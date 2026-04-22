// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// ITER-15 ops note: when self-hosting the Vite dev server behind nginx at a
// real domain (e.g. staging.isola.epic.dm on 66.118.37.12:3011), Vite blocks
// proxied hosts by default with a "not allowed" error. The allowedHosts list
// below whitelists our hosted domains. Safe to leave here — the Lovable
// preview and Cloudflare Pages deploy don't need this, they just ignore it.
export default defineConfig({
  vite: {
    server: {
      allowedHosts: [
        "staging.isola.epic.dm",
        "isola.epic.dm",
        "hub.epic.dm",
        "bff.epic.dm",
      ],
    },
    preview: {
      allowedHosts: [
        "staging.isola.epic.dm",
        "isola.epic.dm",
        "hub.epic.dm",
        "bff.epic.dm",
      ],
    },
  },
});
