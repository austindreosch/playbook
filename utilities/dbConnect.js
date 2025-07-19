import mongoose from 'mongoose';

const connection = {};

async function dbConnect(req, res, next) {
  if (connection.isConnected) {
    return next();
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch(err => console.error('Database connection failed:', err));

  connection.isConnected = mongoose.connection.readyState;
}

export default dbConnect;