import { join } from 'path'
import file_system from '../Filesystem'
import { request_client } from '../RequestClient'
interface Iconfig_primitive {
    manga_directory: string | null,
    disabled_sources: string[]
}

export abstract class manga_primitive extends request_client{
    public readonly WEBSITE_HOME: URL
    public readonly IDENTIFIER: string
    public readonly TITLE: string
    public CONFIG: Iconfig_primitive

    public async download(urls: string[], manga: string, chapter: string, headers={}): Promise<string> {
        const tasks = []
        const config = await file_system.config()
        for (const [index, url] of urls.entries()) {
            tasks.push(this.ipcRenderer.invoke('download_file', url, join(config.manga_directory, manga, chapter, index.toString().padStart(4, '0')), headers))
          }
        await Promise.all(tasks)
        return join((await file_system.config()).manga_directory, manga, chapter)
    }

    public constructor(website_home: string, identifier: string, title: string, header_options?: RequestInit) {
        super()
        this.WEBSITE_HOME = new URL(website_home)
        this.IDENTIFIER = identifier
        this.TITLE = title
        this.header_options = header_options ? header_options : {}
        this.CONFIG = {manga_directory: null, disabled_sources: []}
    }
}

export interface search_result {
    title: string,
    url: string,
    slug? : string,
    alt_name?: string,
    author?: string,
    rank?: number,
    categories?: string,
    img?: string,
    latest?: string
}

export type Isearch_results = Array<search_result>

export interface Ichapter {
    url: string,
    title: string,
    previous?: string,
    next?: string
}

export interface Iimages {
    images: string[],
    title?: string | null
    next_chapter?: string | null,
    previous_chapter?: string | null
}

export interface Imanga_source extends manga_primitive{
    search(query: string): Promise<Isearch_results | null>,
    get_chapters(slugorurl: string): Promise<Array<Ichapter>>,
    get_images(url: string): Promise<Iimages>
}