/**
 * Build Steps
 * -----------------------------------------------------
 * 1. Create top level NgModule
 * 2. Retrieve all pages with their respective data
 * 3. Run Angular Static on each page with data
 * 4. Store result in public
 */
import { NgModule, enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { renderTemplate, createDocument } from 'angularstatic';
import * as fs from 'fs-extra';
import * as path from 'path';
const pretty = require('pretty');

function getComponents() {
  const components = fs.readdirSync(__dirname + '/src/components');
  const declarations = components.map(comp => require(__dirname + `/src/components/${comp.replace('.ts', '')}`).default);
  const exports = declarations;
  const imports = [CommonModule];
  @NgModule({ declarations, imports, exports }) class StaticComponentModule { }
  return StaticComponentModule;
}

function getPages() {
  const pages = fs.readdirSync(__dirname + '/src/pages');
  return pages.map(page => {
    return {
      page,
      content: fs.readFileSync(__dirname + '/src/pages/' + page, 'utf8')
    }
  });
}

async function buildPage(page: any) {
  enableProdMode();
  const destDir = path.resolve('./public', '');
  const configDir = path.resolve('./src/data', '');
  const destFile = destDir + '/' + page.page;
  const destPath = destFile.replace('.html', '');
  const configPath = configDir + '/' + page.page.replace('.html', '.json');
  const { config } = require(configPath);
  const componentModule = getComponents();
  const routes = Object.keys(config);
  const promises = routes.map(async route => {
    const routeConfig = config[route];
    const content = await buildRoute(page, routeConfig, componentModule);
    const routeFile = `${destPath}/${route}.html`;
    return { destFile: routeFile, content };
  });
  const allContent = await Promise.all(promises);
  return allContent;
}

async function buildRoute(page: any, routeConfig: any, componentModule: any) {
  const templateFn = await renderTemplate(page.content, {
    document: createDocument({ 
      tag: 'ng-static',
      headTags: routeConfig.head.tags,
      title: routeConfig.head.title,
    }),
    url: '/',
    modules: [componentModule]
  });
  const content = await templateFn(routeConfig.data);
  return content;  
}

async function buildPages(pages: any[]) {
  const promises = pages.map(buildPage);
  const routes = await Promise.all(promises);
  routes.forEach(route => {
    route.forEach(r => {
      const pieces = r.destFile.split('/');
      const pathPieces = pieces.slice(0, pieces.length - 1);
      const path = pathPieces.join('/');
      fs.mkdirpSync(path);
      fs.writeFileSync(r.destFile, pretty(r.content), 'utf8');
    });
  });
  return pages;
}

async function build() {
  const pages = getPages();
  try {
    fs.mkdirpSync(path.resolve('../public', ''));
    await buildPages(pages);
  } catch(e) {
    console.log(e);
  }
}

build();

