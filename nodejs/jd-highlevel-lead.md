# HighLevel — Lead Engineer (Custom Objects) Interview Prep

### <a href="../README.md">Interview Preparation</a> <img src="../img/icons8-right-25.png" alt="arrow" style="width:15px; height:15px;"> <a href="./README.md">NodeJs</a> <img src="../img/icons8-right-25.png" alt="arrow" style="width:15px; height:15px;"> JD-Specific Prep

> **Role:** Lead Engineer – Custom Objects | **Team:** CRM & Automation | **Stack:** Node.js · MongoDB · Firestore · Redis · ClickHouse · GCP · Kubernetes

---

## 🎯 Coverage Map

| JD Requirement | Existing Coverage | Status |
|---|---|---|
| Node.js internals (event loop, async, memory) | [Q7](./1-10.md#7-the-event-loop), [Q6](./1-10.md#6-asyncawait-in-nodejs), [Basics #7-8](./basics.md#8-event-loop) | ✅ Covered |
| Caching (Redis), Rate limiting, Backpressure | [Q36](./31-40.md#36-caching-with-redis-in-nodejs), [Q37](./31-40.md#37-rate-limiting-in-nodejs), [Q30](./21-30.md#30-streams-in-nodejs) | ✅ Covered |
| Database connection pooling | [Q35](./31-40.md#35-database-connection-pooling) | ✅ Covered |
| Worker threads / CPU offloading | [Q38](./31-40.md#38-worker-threads-in-nodejs) | ✅ Covered |
| Structured logging | [Q39](./31-40.md#39-structured-logging-in-nodejs) | ✅ Covered |
| Graceful shutdown | [Q33](./31-40.md#33-graceful-shutdown-in-nodejs) | ✅ Covered |
| CPU/heap profiling (practical depth) | [Q8 partial](./1-10.md#8-optimizing-performance-in-nodejs) | ⚠️ Partial |
| MongoDB performance & indexing | — | ⚠️ Partial |
| Batching & concurrency control | [Q27 partial](./21-30.md#27-handling-multiple-requests-in-nodejs) | ⚠️ Partial |
| CPU/heap profiling (deep dive) | — | ❌ Missing |
| Microservices patterns | — | ❌ Missing |
| Circuit breaker / cascading failures | — | ❌ Missing |
| Distributed tracing (OpenTelemetry) | — | ❌ Missing |
| RED/USE metrics · SLO engineering | — | ❌ Missing |
| Custom Objects / dynamic schema design | — | ❌ Missing |
| Kubernetes / GKE for Node.js | — | ❌ Missing |
| Memory leak detection & prevention | — | ❌ Missing |

---

## 📚 Table of Contents

| # | Gap Topic |
|---|---|
| A | [Node.js Profiling: CPU, Heap & Event Loop](#a-nodejs-profiling-cpu-heap--event-loop) |
| B | [Memory Leak Detection & Prevention](#b-memory-leak-detection--prevention) |
| C | [Circuit Breaker & Cascading Failure Prevention](#c-circuit-breaker--cascading-failure-prevention) |
| D | [Microservices Communication Patterns](#d-microservices-communication-patterns) |
| E | [Distributed Tracing with OpenTelemetry](#e-distributed-tracing-with-opentelemetry) |
| F | [RED/USE Metrics & SLO Engineering](#f-reduse-metrics--slo-engineering) |
| G | [Custom Objects & Dynamic Schema Design](#g-custom-objects--dynamic-schema-design) |
| H | [MongoDB Performance & Indexing](#h-mongodb-performance--indexing) |
| I | [ClickHouse for Analytics Workloads](#i-clickhouse-for-analytics-workloads) |
| J | [Kubernetes / GKE for Node.js Services](#j-kubernetes--gke-for-nodejs-services) |
| K | [Batching & Concurrency Control Patterns](#k-batching--concurrency-control-patterns) |
| — | [System Design Scenarios](#-system-design-scenarios) |
| — | [Lead Engineer Behavioral Questions](#-lead-engineer-behavioral-questions) |

---

## A. Node.js Profiling: CPU, Heap & Event Loop

> **Level:** Advanced | **JD Link:** "Profile Node.js services (CPU, heap, event loop) and rewrite hot paths"

#### Why This Is Asked
HighLevel serves 4 billion API hits/day. A 10 ms regression in a hot path multiplied by millions of calls costs real seconds. Interviewers want engineers who can find and fix bottlenecks systematically, not by guessing.

#### Key Concepts

**CPU Profiling**

The V8 engine samples the call stack at a fixed interval. A flame graph visualises where time is spent — wide frames = hot code.

```bash
# Built-in V8 profiler — generates isolate-*.log
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# 0x — generates an interactive flame graph
npx 0x -- node app.js
# Then load the .html output in a browser

# Clinic.js suite — three tools
npx clinic flame -- node app.js    # CPU flame graph
npx clinic bubbleprof -- node app.js  # async operations map
npx clinic doctor -- node app.js   # auto-detect bottlenecks
```

**Heap Profiling (memory allocation over time)**

```javascript
// Take heap snapshots in production with --inspect
// Or programmatically:
const v8 = require('v8');
const fs = require('fs');

// Write a snapshot to disk — open in Chrome DevTools Memory tab
const snapshot = v8.writeHeapSnapshot();
console.log(`Heap snapshot written to: ${snapshot}`);

// Track allocation timeline with sampling profiler
const inspector = require('inspector');
const session = new inspector.Session();
session.connect();

session.post('HeapProfiler.startSampling', () => {
  setTimeout(() => {
    session.post('HeapProfiler.stopSampling', (err, { profile }) => {
      fs.writeFileSync('heap-profile.heapprofile', JSON.stringify(profile));
      session.disconnect();
    });
  }, 30_000);
});
```

**Event Loop Lag Monitoring**

```javascript
// Measure event loop lag — if this number grows, the loop is blocked
function measureEventLoopLag() {
  const start = process.hrtime.bigint();
  setImmediate(() => {
    const lag = Number(process.hrtime.bigint() - start) / 1e6; // ms
    if (lag > 100) {
      logger.warn({ lagMs: lag }, 'Event loop lag detected');
    }
  });
}
setInterval(measureEventLoopLag, 500);

// Node.js built-in (v16+): performance.eventLoopUtilization()
const { performance } = require('perf_hooks');
let last = performance.eventLoopUtilization();
setInterval(() => {
  const current = performance.eventLoopUtilization(last);
  last = performance.eventLoopUtilization();
  // utilization > 0.8 means the loop is busy 80% of the time
  metrics.gauge('node.event_loop.utilization', current.utilization);
}, 5000);
```

#### Reading a Flame Graph
- **Wide frames** at the top = where time is spent (the hot path)
- **Deep frames** = deep call stacks (not necessarily slow)
- Look for synchronous code in hot paths: JSON.parse, RegExp, crypto, fs.readFileSync
- Identify V8 internal frames (c++ builtins) vs your application frames

#### Do's and Don'ts

**Do's**
- Profile under realistic load (use Artillery or k6 to generate traffic while profiling).
- Take two heap snapshots separated in time, then compare — retained objects between snapshots are leak candidates.
- Use `--inspect` with a load balancer bypass (health check endpoint) so profiling doesn't affect production traffic.

**Don'ts**
- Don't profile a cold, idle server — warm it up first, then attach the profiler.
- Avoid optimising based on synthetic micro-benchmarks alone — verify with production-like load.

#### Common Follow-up Questions
- How do you identify which function is responsible for 80% of CPU time in a flame graph?
- What does a "flat" flame graph (all frames are roughly the same width) indicate?
- How would you profile a specific endpoint without profiling the entire server?

#### [Back to Top](#-table-of-contents)

---

## B. Memory Leak Detection & Prevention

> **Level:** Advanced | **JD Link:** "Profile Node.js services (CPU, heap, event loop)"

#### Why This Is Asked
Memory leaks in a long-running Node.js service cause gradual RSS growth, eventually triggering OOM kills. At HighLevel's scale (250+ microservices), undetected leaks cause cascading restarts and traffic loss.

#### Common Leak Sources in Node.js

| Source | Example |
|---|---|
| EventEmitter listeners not removed | `emitter.on()` inside a loop, never `.off()` |
| Closures holding large objects | Cache maps that grow without bounds |
| Timers not cleared | `setInterval` whose reference is lost but keeps running |
| Global/module-level caches | `const cache = {}` in a module, populated but never evicted |
| Promises never settled | An async operation that hangs — the Promise and its closure stay in memory |

#### Code Example

```javascript
// LEAK: listeners accumulate on a shared emitter
class RequestHandler {
  handle(req) {
    // New listener added on every request — never removed
    globalEmitter.on('data', (d) => this.process(d));
  }
}

// FIX: use .once(), or remove the listener when done
class RequestHandler {
  handle(req) {
    const handler = (d) => this.process(d);
    globalEmitter.once('data', handler);
    // or: store handler reference and remove it in cleanup
  }
}

// Detecting leaks in production with heap snapshots
const v8 = require('v8');
let snapshotCount = 0;

// Take a snapshot on demand via HTTP endpoint (restrict access!)
app.get('/_internal/heap-snapshot', authenticate, (req, res) => {
  const path = v8.writeHeapSnapshot(`/tmp/heap-${++snapshotCount}.heapsnapshot`);
  res.json({ path });
});

// Automated leak detection: watch for RSS growth
const startRss = process.memoryUsage().rss;
setInterval(() => {
  const { rss, heapUsed, heapTotal, external } = process.memoryUsage();
  metrics.gauge('node.memory.heap_used', heapUsed);
  metrics.gauge('node.memory.rss', rss);

  // Alert if RSS grew more than 500 MB from start
  if (rss - startRss > 500 * 1024 * 1024) {
    logger.error({ rss, heapUsed }, 'Possible memory leak — RSS grown 500 MB');
  }
}, 10_000);
```

#### Workflow: Find a Leak in Production
1. **Confirm it's a leak** — graph RSS and heap over time. Steady upward trend = leak.
2. **Isolate** — take snapshot A, run load for 5 min, take snapshot B.
3. **Compare** in Chrome DevTools: Memory → Load snapshot B → Compare to A → look for objects with large "Delta" size.
4. **Identify retaining path** — right-click any leaked object → Retaining tree — shows what is holding the reference.
5. **Fix** — remove the retaining reference (clear listeners, set limits on caches, call `.unref()` on timers).

#### Do's and Don'ts

**Do's**
- Set a max size on any in-process cache — use `lru-cache` which evicts the least-recently-used entry automatically.
- Call `emitter.setMaxListeners(0)` only after confirming it is intentional — the default warning at 10 is a helpful leak signal.
- Monitor `process.memoryUsage().heapUsed` and expose it as a metric to Prometheus.

**Don'ts**
- Don't treat a rising RSS as definitely a leak — Node.js holds a pool of freed memory before returning it to the OS. Rising heap *retained* between GC cycles is the real signal.
- Avoid using `global` as a cache — it is never garbage collected.

#### [Back to Top](#-table-of-contents)

---

## C. Circuit Breaker & Cascading Failure Prevention

> **Level:** Advanced | **JD Link:** "Harden services against cascading failures and dependency slowness"

#### Why This Is Asked
HighLevel has 250+ microservices. If one slow DB or downstream service holds all connections while callers keep retrying, it triggers a cascade that takes down unrelated services. Circuit breakers are the standard defence.

#### How a Circuit Breaker Works

```
[CLOSED] — requests flow normally
    ↓ failure rate exceeds threshold (e.g. 50% errors in 10 s)
[OPEN]   — all requests fail immediately (no calls to downstream)
    ↓ after reset timeout (e.g. 30 s)
[HALF-OPEN] — one probe request allowed
    ↓ if probe succeeds → CLOSED
    ↓ if probe fails   → OPEN again
```

#### Code Example

```javascript
const CircuitBreaker = require('opossum');

// Wrap any async function
async function callPaymentService(data) {
  const res = await fetch('http://payment-service/charge', {
    method: 'POST',
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(2000), // hard timeout
  });
  if (!res.ok) throw new Error(`Payment service: ${res.status}`);
  return res.json();
}

const breaker = new CircuitBreaker(callPaymentService, {
  timeout: 3000,          // if the call takes > 3 s, treat as failure
  errorThresholdPercentage: 50, // open when 50% of calls fail
  resetTimeout: 30_000,   // try again after 30 s
  volumeThreshold: 10,    // min calls before calculating failure rate
});

// Fallback — what to do when the circuit is open
breaker.fallback((data) => ({ status: 'queued', message: 'Payment deferred' }));

// Events for observability
breaker.on('open',     () => logger.warn('Circuit OPEN: payment service unavailable'));
breaker.on('halfOpen', () => logger.info('Circuit HALF-OPEN: probing payment service'));
breaker.on('close',    () => logger.info('Circuit CLOSED: payment service recovered'));

// Usage
app.post('/checkout', async (req, res) => {
  const result = await breaker.fire(req.body.payment);
  res.json(result);
});

// Expose circuit status for dashboards
app.get('/health', (req, res) => {
  res.json({ paymentCircuit: breaker.opened ? 'OPEN' : 'CLOSED' });
});
```

#### Related Patterns

**Bulkhead** — limit concurrency per downstream so one slow dependency can't consume all threads/connections:
```javascript
const pLimit = require('p-limit');
const limit = pLimit(10); // max 10 concurrent calls to this service

const results = await Promise.all(
  items.map((item) => limit(() => callDownstream(item)))
);
```

**Retry with Exponential Backoff + Jitter** — prevents retry storms:
```javascript
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 100, 10_000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

#### Do's and Don'ts

**Do's**
- Always pair a circuit breaker with a fallback — an open circuit with no fallback just returns errors.
- Export circuit state as a Prometheus metric so dashboards show which circuits are open across the fleet.
- Set `timeout` lower than your upstream SLO — fail fast rather than holding the connection.

**Don'ts**
- Don't retry non-idempotent operations (POST, payments) without deduplication — a retry that succeeds after the first attempt created a duplicate.
- Avoid retrying 4xx errors — they indicate client errors that won't resolve on retry; only retry 5xx and network errors.

#### Common Follow-up Questions
- What is the difference between a circuit breaker and a retry? Can they be used together?
- What happens if the fallback itself fails?
- How do you test circuit breaker behaviour without taking a real service down?

#### [Back to Top](#-table-of-contents)

---

## D. Microservices Communication Patterns

> **Level:** Advanced | **JD Link:** "250+ microservices, distributed systems"

#### Why This Is Asked
At HighLevel's scale — 250+ services, 4 billion API hits/day — how services talk to each other determines latency, reliability, and coupling. Interviewers test whether the candidate can choose the right pattern for the right problem.

#### Synchronous vs Asynchronous

| Pattern | When to Use | Trade-off |
|---|---|---|
| **REST (HTTP)** | Simple CRUD, public APIs | Easy to debug, but caller blocks and waits |
| **gRPC** | Internal service-to-service, streaming, low latency | Binary protocol, harder to debug, needs proto files |
| **Message Queue (Pub/Sub, Kafka, RabbitMQ)** | Fire-and-forget, fan-out, event-driven flows | Decoupled, resilient, but eventual consistency |
| **GraphQL** | Client-driven queries, BFF layer | Flexible, but N+1 problem, harder to cache |

#### Key Patterns

**Saga Pattern** — managing distributed transactions across services:
```
Order Service           Payment Service         Inventory Service
    ↓ CreateOrder
                            ↓ ChargeCard
                                                    ↓ ReserveStock
                        ← Charge failed
    ← CancelOrder (compensating transaction)
```
Each step has a compensating action. If step N fails, steps 1..N-1 are rolled back.

**API Gateway** — single entry point that routes, authenticates, rate-limits, and aggregates:
```javascript
// Simplified gateway logic
app.use('/api', authenticate);
app.use('/api/users', rateLimit({ max: 100 }), proxy('http://user-service'));
app.use('/api/crm',   rateLimit({ max: 200 }), proxy('http://crm-service'));
```

**Event-Driven Architecture** — services emit events; others subscribe:
```javascript
// Publisher (GCP Pub/Sub)
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

async function publishContactCreated(contact) {
  const data = Buffer.from(JSON.stringify({ type: 'contact.created', payload: contact }));
  await pubsub.topic('crm-events').publish(data);
}

// Subscriber
const subscription = pubsub.subscription('automation-worker');
subscription.on('message', async (message) => {
  const event = JSON.parse(message.data.toString());
  await handleEvent(event);
  message.ack(); // only ack after successful processing
});
subscription.on('error', (err) => logger.error({ err }, 'Pub/Sub error'));
```

#### Do's and Don'ts

**Do's**
- Use async messaging (Pub/Sub) for workflows where the caller doesn't need an immediate result (sending an email, triggering automation).
- Design events with a stable schema and version them — subscribers break when event shape changes silently.
- Include a `correlationId` in every event so distributed traces can be stitched together.

**Don'ts**
- Don't use a message queue where you need a synchronous response — the added latency and complexity aren't worth it.
- Avoid direct DB access across service boundaries — each service owns its own data store.

#### [Back to Top](#-table-of-contents)

---

## E. Distributed Tracing with OpenTelemetry

> **Level:** Advanced | **JD Link:** "distributed tracing (OTel), tail sampling"

#### Why This Is Asked
In a 250-microservice system, a slow request might touch 8 services. Without distributed tracing you can't see the full chain. OTel is the vendor-neutral standard HighLevel's stack likely uses.

#### Key Concepts

- **Trace** — the entire journey of one request across all services
- **Span** — a single unit of work within a trace (one DB query, one HTTP call, one function)
- **Context propagation** — passing trace ID + span ID via HTTP headers (`traceparent` W3C header) so downstream services continue the same trace
- **Sampling** — recording every trace is too expensive; head sampling (decide at entry) is simple; **tail sampling** (decide after seeing the full trace) lets you always capture slow/error traces

#### Code Example

```javascript
// Instrument Node.js with OpenTelemetry (auto-instrument HTTP, Express, MongoDB)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  serviceName: 'crm-service',
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
// Must be called before any other require — sets up auto-instrumentation

// Manual span for custom operations
const { trace, SpanStatusCode } = require('@opentelemetry/api');
const tracer = trace.getTracer('crm-service');

async function processCustomObject(objectId) {
  const span = tracer.startSpan('custom_object.process', {
    attributes: { 'object.id': objectId, 'object.type': 'contact' },
  });

  try {
    const result = await db.findCustomObject(objectId);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    throw err;
  } finally {
    span.end();
  }
}
```

#### Context Propagation Between Services

```javascript
// The W3C traceparent header carries the trace context
// Auto-instrumentation handles this automatically for HTTP calls
// For manual message passing (Pub/Sub), inject/extract manually:

const { propagation, context } = require('@opentelemetry/api');

// Publisher: inject current trace context into message attributes
async function publish(topic, data) {
  const carrier = {};
  propagation.inject(context.active(), carrier);
  await pubsub.topic(topic).publish(Buffer.from(JSON.stringify(data)), carrier);
}

// Subscriber: extract trace context from message attributes
subscription.on('message', (message) => {
  const remoteContext = propagation.extract(context.active(), message.attributes);
  context.with(remoteContext, async () => {
    await handleMessage(message);
    message.ack();
  });
});
```

#### Do's and Don'ts

**Do's**
- Auto-instrument first (HTTP, DB, Redis) — zero-code instrumentation covers 80% of spans.
- Add manual spans for critical business operations (charge, trigger automation) that auto-instrumentation won't capture.
- Use tail sampling: always sample traces with errors or latency > 2× p50 — discard routine fast-success traces.

**Don'ts**
- Don't add overly granular spans (per-iteration of a loop) — they create noise and inflate storage costs.
- Avoid sampling at the head if you need to always capture error traces — errors are rare but important.

#### [Back to Top](#-table-of-contents)

---

## F. RED/USE Metrics & SLO Engineering

> **Level:** Advanced | **JD Link:** "RED/USE metrics, SLO-driven engineering"

#### Why This Is Asked
HighLevel's on-call SREs use these frameworks to quickly find *what* is broken and *where*. Lead Engineers are expected to design services that produce the right signals and reason about reliability mathematically.

#### RED Metrics (for services)

> **R**ate · **E**rrors · **D**uration — applied to every service endpoint.

```javascript
// Expose RED metrics with Prometheus
const promClient = require('prom-client');

const httpRequestRate = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

// Middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const labels = { method: req.method, route: req.route?.path ?? 'unknown', status_code: res.statusCode };
    httpRequestRate.inc(labels);
    end(labels);
  });
  next();
});

// Expose to Prometheus scraper
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

#### USE Metrics (for resources: CPU, DB, Redis)

> **U**tilization · **S**aturation · **E**rrors — applied to every resource.

| Resource | Utilization | Saturation | Errors |
|---|---|---|---|
| Node.js event loop | `eventLoopUtilization` | Event loop lag (ms) | Uncaught exceptions/s |
| DB connection pool | `activeConnections / maxConnections` | `waitingCount` queue depth | Query errors/s |
| Redis | CPU % | Command queue depth | Connection errors |
| GKE pods | CPU requests used / limit | Pending pods | OOM kills |

#### SLI / SLO / Error Budget

```
SLI (Service Level Indicator)  — the metric you measure
SLO (Service Level Objective)  — the target for that metric
SLA (Service Level Agreement)  — the contractual commitment (usually looser than SLO)
Error Budget                   — 1 - SLO = allowed failure room
```

**Example for HighLevel's API:**
```
SLI: % of HTTP requests with status < 500 and latency < 500 ms (over 30-day window)
SLO: 99.9% of requests meet this criteria
Error Budget: 0.1% = 43.2 minutes/month of allowed failure

If error budget is > 50% consumed mid-month:
  → Freeze non-critical feature releases
  → Prioritise reliability work

If error budget is fully consumed:
  → All releases halted until budget resets
```

#### Do's and Don'ts

**Do's**
- Set SLOs that matter to users, not internal implementation metrics (prefer latency at p99 over average).
- Burn rate alerts are more actionable than threshold alerts — alert when the current consumption rate would exhaust the budget within 1 hour.
- Review SLOs quarterly — an SLO that is never violated might be too loose.

**Don'ts**
- Don't set an SLO of 100% — it's impossible and removes the error budget that allows risk-taking.
- Avoid alerting on every SLI breach — alert only when the burn rate indicates the budget will be exhausted.

#### [Back to Top](#-table-of-contents)

---

## G. Custom Objects & Dynamic Schema Design

> **Level:** Advanced | **JD Link:** "architectural planning for implementing new features around custom objects"

#### Why This Is Asked
This is the core domain of the role. "Custom Objects" in a CRM means users define their own entity types with custom fields (like Salesforce Custom Objects). Designing this correctly is the central system design challenge of the interview.

#### The Problem

A user wants to create a "Deal" object with fields: `title` (text), `value` (number), `closeDate` (date), `stage` (enum). Another user wants a "Property Listing" with completely different fields. The schema is user-defined, must be queryable and filterable, and needs to support thousands of different tenant schemas.

#### Design Patterns

**Option 1: EAV (Entity-Attribute-Value)**
```sql
CREATE TABLE custom_object_values (
  entity_id   UUID,
  field_key   VARCHAR(100),
  value_text  TEXT,
  value_num   NUMERIC,
  value_date  TIMESTAMPTZ
);
-- Querying: SELECT * FROM custom_object_values WHERE entity_id = ? AND field_key = 'stage'
-- Filtering: requires self-joins per field — painful at scale
```
❌ Extremely slow for multi-field queries. Don't use at HighLevel's scale.

**Option 2: JSON Column (PostgreSQL JSONB)**
```sql
CREATE TABLE custom_objects (
  id          UUID PRIMARY KEY,
  tenant_id   UUID NOT NULL,
  object_type VARCHAR(100) NOT NULL,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Fast single-field lookup with a GIN index
CREATE INDEX idx_data ON custom_objects USING GIN (data);

-- Filter by a specific field
SELECT * FROM custom_objects
WHERE tenant_id = $1
  AND object_type = 'deal'
  AND (data->>'stage') = 'Closed Won'
  AND (data->>'value')::numeric > 10000;
```
✅ Good for low-to-medium cardinality. GIN index degrades on very large datasets with many unique keys.

**Option 3: MongoDB Document (HighLevel's likely approach)**
```javascript
// Schema definition stored separately
const objectSchema = {
  tenantId: 'abc123',
  objectType: 'deal',
  fields: [
    { key: 'title',     type: 'text',   required: true },
    { key: 'value',     type: 'number', required: false },
    { key: 'stage',     type: 'enum',   options: ['New', 'Qualified', 'Closed Won'] },
    { key: 'closeDate', type: 'date',   required: false },
  ],
};

// Object instance
const dealRecord = {
  _id: ObjectId(),
  tenantId: 'abc123',
  objectType: 'deal',
  data: {
    title: 'Enterprise Licence',
    value: 50000,
    stage: 'Qualified',
    closeDate: new Date('2025-06-30'),
  },
  createdAt: new Date(),
};

// Indexing for filterable fields
// Compound index: tenantId + objectType + specific field
db.customObjects.createIndex({ tenantId: 1, objectType: 1, 'data.stage': 1 });
db.customObjects.createIndex({ tenantId: 1, objectType: 1, 'data.value': 1 });
// For text search across all fields:
db.customObjects.createIndex({ tenantId: 1, objectType: 1, 'data': 'text' });
```

**Option 4: Hybrid — Firestore for hot data + ClickHouse for analytics**
```
Write path:  App → Firestore (real-time, per-tenant collections)
Read path:   Firestore for record lookup, ClickHouse for aggregate queries
Sync:        Firestore → Pub/Sub → ClickHouse (streaming ingestion)
```

#### Recommended Architecture for HighLevel Scale

```
┌─────────────────────────────────────────────────────┐
│  Schema Registry (MongoDB / Firestore)              │
│  Stores field definitions per tenant+objectType     │
└─────────────────────────┬───────────────────────────┘
                          │ validate on write
┌─────────────────────────▼───────────────────────────┐
│  Object Store (MongoDB or Firestore)                │
│  Stores records with data: { ...userDefinedFields } │
│  Indexes: tenantId + objectType + high-cardinality  │
│           filterable fields                         │
└─────────────────────────┬───────────────────────────┘
                          │ stream via Pub/Sub
┌─────────────────────────▼───────────────────────────┐
│  ClickHouse                                         │
│  Columnar store for reporting, aggregations, exports│
└─────────────────────────────────────────────────────┘
```

#### Key Design Decisions to Discuss in Interview

1. **Schema validation** — validate on write (strict) or read (flexible)? Write-time validation prevents garbage data but requires schema migrations. Read-time is more flexible but allows inconsistency.

2. **Indexing strategy** — you can't index every possible user-defined field. Index fields that are marked "filterable" in the schema definition. Limit filterable fields per tenant.

3. **Multi-tenancy isolation** — row-level (`tenantId` field on every document) vs collection-level (one collection per tenant). Row-level is simpler; collection-level enables independent indexes per tenant but creates collection sprawl.

4. **Backward compatibility** — when a user deletes a field definition, existing records still have the data. Decide: hide it, migrate, or soft-delete.

#### [Back to Top](#-table-of-contents)

---

## H. MongoDB Performance & Indexing

> **Level:** Advanced | **JD Link:** "Optimize database queries, indexing strategies, denormalization"

#### Indexing Essentials

```javascript
// Compound index — order matters: Equality → Sort → Range
// For query: { tenantId: X, status: 'active', createdAt: { $gt: date } }
db.contacts.createIndex({ tenantId: 1, status: 1, createdAt: -1 });

// Covered query — index satisfies the full query without fetching documents
db.contacts.createIndex({ tenantId: 1, email: 1 });
db.contacts.find({ tenantId: 'abc' }, { email: 1, _id: 0 }); // all fields in index

// Partial index — only index active records (reduces index size)
db.contacts.createIndex(
  { tenantId: 1, email: 1 },
  { partialFilterExpression: { status: 'active' } }
);

// Explain to verify index usage
db.contacts.find({ tenantId: 'abc', status: 'active' }).explain('executionStats');
// Look for: IXSCAN (good), COLLSCAN (bad — no index used)
```

#### Aggregation Pipeline Optimisation

```javascript
// WRONG: $match after $lookup — scans all joined documents first
db.orders.aggregate([
  { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
  { $match: { tenantId: 'abc', status: 'paid' } }, // too late!
]);

// CORRECT: $match early, filter before joining
db.orders.aggregate([
  { $match: { tenantId: 'abc', status: 'paid' } }, // filter first — uses index
  { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
  { $project: { _id: 1, total: 1, 'product.name': 1 } }, // project last
]);

// Use $limit early for pagination
db.contacts.aggregate([
  { $match: { tenantId: 'abc' } },
  { $sort: { createdAt: -1 } },
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
]);
```

#### Common Performance Pitfalls

| Pitfall | Fix |
|---|---|
| Missing index on filter fields | Run `explain()`, add compound index |
| `$where` with JavaScript | Use native MongoDB operators |
| Large `$in` arrays (1000+ values) | Batch into chunks or use a different query shape |
| `$lookup` on unindexed `foreignField` | Always index the `foreignField` |
| `countDocuments()` on large collections | Use estimated count, maintain a counter, or paginate with cursor |
| No read preference in replica sets | Use `secondary` read preference for analytics queries |

#### [Back to Top](#-table-of-contents)

---

## I. ClickHouse for Analytics Workloads

> **Level:** Intermediate | **JD Link:** "ClickHouse" in DB stack

#### Why ClickHouse at HighLevel

HighLevel tracks 1.5 billion messages and 200 million leads per month. Querying aggregations on this at Mongo/Postgres scale is too slow. ClickHouse is a columnar OLAP database designed for analytics — aggregate queries on billions of rows run in seconds.

#### Key Characteristics

| Feature | ClickHouse | MongoDB/Postgres |
|---|---|---|
| Storage | Columnar (reads only relevant columns) | Row-based (reads entire rows) |
| Use case | `GROUP BY`, `COUNT`, `SUM`, `AVG` at scale | Point lookups, transactions, CRUD |
| Write pattern | Bulk insert (batch, not single rows) | Single-row inserts fine |
| Mutation | Immutable by design; updates are expensive | Full CRUD |
| Join | Avoid large joins; denormalise instead | Joins are normal |

#### Node.js Integration

```javascript
const { createClient } = require('@clickhouse/client');

const ch = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: 'analytics',
  clickhouse_settings: {
    async_insert: 1,           // batch on the server side
    wait_for_async_insert: 0,  // fire-and-forget (for high-throughput writes)
  },
});

// Analytics query — runs in seconds on billions of rows
const result = await ch.query({
  query: `
    SELECT
      toStartOfDay(occurred_at) AS day,
      event_type,
      count() AS event_count
    FROM message_events
    WHERE tenant_id = {tenantId: String}
      AND occurred_at >= now() - INTERVAL 30 DAY
    GROUP BY day, event_type
    ORDER BY day DESC
  `,
  query_params: { tenantId: 'abc123' },
  format: 'JSONEachRow',
});

// Bulk insert (always batch inserts into ClickHouse)
await ch.insert({
  table: 'message_events',
  values: events,   // array of objects
  format: 'JSONEachRow',
});
```

#### Architecture: Streaming from MongoDB/Firestore to ClickHouse

```
Firestore → Pub/Sub trigger → Cloud Function / Worker → ClickHouse (batch insert)
           (on every write)   (buffer 1 s or 1000 events)
```

#### Do's and Don'ts

**Do's**
- Always insert in batches (100–10,000 rows) — single-row inserts bypass ClickHouse's merge optimisation.
- Denormalise data before inserting — ClickHouse joins are expensive; flatten related data into one wide table.
- Use `ReplacingMergeTree` table engine if you need upsert semantics.

**Don'ts**
- Don't use ClickHouse for transactional workloads or real-time single-record lookups — use MongoDB/Postgres for those.
- Avoid `ALTER TABLE ... UPDATE` frequently — ClickHouse mutations are async and expensive.

#### [Back to Top](#-table-of-contents)

---

## J. Kubernetes / GKE for Node.js Services

> **Level:** Intermediate | **JD Link:** "Kubernetes, GKE, autoscaling, capacity planning"

#### What a Lead Engineer Needs to Know

You don't need to be a Kubernetes admin, but you need to understand how your Node.js service interacts with GKE: health probes, resource sizing, graceful termination, and autoscaling.

#### Health Probes

```javascript
// Liveness probe — is the process alive? If NO: Kubernetes restarts the pod
// Readiness probe — is the pod ready to serve traffic? If NO: removed from load balancer
// Startup probe — is the app still starting? Disables liveness until startup completes

app.get('/healthz/live', (req, res) => {
  // Only return 500 if the process is genuinely broken (e.g., DB connection permanently lost)
  res.json({ status: 'ok' });
});

app.get('/healthz/ready', async (req, res) => {
  // Return 503 when the service cannot serve traffic (DB connecting, warm-up in progress)
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message });
  }
});
```

```yaml
# Kubernetes deployment snippet
livenessProbe:
  httpGet:
    path: /healthz/live
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /healthz/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 2

# Always set resource requests AND limits for Node.js
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "1000m"
    memory: "512Mi"   # if Node.js exceeds this → OOM kill

# Graceful termination
terminationGracePeriodSeconds: 30
```

#### Horizontal Pod Autoscaler (HPA)

```yaml
# Scale based on CPU utilisation
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef:
    name: crm-service
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70  # scale up when average CPU > 70%
    - type: External  # custom metric: event loop lag
      external:
        metric:
          name: node_event_loop_lag_ms
        target:
          type: AverageValue
          averageValue: "100"
```

#### Do's and Don'ts

**Do's**
- Always implement separate liveness and readiness probes — they serve different purposes.
- Set memory limits explicitly — a Node.js memory leak without a limit will take down the node.
- Set `terminationGracePeriodSeconds` > your graceful shutdown timeout to give the app time to drain.

**Don'ts**
- Don't set CPU requests too low — Node.js CPU throttling causes event loop lag, which looks like slowness.
- Avoid running as `root` inside the container — use a non-root user in the Dockerfile.

#### [Back to Top](#-table-of-contents)

---

## K. Batching & Concurrency Control Patterns

> **Level:** Advanced | **JD Link:** "resilience via batching, caching, pooling, concurrency controls"

#### DataLoader Pattern (N+1 Problem)

When fetching a list of objects that each require a sub-query, naïve code makes N+1 DB calls. DataLoader batches them into one.

```javascript
const DataLoader = require('dataloader');

// Instead of: for each contact → query user (N queries)
// DataLoader batches: one query for all user IDs seen in a tick
const userLoader = new DataLoader(async (userIds) => {
  const users = await db.users.findByIds(userIds); // one query
  // Return users in the same order as userIds
  return userIds.map((id) => users.find((u) => u.id === id) ?? null);
});

// Usage — each call is individually made but they get batched automatically
const contacts = await db.contacts.findByTenant(tenantId);
const enriched = await Promise.all(
  contacts.map(async (contact) => ({
    ...contact,
    owner: await userLoader.load(contact.ownerId), // batched!
  }))
);
```

#### Write Batching (Pub/Sub / Firestore)

```javascript
// Anti-pattern: one write per event — 1000 events = 1000 separate writes
events.forEach((e) => db.insert(e));

// Correct: buffer and flush in batches
class BatchWriter {
  constructor({ maxSize = 500, maxWaitMs = 1000, writeFn }) {
    this.buffer = [];
    this.maxSize = maxSize;
    this.maxWaitMs = maxWaitMs;
    this.writeFn = writeFn;
    this.timer = null;
  }

  add(item) {
    this.buffer.push(item);
    if (this.buffer.length >= this.maxSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.maxWaitMs);
    }
  }

  async flush() {
    clearTimeout(this.timer);
    this.timer = null;
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0);
    await this.writeFn(batch);
  }
}

const writer = new BatchWriter({
  maxSize: 500,
  maxWaitMs: 1000,
  writeFn: (batch) => ch.insert({ table: 'events', values: batch, format: 'JSONEachRow' }),
});

subscription.on('message', (msg) => {
  writer.add(JSON.parse(msg.data));
  msg.ack();
});
```

#### Concurrency Limiting (Backpressure)

```javascript
const pLimit = require('p-limit');

// Process contacts in parallel, but max 20 at a time
// Prevents overwhelming downstream services
const limit = pLimit(20);

async function enrichAllContacts(contactIds) {
  const results = await Promise.all(
    contactIds.map((id) => limit(async () => {
      const contact = await fetchContact(id);
      const enriched = await enrichmentService.enrich(contact);
      return enriched;
    }))
  );
  return results;
}

// Semaphore for resource-constrained operations
class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    await new Promise((resolve) => this.queue.push(resolve));
    this.current++;
  }

  release() {
    this.current--;
    this.queue.shift()?.();
  }
}
```

#### [Back to Top](#-table-of-contents)

---

## 🏗 System Design Scenarios

### Scenario 1: Design HighLevel's Custom Objects System

**Prompt:** Design a system that lets 1 million tenants each define custom entity types (like "Deal", "Property") with custom fields, then create, filter, and report on records of those types. Target: 200 million records/day, filterable on any field, reports in <2 s.

**Discussion points:**
1. **Schema storage** — Firestore (one doc per schema per tenant): `schemas/{tenantId}/objectTypes/{type}`
2. **Record storage** — MongoDB with compound index `{tenantId, objectType, 'data.<filterableField>'}` — only index fields marked filterable in schema
3. **Analytics** — ClickHouse for reporting; stream writes via Pub/Sub
4. **Search** — Elasticsearch/OpenSearch for full-text and multi-field filter on arbitrary fields
5. **API design** — REST with dynamic field validation against schema on write; schema versioning for migration
6. **Tenancy** — row-level isolation (tenantId on every document); separate read replica per major tenant if needed

---

### Scenario 2: Debug a P0 — API Latency Spike to 5 s

**Prompt:** HighLevel's CRM API suddenly degrades from 50 ms to 5 s average latency. 250 services are running. Walk me through how you would identify and resolve this.

**Expected approach:**
1. **Check RED metrics** — which service's error rate or latency spiked first? (Grafana, distributed trace waterfall)
2. **Check USE metrics** — DB connection pool saturation? Redis CPU? Event loop lag?
3. **Trace a slow request** — pull a representative trace in Jaeger/Datadog, find the widest span
4. **Narrow down** — if the span is a MongoDB query, run `explain()` on the slow query. If it's a Pub/Sub lag, check subscriber backlog
5. **Immediate mitigation** — circuit break the slow dependency, roll back recent deploy, scale up
6. **Root cause** — missing index from a new query added in yesterday's deploy

---

### Scenario 3: Design a Rate Limiter for 250 Microservices

**Prompt:** Design a rate limiting system that works across 250 Node.js services, limits per tenant and per endpoint, and handles 4 billion hits/day without becoming a bottleneck itself.

**Expected approach:**
1. **Global rate limit store** — Redis with sliding window using sorted sets: `ZADD tenant:{id}:endpoint:{route} <timestamp> <uuid>; ZREMRANGEBYSCORE ...; ZCARD ...`
2. **Local token bucket** — approximate limits locally (each pod tracks last N requests), sync with Redis every 100 ms — reduces Redis load by 10×
3. **Sidecar / gateway enforcement** — enforce at API gateway (GKE Ingress / Envoy) rather than in each service — single point of enforcement
4. **Tiered limits** — global limit per tenant + stricter limit per endpoint (auth, export, webhook)
5. **Observability** — track rate limit hit rate per tenant; alert when a tenant consistently hits limits (upsell or abuse signal)

---

## 🤝 Lead Engineer Behavioral Questions

These test the "Lead" part of the role — architecture decisions, mentoring, communication under pressure.

**1. Describe a time you found and fixed a production performance regression.**
- Structure: what was the symptom → how you diagnosed → what you changed → what you measured after
- HighLevel angle: mention profiling tools, event loop lag, DB query analysis

**2. How do you decide whether to optimise existing code vs rewrite it?**
- Good answer: measure first (profiling, metrics). Rewrite only when the current design is architecturally misfit. Incremental improvement preferred.

**3. A junior engineer's PR introduces an N+1 DB query. How do you handle the review?**
- Good answer: explain the problem clearly in the PR comment with a concrete example. Don't just say "fix it" — show the DataLoader or batch query alternative. Use it as a teaching moment, not a gatekeeping one.

**4. Two senior engineers disagree on whether to use MongoDB vs Firestore for custom objects. How do you resolve it?**
- Good answer: frame the decision around measurable criteria (query flexibility, consistency guarantees, cost, operational complexity). Run a spike with both and benchmark under realistic load. Document the decision and the trade-offs.

**5. You discover that a service you own is silently dropping 0.1% of messages. How do you handle it?**
- Good answer: assess user impact first, add immediate alerting, add dead-letter queue to catch dropped messages, root-cause the drop (timeout? serialisation error?), add a test to prevent regression.

**6. How do you mentor engineers on writing high-performance Node.js code?**
- Good answer: code review with explanations (not just "fix this"), pair programming on profiling sessions, writing internal runbooks or ADRs (Architecture Decision Records) they can reference, setting up dashboards so engineers see the impact of their changes.

---

## 📖 Recommended Study Order

| Priority | Topic | Time |
|---|---|---|
| 🔴 Must | Custom Objects design (Section G) | 2 hrs |
| 🔴 Must | Node.js profiling practical (Section A) | 2 hrs |
| 🔴 Must | Circuit breaker + cascading failures (Section C) | 1 hr |
| 🔴 Must | SLO / RED / USE metrics (Section F) | 1 hr |
| 🟡 High | Distributed tracing OTel (Section E) | 1 hr |
| 🟡 High | MongoDB indexing (Section H) | 1 hr |
| 🟡 High | Batching & concurrency (Section K) | 1 hr |
| 🟢 Medium | Kubernetes probes & HPA (Section J) | 45 min |
| 🟢 Medium | ClickHouse basics (Section I) | 45 min |
| 🟢 Medium | Memory leak detection (Section B) | 45 min |
| 🟢 Medium | Microservices patterns (Section D) | 1 hr |

## 🌐 Socials:
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/biswajit_fsd) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/biswajitfsd) [![Medium](https://img.shields.io/badge/Medium-12100E?logo=medium&logoColor=white)](https://medium.com/@biswajitfsd) [![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/biswajitfsd) [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@biswajitfsd)
