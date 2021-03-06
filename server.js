//////// Dependencies ////////

// get .env variables
require("dotenv").config();

// pull the PORT & DATABASE_URL from .env and assign PORT a default value of 3001
const { PORT = 3001, DATABASE_URL } = process.env;

// import express
const express = require("express");

// create application object
const app = express();

// import mongoose
const mongoose = require("mongoose");

// import middleware
const cors = require("cors");
const morgan = require("morgan");

//////// Database Connection ////////

// establish connection
mongoose.connect(DATABASE_URL);

// connection events
mongoose.connection
    .on("open", () => console.log("App connected to MongoDB"))
    .on("close", () => console.log("App disconnected from MongoDB"))
    .on("error", (error) => console.log(error))

//////// Models ////////
const BackgroundSchema = new mongoose.Schema({
    name: String,
    url: String,
},
    {
        timestamps: true
    })

const Background = mongoose.model("Background", BackgroundSchema);

//////// Middleware ////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//////// Routes ////////

// Test route
app.get("/", (req, res) => {
    res.send("Hello world");
});

// Backgrounds Index route
app.get("/backgrounds", async (req, res) => {
    try {
        res.json(await Background.find({})) // send all Backgrounds
    } catch (error) {
        res.status(400).json(error)
    }
});

// Background Create route
app.post("/backgrounds", async (req, res) => {
    try {
        res.json(await Background.create(req.body))
    } catch (error) {
        res.status(400).json.apply(error)
    }
})

// Background Delete route
app.delete("/backgrounds/:id", async (req, res) => {
    try {
        res.json(await Background.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
});

// Mood Update route
app.put("/backgrounds/:id", async (req, res) => {
    try {
        res.json(await Background.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
});

//////// Listener ////////
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
