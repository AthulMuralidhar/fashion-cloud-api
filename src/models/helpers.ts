
import { Document } from "bson";
import faker from "faker"
import mongoose from "mongoose";
import User from "./user";

export const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL!);
};


export const createSeedUsersWithMessages = async (records = 10) => {
    const users: Document[] = [];

    for (let i = 0; i < records; i++){
        const user = new User({
            username: faker.name.findName(),
            id: faker.datatype.uuid(),
            email: faker.internet.email(),
            extraInfo: faker.lorem.text()
        });
        users.push(user)
    }

    await User.collection.insertMany(users)

};