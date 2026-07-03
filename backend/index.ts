import express from "express";
import { createClient } from "redis";

const client = createClient();
client.connect();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json(`Backend is healthy!`);
});

// app.get("/submission", (req, res) => { });

app.post("/submission", async (req, res) => {
  const language = req.body.language;
  const code = req.body.code;

  try {
    await client.lPush("submission", JSON.stringify({ language, code}));
    res.json({
      message: "processing",
    });
  } catch (e) {
    console.log(`ERROR:- Cannot push to queue, ${e}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:- ${PORT}`);
});
