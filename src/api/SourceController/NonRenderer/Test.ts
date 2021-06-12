export class non_renderer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer

    public async test_method(): Promise<string> {
        console.log('hi from the renderer')
        const img_src: string = await this.ipcRenderer.invoke('get_encoded_response')
        return img_src
    }
} 
