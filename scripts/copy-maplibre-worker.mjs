// MapLibre runs its tile parsing in a web worker that Next's bundler can't emit, so it is
// served from public/ instead. Runs after every install so it always matches the installed version.
import { copyFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const source = require.resolve("maplibre-gl/dist/maplibre-gl-worker.mjs");
copyFileSync(source, new URL("../public/maplibre-gl-worker.mjs", import.meta.url));
