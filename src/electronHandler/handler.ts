import { BrowserWindow, ipcMain, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { Blacklist } from '../FilterList'
import path from 'path'
import { non_renderer_requests_client } from './nonRendererRequestsClient'
import { existsSync, mkdirSync, writeFile, readFileSync } from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'
console.log(`Starting in development = ${isDevelopment}`)

const delay = function(time: number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
}

export default class Main {
    static mainWindow: Electron.BrowserWindow | null
    static application: Electron.App
    static browser_window = BrowserWindow

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static async get_page(url: string, script: string, wait_for=1): Promise<any> {
        let new_window: null | BrowserWindow = new BrowserWindow({
            height: 600, width: 800,
            minHeight: 600, minWidth: 800,
            frame: true,
            show: false
        });
        new_window.webContents.session.webRequest.onBeforeSendHeaders(Blacklist, (details, callback) => {
            callback({ cancel: true })
        })
        new_window.on('closed', function () {
            console.log('closing the window')
            new_window = null
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ret: any
        // new_window.show()
        try {
            await new_window.loadURL(url)
            await delay(wait_for)
            ret = await new_window.webContents.executeJavaScript(script, true)
        } catch (err) {
            ret = err
        } finally {
            new_window.close()
        }
        return ret
    }

    private static request_client_init() {
        ipcMain.handle('get_encoded_response', async (event, url=non_renderer_requests_client.test_url, options=undefined) => {
            return await non_renderer_requests_client.get_encoded_response(url as string, options)
        })
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

    private static filesystem_init() {
        const config_directory = path.join(Main.application.getPath('userData'), 'config.json');
        let config: { manga_directory: string, disabled_sources: string[] }

        if (!existsSync(config_directory)) {
            const manga_dir = path.join(Main.application.getPath('pictures'), 'Manags')
            if (!existsSync(manga_dir)) mkdirSync(manga_dir)
            config = {
                manga_directory: manga_dir,
                disabled_sources: []
            }

            writeFile(config_directory, JSON.stringify(config), 'utf-8', (err) => {if (err) console.log('Something went wrong whilt writing file', err)})
            console.log('config created')

        } else {
            config = JSON.parse(readFileSync(config_directory, {encoding:'utf-8', flag:'r'}))
            if (!config.disabled_sources) {
                config.disabled_sources = []
                writeFile(config_directory, JSON.stringify(config), 'utf-8', (err) => {console.log('Updated the config.');if (err) console.log('Something went wrong whilt writing file', err)})
            }
            console.log('config found')
        }
        ipcMain.handle('get_file_path', () => {
            return Main.application.getAppPath()
        })

        ipcMain.handle('get_config', () => { return config })

        ipcMain.handle('download_file', async (event, url, download_location, headers={}) => await non_renderer_requests_client.download(url, download_location, headers))

        ipcMain.handle('update_config', async (event, new_config: typeof config) => {
            writeFile(config_directory, JSON.stringify(new_config), 'utf-8', (err) => {if (err) console.log('Something went wrong whilt writing file', err)})
        })
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
                // backgroundColor: '#FFF',
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                preload: path.join(__dirname, 'preload.js'),
                webSecurity: false,
            }
        })

        Main.mainWindow.webContents.setVisualZoomLevelLimits(1, 3)
        console.log(process.env.WEBPACK_DEV_SERVER_URL)
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            await Main.mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
            if (!process.env.IS_TEST) Main.mainWindow.webContents.openDevTools()
        } else {
            createProtocol('app')
            // Load the index.html when not in development
            Main.mainWindow.loadURL('app://./index.html')
        }
        Main.mainWindow.webContents.session.webRequest.onBeforeSendHeaders(Blacklist, (details, callback) => {
            callback({ cancel: true })
        })
        // Main.mainWindow.webContents.session.webRequest.onBeforeSendHeaders({
        //     urls: ['*://*/*']
        // }, (details, callback)=> {
        //     details.requestHeaders['Access-Control-Allow-Origin'] = 'http://localhost:8080'
        //     callback({ requestHeaders: details.requestHeaders })
        // })

        Main.mainWindow.on('closed', Main.on_close)
    }

    static main(app: Electron.App): void {
        Main.application = app
        protocol.registerSchemesAsPrivileged([
            { scheme: 'app', privileges: { secure: true, standard: true } }
        ])
        console.log(app.getAppPath())
        ipcMain.handle('execute_js_sync', async (event, url: string, script: string, wait_for=1) => {
            console.log(script)
            return await Main.get_page(url, script, wait_for)
        })
        Main.application.on('window-all-closed', Main.on_all_window_closed)
        Main.application.on('ready', Main.on_ready)
        Main.request_client_init()
        Main.filesystem_init()
    }
}