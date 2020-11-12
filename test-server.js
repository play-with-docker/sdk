const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const PORT = 8080;

const app = express();
console.log(__dirname + "/index.html");

app.get("/", express.static(__dirname));
app.use("/dist", express.static("dist"));

// app.use(
//   "/",
//   createProxyMiddleware({
//     target: "https://labs.play-with-docker.com",
//     changeOrigin: true,
//   })
// );
app.listen(PORT, () => {
  console.log(`Running on http://localhost:` + PORT);
});
