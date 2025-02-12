import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor
} from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { B3Propagator } from "@opentelemetry/propagator-b3";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_TELEMETRY_SDK_LANGUAGE,
  TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS
} from "@opentelemetry/semantic-conventions";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const provider = new WebTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "nigel-web-pos-otel",
    [ATTR_TELEMETRY_SDK_LANGUAGE]: TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS,
    [ATTR_SERVICE_VERSION]: "0.0.0",
    "deployment.environment": "development"
  }),
  spanProcessors: [
    new SimpleSpanProcessor(new ConsoleSpanExporter())
  ]
});

provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new B3Propagator()
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      // load custom configuration for xml-http-request instrumentation
      "@opentelemetry/instrumentation-xml-http-request": {
        clearTimingResources: true
      }
    })
  ],
  tracerProvider: provider
});
