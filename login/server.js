const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { OAuth2Client } = require('google-auth-library');

// Setup Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To handle URL-encoded data

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/mydatabase'; // Include database name
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Set up session middleware with MongoDB store
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoURI, // Ensure database name is included
    collectionName: 'sessions',
  }),
  cookie: { secure: false, maxAge: 1000 * 60 * 60 }, // 1-hour session expiration
}));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Sign-up Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Sign-in Route
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    res.status(200).json({ message: 'Sign-in successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Protected Route to Serve Main HTML
app.get('/login/Main/index_main.html', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Please log in first' });
  }
  res.sendFile(path.join(__dirname, 'public', 'login', 'Main', 'index_main.html'));
});

// Default Route for Serving HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Google OAuth Integration
const client = new OAuth2Client('221340987592-f6rqd5frd1jnvefsrv2ne5iq0evaqpuc.apps.googleusercontent.com'); // Replace with your actual Client ID

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '221340987592-f6rqd5frd1jnvefsrv2ne5iq0evaqpuc.apps.googleusercontent.com', // Replace with your actual Client ID
    });

    const payload = ticket.getPayload();
    const userid = payload['sub']; // Google's unique user ID

    // Use payload to create or retrieve user details
    res.status(200).json({ message: 'Authentication successful', user: payload });
  } catch (error) {
    res.status(400).json({ message: 'Authentication failed', error: error.message });
  }
});

// Handle favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204));

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start the Server
const PORT = 3000; // Changed to avoid conflict with MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
