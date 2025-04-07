import express from 'express';
import jwt from 'jsonwebtoken';

export const verifyJWT = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401);
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Missing or invalid token' });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      res.sendStatus(403); // Respond with 403
      return;
    }

    req.body.user_id = (decoded as any).user_id;
    // Debugging statement for successful token verification

    next(); // Pass control to the next middleware
  });
};
