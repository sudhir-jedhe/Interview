import { Router, Request, Response } from "express";
import { Product } from "../models/Product.js";

const productRouter = Router();

productRouter.get("/", async (_req: Request, res: Response) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

productRouter.post("/", async (req: Request, res: Response) => {
  const name = String(req.body.name || "").trim();
  const price = Number(req.body.price);
  const category = String(req.body.category || "").trim();

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  if (Number.isNaN(price) || price < 0) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  const product = await Product.create({
    name,
    price,
    category,
  });

  res.status(201).json(product);
});

productRouter.delete("/:id", async (req: Request, res: Response) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted successfully" });
});

export default productRouter;
