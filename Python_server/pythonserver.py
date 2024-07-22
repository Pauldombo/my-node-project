import asyncio
import websockets
import json
import mss
import numpy as np
import cv2
import base64
from pynput.mouse import Button, Controller as MouseController
from pynput.keyboard import Controller as KeyboardController

mouse = MouseController()
keyboard = KeyboardController()

password = None

async def set_password():
    global password
    password = input("Enter password: ")
    print(f"Password set: {password}")

async def start_server(websocket, path):
    global password

    async for message in websocket:
        data = json.loads(message)

        if "check_password" in data:
            if data["check_password"] == password:
                await websocket.send(json.dumps({"response": "valid"}))
                await start_screen_sharing(websocket)
            else:
                await websocket.send(json.dumps({"response": "invalid"}))

        elif "mouse_action" in data:
            action = data["mouse_action"]
            x = data["x"]
            y = data["y"]
            screen_size = mouse.screen
            screen_x = x * screen_size.width
            screen_y = y * screen_size.height

            if action == "move":
                mouse.position = (screen_x, screen_y)
            elif action == "click":
                mouse.position = (screen_x, screen_y)
                mouse.click(Button.left)
            elif action == "double_click":
                mouse.position = (screen_x, screen_y)
                mouse.click(Button.left, 2)
            elif action == "right_click":
                mouse.position = (screen_x, screen_y)
                mouse.click(Button.right)

        elif "keyboard_action" in data:
            key = data["key"]
            is_key_down = data["isKeyDown"]

            if is_key_down:
                keyboard.press(key)
            else:
                keyboard.release(key)

async def start_screen_sharing(websocket):
    sct = mss.mss()
    monitor = sct.monitors[1]

    while True:
        try:
            img = sct.grab(monitor)
            img_np = np.array(img)
            img_np = cv2.cvtColor(img_np, cv2.COLOR_BGRA2BGR)
            _, buffer = cv2.imencode('.jpg', img_np)
            img_str = base64.b64encode(buffer).decode('utf-8')
            await websocket.send(json.dumps({"screen_data": img_str}))
        except Exception as e:
            print(f"Error capturing screen: {e}")
            break
        await asyncio.sleep(1 / 30)  # 30 FPS

async def main():
    await set_password()
    async with websockets.serve(start_server, "0.0.0.0", 5000):
        print("Server is running on port 5000")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
