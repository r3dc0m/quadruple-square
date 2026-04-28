import express from "express";
import dotenv from "dotenv";
import router from "./routes/router.js";

dotenv.config();

const PORT = process.env.APP_PORT;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/", router);

app.get("/", (req, res) => {
    res.send("QS API up.");
});

app.listen(PORT,()=>{
    console.log(`Server up on port:${PORT}`);
})