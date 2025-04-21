import prom from "prom-client"

// Create a Registry to register the metrics
const register = new prom.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "lnct-community-api",
})

// Enable the collection of default metrics
prom.collectDefaultMetrics({ register })

// Create custom metrics
const httpRequestDurationMicroseconds = new prom.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000, 10000],
})

const httpRequestCounter = new prom.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
})

const errorCounter = new prom.Counter({
  name: "errors_total",
  help: "Total number of errors",
  labelNames: ["type", "message"],
})

const databaseOperationDurationMicroseconds = new prom.Histogram({
  name: "database_operation_duration_ms",
  help: "Duration of database operations in ms",
  labelNames: ["operation", "collection"],
  buckets: [0.1, 1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
})

const activeConnections = new prom.Gauge({
  name: "active_connections",
  help: "Number of active connections",
})

const memoryUsage = new prom.Gauge({
  name: "memory_usage_bytes",
  help: "Memory usage in bytes",
})

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds)
register.registerMetric(httpRequestCounter)
register.registerMetric(errorCounter)
register.registerMetric(databaseOperationDurationMicroseconds)
register.registerMetric(activeConnections)
register.registerMetric(memoryUsage)

// Update memory usage every 5 seconds
setInterval(() => {
  memoryUsage.set(process.memoryUsage().rss)
}, 5000)

// Middleware to measure HTTP request duration
export const metricsMiddleware = (req, res, next) => {
  const start = Date.now()

  // Increment active connections
  activeConnections.inc()

  // Record end time and calculate duration on response finish
  res.on("finish", () => {
    const duration = Date.now() - start
    const route = req.route ? req.route.path : req.path

    // Record HTTP request duration
    httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode.toString()).observe(duration)

    // Increment request counter
    httpRequestCounter.labels(req.method, route, res.statusCode.toString()).inc()

    // Decrement active connections
    activeConnections.dec()
  })

  next()
}

// Function to record database operation duration
export const recordDbOperation = (operation, collection, duration) => {
  databaseOperationDurationMicroseconds.labels(operation, collection).observe(duration)
}

// Function to record errors
export const recordError = (type, message) => {
  errorCounter.labels(type, message).inc()
}

// Metrics endpoint
export const metricsEndpoint = async (req, res) => {
  try {
    res.set("Content-Type", register.contentType)
    res.end(await register.metrics())
  } catch (error) {
    res.status(500).end(error)
  }
}

export default {
  metricsMiddleware,
  recordDbOperation,
  recordError,
  metricsEndpoint,
}
