import { ACCESS_SECRET, REFRESH_SECRET } from "../../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const generateToken = (userId: string) => {
    const accessToken = jwt.sign({ _id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ _id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, REFRESH_SECRET);
};
