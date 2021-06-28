interface Iconfig {
    manga_directory: string
}

export default class file_system {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer

    static async folders (): Promise<string> {
        return await file_system.ipcRenderer.invoke('get_file_path')
    }

    static async config(): Promise<Iconfig> {
        return await file_system.ipcRenderer.invoke('get_config')
    }
}