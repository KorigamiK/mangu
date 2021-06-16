/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter, Iimages } from '../MangaPrimitive'

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

    get_chapters = async (urlOrSlug: string): Promise<Array<Ichapter>> => {
        urlOrSlug = urlOrSlug.includes('rawmanga') ? urlOrSlug : this.WEBSITE_HOME + urlOrSlug
        const html = await this.get(urlOrSlug)
        const dom = await this.fetch_html(await html.text())
        const chapters: Ichapter[] = []
        dom.querySelectorAll('#chapter-list > ul > li > a').forEach((ele) => chapters.push({title: ele.textContent!, url: ele.getAttribute('href')!}))
        return chapters
    }

    get_images = async (url: string): Promise<Iimages> => {
        const body = await (await this.get(url)).text()
        const dom = await this.fetch_html(body)
        let imgs: Array<string> = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dom.querySelector("select.custom-select.page-list")?.childNodes.forEach((ele) => (ele as any).value ? imgs.push((ele as any)['value']) : {})
        imgs = imgs.map((ele) => `${this.WEBSITE_HOME}viewer/${url.replace(this.WEBSITE_HOME.toString(), '')}/${ele}`)
        const ret = {} as Iimages
        ret.images = imgs 
        ret.title = dom.querySelector('main > div ul > li:last-child')?.textContent
        ret.previous_chapter = dom.querySelector('select.chapter-list [selected]')?.nextElementSibling?.getAttribute('value')
        if (ret.previous_chapter) ret.previous_chapter = url.split('/').slice(0, -1).join('/') + '/' +ret.previous_chapter
        ret.next_chapter = dom.querySelector('select.chapter-list [selected]')?.previousElementSibling?.getAttribute('value')
        if (ret.next_chapter) ret.next_chapter = url.split('/').slice(0, -1).join('/') + '/' +ret.next_chapter

        return ret
    }
}