const express = require("express");
const app = express();
const PORT_NUMBER = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/frontend'));

app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on port ${PORT_NUMBER}`);
});

app.get("/", (_, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.get("/profile", (_, res) => {
    res.sendFile(__dirname + '/frontend/profile.html');
});