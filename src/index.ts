import { ReflectiveInjector } from '@angular/core';
import { JitCompiler, COMPILER_PROVIDERS } from '@angular/compiler';
import { renderModuleFactory, PlatformConfig } from '@angular/platform-server';
import { moduleFromTemplate, provideContext } from './compiler';
import { createDocument } from './document';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

export interface Config {
   title?: string;
   url: string;
   modules?: any[];
   appId?: string;
}

/**
 * Single instance of compiler
 */
const compiler: JitCompiler = ReflectiveInjector.resolveAndCreate(COMPILER_PROVIDERS).get(JitCompiler);

export function renderTemplate(template: string, config: Config): (context: Object) => Promise<string> {
   const {modules, appId, title} = config;
   const document = createDocument(title);
   const factory = moduleFromTemplate(template, modules, appId, compiler);
   return (context: Object) => renderModuleFactory(factory, {
      document, url: '/', extraProviders: [
         provideContext(context),
      ]
   });
}

export function renderModule(topModule: any, config: PlatformConfig): Promise<string> {
   const factory = compiler.compileModuleSync(topModule);
   return renderModuleFactory(factory, config);
}
