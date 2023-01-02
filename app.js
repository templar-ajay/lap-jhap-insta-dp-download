const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, ress) => {
  const { username } = req.body;
  console.log("username", username);
  const options = {
    method: "GET",
    url: "https://instagram130.p.rapidapi.com/account-info",
    params: { username: username },
    headers: {
      "X-RapidAPI-Key": `${process.env.API}`,
      "X-RapidAPI-Host": "instagram130.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const url = response.data.profile_pic_url_hd;
      https.get(url, (res) => {
        const path = "downloaded-image.jpg";
        const writeStream = fs.createWriteStream(path);

        res.pipe(writeStream);

        writeStream.on("finish", () => {
          writeStream.close();
          console.log("Download Completed!");
          ress.download(__dirname + "/downloaded-image.jpg");
        });
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(process.env.PORT || 3000, (x = process.env.PORT || 3000) => {
  console.log(
    `server up and running at ${
      x == 3000 ? "http://localhost:3000" : "http://localhost:" + x
    }`
  );
});
