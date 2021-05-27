import { request_client } from '../RequestClient'

export abstract class manga_primitive extends request_client{
    public readonly WEBSITE_HOME: URL
    public readonly IDENTIFIER: string
    public readonly TITLE: string

    public constructor(website_home: string, identifier: string, title: string, header_options?: RequestInit) {
        super()
        this.WEBSITE_HOME = new URL(website_home)
        this.IDENTIFIER = identifier
        this.TITLE = title
        this.header_options = header_options ? header_options : {}
    }
}

export interface search_result {
    title: string,
    slug? : string,
    alt_name?: string,
    author?: string,
    rank?: number,
    categories?: string,
    img?: string,
    url: string,
}

export type Isearch_results = Array<search_result>

export interface Imanga_source extends manga_primitive{
    search: (query: string) => Promise<Isearch_results | null>,
    get_chapters : (slugorurl: string) => Promise<Array<string>>,
    get_images: (url: string) => Promise<Array<string>>
}