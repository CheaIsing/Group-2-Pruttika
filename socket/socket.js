// socket.js
const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    // console.log("A user connected:", socket.id);

    socket.on("join", (user_id) => {
      socket.join(user_id);
      console.log(`User ${user_id} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};