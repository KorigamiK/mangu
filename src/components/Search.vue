<template>
  <div v-if="!show_form"><button @click="show_form = true; show_results = true; show_chapters=false">Add source</button></div>
  <div v-if="show_chapters"><button @click="show_chapters=false">Hide Chapters</button></div>
  <div v-if="chapters !== [{}] && !show_chapters"><button @click="show_chapters=true">Show Chapters</button></div>

  <form @submit.prevent="handel_search" v-if="show_form">
    <h3>Search</h3>
    <label>Series Name</label>
    <input type="search_query" v-model="search_query" required />

    <label>Role:</label>
    <select class="form-control" name="template" v-model="selected_source" required>
      <option value="ALL_SOURCES">All Sources</option>
      <option
        v-for="source in sources"
        v-bind:value="source.IDENTIFIER"
        :key="source.IDENTIFIER"
      >
        {{ source.TITLE }}
      </option>
    </select>
    <div class="submit">
      <button :class="[!selected_source && !search_query ? 'inactive' : 'active']">
        Go
      </button>
    </div>
  </form>

  <p class="pill">query: {{ search_query }}</p>
  <p class="pill">source: {{ selected_source }}</p>
  <div class="results" v-if="show_results">
    Here are the results
    <div v-if="selected_source == 'ALL_SOURCES'" class="results-flex-container">
      <div class="results-flex-child" v-for="results in all_results" :key="results">
        <p>{{results.source_title}}</p>
        <p class="pill" 
        v-for="result in results.result" 
        :key="result" 
        @click="selected_source = results.identifier; select_result(result, results.identifier)"
        >
        {{ result.title }}
        </p>
      </div>
    </div>

    <div
      class="results-container"
      v-for="result in search_results"
      :key="result.title"
      v-else
    >
      <p class="pill" @click="select_result(result, selected_source)">{{ result.title }}</p>
      <br />
    </div>
  </div>
  <div class="chapters" v-show="show_chapters">
    <div class="chapters-contain" v-for="chapter in chapters" :key="chapter.title">
      <p class="pill" @click="select_chapter(chapter, selected_source)">{{ chapter.title }}</p>
    </div>
  </div>

</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { Isources } from "../api/SourceController/Controller";
import { search_result, Isearch_results, Ichapter } from "../api/SourceController/MangaPrimitive";

interface Iall_results {
  source_title: string,
  result: Isearch_results | null,
  identifier: string
}

export default defineComponent({
  name: "Search",
  emits: ['load-chapter'],
  props: {
    sources: {
      type: Object as PropType<Isources>,
      required: true
    }
  },
  data() {
    return {
      search_query: "",
      selected_source: "",
      show_results: false,
      show_form: true,
      search_results: [] as Isearch_results,
      show_chapters: false,
      chapters: [{}] as Ichapter[],
      all_results: [{}] as Iall_results[]
    };
  },

  methods: {
    async handel_search() {
      console.log(this.search_query, this.selected_source);
      if (this.selected_source !== 'ALL_SOURCES') {
        let results: Isearch_results | null
        try{
          results = await this.sources[this.selected_source].search(this.search_query);
        }catch(e){
          console.log(e)
          console.log('something went wrong while getting results')
          results = null
        }
        this.search_results = results ? results : [{ title: "", url: "" }];
      }else {
        this.all_results = await this.search_all_sources()
      }
      this.show_results = true;
      this.show_form = false;
    },

    async select_result(result: search_result, source_identifier: string) {
      console.log(source_identifier);
      this.chapters = await this.sources[source_identifier].get_chapters(result.url)
      this.show_results = false;
      this.show_chapters = true
    },

    async select_chapter(chapter: Ichapter, source_identifier: string) {
      const chapter_images = await this.sources[source_identifier].get_images(chapter.url)
      this.$emit('load-chapter', chapter_images, source_identifier + ' - ' + chapter.title, source_identifier)
      this.show_chapters = false
    },

    async search_all_sources(): Promise<Iall_results[]> {
      const tasks = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let results: any[] = []
      try {
        for(const source in this.sources) {
          tasks.push(this.sources[source].search(this.search_query))
        }
        results = await Promise.all(tasks)
      }catch(e){
        console.log(e)
        console.log('something went wrong while getting results')
      }

      const ret = []
      let x = 0
      for (const i in this.sources) {
        if (!(!results[x] || !results[x].length)) {
          ret.push({
            source_title: this.sources[i].TITLE,
            identifier: this.sources[i].IDENTIFIER,
            result: results[x] ? results[x] : null
          })
      }
        x++
      }
      console.log(ret)
      return ret 
    }
  },
});
</script>

<style scoped>
.results-flex-container {
  display: flex;
}

.results-flex-child {
  flex: 1;
  border: 2px solid rgb(53, 53, 53);
}

form {
  max-width: 420px;
  margin: 30px auto;
  background: #5a6d60;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
  color: #ffffff;
}
label {
  color: #ffffff;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input,
select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
input[type="checkbox"] {
  display: inline-block;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}
.pill {
  display: inline-block;
  margin: 10px 10px 12px 21px;
  padding: 6px 12px;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  color: #777;
  cursor: pointer;
}
button {
  background: #5a6d60;
  border: 0;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
  color: #ffffff;
  border-radius: 20px;
}
.submit {
  text-align: center;
}
.inactive {
  background: #aaa;
}
.active {
  background: rgb(75, 138, 117);
}
</style>