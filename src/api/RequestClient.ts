export class request_client {
    header_options: RequestInit = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer

    get (url: RequestInfo, options: RequestInit={}): Promise<Response> {
        options.method = 'get'
        return fetch(url, {...options, ...this.header_options})
    }

    post (url: RequestInfo, options: RequestInit={}): Promise<Response> {
        options.method = 'post'
        return fetch(url, {...options, ...this.header_options})
    }

    async fetch_html(body: string): Promise<Document> {
        const mime = 'text/html'
        return new DOMParser().parseFromString(body, mime)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async eval_js(url: string, js_code: string): Promise<any> {
        return await this.ipcRenderer.invoke('execute_js_sync', url, js_code)
    }

    async non_renderer_get_encoded_response(url: string, options: RequestInit): Promise<string> {
        const b64string: string = await this.ipcRenderer.invoke('get_encoded_response', url, options)
        return b64string
    }
}