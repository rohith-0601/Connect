import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import PostRoutes from "./routes/PostRoutes.js"
import UserRoutes from "./routes/UserRoutes.js"
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use("/uploads",express.static("uploads"))


app.use(PostRoutes)
app.use(UserRoutes)


const  main =  async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
};

main().then(()=>console.log("db connected")).catch(e=>{console.log(e)})


app.listen(process.env.PORT,()=>{
    console.log("server connected");
})
