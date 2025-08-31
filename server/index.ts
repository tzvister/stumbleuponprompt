import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Environment and limits
const nodeEnv = process.env.NODE_ENV || 'development';
const bodyLimit = process.env.BODY_LIMIT || '100kb';

// Security headers (no CSP by default). Enable HSTS only in production.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: nodeEnv === 'production' ? undefined : false,
  })
);

// Body parsers with explicit limits
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: false, limit: bodyLimit }));

// Rate limiting (disabled in development)
if (nodeEnv !== 'development') {
  const apiWindowMs = parseInt(
    process.env.RATE_LIMIT_API_WINDOW_MS || process.env.RATE_LIMIT_WINDOW_MS || '60000',
    10
  );
  const apiMax = parseInt(
    process.env.RATE_LIMIT_API_MAX || process.env.RATE_LIMIT_MAX || '100',
    10
  );

  const healthWindowMs = parseInt(
    process.env.RATE_LIMIT_HEALTH_WINDOW_MS || process.env.RATE_LIMIT_WINDOW_MS || '60000',
    10
  );
  const healthMax = parseInt(
    process.env.RATE_LIMIT_HEALTH_MAX || process.env.RATE_LIMIT_MAX || '30',
    10
  );

  const apiLimiter = rateLimit({
    windowMs: apiWindowMs,
    max: apiMax,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const healthLimiter = rateLimit({
    windowMs: healthWindowMs,
    max: healthMax,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api', apiLimiter);
  app.use('/health', healthLimiter);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Enhanced error handling and logging for deployment
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

(async () => {
  try {
    console.log('🚀 Starting server initialization...');
    
    // Validate critical environment variables
    const port = parseInt(process.env.PORT || '5000', 10);
    
    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new Error(`Invalid port: ${process.env.PORT}. Must be a valid number between 1 and 65535.`);
    }
    
    console.log(`Environment: ${nodeEnv}`);
    console.log(`Target port: ${port}`);
    console.log(`Process PID: ${process.pid}`);
    
    // Register routes with error handling
    console.log('📋 Registering routes...');
    const server = await registerRoutes(app);
    console.log('✅ Routes registered successfully');

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      console.error('Express error handler:', {
        status,
        message,
        stack: err.stack,
        url: _req.url,
        method: _req.method
      });

      res.status(status).json({ message });
    });

    // Setup development or production environment
    if (nodeEnv === "development") {
      console.log('🔧 Setting up Vite development server...');
      await setupVite(app, server);
      console.log('✅ Vite development server configured');
    } else {
      console.log('📦 Setting up static file serving for production...');
      serveStatic(app);
      console.log('✅ Static file serving configured');
    }

    // Start the server with comprehensive error handling
    console.log(`🌐 Starting HTTP server on ${port}...`);
    
    const startServer = new Promise<void>((resolve, reject) => {
      const serverInstance = server.listen(port, "127.0.0.1", () => {
        console.log(`✅ Server successfully started on port ${port}`);
        console.log(`🌍 Server accessible at http://127.0.0.1:${port}`);
        log(`serving on port ${port}`);
        resolve();
      });
      
      // Handle server errors
      serverInstance.on('error', (error: any) => {
        console.error('Server error event:', error);
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${port} is already in use`);
        } else if (error.code === 'EACCES') {
          console.error(`❌ Permission denied to bind to port ${port}`);
        }
        reject(error);
      });
      
      // Graceful shutdown handling
      const gracefulShutdown = (signal: string) => {
        console.log(`Received ${signal}. Starting graceful shutdown...`);
        serverInstance.close((err) => {
          if (err) {
            console.error('Error during server shutdown:', err);
            process.exit(1);
          } else {
            console.log('Server closed successfully');
            process.exit(0);
          }
        });
      };
      
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    });
    
    await startServer;
    console.log('🎉 Application startup completed successfully!');
    
  } catch (error) {
    console.error('💥 Critical error during server startup:');
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    console.error('🔄 Server startup failed. Exiting...');
    process.exit(1);
  }
})();
