// Minimalni stubovi da TypeScript ne kuka oko vite-plugin-pwa tipova

declare module '@vite-pwa/assets-generator/api' {
  export type ImageAssetsInstructions = any
  export type IconAsset = any
  export type FaviconLink = any
  export type HtmlLink = any
  export type AppleSplashScreenLink = any
  export type HtmlLinkPreset = any
}

declare module '@vite-pwa/assets-generator/config' {
  export type BuiltInPreset = any
  export type Preset = any
}
