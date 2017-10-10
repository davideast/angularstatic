import { 
  renderModule,  
  renderTemplate, 
  createDocument,
  STATIC_CONTEXT
} from './';
import { NameAppModule, RouterAppModule } from './utils.spec';
import * as assert from 'assert';
import { JSDOM } from 'jsdom';

describe('Angular Static', () => {

  describe('#renderModule', () => {
    
    it('should render a Module asynchronously', async () => {
      const document = createDocument({ tag: 'app-root' });
      const templateFn = await renderModule(NameAppModule, { document, url: '/' })
      const html = await templateFn({ name: 'David'});
      const dom = new JSDOM(html);
      const appHi = dom.window.document.querySelector('app-hi[ng-reflect-name="David"]');
      assert.equal(appHi.innerHTML.trim(), 'Hi David!');
    });

    // it('should render a router app', async () => {
    //   const document = createDocument({ tag: 'app-root' });
    //   const templateFn = await renderModule(RouterAppModule, { document, url: '/david' });
    //   const html = await templateFn({ people: { david: 'David' }});
    //   console.log(html);
    // });

  });

  describe('#renderTemplate', () => {
    
    it('should render a template asynchronously', async () => {
      const document = createDocument({ tag: 'ng-static' });
      const templateFn = await renderTemplate('Hi {{ name }}!', { document, url: '/' });
      const html = await templateFn({ name: 'David'});
      const dom = new JSDOM(html);
      const ngStatic = dom.window.document.querySelector('ng-static');
      assert.equal(ngStatic.innerHTML.trim(), 'Hi David!');
    });

  });

});