const express = require("express");
const app = express();
const PORT_NUMBER = 8080;

let db1 = [];

app.use(express.json());
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));

app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on port ${PORT_NUMBER}`);
});

app.get("/", (req, res) => {
    res.render("index.html", { data: db1 });
});