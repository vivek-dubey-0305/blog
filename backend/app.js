import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const app = express();

// 7387042015


//!----------------------------------------------------------------!//
// * CORS: For Connecting Backend To Fronted
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === process.env.CORS_ORIGIN) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
//!----------------------------------------------------------------!//



//*---------------------------------------*//
//? sets the limit to send json to server
app.use(express.json({ limit: "16kb" }));
//*---------------------------------------*//

//*---------------------------------------*//
//? url encoder -- + in b/w of strings
app.use(express.urlencoded({ extended: true }));
//*---------------------------------------*//

//*---------------------------------------*//
//? using COokies
app.use(cookieParser());
//*---------------------------------------*//

//*---------------------------------------*//
//? public assests
app.use(express.static("public"));
//*---------------------------------------*//


app.use(express.static("build")); 

//?------------------------------------------------
//*ROUTES IMPORT
import userRouter from "./routes/user.route.js";

//*route declaration
app.use("/api/v1/users", userRouter)
//?------------------------------------------------


export { app };