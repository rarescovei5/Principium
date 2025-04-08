// ./types/express.d.ts
import * as express from 'express';

declare module 'express' {
  export interface Request {
    user?: { id: string | number }; // Adjust type based on your JWT payload
  }
}
