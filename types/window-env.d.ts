export {};

declare global {
  interface Window {
    __ENV__?: {
      NEXT_PUBLIC_PANEL_URL?: string;
    };
  }
}
