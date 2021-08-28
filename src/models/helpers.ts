
import { Document, ObjectId } from "bson";
import faker from "faker"
import mongoose from "mongoose";
import Message from "./message";
import User from "./user";

export const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL!);
};


export const createSeedUsersWithMessages = async (records = 10) => {
    const messages: Document[] = [];
    const users: Document[] = [];

    for (let i = 0; i < records; i++){
        const user = new User({
            username: faker.name.findName(),
            id: faker.datatype.uuid()
        });

        const message = new Message({
            text: faker.lorem.text(),
            user: user.id,
            id: faker.datatype.uuid()
        });

        messages.push(message)
        users.push(user)
    }

    await User.collection.insertMany(users)
    await Message.collection.insertMany(messages)
};