import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {connectDb, createSeedUsersWithMessages} from "./models/helpers";
import {models} from "mongoose";
import {userRouter} from "./router";
import morgan from 'morgan'

// load app constants
dotenv.config();
if (!process.env.PORT) {
    process.exit(1);
 }
 
const PORT: number = parseInt(process.env.PORT as string, 10);
const eraseDatabaseOnInit = process.env.ERASE_ON_INIT
const SEED_DOCS: number = parseInt(process.env.MAX_DOCS as string, 10) ?? 10;

// setup app wide constants
export const TTL_SECS: number = parseInt(process.env.TTL_SECS as string, 10) ?? 60000;
export const MAX_DOCS: number = parseInt(process.env.MAX_DOCS as string, 10) ?? 10;


// setup app middleware
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'))

// setup mongodb client
connectDb().then(async ()=>{
    if (eraseDatabaseOnInit) {
        // erase db on restart and populate with fake data
        await Promise.all([
            models.User.deleteMany({}),
        ]);
        try {
            await createSeedUsersWithMessages(SEED_DOCS);
            console.log('Seeded mongodb successfully')
        } catch (e) {
            console.log(`Seeded mongodb failed with error:${e}`)
        }
    } else {
        // NOTE: comment out the env variable to skip seed
        console.log('skipping seed...')
    }

    // setup app to listen on port
    app.listen(PORT, () => {
        console.log('MongoDB is up!')
        console.log(`Listening on port ${PORT}`);
    });
})

// setup app router
app.use("/", userRouter)



