import { Component, NgModule, ReflectiveInjector, Inject, Provider, InjectionToken, NgModuleFactory } from '@angular/core';
import { JitCompiler, COMPILER_PROVIDERS } from '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';

export const STATIC_CONTEXT = new InjectionToken<Object>('CONTEXT');

/**
 * Create the root component for the static template
 * @param template
 */
function componentFromTemplate(template: string): any {
  @Component({ selector: 'ng-static', template })
  class RootStatic {
    constructor( @Inject(STATIC_CONTEXT) context: Object) {
      Object.keys(context).forEach(key => this[key] = context[key]);
    }
  }

  return RootStatic;
}

/**
 * Provider for template context data
 * @param context
 */
export function provideContext(context: Object): Provider[] {
  return [{
    provide: STATIC_CONTEXT,
    useValue: context
  }];
}


function moduleFromTemplate(template: string, modules: any[] = [], appId = 'angularstatic') {
  const Cmp = componentFromTemplate(template);
  @NgModule({
    imports: [
      BrowserModule.withServerTransition({ appId }),
      ServerModule,
      ...modules,
    ],
    bootstrap: [
      Cmp,
    ],
    declarations: [
      Cmp,
    ],
  })
  class StaticModule { }
  return StaticModule;
}

/**
 * Create an NgModule given a string template. Optionally provide modules, appId, and a compiler.
 * @param template 
 * @param modules 
 * @param appId 
 * @param compiler 
 */
export async function moduleFactoryFromTemplate(template: string, modules: any[] = [], appId = "angularstatic", compiler: JitCompiler): Promise<NgModuleFactory<any>> {
  const StaticModule = moduleFromTemplate(template, modules, appId);
  return await compiler.compileModuleAsync(StaticModule);
}

export function moduleFactoryFromTemplateSync(template: string, modules: any[] = [], appId = "angularstatic", compiler: JitCompiler): NgModuleFactory<any> {
  const StaticModule = moduleFromTemplate(template, modules, appId);
  return compiler.compileModuleSync(StaticModule);
}
