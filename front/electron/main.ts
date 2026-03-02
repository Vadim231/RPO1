/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, BrowserWindow, ipcMain } from "electron";
// import { createRequire } from 'node:module'
import { fileURLToPath } from "node:url";
import path from "node:path";

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, "public")
	: RENDERER_DIST;

let win: BrowserWindow | null;
function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
		frame: true,
		alwaysOnTop: true,
		titleBarStyle: "hidden",
		minWidth: 385,
		minHeight: 510,
	});
	
	ipcMain.on("window-control", (_, action) => {
		if (!win) return;
		switch (action) {
			case "minimize":
				win.minimize();
				break;
			case "maximize":
				win.isMaximized() ? win.unmaximize() : win.maximize();
				break;
			case "close":
				win.close();
				break;
		}
	});

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", new Date().toLocaleString());
	});

	// Обработка ошибок загрузки
	win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
		console.log("Load failed:", errorCode, errorDescription);
		// Пробуем перезагрузить через 2 секунды
		setTimeout(() => {
			if (VITE_DEV_SERVER_URL) {
				win?.loadURL(VITE_DEV_SERVER_URL);
			}
		}, 2000);
	});

	if (VITE_DEV_SERVER_URL) {
		console.log("Loading dev URL:", VITE_DEV_SERVER_URL);
		// Добавляем задержку для уверенности, что Vite сервер готов
		setTimeout(() => {
			win.loadURL(VITE_DEV_SERVER_URL).catch(err => {
				console.error("Failed to load URL:", err);
				// Пробуем еще раз через 1 секунду
				setTimeout(() => {
					win.loadURL(VITE_DEV_SERVER_URL).catch(console.error);
				}, 1000);
			});
		}, 500);
	} else {
		console.log("Loading from file:", path.join(RENDERER_DIST, "index.html"));
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
