import jwt from "jsonwebtoken";
import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";

function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded: any) => {
    if (err || decoded?.role !== "admin") return res.sendStatus(403);
    next();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Admin login
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    // TEMP credentials
    if (email === "admin@gmail.com" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
      });

      return res.json({ token });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
