export class request_client {
    header_options: RequestInit = {}
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await ((window as any).ipcRenderer as Electron.IpcRenderer).invoke('execute_js_sync', url, js_code)
    }
}