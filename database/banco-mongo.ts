import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI as string;
const insecure = process.env.MONGO_INSECURE === "true";

const client = new MongoClient(mongoUri, insecure ? { tlsAllowInvalidCertificates: true } : {});
let db: Db;

export async function conectarBanco() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB || "loja-albuns");
    console.log("Banco de dados conectado com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err);
    throw err;
  }
}

export { db };
