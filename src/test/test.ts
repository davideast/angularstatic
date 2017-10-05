import { Type } from '@angular/core';
import { renderTemplateSync, renderModule } from '../';
import { AppModule } from './app.module';
import { createDocument } from './document';

const templateFn = renderTemplateSync(`<div> {{ name }}</div>`, {
   document: createDocument('My angular app'),
   url: '/'
});
templateFn(({ name: 'David' })).then(console.log);

const document = createDocument('angular static', 'app-root');

interface Person {
  name: string;
}

async function render<T>(document: string, module: Type<T>) {
  const templateFn = await renderModule<T>(module, {  document, url: '/' });
  return await templateFn<Person>({ name: 'David' })
}

render(document, AppModule)
  .then(console.log)
  .catch(console.log);
