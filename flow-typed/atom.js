/* eslint-disable */
/* @flow */

// Flow declarations for Atom common features

declare var atom: Object;

declare class Subscription {
  dispose(): void;
}

declare class Config {
  observe(config: string, cb: Function): Subscription;
}

declare class CompositeDisposableClass {
  add(observable: Subscription): void;
  dispose(): void;
}

declare class Disposable {
  dispose(): void;
}

export type Point = [number, number]
export type Range = [Point, Point]

declare module 'atom' {
  declare var CompositeDisposable: any;
  declare var config: Config;
}

declare module 'atom-package-deps' {
  declare function install(packageName?: string): void;
}

declare module 'shell' {
  declare function openExternal(url: string): void;
}

declare class TextEditor {
  getPath(): string;
  getLineCount(): number;
}

declare class LinterHelpers {
  exec(exec: string, args: Array<string>, opts: any): Promise<string>;
  rangeFromLineNumber(textEditor: TextEditor, line: number, col: number): Range;
}

declare type LinterMessageType = 'Warning' | 'Error';

declare type LinterMessage = {
  type: LinterMessageType,
  html?: string,
  text?: string,
  range: Range,
  filePath: string,
}

declare module 'atom-linter' {
  declare var exports: LinterHelpers;
}

declare type LinterMessages = Array<LinterMessage>;

declare type LinterScopeType = 'file' | 'project';

declare type LinterCallback = (textEditor: TextEditor) => Promise<LinterMessages>;

declare type LinterInfo = {
  name: string,
  grammarScopes: Array<string>,
  scope: LinterScopeType,
  lintOnFly: bool,
  lint: LinterCallback
}
