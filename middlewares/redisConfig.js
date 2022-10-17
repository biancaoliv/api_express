const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS || undefined
});

app.get("/page", (req, res) => {
  res.contentType("application/html");
  res.status(200).send("<h1>Home page/h1>")
});



