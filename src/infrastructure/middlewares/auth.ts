import User from "../../infrastructure/db/models/User.ts";
import { verifyAccessToken } from "../../lib/util/token.ts";
import { Request, Response, NextFunction } from "express";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Authentication token required" });
  }

  const token = authorization?.split(" ")[1];

  try {
    const payload = verifyAccessToken(token ?? "");

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("_id" in payload)
    ) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    const { _id } = payload as { _id: string };

    req.user = await User.findOne({ _id });
    if (!req.user) {
      res.status(404).json({ error: _id });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
    return;
  }
};
