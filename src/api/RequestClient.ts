export class request_client {
    header_options: RequestInit = {}
    static github_package_url = 'https://raw.githubusercontent.com/KorigamiK/mangu/main_master/package.json'
    private static latest_version: string | null = null
    private static current_version: string | null = null

    public static delay(time: number): Promise<void> {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public ipcRenderer = (window as any).ipcRenderer as Electron.IpcRenderer

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
    async eval_js(url: string, js_code: string, wait_for=1000): Promise<any> {
        return await this.ipcRenderer.invoke('execute_js_sync', url, js_code, wait_for)
    }

    async non_renderer_get_encoded_response(url: string, options: RequestInit): Promise<string> {
        const b64string: string = await this.ipcRenderer.invoke('get_encoded_response', url, options)
        return b64string
    }

    static async get_current_version(): Promise<string> {
        if (!request_client.current_version){
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            request_client.current_version = await ((window as any).ipcRenderer as Electron.IpcRenderer).invoke('get_version') as string
        }
        return request_client.current_version
    }

    static async get_latest_version(force=false): Promise<string> {
        if (!request_client.latest_version || force) {
            console.log('Fetching latest version...')
            const json: {version: string} = await (await fetch(request_client.github_package_url, {method: 'GET'})).json()
            request_client.latest_version = json.version
        }
        // await this.delay(1000)
        return request_client.latest_version
    }
}