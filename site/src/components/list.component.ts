import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-list',
  template: `
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
  `
})
export default class List {
  @Input() items: any[];
}
