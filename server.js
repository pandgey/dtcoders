const express = require("express");
const app = express();
const PORT_NUMBER = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/frontend'));

app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on port ${PORT_NUMBER}`);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.get("/profile", (req, res) => {
    res.sendFile(__dirname + '/frontend/profile.html');
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