const bcrypt = require("bcryptjs");
const robot = require("robotjs");
const os = require("os");
const db = require("./db");
const { startScreenSharing } = require("./screenSharing");

const handleSocketConnection = (socket) => {
  console.log("Client connected");

  socket.emit("device_name", os.hostname());

  socket.on("set_password", async ({ password, userId }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO server_passwords (user_id, password_hash) VALUES (?, ?)";
      db.query(query, [userId, hashedPassword], (err, results) => {
        if (err) {
          console.error("Error setting password:", err);
          socket.emit("response", "error");
        } else {
          socket.emit("response", "password_set");
        }
      });
    } catch (err) {
      console.error("Error hashing password:", err);
      socket.emit("response", "error");
    }
  });

  socket.on("check_password", async (password) => {
    const query =
      "SELECT password_hash FROM server_passwords ORDER BY created_at DESC LIMIT 1";
    db.query(query, async (err, results) => {
      if (err) {
        console.error("Error checking password:", err);
        socket.emit("response", "error");
      } else if (results.length > 0) {
        const hashedPassword = results[0].password_hash;
        const match = await bcrypt.compare(password, hashedPassword);
        if (match) {
          socket.emit("response", "valid");
          startScreenSharing(socket);
        } else {
          socket.emit("response", "invalid");
        }
      } else {
        socket.emit("response", "invalid");
      }
    });
  });

  socket.on("generate_location", (data) => {
    const { deviceName, latitude, longitude } = data;
    const query = "SELECT device_id FROM devices WHERE device_name = ?";
    db.query(query, [deviceName], (err, result) => {
      if (err || result.length === 0) {
        console.error("Error fetching user ID:", err || "Device not found");
        socket.emit("location_response", "error");
      } else {
        const userId = result[0].device_id;
        const insertQuery =
          "INSERT INTO locations (user_id, latitude, longitude) VALUES (?, ?, ?)";
        db.query(insertQuery, [userId, latitude, longitude], (err, results) => {
          if (err) {
            console.error("Error storing location:", err);
            socket.emit("location_response", "error");
          } else {
            socket.emit("location_response", "location_stored");
          }
        });

        setInterval(() => {
          db.query(
            insertQuery,
            [userId, latitude, longitude],
            (err, results) => {
              if (err) {
                console.error("Error updating location:", err);
              } else {
                console.log("Location updated");
              }
            }
          );
        }, 600000); // 10 minutes
      }
    });
  });

  socket.on("mouse_action", (data) => {
    const { action, x, y } = data;
    const screenSize = robot.getScreenSize();
    const screenX = x * screenSize.width;
    const screenY = y * screenSize.height;

    switch (action) {
      case "move":
        robot.moveMouse(screenX, screenY);
        break;
      case "click":
        robot.moveMouse(screenX, screenY);
        robot.mouseClick();
        break;
      case "double_click":
        robot.moveMouse(screenX, screenY);
        robot.mouseClick();
        robot.mouseClick();
        break;
      case "right_click":
        robot.moveMouse(screenX, screenY);
        robot.mouseClick("right");
        break;
    }

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
  };

  socket.on("keyboard_action", (data) => {
    const { key, isKeyDown } = data;
    let mappedKey = keyMap[key] || key;

    if (mappedKey) {
      robot.keyToggle(mappedKey, isKeyDown ? "down" : "up");
    } else {
      console.error("Invalid key code specified:", key);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { handleSocketConnection };
