import { ReflectiveInjector, NgModuleFactory, Type } from '@angular/core';
import { JitCompiler, COMPILER_PROVIDERS } from '@angular/compiler';
import { renderModuleFactory, PlatformConfig } from '@angular/platform-server';
import { moduleFactoryFromTemplate, moduleFactoryFromTemplateSync, provideContext, CONTEXT } from './compiler';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

export interface StaticConfig {
  document?: string;
  url: string;
  modules?: any[];
  appId?: string;
}

/**
 * Single instance of compiler
 */
const compiler: JitCompiler = ReflectiveInjector.resolveAndCreate(COMPILER_PROVIDERS).get(JitCompiler);

export async function renderModule<T>(module: Type<T>, config: StaticConfig) {
  let { appId, document } = config;
  const factory = await compiler.compileModuleAsync(module);
  return function templateFn<R>(context: R) {
    return renderModuleFactory(factory, {
      document, url: '/', extraProviders: [
        provideContext(context)
      ]
    });
  }
}

export function renderModuleSync<T>(module: Type<T>, config: StaticConfig) {
  let { appId, document } = config;
  const factory = compiler.compileModuleSync(module);
  return function templateFn<R>(context: R) {
    return renderModuleFactory(factory, {
      document, url: '/', extraProviders: [
        provideContext(context)
      ]
    });
  }
}

export function renderTemplateSync(template: string, config: StaticConfig): (context: Object) => Promise<string> {
  const { modules, appId, document } = config;
  const factory = moduleFactoryFromTemplateSync(template, modules, appId, compiler);
  return function templateFn<R>(context: R) {
    return renderModuleFactory(factory, {
      document, url: '/', extraProviders: [
        provideContext(context)
      ]
    });
  }
}

export async function renderTemplate(template: string, config: StaticConfig) {
  const { modules, appId, document } = config;
  const factory = await moduleFactoryFromTemplate(template, modules, appId, compiler);
  return function templateFn<R>(context: R) {
    return renderModuleFactory(factory, {
      document, url: '/', extraProviders: [
        provideContext(context)
      ]
    });
  }
}

export { CONTEXT };
