const express = require("express");
const app = express();
const PORT_NUMBER = 8080;

let db1 = [];

app.use(express.json());
//app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));

app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on port ${PORT_NUMBER}`);
});

/**
 * Allow the user to upload a file on the homepage, helper functions will determine the height of a building and the number of buildings in the index.html file to be added and rendered.
 */
app.get("/", (req, res) => {
    res.render("./index.html", { data: db1 });
});

function calculateBuildingHeight(file) {
    let height = 0;
    for (let i = 0; i < file.length; i++) {
        if (file[i] === "1") {
            height++;
        }
    }
    return height;
}

function calculateNumberOfBuildings(file) {
    let count = 0;
    for (let i = 0; i < file.length; i++) {
        if (file[i] === "1") {
            count++;
        }
    }
    return count;
}