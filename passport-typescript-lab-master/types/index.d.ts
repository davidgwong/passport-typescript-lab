export {};

declare module "express-session" {
  interface SessionData {
    passport: {
      user: number;
    };
    messages: string[];
  }
}

declare global {
  namespace Express {
    export interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      role: string;
    }
  }
}
