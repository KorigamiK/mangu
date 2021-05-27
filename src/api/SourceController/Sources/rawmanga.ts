import { Imanga_source, manga_primitive, Isearch_results } from '../MangaPrimitive'

export default class rawmanga extends manga_primitive implements Imanga_source {
    public constructor() {
        super('https://rawmanga.top/', 'rawmanga', 'RawManga - RAW')
        this.header_options = { mode: 'no-cors' }
    }

    search = async (query: string): Promise<Isearch_results | null> => {
        const params = new URLSearchParams()
        params.append('q', query)
        const resp = await this.get('https://rawmanga.top/ajax/search?' + params, {
            headers: {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "x-requested-with": "XMLHttpRequest",
            },
            body: null,
        })
        const results = await resp.json()
        if (results.length) {
            return results
        } else {
            return null
        }
    }

    get_chapters = async (urlOrSlug: string): Promise<Array<string>> => {
        urlOrSlug = urlOrSlug.includes('rawmanga') ? urlOrSlug : this.WEBSITE_HOME + urlOrSlug
        const html = await this.get(urlOrSlug)
        const dom = await this.fetch_html(await html.text())
        const chapters: Array<string> = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dom.querySelectorAll('#chapter-list > ul > li > a').forEach((ele) => chapters.push((ele as any).href))
        return chapters
    }

    get_images = async (url: string): Promise<Array<string>> => {
        console.log(url)
        const body = await (await this.get(url)).text()
        const dom = await this.fetch_html(body)
        let imgs: Array<string> = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dom.querySelector("select.custom-select.page-list")?.childNodes.forEach((ele) => (ele as any).value ? imgs.push((ele as any)['value']) : {})
        imgs = imgs.map((ele) => `${this.WEBSITE_HOME}viewer/${url.replace(this.WEBSITE_HOME.toString(), '')}/${ele}`)
        return imgs
    }
}