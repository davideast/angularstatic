<p align="center">
  <h1 align="center">Angular Static</h1>
  <p align="center">A simple way to build static templates with Angular</p>
</p>

Status: Infancy

## What is Angular Static?

- **Server based** - Build Angular templates on the server. An alternative for server templating (pug, twig, ejs).
- **Static** - No JavaScript from Angular is included.
- **Uni-directional** - Follow a simple props down approach to render your site


## Example usage

```ts
import { renderModule, StaticConfig } from 'angularstatic';
import { AppModule } from './app.module';

const config = { url, document, modules, appId };

async function render(module, config: StaticConfig) {
  const { document, url } = config;
  const templateFn = await renderModule(AppModule, { document, url: '/' });
  // pass in data for your app at a top-level
  return await templateFn<Person>({ name: 'David' })
}
```

## Creating an `AppModule`

Angular Static takes a "top-down" approach for passing in data. This is similar to state management in React. Create a top-level `Component` that injects a `STATIC_CONTEXT` token. This `STATIC_CONTEXT` token represents the data passed into your template function. Then include the top-level `Component` in an `NgModule`.

```ts
// app.module.ts
import { Component, NgModule, Input, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { STATIC_CONTEXT } from 'angularstatic';

export interface Person { name: string };

@Component({
  selector: 'app-root',
  template: `
    {{ context | json }}
  `
})
export class AppComponent { 
  constructor( @Inject(STATIC_CONTEXT) public context: Person ) { }
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app-id' }),
    ServerModule,
  ],
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

