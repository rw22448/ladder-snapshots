import express from "express";
import axios from "axios";
import cors from "cors";

require("dotenv").config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;
const PERSONAL_API_KEY = process.env.PERSONAL_API_KEY || "";

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

axios.interceptors.request.use((req) => {
  req.headers["X-Riot-Token"] = PERSONAL_API_KEY;
  return req;
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
