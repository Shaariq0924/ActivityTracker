require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

const goalRoutes = require('./routes/goalRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notes', noteRoutes);

// MongoDB connection
/*
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/f1-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected via Mongoose'))
  .catch(err => console.error('MongoDB Error:', err));
*/

app.get('/', (req, res) => {
  res.json({ message: 'F1 Productivity API is running laps.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server warming up tires on port ${PORT}`);
});
