import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/observable';
import { Feature } from '../models/feature';

import { map, catchError, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class FeatureService {

  constructor(private db: AngularFireDatabase) { }


  getFeature(id: number = 0): Observable<any> {
    // update local storage id
    localStorage.setItem('featureId', String(id));
    // use local storage
    return this.db.object('/features/' + id).snapshotChanges().map(change => {
      const data = { id: change.payload.key, ...change.payload.val() };
      return data;
    });
  }

  getFeatures(): Observable<any[]> {
    // Use snapshotChanges().map() to store the key
    return this.db.list('/features').snapshotChanges().map(changes => {
      const data = changes.map(c => ({ id: c.payload.key, ...c.payload.val() }));
      return data;
    });
  }

  getFeatureIds(): Observable<number[]> {
    return this.getFeatures().map(features => {
      return features.map(feature => feature.id);
    });
  }

}
