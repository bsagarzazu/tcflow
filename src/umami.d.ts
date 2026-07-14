export {};

declare global {
  interface Window {
    umami?: {
      track: {
        (eventName: string, eventData?: Record<string, any>): void;
        (customFunction: (props: any) => any): void;
      };
    };
  }
}
