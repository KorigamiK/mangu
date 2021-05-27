<script lang="ts">
import { defineComponent } from 'vue';
import {sources, Isources} from '../api/SourceController/Controller'
import {Imanga_source} from '../api/SourceController/MangaPrimitive'

console.log('Testing component loaded');
sources as Isources

async function test_source(src: Imanga_source) {
    console.log(src.TITLE)
    const search_results = await src.search('kanojo')
    if (!search_results) {console.log('search failed'); return null}
    const selected_result = search_results[0]
    const chapters = await src.get_chapters(selected_result.url)
    const imgs = await src.get_images(chapters[0])
    console.log(selected_result.title, 'Is selected')
    console.log(search_results)
    console.log(`Only ${chapters.length} chapters found`)
    console.log(imgs)
}

const tester = async (): Promise<void> => {
    const tasks = []
    for (const source in sources) {
        tasks.push(test_source(sources[source]))
    }
    await Promise.all(tasks)
    console.log('TESTS COMPLETED!')
}

(async () => tester())();

export default defineComponent({
  name: 'Test',
  props: {
    msg: {
        default: 'Module loaded'
    },
  },
});
</script>

<template>
    <h3>Testing {{ msg }}</h3>
</template>
