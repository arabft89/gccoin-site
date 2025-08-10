// /types/global.d.ts
import type { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider; // type-safe MetaMask provider on window
  }
}

// Make this file a module so it’s included by TS
export {};
