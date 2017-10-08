import { 
  renderModule, 
  renderModuleSync, 
  renderTemplate, 
  renderTemplateSync, 
  createDocument,
  STATIC_CONTEXT
} from './';
import { NameAppModule } from './utils.spec';
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

  });

  describe('#renderTemplate', () => {
    
  });

});