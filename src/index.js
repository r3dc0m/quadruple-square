import express from "express";
import dotenv from "dotenv";
import router from "./routes/router.js";
import { checkDB, syncDB } from "./config/db.js";
import models from "./models/index.js";
import seedAll from "./seed/seed.js";

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
        currentPage: "home",
        contentView: "home"
    });
});

app.use((req, res, next) => {
    console.log("*************** INDEX MW **************")
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);

    next();
});

app.use((req, res) => {
    res.status(404).render("layout", {
        pageTitle: "404",
        currentPage: "404",
        contentView: "home"
    });
});

async function startServer() {
    await checkDB();
    await syncDB();

    if (await models.User.count() === 0) {
        await seedAll();
    }

    app.listen(PORT, () => {
        console.log(`Server up on port:${PORT}`);
    });
}

startServer();