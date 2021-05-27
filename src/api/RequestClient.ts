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

    eval_js(url: string, js_code: string): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ((window as any).ipcRenderer as Electron.IpcRenderer).sendSync('execute_js_sync', url, js_code)
    }
}