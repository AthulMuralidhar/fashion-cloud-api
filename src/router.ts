import express, { Request, Response } from "express";

import UserModel from "./models/user";
import faker from "faker";
import {MAX_DOCS} from "./index";



export const userRouter = express.Router();



userRouter.get("/", async (req: Request, res: Response) => {
        return UserModel.find({}).then((users)=> {
            res.status(200).send(users);
        }).catch((e) => {
        res.status(500).send(e);
    })
});

userRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        let result = await UserModel.findById(req.params.id)

        if (result){
            console.log("Cache hit")
        } else {
            console.log("Cache miss")
            result = await  UserModel.create({
                username: faker.name.findName(),
                id: req.params.id,
                email: faker.internet.email(),
                extraInfo: faker.lorem.text()
            })
        }
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});

userRouter.put("/:id", async (req: Request, res: Response) => {
    return UserModel.updateOne({id: req.params.id},{'$set': req.body}).then((message) => {
        res.status(201).send(message);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

userRouter.delete("/:id", async (req: Request, res: Response) => {
    return UserModel.deleteOne({id: req.params.id}).then((message) => {
        res.status(200).send(message);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

userRouter.delete("/", async (req: Request, res: Response) => {
    return UserModel.deleteMany({}).then((message) => {
        res.status(200).send(message);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

userRouter.post("/", async (req: Request, res: Response) => {
    try {
        const count = await UserModel.find().sort({ createdAt: -1 })
        let result: unknown;

        if (count.length >= MAX_DOCS){
             result =  await UserModel.findOneAndUpdate({}, {...req.body}, {new: true, overwrite: true}).sort('createdAt')
        } else {
             result = await  UserModel.create({
                id: faker.datatype.uuid(),
                ...req.body
            })
        }
        res.status(200).send(result);

    } catch (e) {
        res.status(500).send(e);
    }
});
