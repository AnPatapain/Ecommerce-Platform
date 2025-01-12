import {Request,Response,NextFunction} from "express";

export async function customMiddleware(req: Request, res: Response, next: NextFunction) {

    next();
}