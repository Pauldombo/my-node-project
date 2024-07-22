const io = require("socket.io")(5000);
const screenshot = require("screenshot-desktop");
const readline = require("readline");
const robot = require("robotjs");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let storedPassword = null;

// Function to set the password from console input
function setPassword() {
  rl.question("Enter password: ", (password) => {
    storedPassword = password;
    console.log("Password set:", storedPassword);
    rl.close();
  });
}

// Set the password from console input
setPassword();

io.on("connection", (socket) => {
  console.log("Client connected");

  // Event to check the password
  socket.on("check_password", (password) => {
    if (storedPassword && password === storedPassword) {
      socket.emit("response", "valid");
      startScreenSharing(socket);
    } else {
      socket.emit("response", "invalid");
    }
  });

  socket.on("mouse_action", (data) => {
    const { action, x, y } = data;
    const screenSize = robot.getScreenSize();
    const screenX = x * screenSize.width;
    const screenY = y * screenSize.height;

    if (action === "move") {
      robot.moveMouse(screenX, screenY);
    } else if (action === "click") {
      robot.moveMouse(screenX, screenY);
      robot.mouseClick();
    } else if (action === "double_click") {
      robot.moveMouse(screenX, screenY);
      robot.mouseClick();
      robot.mouseClick();
    } else if (action === "right_click") {
      robot.moveMouse(screenX, screenY);
      robot.mouseClick("right");
    }

    // Send the current mouse position to the client
    const currentMousePos = robot.getMousePos();
    socket.emit("mouse_position", {
      x: currentMousePos.x / screenSize.width,
      y: currentMousePos.y / screenSize.height,
    });
  });

  const keyMap = {
    Enter: "enter",
    Backspace: "backspace",
    Tab: "tab",
    Shift: "shift",
    Control: "control",
    Alt: "alt",
    CapsLock: "caps_lock",
    Escape: "escape",
    Space: "space",
    ArrowLeft: "left",
    ArrowUp: "up",
    ArrowRight: "right",
    ArrowDown: "down",
    // Add more mappings as needed
  };

  socket.on("keyboard_action", (data) => {
    const { key, isKeyDown } = data;
    const mappedKey = keyMap[key] || key; // Use mapped key if available, otherwise use the original key
    if (isKeyDown) {
      robot.keyToggle(mappedKey, "down");
    } else {
      robot.keyToggle(mappedKey, "up");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

console.log("Server is running on port 5000");

function startScreenSharing(socket) {
  let isSharing = false;

  const shareScreen = async () => {
    if (!isSharing) {
      isSharing = true;
      try {
        const img = await screenshot();
        const imgBase64 = img.toString("base64"); // Encode image data to Base64
        socket.emit("screen_data", imgBase64);
      } catch (error) {
        console.error("Error capturing screen:", error);
      }
      isSharing = false;
    }
  };

  // Capture screen every 33 milliseconds (for 30 FPS)
  const intervalId = setInterval(shareScreen, 33);

  // Clean up the interval when the socket disconnects
  socket.on("disconnect", () => {
    clearInterval(intervalId);
  });
}
