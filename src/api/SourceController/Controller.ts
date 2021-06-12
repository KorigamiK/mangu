import mangakomi from './Sources/mangakomi'
import rawmanga from './Sources/rawmanga'
import kissaway from './Sources/kissaway'

import {Imanga_source} from './MangaPrimitive'

export interface Isources {
    [key: string]: Imanga_source
}

// make sure that the key is the IDENTIFIER of the source
export const sources: Isources = {
    mangakomi: new mangakomi(),
    rawmanga: new rawmanga(),
    kissaway: new kissaway(),
} 