/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Imanga_source, manga_primitive, Isearch_results, Ichapter, Iimages } from '../MangaPrimitive'
import file_system from '@/api/Filesystem'
import fs from 'fs'
import { dirname, join } from 'path'
import fileUrl from 'file-url'
import Fuse from 'fuse.js'

export default class mangathousand extends manga_primitive implements Imanga_source {
    public constructor() {
        super('file:///home/pictures/Mangas', 'offlinemanga', 'Downloaded Manga')
        this.header_options = { mode: 'no-cors' }
    }

    async search(query: string): Promise<Isearch_results | null> {
        if (!this.CONFIG.manga_directory) this.CONFIG = await file_system.config()
        const all_series = fs.readdirSync(this.CONFIG.manga_directory!).filter(serie => fs.statSync(join(this.CONFIG.manga_directory!, serie)).isDirectory())
        .sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}))
        const results = [] as Isearch_results
        const fuse = new Fuse(all_series)
        fuse.search(query).forEach(({item}) => {
            results.push({
                title: item,
                url: join(this.CONFIG.manga_directory!, item)
            })
        })
        return results
    }

    async get_chapters(chapter_directory: string): Promise<Array<Ichapter>> {
        const all_chapters = fs.readdirSync(chapter_directory).filter(chapter => fs.statSync(join(chapter_directory, chapter)).isDirectory()).sort((a, b) => a.localeCompare(b, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true}))

        const ret = [] as Ichapter[]
        all_chapters.forEach((chapter, index) => {
            ret.push({
                title: chapter,
                url: join(chapter_directory, chapter),
                next: all_chapters[index + 1] ? join(chapter_directory, all_chapters[index + 1]) : undefined,
                previous: all_chapters[index - 1] ? join(chapter_directory, all_chapters[index - 1]) : undefined,
            })
        })
        return ret.reverse()
    }

    async get_images(images_directory: string): Promise<Iimages> {
        const ret = {} as Iimages
        ret.images = fs.readdirSync(images_directory).map(img => fileUrl(join(images_directory, img)));
        for (const chap of await this.get_chapters(dirname(images_directory))) {
            if (chap.url === images_directory) {
                ret.next_chapter = chap.next
                ret.title = chap.title
                ret.previous_chapter = chap.previous
                break
            }
        }
        return ret
    }
}