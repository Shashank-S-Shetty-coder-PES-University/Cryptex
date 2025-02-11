const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';  // MongoDB connection string
const dbName = 'test';  // Your database name

async function connectToMongoDB() {
  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    console.log('Connected to MongoDB!');
    
    const db = client.db(dbName);  // Select your database
    
    // Perform operations on the database here
    
    await client.close();  // Close the connection
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

connectToMongoDB();
