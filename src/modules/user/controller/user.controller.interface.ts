import { Request, Response } from "express";

export interface IUserController {
   createUser(req: Request, res: Response): Promise<void>;
   getUserById(req: Request, res: Response): Promise<void>;
   getAll(req: Request, res: Response): Promise<void>;
}
