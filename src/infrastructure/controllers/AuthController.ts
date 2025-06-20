import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { RegisterUser } from "../../usecases/user/RegisterUser";
import { LoginUser } from "../../usecases/user/LoginUser";
import { Refresh } from "../../usecases/user/Refresh";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const usecase = new RegisterUser(new UserRepository());
    await usecase.execute({ name, email, password });
    res.status(200).json({
      message: "Registered User",
      content: {},
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const usecase = new LoginUser(new UserRepository());
    const result = await usecase.execute({ email, password });

    const { accessToken, refreshToken } = result.tokens;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login success",
      content: {
        accessToken,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res
      .status(401)
      .json({ error: "Refresh token not found, please login again" });
  }

  try {
    const usecase = new Refresh(new UserRepository());

    const result = await usecase.execute({ refreshToken });

    res.status(200).json({
      message: "Refresh success",
      content: {
        accessToken: result.tokens.accessToken,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};
