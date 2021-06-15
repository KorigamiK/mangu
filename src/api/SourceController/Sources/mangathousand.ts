/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter, search_result } from '../MangaPrimitive'

export default class mangathousand extends manga_primitive implements Imanga_source {
    SEARCH_API: URL

    public constructor() {
        super('https://manga1001.com/', 'manga1001', 'Manga1001 - RAW')
        this.header_options = { mode: 'no-cors' }
        this.SEARCH_API = this.WEBSITE_HOME
    }

    search = async (query: string): Promise<Isearch_results | null> => {
        this.SEARCH_API.searchParams.set('s', query)

        const html = await this.get(this.SEARCH_API.toString(), {})
        const dom = await this.fetch_html(await html.text())
        const results: Isearch_results = []
        for (const article of dom.querySelectorAll('article[id^="post"] a')) {
            const result = {} as search_result
            const img_tag = article.querySelector('img')
            if (!img_tag) continue
            result.img = img_tag.getAttribute('src')!
            result.title = img_tag.getAttribute('alt')!
            result.url = article.getAttribute('href')!
            results.push(result)
        }
        return results
    }

    get_chapters = async (urlOrSlug: string): Promise<Array<Ichapter>> => {
        const html = await this.get(urlOrSlug, {})
        const dom = await this.fetch_html(await html.text())
        const chapters = []
        for (const anchor of dom.querySelectorAll('[id^="post"] table a')) {
            const chapter = {} as Ichapter
            chapter.url = anchor.getAttribute('href')!
            chapter.title = anchor.textContent!
            chapters.push(chapter)
        }
        return chapters
    }

    get_images = async (url: string): Promise<Array<string>> => {
        const html = await this.get(url, {})
        const dom = await this.fetch_html(await html.text())
        const imgs: string[] = []
        for (const i of dom.querySelectorAll('.aligncenter')) {
            imgs.push(i.getAttribute('data-src') ? i.getAttribute('data-src')! : i.getAttribute('src')!)
        }
        const tasks = []
        if (imgs[0].includes('vuc19.club')) {
            for (const img of imgs) {
                tasks.push(this.non_renderer_get_encoded_response(img, { headers: { 'referer': 'https://manga1001.com/' }}))
            }
        }
        return tasks.length !== 0 ? await Promise.all(tasks) : imgs
    }
}