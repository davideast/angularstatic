import { Component, NgModule, Input, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { STATIC_CONTEXT } from '../';

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
    {{ context | json }}
    <app-hi [name]="context.name"></app-hi>
  `
})
export class AppComponent { 
  constructor( @Inject(STATIC_CONTEXT) public context: { name: string } ) { }
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'angularstaticid' }),
    ServerModule,
  ],
  declarations: [
    AppComponent,
    HiComponent
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
