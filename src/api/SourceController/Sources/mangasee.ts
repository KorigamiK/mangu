/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter, Iimages, search_result } from '../MangaPrimitive'
import Fuse from 'fuse.js'

interface mangasee_manga {
    i: string,
    s: string,
    a: Array<string>
}

interface mangasee_chapter {
    Chapter: string,
    Type: string,
    Date: string,
    ChapterName: string | null
}

interface mangasee_CurChapter {
    Chapter: string,
    Type: string,
    Page: string,
    Directory: string,
    Date: string,
    ChapterName: string | null
}

export default class mangasee extends manga_primitive implements Imanga_source {
    ALL_MANGA: Array<mangasee_manga>
    COVER_API: string
    NAME_REGEX = /(?<=\/read-online\/)(.+)-chapter/
    
    public constructor() {
        super('https://mangasee123.com', 'mangasee', 'MangaSee - English')
        this.header_options = { mode: 'no-cors', referrer: "https://mangasee123.com/", }
        this.ALL_MANGA = []
        this.COVER_API = 'https://cover.nep.li/cover/'
    }

    async search(query: string): Promise<Isearch_results | null> {        
        if (this.ALL_MANGA.length === 0) {
            const resp = await this.post(this.WEBSITE_HOME + '/_search.php')
            this.ALL_MANGA = await resp.json()
        }

        const fuse = new Fuse(this.ALL_MANGA, {keys: ['s', 'a'], includeScore: false, findAllMatches: false})

        const results = fuse.search(query, {limit: 20})

        return results.map(({ item }) => {
            return {
                url: this.WEBSITE_HOME + 'manga/' + item.i,
                title: item.s,
                img: this.COVER_API + item.i + '.jpg'
            } as search_result
        })
    }

    async get_chapters(urlOrSlug: string): Promise<Array<Ichapter>> {
        const html = await (await this.get(urlOrSlug)).text()
        const chapter_regex = /vm.Chapters = (\[.+\])/
        const matches = chapter_regex.exec(html)
        urlOrSlug = urlOrSlug.replace('/manga/', '/read-online/')
        if (matches) {
            const chapters: mangasee_chapter[] = JSON.parse(matches[1])
            return chapters.map(chapter => {
                return {
                    url: urlOrSlug + this.chapter_url_encode(chapter.Chapter),
                    title: chapter.ChapterName || this.chapter_url_encode(chapter.Chapter).replaceAll('-', ' ').replace('.html', '').trim()
                } as Ichapter
            })
        } else {
            console.log('Error fetching chapters.')
            return []
        }
    }

    chapter_url_encode = (e: string): string => {
        let Index = "";
        const t = e.substring(0, 1);
        (1).toString() != t && (Index = "-index-" + t);
        const n = parseInt(e.slice(1, -1))
        let m = ""
        const a = e[e.length - 1];
        return (0).toString() != a && (m = "." + a), "-chapter-" + n + m + Index + ".html"
    }

    async get_images(url: string): Promise<Iimages> {
        const html = await (await this.get(url)).text()
        const CurChapter_regex = /vm.CurChapter = (\{.+\})/
        const CurPath_regex = /vm.CurPathName = (".+")/
        const Chapters_regex = /vm.CHAPTERS = (\[.+\])/

        const matches = CurChapter_regex.exec(html)
        const name = this.NAME_REGEX.exec(url)![1]
        const chapters: mangasee_chapter[] = JSON.parse(Chapters_regex.exec(html)![1])
        if (matches) {
            const CurChapter: mangasee_CurChapter = JSON.parse(matches[1])
            const CurPath = JSON.parse(CurPath_regex.exec(html)![1]);
            const imgs = []
            for(let i=1; i <= parseInt(CurChapter.Page); i++){
                const link = `https://${CurPath}/manga/${name}/${CurChapter.Directory == '' ? '' : CurChapter.Directory +'/'}${this.ChapterImage(CurChapter.Chapter)}-${this.PageImage(i)}.png`
                imgs.push(link)
            }
            let next = null
            let prev = null
            for(let i=0; i < chapters.length; i++){
                if(chapters[i].Chapter == CurChapter.Chapter){
                    next = chapters[i + 1]?.Chapter ? `${this.WEBSITE_HOME}read-online/${name}${this.chapter_url_encode(chapters[i + 1].Chapter)}` : null;
                    prev = chapters[i - 1]?.Chapter ? `${this.WEBSITE_HOME}read-online/${name}${this.chapter_url_encode(chapters[i - 1].Chapter)}` : null
                    break;
                }
            }
            return {images: imgs, next_chapter: next, previous_chapter: prev, title: `${name} chapter ${this.ChapterDisplay(CurChapter.Chapter)}`} as Iimages
        }else {
            console.log('Error while fetching images.')
            return {images: ['']}
        }
    }

    ChapterImage = (ChapterString: string): string => {
        const Chapter = ChapterString.slice(1,-1);
        const Odd = ChapterString[ChapterString.length -1];
        if(Odd == (0).toString()){
            return Chapter;
        }else{
            return Chapter + "." + Odd;
        }
    }

    PageImage = (PageString: number): string => {
        const s = "000" + PageString;
        return s.substr(s.length - 3);
    }

    ChapterDisplay = (ChapterString: string): string => {
        const Chapter = parseInt(ChapterString.slice(1,-1));
        const Odd = ChapterString[ChapterString.length -1];
        if(Odd == (0).toString()){
            return Chapter.toString();
        }else{
            return Chapter + "." + Odd;
        }
    }
}