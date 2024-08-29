const screenshot = require("screenshot-desktop");

const startScreenSharing = (socket) => {
  let isSharing = false;

  const shareScreen = async () => {
    if (!isSharing) {
      isSharing = true;
      try {
        const img = await screenshot();
        const imgBase64 = img.toString("base64");
        socket.emit("screen_data", imgBase64);
      } catch (error) {
        console.error("Error capturing screen:", error);
      }
      isSharing = false;
    }
  };

  const intervalId = setInterval(shareScreen, 33);

  socket.on("disconnect", () => {
    clearInterval(intervalId);
  });
};

module.exports = { startScreenSharing };
