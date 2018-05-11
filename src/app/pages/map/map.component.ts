import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import { swipe } from '../../utils/swipe';
import * as kf from '../../utils/keyframes';

import { Feature } from '../../models/feature';
import { FeatureService } from '../../services/feature.service';

import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { loadModules, loadScript } from 'esri-loader';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => slideOutLeft', animate(200, keyframes(kf.slideOutLeft))),
      transition('* => slideOutRight', animate(200, keyframes(kf.slideOutRight))),
    ])
  ]
})
export class MapComponent implements OnInit {

  map: any;
  view: any;
  features: Feature[];
  featureIds: number[];
  graphics: any[];
  activeFeatureId = 0;
  activeFeature: Feature;
  activeGraphic: any;

  dishSymbol = {
    type: 'picture-marker',
    url: '/assets/symbols/dish.png',
    width: '36px',
    height: '36px'
  };

  coverSymbol = {
    type: 'picture-marker',
    url: '/assets/symbols/cover.png',
    width: '24px',
    height: '24px'
  };

  featureLoaded = false;

  animationState: string;

  constructor(private featureService: FeatureService) { }

  ngOnInit() {
    this.getFeatures();
  }

  getFeatures() {
    this.featureService.getFeatures().subscribe(features => {
      console.log(features);
      // get features
      this.features = features;
      this.featureIds = features.map(feature => feature.id);
      this.activeFeatureId = localStorage.getItem('featureId') == null ? 0 : +localStorage.getItem('featureId');
      this.activeFeature = features.filter(feature => feature.id === this.activeFeatureId)[0];
      this.featureLoaded = true;
      // init map
      this.initMap();
    });
  }

  // init map
  initMap(): void {
    // first, we use Dojo's loader to require the map class
    loadModules([
      'esri/views/MapView', 'esri/Map',
      'esri/layers/GraphicsLayer', 'esri/Graphic'
    ]).then(([
      MapView, Map, GraphicsLayer, Graphic
    ]) => {
      // then we load a web map from an id
      this.map = new Map({
        basemap: 'streets'
      });
      // and we show that map in a container w/ id #viewDiv
      this.view = new MapView({
        container: 'viewDiv',  // Reference to the scene div created in step 5
        map: this.map,  // Reference to the map object created before the scene
        zoom: 14,  // Sets zoom level based on level of detail (LOD)
        center: [113.237, 23.115]  // Sets center point of view using longitude,latitude
      });

      // construct graphics
      this.graphics = this.features.map(feature => {
        return new Graphic({
          geometry: {
            type: 'point',
            latitude: +feature.lat,
            longitude: +feature.lng
          },
          symbol: this.coverSymbol,
          attributes: {
            id: feature.id,
            name: feature.name
          }
        });
      });
      // init activated graphic
      this.view.when(() => {
        this.updateGraphic(this.activeFeatureId);
      }, (error) => {
        console.error(error);
      });

      // add graphics layer
      const graphicsLayer = new GraphicsLayer({
        graphics: this.graphics
      });
      this.map.add(graphicsLayer);

      // add google map as base map
      const gMapObservable = fromPromise(this.initBasemap());
      gMapObservable.subscribe(gLayer => {
        console.log('Google Basemap Layer loaded.');
        this.map.add(gLayer);
        this.map.reorder(gLayer, 0);
      });
      console.log(this.map);
      console.log(this.view);

      // event after clicked
      this.view.on('click', (event) => {
        const screenPoint = {
          x: event.x,
          y: event.y
        };

        // Search for graphics at the clicked location
        this.view.hitTest(screenPoint).then((response) => {
          if (response.results.length) {
            const graphic = response.results.filter((result) => {
              // check if the graphic belongs to the layer of interest
              return result.graphic.layer === graphicsLayer;
            })[0].graphic;
            // do something with the result graphic
            console.log(graphic);
            // update
            this.updateGraphic(graphic.attributes.id);
          }
        });
      });

    }).catch(err => {
      // handle any errors
      console.error(err);
    });
  }

  // update active graphic
  updateGraphic(id: number) {
    // *******************************************************
    // Update feature pointer
    // *******************************************************
    this.activeFeature =
      this.features.filter(feature => feature.id === id)[0];
    this.activeFeatureId = id;
    // save changes
    localStorage.setItem('featureId', String(id));

    // *******************************************************
    // Update graphic
    // *******************************************************
    const graphic = this.graphics.filter(el => {
      return el.attributes.id === this.activeFeatureId;
    })[0];

    if (this.activeGraphic) {
      // deactivate prev active graphic
      this.activeGraphic.symbol = this.coverSymbol;
    }
    // activate curr graphic
    graphic.symbol = this.dishSymbol;
    // save changes
    this.activeGraphic = graphic;

    // *******************************************************
    // Zoom to activated graphic
    // *******************************************************
    this.view.goTo(this.activeGraphic);
  }

  // response to swipe action to the card component
  swipeAction(action: string) {
    // start animation
    if (action === 'swipeleft') {
      this.startAnimation('slideOutLeft');
    }
    if (action === 'swiperight') {
      this.startAnimation('slideOutRight');
    }
    // toggle feature visibility
    const nextIndex = swipe(action, this.features, this.activeFeatureId);
    this.activeFeatureId = nextIndex;
    // update after animation
    setTimeout(() => {
      this.updateGraphic(nextIndex);
    }, 200);
  }

  // *******************************************************
  // Animation
  // *******************************************************
  // start animation
  startAnimation(state) {
    console.log(state);
    if (!this.animationState) {
      this.animationState = state;
    }
  }
  // reset animation
  resetAnimationState() {
    this.animationState = '';
  }

  // *******************************************************
  // Custom tile layer class
  // Create a subclass of BaseTileLayer
  // *******************************************************
  initBasemap(): Promise<any> {
    return loadModules([
      'esri/Map',
      'esri/config',
      'esri/request',
      'esri/Color',
      'esri/views/SceneView',
      'esri/widgets/LayerList',
      'esri/layers/BaseTileLayer',
    ]).then(([
      Map, esriConfig, esriRequest, Color,
      SceneView, LayerList, BaseTileLayer
    ]) => {
      // *******************************************************
      // Custom tile layer class code
      // Create a subclass of BaseTileLayer
      // *******************************************************

      const TintLayer = BaseTileLayer.createSubclass({
        properties: {
          urlTemplate: null,
          tint: {
            value: null,
            type: Color
          }
        },

        // generate the tile url for a given level, row and column
        getTileUrl: function (level, row, col) {
          return this.urlTemplate
            .replace('{z}', level)
            .replace('{x}', col)
            .replace('{y}', row);
        },

        // This method fetches tiles for the specified level and size.
        // Override this method to process the data returned from the server.
        fetchTile: function (level, row, col) {

          // call getTileUrl() method to construct the URL to tiles
          // for a given level, row and col provided by the LayerView
          const url = this.getTileUrl(level, row, col);

          // request for tiles based on the generated url
          // set allowImageDataAccess to true to allow
          // cross-domain access to create WebGL textures for 3D.
          return esriRequest(url, {
            responseType: 'image',
            allowImageDataAccess: true
          })
            .then(function (response) {
              // when esri request resolves successfully
              // get the image from the response
              const image = response.data;
              const width = this.tileInfo.size[0];
              const height = this.tileInfo.size[0];

              // create a canvas with 2D rendering context
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = width;
              canvas.height = height;

              // Apply the tint color provided by
              // by the application to the canvas
              if (this.tint) {
                // Get a CSS color string in rgba form
                // representing the tint Color instance.
                context.fillStyle = this.tint.toCss();
                context.fillRect(0, 0, width, height);

                // Applies "difference" blending operation between canvas
                // and steman tiles. Difference blending operation subtracts
                // the bottom layer (canvas) from the top layer (tiles) or the
                // other way round to always get a positive value.
                context.globalCompositeOperation = 'difference';
              }

              // Draw the blended image onto the canvas.
              context.drawImage(image, 0, 0, width, height);

              return canvas;
            }.bind(this));
        }
      });

      // *******************************************************
      // Start of JavaScript application
      // *******************************************************

      // Add google map cn url to the list of servers known to support CORS specification.
      esriConfig.request.corsEnabledServers.push('https://mt2.google.cn/');

      // Create a new instance of the TintLayer and set its properties
      const gLayer = new TintLayer({
        id: 'google-map',
        urlTemplate: 'https://mt2.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
        title: 'Google Map'
      });

      // return layer
      return gLayer;
    });
  }

}
