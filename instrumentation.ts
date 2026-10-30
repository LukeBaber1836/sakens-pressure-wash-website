import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
// Only production deployments send logs, so local runs don't land in the production project.
export const loggerProvider =
  process.env.NODE_ENV === "production" && projectToken && apiHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          "service.name": "sakens-pressure-wash-website",
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: new URL("/i/v1/logs", apiHost).toString(),
              headers: {
                Authorization: `Bearer ${projectToken}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : undefined;

export function getPostHogLogLogger() {
  return loggerProvider?.getLogger("sakens-pressure-wash-posthog");
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}
