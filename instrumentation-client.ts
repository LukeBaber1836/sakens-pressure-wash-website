import posthog from "posthog-js"

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

// Only production deployments report to PostHog, so local runs (next dev, or a production build
// served on this machine) stay out of the production data. Captures before init are no-ops, so the
// rest of the app needs no checks.
if (
  projectToken &&
  apiHost &&
  process.env.NODE_ENV === "production" &&
  !["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}
