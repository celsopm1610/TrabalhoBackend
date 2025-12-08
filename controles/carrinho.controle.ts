import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../database/banco-mongo.js"; 

interface AlbumDocument {
  id: ObjectId;
  nome: string;
  artista: string;
  preco: number;
  capa?: string;
  categoria?: string;
}

interface ItemCarrinho {
  albumId: string;
  nome: string;
  artista: string;
  precoUnitario: number;
  quantidade: number;
  capa?: string;
}

interface Carrinho {
  usuarioId: string;
  itens: ItemCarrinho[];
  dataAtualizacao: Date;
  total: number;
}

interface AutenticacaoRequest extends Request {
  usuarioId?: string;
  body: {
    albumId?: string;
    quantidade?: number;
    usuarioId?: string;
  };
}

class CarrinhoController {
  async adicionarItem(req: AutenticacaoRequest, res: Response) {
    try {
      const { albumId, quantidade } = req.body;
      const usuarioId = req.usuarioId;

      if (!usuarioId)
        return res.status(401).json({ mensagem: "Usuário não autenticado" });

      if (!albumId || typeof albumId !== "string")
        return res.status(400).json({ mensagem: "albumId inválido" });

      if (!quantidade || quantidade <= 0)
        return res.status(400).json({ mensagem: "quantidade inválida" });

      // Verificação corrigida
      if (!ObjectId.isValid(albumId)) return res.status(400).json({ mensagem: "albumId inválido" });
      
      const albumObjectId = new ObjectId(albumId);
      const album = await db.collection<AlbumDocument>("produtos").findOne({ _id: albumObjectId });

      if (!album)
        return res.status(404).json({ mensagem: "Álbum não encontrado" });

      const precoUnitario = album.preco;
      const nome = album.nome;
      const artista = album.artista;
      const capa = album.capa ?? "";

      const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId });

      if (!carrinho) {
        const novoCarrinho: Carrinho = {
          usuarioId,
          itens: [{ albumId, nome, artista, precoUnitario, quantidade, capa }],
          dataAtualizacao: new Date(),
          total: precoUnitario * quantidade,
        };
        const resultado = await db.collection("carrinhos").insertOne(novoCarrinho);
        const novoCarrinhoRetorno = { ...novoCarrinho, _id: resultado.insertedId.toString() };
        return res.status(201).json(novoCarrinhoRetorno);
      }

      const itemExistente = carrinho.itens.find(
        (it: ItemCarrinho) => it.albumId === albumId
      );

      if (itemExistente) {
        itemExistente.quantidade += quantidade;
      } else {
        carrinho.itens.push({ albumId, nome, artista, precoUnitario, quantidade, capa });
      }

      carrinho.total = carrinho.itens.reduce(
        (acc: number, item: ItemCarrinho) => acc + item.precoUnitario * item.quantidade,
        0
      );
      carrinho.dataAtualizacao = new Date();

      await db.collection("carrinhos").updateOne({ usuarioId }, { $set: carrinho });

      const carrinhoRetorno = { ...carrinho } as any;
      if ((carrinho as any)._id) carrinhoRetorno._id = (carrinho as any)._id.toString();
      return res.status(200).json(carrinhoRetorno);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao adicionar item" });
    }
  }

  async removerItem(req: Request, res: Response) {
    try {
      const { usuarioId, albumId } = req.body as { usuarioId: string; albumId: string };

      const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId });
      if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado" });

      carrinho.itens = carrinho.itens.filter((it: ItemCarrinho) => it.albumId !== albumId);
      carrinho.total = carrinho.itens.reduce(
        (acc: number, it: ItemCarrinho) => acc + it.precoUnitario * it.quantidade,
        0
      );
      carrinho.dataAtualizacao = new Date();

      await db.collection("carrinhos").updateOne({ usuarioId }, { $set: carrinho });
      return res.status(200).json(carrinho);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao remover item" });
    }
  }

  async listar(req: Request, res: Response) {
    const usuarioIdParam = (req.params as any).usuarioId as string | undefined;
    const usuarioId = usuarioIdParam || (req as AutenticacaoRequest).usuarioId;
    if (!usuarioId) return res.status(400).json({ mensagem: "usuarioId não fornecido" });

    const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId });
    if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado" });

    const carrinhoRetorno = { ...carrinho } as any;
    if ((carrinho as any)._id) carrinhoRetorno._id = (carrinho as any)._id.toString();
    return res.status(200).json(carrinhoRetorno);
  }

  async remover(req: Request, res: Response) {
    const { usuarioId } = req.params;
    const resultado = await db.collection("carrinhos").deleteOne({ usuarioId });
    if (resultado.deletedCount === 0)
      return res.status(404).json({ mensagem: "Carrinho não encontrado" });
    return res.status(200).json({ mensagem: "Carrinho removido" });
  }
}

export default new CarrinhoController();