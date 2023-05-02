require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT;
const PingMonitor = require("ping-monitor");
const nodemailer = require("nodemailer");
app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Hello World!");
});
//
const websiteUrl = "http://45.32.134.75";

function pingWebsite() {
  const monitor = new PingMonitor({
    website: "http://45.32.134.75",
    interval: 10, // Ping every 10 minutes
  });

  monitor.on("up", function (res) {
    console.log(`${websiteUrl}` + " is up.");
  });

  monitor.on("down", (error) => {
    // res.status(500).send(`Website is down with error: ${error}`);
    console.log(`${websiteUrl}` + " is down");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "ramuksampath5@gmail.com",
      to: "sampathnavgurukul@gmail.com,krishna@voxglobaltech.com",
      subject: "Website Down",
      text: `Website is down with error: ${error}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });

  monitor.start();
}
pingWebsite();
//

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
