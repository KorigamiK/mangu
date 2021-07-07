import mangakomi from './Sources/mangakomi'
import rawmanga from './Sources/rawmanga'
import kissaway from './Sources/kissaway'
import mangathousand from './Sources/mangathousand'
import otakuscan from './Sources/otakuscan'
import offlinemanga from './Sources/offlinemanga'
import mangasee from './Sources/mangasee'
import {Imanga_source} from './MangaPrimitive'

export interface Isources {
    [key: string]: Imanga_source
}

// make sure that the key is the IDENTIFIER of the source
export const sources: Isources = {
    mangakomi: new mangakomi(),
    rawmanga: new rawmanga(),
    kissaway: new kissaway(),
    manga1001: new mangathousand(),
    otakuscan: new otakuscan(),
    mangasee: new mangasee(),
    offlinemanga: new offlinemanga(),
}

interface Iidentifier {
    identifier: string,
    title: string,
    website_home: string,
}

function get_identifiers() {
    const identifiers: Iidentifier[] = []
    for (const source in sources) {
        identifiers.push({
            identifier: sources[source].IDENTIFIER,
            title: sources[source].TITLE,
            website_home: sources[source].WEBSITE_HOME.toString()
        })
    }
    return identifiers
}

export const all_identifiers = get_identifiers()