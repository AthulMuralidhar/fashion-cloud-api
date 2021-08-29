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
        // this is buggy now
        // it is updating the cache all the time instread of finding and returing
        // fucking sucks
        const result = await UserModel.findByIdAndUpdate(req.params.id, {'$set': {
                username: faker.name.findName(),
                email: faker.internet.email(),
                extraInfo: faker.lorem.text()
            }
        }, {upsert: true, new: true, rawResult: true })

        if (result.lastErrorObject.updatedExisting){
            console.log(result)
            console.log("Cache hit")
        } else {
            console.log(result)
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

userRouter.post("/", async (req: Request, res: Response) => {
    try {
        const count = await UserModel.count({"createdAt": -1})
        let result: unknown;

        if (count > MAX_DOCS){
             result =  await UserModel.findOneAndUpdate({"createdAt": -1}, {
                ...req.body
            }, {upsert: true, new: true})

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
