const express = require("express");
const redis = require("redis");
const { promisify } = require("util");

const PORT = process.env.PORT || 5001;
const REDIS_URL = process.env.REDIS_URL;

const app = express();
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

// curl http://localhost:5001/store/my-key\?some\=value\&some-other\=other-value
app.get("/store/:key", async (req, res) => {
  const { key } = req.params;
  const value = req.query;
  await client.connect();
  await client.set(key, JSON.stringify(value), redis.print);
  return res.send("success");
});

app.get("/:key", async (req, res) => {
  const { key } = req.params;
  await client.connect();
  const rawData = await client.get(key, redis.print);
  return res.json(JSON.parse(rawData));
});

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
