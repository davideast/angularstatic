import { renderTemplate } from '../';

const templateFn = renderTemplate(`<div> {{ name }}</div>`, {
   title: 'My angular app',
   url: '/'
});
templateFn(({ name: 'David' })).then(console.log);
