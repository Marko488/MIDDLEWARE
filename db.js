import express from "express";
import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();
let mongoURI = process.env.MONGO_URI;
let db_name = process.env.DB_NAME;

async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    let db = client.db(db_name);
    console.log("Uspjesno spojeno na bazu podataka!");
    return db;
  } catch (error) {
    console.error("Greska u spajanju na bazu podataka ", error.message);
  }
}

export { connectToDatabase };
