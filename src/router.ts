import express, { Request, Response } from "express";

import UserModel from "./models/user";
import faker from "faker";
import {MAX_DOCS} from "./index";

export const userRouter = express.Router();

// GET ALL
userRouter.get("/", async (req: Request, res: Response) => {
        return UserModel.find({}).then((users)=> {
            res.status(200).send(users);
        }).catch((e) => {
        res.status(500).send(e);
    })
});

// GET OR CREATE BY ID
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

// UPDATE BY ID
userRouter.put("/:id", async (req: Request, res: Response) => {
    return UserModel.updateOne({id: req.params.id},{'$set': req.body}).then((message) => {
        res.status(201).send(message);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

// DELETE BY ID
userRouter.delete("/:id", async (req: Request, res: Response) => {
    return UserModel.deleteOne({id: req.params.id}).then((message) => {
        res.status(200).send(message);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

// DELETE ALL
userRouter.delete("/", async (req: Request, res: Response) => {
    return UserModel.deleteMany({}).then((message) => {
        res.status(200).send(message);
    }).catch((e) => {
        res.status(500).send(e);
    })
})

// CREATE
userRouter.post("/", async (req: Request, res: Response) => {
    try {
        // get the list of documents created latest
        const count = await UserModel.find().sort({ createdAt: -1 })
        let result: unknown;

        if (count.length >= MAX_DOCS){
             // if existing documents list > max documents
            // overwrite the oldest document
             result =  await UserModel.findOneAndUpdate({}, {...req.body}, {new: true, overwrite: true}).sort('createdAt')
        } else {
             // else follow the usual create flow
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
