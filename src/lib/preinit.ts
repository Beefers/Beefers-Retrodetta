// Hoist required modules
// This used to be in filters.ts, but things became convoluted

// Early find logic
const basicFind = (prop: string) => Object.values(window.modules).find(m => m?.publicModule.exports?.[prop])?.publicModule?.exports;

// Hoist React on window
window.React = basicFind("createElement") as typeof import("react");

// Export ReactNative
export const ReactNative = basicFind("AppRegistry") as typeof import("react-native");

// Export chroma.js
export const chroma = basicFind("brewer") as typeof import("chroma-js");