import express, { Request, Response } from "express";

import UserModel from "./models/user";


export const userRouter = express.Router();


userRouter.get("/", async (req: Request, res: Response) => {
        return UserModel.find({}).then((users)=> {
            res.status(200).send(users);
        }).catch((e) => {
        res.status(500).send(e);
    })
});

