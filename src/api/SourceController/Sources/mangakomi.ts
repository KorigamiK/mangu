/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter } from '../MangaPrimitive'

export default class mangakomi extends manga_primitive implements Imanga_source {
    public constructor() {
        super('https://mangakomi.com/manga/', 'mangakomi', 'MangaKomi - English')
        this.header_options = { mode: 'no-cors' }
    }

    search = async (query: string): Promise<Isearch_results | null> => {
        const params = new URLSearchParams()
        params.append('action', 'wp-manga-search-manga')
        params.append('title', query)
        const resp = await (await this.post('https://mangakomi.com/wp-admin/admin-ajax.php', {
            "headers": { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            "body": params
        })).json()
        if (resp.success) {
            return resp.data
        } else {
            return null
        }
    }

    get_chapters = async (url: string): Promise<Array<Ichapter>> => {
        const html = await this.get(url)
        const dom = await this.fetch_html(await html.text())
        const chapters = [] as Ichapter[]
        dom.querySelectorAll('li.wp-manga-chapter > a').forEach((ele) => chapters.push({title: ele.textContent!.trim(), url: ele.getAttribute('href')!}))
        return chapters
    }

    get_images = async (url: string): Promise<Array<string>> => {
        const body = await (await this.get(url)).text()
        const dom = await this.fetch_html(body)
        const imgs: Array<string> = []
        dom.querySelectorAll("img[id^='image']").forEach((ele) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            imgs.push((ele as any).dataset.src.trim())
        })
        return imgs
    }
}