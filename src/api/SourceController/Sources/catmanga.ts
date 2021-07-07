/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter, Iimages } from '../MangaPrimitive'
import { filter as fuzzy_filter } from 'fuzzaldrin'

interface catmanga_serie {
    all_covers: Array<{source: string}>
    alt_titles: string[],
    authors: string[],
    chapters: {
        title: string | undefined,
        number: number,
        volume: number,
        groups: string[]
    }[],
    cover_art: {
        source: string
    },
    description: string,
    genres: string[],
    series_id: string,
    status: string,
    title: string,
}

interface all_catmanga {
    props: {
        pageProps: {
            series: Array<catmanga_serie>
        }
    }
}

interface catmanga_chapter_images{
    props: {
        pageProps: {
            chapter: {
                title: string,
                number: number,
                volume: number
            }
            pages: string[],
            series: {
                title: string,
                series_id: string
            }
        }
    }
}
export default class catmanga extends manga_primitive implements Imanga_source {
    ALL_MANGA: all_catmanga | null

    public constructor() {
        super('https://catmanga.org/', 'catmanga', 'CatManga - English')
        this.header_options = { mode: 'no-cors' }
        this.ALL_MANGA = null
    }

    async search(query: string): Promise<Isearch_results | null> {
        if (this.ALL_MANGA === null) {
            const html = await this.get(this.WEBSITE_HOME.toString())
            const dom = await this.fetch_html(await html.text())
            this.ALL_MANGA = JSON.parse(dom.querySelector('script#__NEXT_DATA__')!.textContent!) as all_catmanga
        }

        const filtered = fuzzy_filter(this.ALL_MANGA.props.pageProps.series, query, {key: 'title', maxResults: 20})
        const ret = [] as Isearch_results
        for (const i of filtered) {
            ret.push({
                title: i.title,
                url: new URL(`/series/${i.series_id}`, this.WEBSITE_HOME).href,
                img: i.cover_art.source
            })
        }
        return ret
    }

    async get_chapters(url: string): Promise<Array<Ichapter>> {
        const manga_id = url.split('/').splice(-1)[0]
        const ret = [] as Ichapter[]
        for (const serie of this.ALL_MANGA!.props.pageProps.series) {
            if (serie.series_id === manga_id) {
                for (const chapter of serie.chapters) {
                    ret.push({
                        title: `${chapter.number} - ${chapter.title || serie.title}`,
                        url: `${url}/${chapter.number}`
                    })
                }
                break
            }
        }
        return ret
    }

    async get_images(url: string): Promise<Iimages> {
        const html = await this.get(url)
        const dom = await this.fetch_html(await html.text())
        const data: catmanga_chapter_images = JSON.parse(dom.querySelector('script#__NEXT_DATA__')!.textContent!)
        const series = this.get_series(data.props.pageProps.series.series_id)!
        let next: string | undefined
        let prev: string | undefined
        for (const [index, chapter] of series.chapters.entries()) {
            if (chapter.number === data.props.pageProps.chapter.number) {
                // eslint-disable-next-line no-empty
                try {next = `${url.split('/').slice(0, -1).join('/')}/${series.chapters[index + 1].number}`} catch(e) {}
                // eslint-disable-next-line no-empty
                try {prev = `${url.split('/').slice(0, -1).join('/')}/${series.chapters[index - 1].number}`} catch(e) {}
                break
            }
        }
        return {
            images: data.props.pageProps.pages,
            title: `${data.props.pageProps.chapter.number} - ${data.props.pageProps.chapter.title || data.props.pageProps.series.title}`,
            next_chapter: next,
            previous_chapter: prev
        } as Iimages
    }

    get_series(series_id: string): catmanga_serie | null {
        for (const serie of this.ALL_MANGA!.props.pageProps.series) {
            if (serie.series_id === series_id) return serie
        }
        return null
    }
}