import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

import { Router, Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { map, switchMap } from 'rxjs/operators';

import { Feature } from '../../models/feature';

// environment variable
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges {

  featureId: number;
  featureIds: number[];
  features: Feature[];
  @Input() feature: Feature;

  Arr = Array; // array type captured in a variable

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.initFeature();
  }

  cardClickEvent() {
    console.log('Clicked');
    localStorage.setItem('featureId', String(this.featureId));
    this.router.navigate(['/detail', { id: this.featureId }]);  // redirect to detail page
  }

  initFeature() {
    this.featureId = +this.feature.id;
  }


}
