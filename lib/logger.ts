// lib/logger.ts
const isProd = process.env.NODE_ENV === "production";

export const log = (...args: any[]) => {
  if (!isProd) console.log(...args);
};

export const warn = (...args: any[]) => {
  if (!isProd) console.warn(...args);
};

export const error = (...args: any[]) => {
  // Always show errors, even in production
  console.error(...args);
};
