
import { Document } from "bson";
import faker from "faker"
import mongoose from "mongoose";
import UserModel from "./user";
import {TTL_SECS} from "../index";

// const TTL_SECS: number = parseInt(process.env.TTL_SECS as string, 10)

export const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL!);
};


export const createSeedUsersWithMessages = async (records = 10) => {
    const users: Document[] = [];

    for (let i = 0; i < records; i++){
        const user = new UserModel({
            username: faker.name.findName(),
            id: faker.datatype.uuid(),
            email: faker.internet.email(),
            extraInfo: faker.lorem.text()
        });
        users.push(user)
    }

    const createdIndex = await UserModel.collection.getIndexes()

    if (createdIndex.createdAt_1 ){
        // reset TTL for every refresh and seed
        await UserModel.collection.dropIndex("createdAt_1")
        await UserModel.collection.ensureIndex(
            { "createdAt": 1 },
            { "expireAfterSeconds": TTL_SECS},
        );

    } else {
        // if no createdAt then make the index and set it to the env variable
        await UserModel.collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: TTL_SECS })
    }

    await UserModel.collection.insertMany(users)

};