/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter, Iimages } from '../MangaPrimitive'

export default class otakuscan extends manga_primitive implements Imanga_source {
    private SEARCH_API = 'https://otakuscan.net/Home/Search'

    public constructor() {
        super('https://otakuscan.net', 'otakuscan', 'OtakuScan - RAW')
        this.header_options = { mode: 'no-cors' }
    }

    async search(query: string): Promise<Isearch_results | null> {
        const uri = new URL(this.SEARCH_API)
        uri.searchParams.append('search', query)
        const html = await this.get(uri.toString())
        const dom = await this.fetch_html(await html.text())

        const ret = [] as Isearch_results

        for (const element of dom.querySelectorAll('div.picture-card')) {
            const card = element.querySelector('a[target=_blank]')
            const title = card?.getAttribute('alt')
            const link = this.WEBSITE_HOME.toString().slice(undefined, -1) + card?.getAttribute('href')
            const cover = card?.querySelector('img')?.getAttribute('src')
            ret.push({
                title: title!,
                url: link,
                img: cover!,
            })
        }

        return ret
    }

    async get_chapters(urlOrSlug: string): Promise<Array<Ichapter>> {
        const html = await this.get(urlOrSlug)
        const dom = await this.fetch_html(await html.text())
        const ret = [] as Ichapter[]
        const home = this.WEBSITE_HOME.toString().slice(undefined, -1)
        for (const element of dom.querySelectorAll('a.thrilldown')) {
            ret.push({title: element.getAttribute('title')!, url: home + element.getAttribute('href')!})
        }
        return ret
    }

    async get_images(url: string): Promise<Iimages> {
        const home = this.WEBSITE_HOME.toString().slice(undefined, -1)
        const next_prev = async () => {
            const html = await this.get(url.toString())
            const dom = await this.fetch_html(await html.text())
            return {
                previous_chapter: home + dom.querySelector('a.btn-pre')?.getAttribute('href'),
                next_chapter: home + dom.querySelector('a.btn-next[rel="next"]')?.getAttribute('data-href') !== 'https://otakuscan.netundefined' ? home + dom.querySelector('a.btn-next[rel="next"]')?.getAttribute('data-href') : '' ,
                title: dom.querySelector('h1.header.capitalize')!.textContent!.trim(),
            }
        }
        const x = await Promise.all([next_prev(), this.eval_js(url, "let x = []; for (i of document.querySelectorAll('img.canv.nor-pic:not(.loaded)')) {x.push(i.src)}; x", 3000)])
        return {...x[0], images: x[1]} as Iimages
    }
}