// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// interface UserPayload extends jwt.JwtPayload {
//   id: string;
//   email: string;
//   // Add any other properties you expect in the payload
// }

// export function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }
