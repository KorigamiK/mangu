import mangakomi from './Sources/mangakomi'
import rawmanga from './Sources/rawmanga'

import {Imanga_source} from './MangaPrimitive'

export interface Isources {
    [key: string]: Imanga_source
}

export const sources: Isources = {
    MangaKomi: new mangakomi(),
    RawManga: new rawmanga()
} 