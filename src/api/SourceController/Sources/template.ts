import { Imanga_source, manga_primitive, Isearch_results, Ichapter, Iimages } from '../MangaPrimitive'

export default class mangathousand extends manga_primitive implements Imanga_source {
    public constructor() {
        super('https://manga1001.com/', 'manga1001', 'Manga1001 - RAW')
        this.header_options = { mode: 'no-cors' }
    }

    async search(query: string): Promise<Isearch_results | null> {
        console.log(query)
        return [] as Isearch_results
    }

    async get_chapters(urlOrSlug: string): Promise<Array<Ichapter>> {
        console.log(urlOrSlug)
        return [] as Ichapter[]
    }

    async get_images(url: string): Promise<Iimages> {
        console.log(url)
        return {} as Iimages
    }
}