const app = require('./app');
const env = require('./config/env');

const PORT = env.port;

const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log('CropWise API is running');
  console.log(`Environment: ${env.nodeEnv}`);
  console.log(`Port: ${PORT}`);
  console.log('=================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Error] Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
