import express from "express";
import dotenv from "dotenv";
import router from "./routes/router.js";
import { checkDB, syncDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.APP_PORT;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('public'));

app.use("/", router);

app.get("/", (req, res) => {
    res.render("layout", {
        pageTitle: "Quadruple Square",
        currentPage: "home"
    });
});

async function startServer() {
    await checkDB();
    await syncDB();
    app.listen(PORT, () => {
        console.log(`Server up on port:${PORT}`);
    });
}

startServer();