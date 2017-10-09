import { Component, NgModule, Input, Inject, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { Routes, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { STATIC_CONTEXT } from './';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-hi',
  template: `
    Hi {{ name }}!
  `
})
export class HiComponent {
  @Input() name: string;
}

@Component({
  selector: 'app-root',
  template: `
    <app-hi [name]="context.name"></app-hi>
  `
})
export class NameAppComponent { 
  constructor( @Inject(STATIC_CONTEXT) public context: { name: string } ) { }
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'angularstaticid' }),
    ServerModule,
  ],
  declarations: [
    NameAppComponent,
    HiComponent
  ],
  exports: [NameAppComponent],
  bootstrap: [NameAppComponent]
})
export class NameAppModule { }

/**
 * 
 * ROUTER APP
 * 
 */

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}

@Component({
  selector: 'app-main',
  template: `<h1>Main</h1>`
})
export class MainComponent {
 
}

@Component({
  selector: 'app-detail',
  template: `
  <div>
    {{ person$ | async }}
  </div>
  `
})
export class DetailComponent implements OnInit {
  person$: Observable<string>;
  constructor( 
    @Inject(STATIC_CONTEXT) public context: { people: { [key: string]: string } },
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.person$ = this.route.paramMap
      .switchMap((params: ParamMap) => {
        const id = params.get('id');
        return this.context.people[id];
      });
  }
}

const RouterAppRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: ':id', component: DetailComponent }
];

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'routerappid' }),
    ServerModule,
    RouterModule.forRoot(RouterAppRoutes)
  ],
  declarations: [
    MainComponent,
    DetailComponent,
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class RouterAppModule { }