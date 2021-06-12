import { Imanga_source, manga_primitive, Isearch_results, search_result, Ichapter } from '../MangaPrimitive'

interface kissaway_search {
    image: string,
    onclick: string, 
    primary: string, 
    secondary: string
}

export default class kissaway extends manga_primitive implements Imanga_source {

    SEARCH_API = new URL('https://kissaway.net/app/manga/controllers/search.single.php')
    public constructor() {
        super('https://kissaway.net', 'kissaway', 'KissAway - Raw')
        this.header_options = { mode: 'no-cors' }
    }

    async search(query: string): Promise<Isearch_results | null> {
        this.SEARCH_API.searchParams.append('q', query)
        const results = await (await this.get(this.SEARCH_API.toString(), {})).json()
        let return_results = [] as Isearch_results
        for (const result of results[0].data as Array<kissaway_search>) {
            const return_result = {} as search_result
            return_result.title = result.primary
            return_result.url = this.WEBSITE_HOME + result.onclick.replace("window.location='", '').replace("'", '')
            return_result.img = this.WEBSITE_HOME + result.image
            return_result.latest = result.secondary
            return_results = [...return_results, return_result]
        }
        return return_results
    }

    async get_chapters(url: string) {
        const page = await this.get(url)
        const dom = await this.fetch_html(await page.text())
        const chapters = []
        for (const node of dom.querySelectorAll("a.chapter[href]:not([href='#'])")) {
            chapters.push({url: this.WEBSITE_HOME + node.getAttribute('href')!, title: node.getAttribute('title')!})
        }
        return chapters as Ichapter[]
    }

    async get_images(chapter_url: string) {
        const page = await this.get(chapter_url)
        const dom = await this.fetch_html(await page.text())
        const raw_imgs = [] as string[]
        const tasks = []
        for (const i of dom.querySelectorAll('img.chapter-img')){
            tasks.push(this.non_renderer_get_encoded_response(i.getAttribute('data-aload')!, { headers: { 'referer': 'https://kissaway.net/' } }))
          }
        return await Promise.all(tasks)
    }
}