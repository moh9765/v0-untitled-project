import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Create the Stack server app with error handling
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  // Add any additional configuration options here if needed
});
