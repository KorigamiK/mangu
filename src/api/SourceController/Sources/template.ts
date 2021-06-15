import { Imanga_source, manga_primitive, Isearch_results, Ichapter } from '../MangaPrimitive'

export default class mangathousand extends manga_primitive implements Imanga_source {
    public constructor() {
        super('https://manga1001.com/', 'manga1001', 'Manga1001 - RAW')
        this.header_options = { mode: 'no-cors' }
    }

    search = async (query: string): Promise<Isearch_results | null> => {
        console.log(query)
        return [] as Isearch_results
    }

    get_chapters = async (urlOrSlug: string): Promise<Array<Ichapter>> => {
        console.log(urlOrSlug)
        return [] as Ichapter[]
    }

    get_images = async (url: string): Promise<Array<string>> => {
        console.log(url)
        return [] as string[]
    }
}