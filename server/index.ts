// server/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/db';
import emergencyRoutes from './routes/emergency';
import lostItemRoutes from './routes/lost-items';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/lost-items', lostItemRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await dbConnect();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} is in use, trying ${PORT + 1}...`);
        app.listen(PORT + 1);
      } else {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();