import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition } from '@angular/animations';
import { swipe } from '../../utils/swipe';
import * as kf from '../../utils/keyframes';

import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { map, switchMap, concatAll } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Feature } from '../../models/feature';
import { FeatureService } from '../../services/feature.service';

// environment variable
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => slideOutLeft', animate(200, keyframes(kf.slideOutLeft))),
      transition('* => slideOutRight', animate(200, keyframes(kf.slideOutRight))),
    ])
  ]
})
export class DetailComponent implements OnInit {

  features: Feature[];
  featureId: number;
  feature: Feature;
  baseUrl: string;

  Arr = Array; // array type captured in a variable

  animationState = '';

  constructor(private featureService: FeatureService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { this.baseUrl = environment.baseUrl; }

  ngOnInit() {
    this.scrollToTop();
    this.getFeatures();
  }

  /**
   * get features
   */
  getFeatures() {
    // get features
    const obsFeatures = this.featureService.getFeatures().subscribe(features => {

      this.features = features; // get all features

      const obsFeatureId = this.route.params.subscribe(params => {
        // get specific id
        const id = params['id'] !== undefined ? +params['id'] :
          (localStorage.getItem('featureId') !== null ?
            +localStorage.getItem('featureId') : 0);

        // update storage
        localStorage.setItem('featureId', String(id));

        this.featureId = id;
        this.feature = this.features[id];
      });
    });
  }

  /**
   * update active feature
   * @param id number
   */
  updateFeature(id: number) {
    if (this.features) {
      localStorage.setItem('featureId', String(id));
      this.featureId = id;
      this.feature = this.features[id];
    }
  }

  /**
   * swipe action
   * @param action string
   */
  swipeAction(action) {
    const nextIndex = swipe(action, this.features, this.featureId);
    this.router.navigate(['/detail'], { queryParams: { id: nextIndex } });
    this.updateFeature(nextIndex);
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

  // reset the page position
  scrollToTop() {
    window.scrollTo(0, 0);
  }


}
