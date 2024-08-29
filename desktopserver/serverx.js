const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const routes = require("./routes");
const { handleSocketConnection } = require("./socketHandlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use("/", routes);

io.on("connection", (socket) => {
  handleSocketConnection(socket);
});

server.listen(5000, () => console.log("Server running on port 5000"));
