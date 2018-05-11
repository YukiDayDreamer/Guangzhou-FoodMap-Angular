import { Routes } from '@angular/router';

import { MapComponent } from '../pages/map/map.component';
import { DetailComponent } from '../pages/detail/detail.component';
import { ListComponent } from '../pages/list/list.component';
import { CardComponent } from '../components/card/card.component';

export const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },  // default path
  { path: 'map', component: MapComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'list', component: ListComponent },
  { path: 'card', component: CardComponent },
];
