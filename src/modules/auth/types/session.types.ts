export interface UserSession {
  username: string;
}

declare module 'express-session' {
  interface Session {
    user?: UserSession;
  }
}