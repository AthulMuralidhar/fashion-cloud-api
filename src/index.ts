import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {connectDb, createSeedUsersWithMessages} from "./models/helpers";
import {models} from "mongoose";
import {userRouter} from "./router";
import morgan from 'morgan'

/*
ref for mongo: https://www.robinwieruch.de/mongodb-express-setup-tutorial
*/


dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
 }
 
const PORT: number = parseInt(process.env.PORT as string, 10);
const eraseDatabaseOnInit = process.env.ERASE_ON_INIT

// setup app wide constants
export const TTL_SECS: number = parseInt(process.env.TTL_SECS as string, 10) ?? 60000;
export const MAX_DOCS: number = parseInt(process.env.MAX_DOCS as string, 10) ?? 10;



const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'))

connectDb().then(async ()=>{
    if (eraseDatabaseOnInit) {
        await Promise.all([
            models.User.deleteMany({}),
        ]);
        try {
            await createSeedUsersWithMessages();
            console.log('Seeded mongodb succesfully')
        } catch (e) {
            console.log(`Seeded mongodb failed with error:${e}`)
        }
    } else {
        console.log('skipping seed...')
    }


    app.listen(PORT, () => {
        console.log('MongoDB is up!')
        console.log(`Listening on port ${PORT}`);
    });
})

app.use("/", userRouter)



