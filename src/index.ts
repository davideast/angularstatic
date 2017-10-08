import { ReflectiveInjector, NgModuleFactory, Type } from '@angular/core';
import { JitCompiler, COMPILER_PROVIDERS } from '@angular/compiler';
import { renderModuleFactory, PlatformConfig } from '@angular/platform-server';
import { moduleFactoryFromTemplate, moduleFactoryFromTemplateSync, provideContext, STATIC_CONTEXT } from './compiler';
import { createDocument } from './document';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

export interface StaticModuleConfig {
  document: string;
  url: string;
}

export interface StaticTemplateConfig extends StaticModuleConfig {
  modules?: any[];
  appId?: string;
}

const compiler: JitCompiler = ReflectiveInjector.resolveAndCreate(COMPILER_PROVIDERS).get(JitCompiler);

export async function renderModule<T>(module: Type<T>, config: StaticModuleConfig) {
  let { document, url } = config;
  const factory = await compiler.compileModuleAsync(module);
  return function templateFn<R>(context: R) {
    return renderModuleFactory(factory, {
      document, url, extraProviders: [
        provideContext(context)
      ]
    });
  }
}

export async function renderTemplate(template: string, config: StaticTemplateConfig) {
  const { modules, appId, document, url } = config;
  const factory = await moduleFactoryFromTemplate(template, modules, appId, compiler);
  return function templateFn<R>(context: R) {
    return renderModuleFactory(factory, {
      document, url, extraProviders: [
        provideContext(context)
      ]
    });
  }
}

export { STATIC_CONTEXT, createDocument };
