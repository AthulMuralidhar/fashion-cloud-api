import express, { Request, Response } from "express";

import UserModel from "./models/user";
import faker from "faker";


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
        const result = await UserModel.findByIdAndUpdate(req.params.id, {'$set': {
                username: faker.name.findName(),
                email: faker.internet.email(),
                extraInfo: faker.lorem.text()
            }
        }, {upsert: true, new: true, rawResult: true })

        if (result.lastErrorObject.updatedExisting){
            console.log("Cache hit")
        } else {
            console.log("Cache miss")
        }
        res.status(200).send(result.value)
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
