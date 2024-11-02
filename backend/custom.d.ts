// custom.d.ts

export {};

declare global {
  namespace Express {
    interface Request {
      files?: {
        coverImage?: {
          path: string;
        }[];
      };
    }
  }
}