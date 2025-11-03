import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);
let db: Db;

export async function conectarBanco() {
  await client.connect();
  db = client.db(process.env.MONGO_DB || "loja-albuns");
  console.log("🎵 Banco de dados conectado com sucesso!");
}

export { db };
