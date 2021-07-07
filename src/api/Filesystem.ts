interface Iconfig {
    manga_directory: string,
    disabled_sources: string[]
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

    public static async disable_source(IDENTIFIER: string): Promise<boolean> {
        const config = await file_system.config()
        config.disabled_sources.push(IDENTIFIER)
        await file_system.ipcRenderer.invoke('update_config', config)
        return true
    }

    public static async enable_source(IDENTIFIER: string): Promise<boolean> {
        const config = await file_system.config()
        config.disabled_sources = config.disabled_sources.filter(identifier => identifier !== IDENTIFIER)
        await file_system.ipcRenderer.invoke('update_config', config)
        return true
    }

    public static async update_config(new_config: Iconfig): Promise<boolean> {
        await file_system.ipcRenderer.invoke('update_config', new_config)
        return true
    }

}