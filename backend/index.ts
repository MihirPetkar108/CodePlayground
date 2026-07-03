import express from "express";
import { createClient } from "redis";
import { prisma } from "./db";

const client = createClient();
client.connect();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json(`Backend is healthy!`);
});

app.get("/submission/:submissionId", async (req, res) => {
  const response = await prisma.submission.findFirst({
    where: {
      id: req.params.submissionId,
    },
  });
  res.json({
    status: response?.status,
    output: response?.output,
  });
});

app.post("/submission", async (req, res) => {
  const language = req.body.language;
  const code = req.body.code;

  try {
    const response = await prisma.submission.create({
      data: {
        language,
        code,
      },
    });
    await client.lPush(
      "submission",
      JSON.stringify({ submissionId: response.id, language, code }),
    );
    res.json({
      message: "processing",
      submissionId: response.id,
    });
  } catch (e) {
    console.log(`ERROR:- Cannot push to queue, ${e}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:- ${PORT}`);
});
