/**
 * Build Steps
 * -----------------------------------------------------
 * 1. Create top level NgModule
 * 2. Retrieve all pages with their respective data
 * 3. Run Angular Static on each page with data
 * 4. Store result in public
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { renderTemplate, createDocument } from 'angularstatic';
import * as fs from 'fs-extra';
import * as path from 'path';

function createModule() {
  @NgModule({
    imports: [
      BrowserModule,
      ServerModule
    ]
  }) class TopModule {}
  return TopModule;
}

function buildPages() {
  const pages = fs.readdirSync(__dirname + '/src/pages');
  const metas = pages.map(page => {
    return {
      page,
      content: fs.readFileSync(__dirname + '/src/pages/' + page, 'utf8')
    }
  });
  metas.forEach(async meta => {
    const destDir = path.resolve('./public', '');
    const destPath = destDir + '/' + meta.page;
    const templateFn = await renderTemplate(meta.content, {
      document: createDocument({ tag: 'ng-static' }),
      url: '/'
    });
    console.log(destPath);
    const built = await templateFn({ name: 'David' });
    fs.writeFileSync(destPath, built, 'utf8');
  });
  return pages;
}

buildPages()
