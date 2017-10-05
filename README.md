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
  const templateFn = await renderModule(module, { document, url: '/' });
  return await templateFn<Person>({ name: 'David' })
}
```
