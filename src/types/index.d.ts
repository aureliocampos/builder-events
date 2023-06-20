declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtmDataLayer: Record<string, any>;
  }
}

export {};
