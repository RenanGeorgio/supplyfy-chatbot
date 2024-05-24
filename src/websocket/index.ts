import { io } from "../core/http";
// import { authMiddleware } from "../middlewares";

// let users = [];

// middleware do JWT
// io.use(authMiddleware.socketJWT);

io.on("connection", async (socket) => {
  // io.sockets.emit("users", users);

  // users.push({
  //   id: socket.id,
  //   username: socket.handshake.query.username,
  // });

  socket.on("send", async (data) => {
    console.log(data);
  });

  socket.on("connect_error", (error) => {
    console.log(error);
  });

  socket.on("disconnect", () => {
    // for (var i = 0, len = users.length; i < len; ++i) {
    //   var user = users[i];
    //   if (user.id == socket.id) {
    //     users.splice(i, 1);
    //     break;
    //   }
    // }
    // io.sockets.emit("users", users);
  });
});