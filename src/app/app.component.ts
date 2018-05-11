import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor() {
    if (localStorage.getItem('featureId') == null) {
      localStorage.setItem('featureId', '0');
      console.log('feature ID set');
    }
  }
}
