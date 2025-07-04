import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const client = new MongoClient(url);
export const mongoClientPromise = client.connect().then(() => {
    console.log("Connected to MongoDB (music)");
    return client.db(process.env.MONGO_DB);
});