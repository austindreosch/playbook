// /pages/api/user.js
// endpoint for auth0 to call to create or update user in the database

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = cachedClient || new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  cachedClient = client;
  cachedDb = client.db('playbook');
  return cachedDb;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { auth0Id, name, email } = req.body;
    if (!auth0Id) {
      return res.status(400).json({ error: 'Missing auth0Id' });
    }

    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');

      // Upsert user for Auth0 hook
      await usersCollection.updateOne(
        { auth0Id },
        {
          $set: { name, email, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date(), newUser: true }
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DB Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { auth0Id, ...updateData } = req.body;
    if (!auth0Id) {
      return res.status(400).json({ error: 'Missing auth0Id' });
    }

    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');

      const updatePayload = {};
      for (const key in updateData) {
        if (updateData[key] !== undefined) {
          updatePayload[key] = updateData[key];
        }
      }

      await usersCollection.updateOne(
        { auth0Id },
        { $set: { ...updatePayload, updatedAt: new Date() } }
      );

      return res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      console.error('DB Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
