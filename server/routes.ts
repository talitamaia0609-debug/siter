import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { insertMemberSchema, insertItemDropSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.get("/auth/discord", passport.authenticate("discord"));

  app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    (_req, res) => {
      res.redirect("/");
    }
  );

  app.post("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ message: "Erro ao destruir sessão" });
        }
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
        res.json({ message: "Logout realizado com sucesso" });
      });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = req.user as any;
    res.json({
      id: user.id,
      discordId: user.discordId,
      username: user.username,
      discriminator: user.discriminator,
      email: user.email,
      avatar: user.avatar,
    });
  });

  // Members routes
  app.get("/api/members", async (_req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar membros" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Membro não encontrado" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar membro" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar membro" });
    }
  });

  // Events routes
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar eventos" });
    }
  });

  app.get("/api/events/active", async (_req, res) => {
    try {
      const events = await storage.getActiveEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar eventos ativos" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Evento não encontrado" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar evento" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar atividades" });
    }
  });

  // Marketplace routes
  app.get("/api/marketplace", async (_req, res) => {
    try {
      const items = await storage.getMarketplaceItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar itens do marketplace" });
    }
  });

  // Point transfers routes
  app.get("/api/transfers", async (_req, res) => {
    try {
      const transfers = await storage.getPointTransfers();
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar transferências" });
    }
  });

  // Item drops routes
  app.get("/api/item-drops", async (_req, res) => {
    try {
      const drops = await storage.getItemDrops();
      res.json(drops);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar drops de itens" });
    }
  });

  app.post("/api/item-drops", async (req, res) => {
    try {
      const validatedData = insertItemDropSchema.parse(req.body);
      const drop = await storage.createItemDrop(validatedData);
      res.status(201).json(drop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar drop" });
    }
  });

  // Stats for dashboard
  app.get("/api/stats", async (_req, res) => {
    try {
      const members = await storage.getAllMembers();
      const activeEvents = await storage.getActiveEvents();
      const itemDrops = await storage.getItemDrops();
      
      const totalMembers = members.length;
      const activeEventsCount = activeEvents.length;
      const avgLevel = members.length > 0 
        ? Math.round(members.reduce((sum, m) => sum + m.level, 0) / members.length)
        : 0;

      res.json({
        totalMembers,
        activeEventsCount,
        avgLevel,
        totalItemDrops: itemDrops.length
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
