import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { map, switchMap } from 'rxjs/operators';

import { Feature } from '../../models/feature';
import { FeatureService } from '../../services/feature.service';

// environment variable
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  features: Feature[];
  featureIds: number[];

  constructor(private featureService: FeatureService) { }

  ngOnInit() {
    this.getFeatures();
  }

  getFeatures() {
    this.featureService.getFeatures().subscribe(features => {
      console.log(features);
      this.features = features;
      this.featureIds = features.map(feature => feature.id);
    });
  }


}
