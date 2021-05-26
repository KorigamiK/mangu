import { BrowserWindow, ipcMain, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { Blacklist } from '../FilterList'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isDevelopment = process.env.NODE_ENV !== 'production'

export default class Main {
    static mainWindow: Electron.BrowserWindow | null
    static application: Electron.App
    static browser_window = BrowserWindow

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static async get_page(url: string, script: string): Promise<any> {
        let new_window: null | BrowserWindow = new BrowserWindow({
            height: 600, width: 800,
            minHeight: 600, minWidth: 800,
            frame: true,
            show: false
        });
        new_window.webContents.session.webRequest.onBeforeSendHeaders(Blacklist, (details, callback)=> {
            callback({cancel: true})
        })
        // new_window.show()
        await new_window.loadURL(url)
        const ret = await new_window.webContents.executeJavaScript(script, true)
        new_window.close()
        new_window.on('closed', function () {
            console.log('closing the window')
            new_window = null
        })
        return ret
    }

    private static on_all_window_closed() {
        if (process.platform !== 'darwin') {
            Main.application.quit()
        }
    }

    private static on_close() {
        // dereference the window object
        Main.mainWindow = null
    }

    private static async on_ready() {
        // if (isDevelopment && !process.env.IS_TEST) {
        //     // Install Vue Devtools
        //     try {
        //         const vue_devtools_beta = { id: "ljjemllljcmogpfapbkkighbhhppjdbg", electron: ">=1.2.1" }
        //       await installExtension(vue_devtools_beta)
        //     } catch (e) {
        //       console.error('Vue Devtools failed to install:', e.toString())
        //     }
        //   }

        Main.mainWindow = new Main.browser_window({
            width: 800, height: 600, webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        })
        console.log(process.env.WEBPACK_DEV_SERVER_URL)
        // console.log(process.env)
        // Main.mainWindow.loadFile('../index.html')
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            await Main.mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
            if (!process.env.IS_TEST) Main.mainWindow.webContents.openDevTools()
          } else {
            createProtocol('app')
            // Load the index.html when not in development
            Main.mainWindow.loadURL('app://./index.html')
          }
        Main.mainWindow.webContents.session.webRequest.onBeforeSendHeaders(Blacklist, (details, callback)=> {
            callback({cancel: true})
        })
        Main.mainWindow.on('closed', Main.on_close)
        ipcMain.on('execute_js_sync', async (event, url: string, script: string) => {
            console.log(script)
            event.returnValue = await Main.get_page(url, script)
        })
    }

    static main(app: Electron.App): void {
        console.log('hello mains')
        Main.application = app
        protocol.registerSchemesAsPrivileged([
            { scheme: 'app', privileges: { secure: true, standard: true } }
          ])
        console.log(app.getAppPath())
        Main.application.on('window-all-closed', Main.on_all_window_closed)
        Main.application.on('ready', Main.on_ready)
    }
}