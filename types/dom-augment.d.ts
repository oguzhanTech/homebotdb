/// <reference lib="dom" />

// Ensures DOM properties are available with React 19 global typings.
interface HTMLInputElement {
  value: string;
}

interface HTMLTextAreaElement {
  value: string;
}

interface HTMLSelectElement {
  value: string;
}

interface KeyboardEvent {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  preventDefault(): void;
}

interface Window {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare const window: Window & typeof globalThis;

interface Document {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare const document: Document;
