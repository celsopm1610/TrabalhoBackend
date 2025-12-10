import { Stripe } from "stripe";
import { Express } from "express";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const app: Express = express();
import express, { Request, Response } from "express";
app.get("criar-pagamento-cartao"), async (req: Request, res: Response) => {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "brl",
      payment_method_types: ["card"],
      metadata: {
        pedido_id: "123",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    if (err instanceof Error)
      return res.status(400).json({ mensagem: err.message });
    res.status(400).json({ mensagem: "Erro de pagamento desconhecido!" });
  }
};