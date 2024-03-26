import { io } from '../core/http';
import { authMiddleware } from '../middlewares';

// middleware do JWT
io.use(authMiddleware.socketJWT);

io.on("connection", async (socket) => {
  socket.on("send", async (data) => {
    console.log(data);
  });

  socket.on("connect_error", (error) => {
    console.log(error);
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});