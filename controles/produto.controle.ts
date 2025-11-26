import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../database/banco-mongo.js";

interface Produto {
  _id?: ObjectId;
  nome: string;
  artista: string;
  preco: number;
  capa: string;
  estoque: number;
  categoria?: string;
  dataCadastro: Date;
}

class ProdutoController {
  // Criar novo produto
  async criar(req: Request, res: Response) {
    try {
      const { nome, artista, preco, capa, estoque, categoria } = req.body;

      if (!nome || !artista || !preco || !capa || estoque === undefined) {
        return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios." });
      }

      const novoProduto: Produto = {
        nome,
        artista,
        preco,
        capa,
        estoque,
        categoria,
        dataCadastro: new Date()
      };

      const resultado = await db.collection("produtos").insertOne(novoProduto);
      const novoProdutoComId = { ...novoProduto, _id: resultado.insertedId.toString() };
      return res.status(201).json({ mensagem: "Produto cadastrado com sucesso!", novoProduto: novoProdutoComId });
    } catch (erro) {
      console.error("Erro ao criar produto:", erro);
      return res.status(500).json({ mensagem: "Erro interno ao criar produto." });
    }
  }

  // Listar todos os produtos
  async listar(req: Request, res: Response) {
    try {
      const produtos = await db.collection<Produto>("produtos").find().toArray();
      const produtosNormalizados = produtos.map(p => ({ ...p, _id: p._id ? p._id.toString() : p._id }));
      return res.status(200).json(produtosNormalizados);
    } catch (erro) {
      console.error("Erro ao listar produtos:", erro);
      return res.status(500).json({ mensagem: "Erro ao listar produtos." });
    }
  }

  // Buscar um produto pelo ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ mensagem: "ID de produto inválido." });
      const produto = await db.collection<Produto>("produtos").findOne({ _id: new ObjectId(id) });

      if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado." });

      return res.status(200).json({ ...produto, _id: produto._id ? produto._id.toString() : produto._id });
    } catch (erro) {
      console.error("Erro ao buscar produto:", erro);
      return res.status(500).json({ mensagem: "Erro ao buscar produto." });
    }
  }

  // Atualizar produto
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, artista, preco, capa, estoque, categoria } = req.body;

      if (!ObjectId.isValid(id)) return res.status(400).json({ mensagem: "ID de produto inválido." });
      const produto = await db.collection<Produto>("produtos").findOne({ _id: new ObjectId(id) });
      if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado." });

      await db.collection("produtos").updateOne({ _id: new ObjectId(id) }, { $set: { nome, artista, preco, capa, estoque, categoria } });

      return res.status(200).json({ mensagem: "Produto atualizado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao atualizar produto:", erro);
      return res.status(500).json({ mensagem: "Erro ao atualizar produto." });
    }
  }

  // Remover produto
  async remover(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) return res.status(400).json({ mensagem: "ID de produto inválido." });
      const resultado = await db.collection("produtos").deleteOne({ _id: new ObjectId(id) });

      if (resultado.deletedCount === 0) {
        return res.status(404).json({ mensagem: "Produto não encontrado." });
      }

      return res.status(200).json({ mensagem: "Produto removido com sucesso!" });
    } catch (erro) {
      console.error("Erro ao remover produto:", erro);
      return res.status(500).json({ mensagem: "Erro ao remover produto." });
    }
  }
}

export default new ProdutoController();
