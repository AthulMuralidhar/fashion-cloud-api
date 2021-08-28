import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import {connectDb, createSeedUsersWithMessages} from "./models/helpers";
import {models} from "mongoose";
import {userRouter} from "./router";

/*
ref for mongo: https://www.robinwieruch.de/mongodb-express-setup-tutorial
*/


dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
const eraseDatabaseOnInit = process.env.ERASE_ON_INIT
 const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

connectDb().then(async ()=>{
    if (eraseDatabaseOnInit) {
        await Promise.all([
            models.User.deleteMany({}),
        ]);
    }
   try {
        await createSeedUsersWithMessages();
        console.log('Seeded mongodb succesfully')
    } catch (e) {
       console.log(`Seeded mongodb failed with error:${e}`)
   }

    app.listen(PORT, () => {
        console.log('MongoDB is up!')
        console.log(`Listening on port ${PORT}`);
    });
})

app.use("/", userRouter)



