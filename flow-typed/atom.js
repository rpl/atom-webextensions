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

declare module 'atom' {
  declare var Range: any;
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

declare module 'atom-linter' {
  declare function exec(exec: string, args: Array<string>, opts: any): Promise<string>;
  declare function rangeFromLineNumber(textEditor: TextEditor, line: number, col: number): Range;
}
