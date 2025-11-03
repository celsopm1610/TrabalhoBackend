import { Request, Response } from "express";
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js";

interface Album {
  _id?: ObjectId;
  nome: string;
  artista: string;
  preco: number;
  capa: string;
  dataCadastro: Date;
}

class AdmController {
  // Criar novo álbum
  async criarAlbum(req: Request, res: Response) {
    try {
      const { nome, artista, preco, capa } = req.body;

      if (!nome || !artista || !preco || !capa) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
      }

      const novoAlbum: Album = {
        nome,
        artista,
        preco,
        capa,
        dataCadastro: new Date(),
      };

      await db.collection("albuns").insertOne(novoAlbum);
      return res.status(201).json({ mensagem: "Álbum cadastrado com sucesso!", novoAlbum });
    } catch (erro) {
      console.error("Erro ao criar álbum:", erro);
      return res.status(500).json({ mensagem: "Erro interno ao criar álbum." });
    }
  }

  // Listar todos os álbuns
  async listarAlbuns(req: Request, res: Response) {
    try {
      const albuns = await db.collection<Album>("albuns").find().toArray();
      return res.status(200).json(albuns);
    } catch (erro) {
      console.error("Erro ao listar álbuns:", erro);
      return res.status(500).json({ mensagem: "Erro ao listar álbuns." });
    }
  }

  // Atualizar um álbum
  async atualizarAlbum(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, artista, preco, capa } = req.body;

      const album = await db.collection<Album>("albuns").findOne({ _id: new ObjectId(id) });
      if (!album) {
        return res.status(404).json({ mensagem: "Álbum não encontrado." });
      }

      await db.collection("albuns").updateOne(
        { _id: new ObjectId(id) },
        { $set: { nome, artista, preco, capa } }
      );

      return res.status(200).json({ mensagem: "Álbum atualizado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao atualizar álbum:", erro);
      return res.status(500).json({ mensagem: "Erro ao atualizar álbum." });
    }
  }

  // Remover um álbum
  async removerAlbum(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const resultado = await db.collection("albuns").deleteOne({ _id: new ObjectId(id) });

      if (resultado.deletedCount === 0) {
        return res.status(404).json({ mensagem: "Álbum não encontrado." });
      }

      return res.status(200).json({ mensagem: "Álbum removido com sucesso!" });
    } catch (erro) {
      console.error("Erro ao remover álbum:", erro);
      return res.status(500).json({ mensagem: "Erro ao remover álbum." });
    }
  }
}

export default new AdmController();
