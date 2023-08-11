require("dotenv").config();

const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Boubacar",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to contact form server" });
  } catch (error) {
    res.status(500).json({ message: "Inetrnal server error" });
  }
});

app.post("/form", async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    const messageData = {
      from: `${firstName} ${lastName} <${email}>`, //"Excited User <me@samples.mailgun.org>",
      to: "bt.boubacar@gmail.com",
      subject: `Mailgun test : ${subject}`,
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    res.status(201).json(response);
  } catch (error) {
    res.status(error.status).json({ message: error });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "route not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started 👍 on PORT => " + port);
});
