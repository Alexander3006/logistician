import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';

export const otel = new NodeSDK({
  traceExporter: new ZipkinExporter({
    url: process.env.ZIPKIN_URL || 'http://localhost:9411/api/v2/spans',
  }),
  spanProcessor: new SimpleSpanProcessor(
    new ZipkinExporter({
      url: process.env.ZIPKIN_URL || 'http://localhost:9411/api/v2/spans',
    }),
  ),
  // spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
