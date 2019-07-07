const electron = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 680, maxWidth: 2700, maxHeight: 1920 });
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3240"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
