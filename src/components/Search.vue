<template>
  <div v-if="!show_form">
    <button
      @click="
        show_form = true;
        show_results = true;
        show_chapters = false;
      "
    >
      Add source
    </button>
  </div>
  <div v-if="show_chapters">
    <button @click="show_chapters = false">Hide Chapters</button>
  </div>
  <div v-if="chapters.length && !show_chapters">
    <button @click="show_chapters = true">Show Chapters</button>
  </div>

  <form @submit.prevent="handel_search" v-if="show_form">
    <h3>Search</h3>
    <label>Series Name:</label>
    <input type="search_query" v-model="search_query" required />

    <label>Source:</label>
    <select
      class="form-control"
      name="template"
      v-model="selected_source"
      required
    >
      <option value="ALL_SOURCES">All Sources</option>
      <option
        v-for="source in sources"
        :value="source.IDENTIFIER"
        :key="source.IDENTIFIER"
      >
        {{ source.TITLE }}
      </option>
    </select>
    <div class="submit">
      <button
        :class="[!selected_source && !search_query ? 'inactive' : 'active']"
      >
        Go
      </button>
    </div>
  </form>

  <p class="pill">query: {{ search_query }}</p>
  <p class="pill">source: {{ selected_source }}</p>
  <div class="results" v-if="show_results">
    Here are the results
    <div v-if="selected_source == 'ALL_SOURCES'" class="results-flex-container">
      <div
        class="results-flex-child"
        v-for="results in all_results"
        :key="results"
      >
        <p>{{ results.source_title }}</p>
        <p
          class="pill result-element all-sources-result"
          v-for="result in results.result"
          :key="result"
          @click="
            selected_source = results.identifier;
            select_result(result, results.identifier);
          "
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
      <p class="pill result-element single-result" @click="select_result(result, selected_source)">
        {{ result.title }}
      </p>
      <br />
    </div>
  </div>
  <div class="chapters" v-show="show_chapters">
    <button v-if="to_download.length" @click="download_selected()">
      Download Selected
    </button>
    <button
      v-if="chapters.length === to_download.length"
      @click="to_download = []"
    >
      Deselect All
    </button>
    <button v-else @click="to_download = chapters">Select All</button>
    <div
      class="chapters-contain"
      v-for="chapter in chapters"
      :key="chapter.title"
    >
      <input
        type="checkbox"
        :id="chapter.title"
        :value="chapter"
        v-model="to_download"
      />
      <p class="pill" @click="select_chapter(chapter, selected_source)">
        {{ chapter.title }}
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { Isources } from "../api/SourceController/Controller";
import {
  search_result,
  Isearch_results,
  Ichapter,
} from "../api/SourceController/MangaPrimitive";

interface Iall_results {
  source_title: string;
  result: Isearch_results | null;
  identifier: string;
}

export default defineComponent({
  name: "Search",
  emits: ["load-chapter", "download-selection"],
  props: {
    sources: {
      type: Object as PropType<Isources>,
      required: true,
    },
  },
  data() {
    return {
      search_query: "",
      selected_source: "",
      show_results: false,
      show_form: true,
      search_results: [] as Isearch_results,
      show_chapters: false,
      chapters: [] as Ichapter[],
      all_results: [{}] as Iall_results[],
      manga_name: "",
      to_download: [],
    };
  },

  methods: {
    async handel_search() {
      console.log(this.search_query, this.selected_source);
      if (this.selected_source !== "ALL_SOURCES") {
        let results: Isearch_results | null;
        try {
          results = await this.sources[this.selected_source].search(this.search_query);
        } catch (e) {
          console.log(e);
          console.log("something went wrong while getting results");
          results = null;
        }
        this.search_results = results ? results : [{ title: "", url: "" }];
      } else {
        this.all_results = await this.search_all_sources();
      }
      this.to_download = [];
      this.show_results = true;
      this.show_form = false;
    },

    async select_result(result: search_result, source_identifier: string) {
      console.log(source_identifier);
      this.manga_name = result.title;
      this.chapters = await this.sources[source_identifier].get_chapters(result.url);
      this.show_results = false;
      this.show_chapters = true;
    },

    async select_chapter(chapter: Ichapter, source_identifier: string) {
      const chapter_images = await this.sources[source_identifier].get_images(
        chapter.url
      );
      this.$emit(
        "load-chapter",
        chapter_images,
        source_identifier + " - " + chapter.title,
        source_identifier,
        this.manga_name
      );
      this.show_chapters = false;
    },

    async search_all_sources(): Promise<Iall_results[]> {
      const tasks = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let results: any[] = [];
      try {
        for (const source in this.sources)
          tasks.push(this.sources[source].search(this.search_query));
        results = await Promise.all(tasks);
      } catch (e) {
        console.log(e);
        console.log("something went wrong while getting results");
      }

      const ret = [];
      let x = 0;
      for (const i in this.sources) {
        if (!(!results[x] || !results[x].length)) {
          ret.push({
            source_title: this.sources[i].TITLE,
            identifier: this.sources[i].IDENTIFIER,
            result: results[x] ? results[x] : null,
          });
        }
        x++;
      }
      console.log(ret);
      return ret;
    },
    download_selected() {
      const callback = () => (this.to_download = []);
      this.$emit(
        "download-selection",
        this.selected_source,
        this.manga_name,
        this.to_download,
        callback
      );
    },
  },
});
</script>

<style scoped>
.results-flex-container {
  display: flex;

}

.results-flex-child {
  flex: 1;
  justify-content: center;
  border: 2px solid rgb(53, 53, 53);
}

.all-sources-result {
  max-width: 30rem;
  width: 60%;
}

.chapters-contain{
  display: grid;
  padding: 0 32vw 0 32vw;
  gap: 1rem;
  grid-template-columns: 60px auto;
}

 .chapters-contain > p{
    background: #dbdbdb;
    -webkit-transition: .05s all;   
    -webkit-transition-delay: 05s; 
    -moz-transition: .05s all;   
    -moz-transition-delay: 05s; 
    -ms-transition: .05s all;   
    -ms-transition-delay: 05s; 
    -o-transition: .05s all;   
    -o-transition-delay: 05s;
    transition: .05s all;   
    transition-delay: 0.1s; 
}

.result-element:hover, .chapters-contain > p:hover{
    background:#ffe3e3;
    -webkit-transition-delay: 0s;
    -moz-transition-delay: 0s;
    -ms-transition-delay: 0s;
    -o-transition-delay: 0s;
    transition-delay: 0s;
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
  transform: translate(0, 12px);
  margin: 0 30px 0 0;
  padding: 10px 0 0 0;
  position: relative;
  cursor: pointer;
  width: 0px;
  height: 0px;
}

input[type="checkbox"]:checked:before {
  content: "";
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  border: 4px solid #ffcb9a;
  border-radius: 15px;
  background-color: #445768;
  transition: all 0.2s linear;
}

input[type="checkbox"]:before {
  content: "";
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  border: 4px solid #ffcb9a;
  border-radius: 3px;
  background-color: #445768;
}

input[type="checkbox"]:after {
  content: "";
  display: block;
  width: 0px;
  height: 0px;
  border: solid #ffcb9a;
  border-width: 0 0px 0px 0;
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
  position: absolute;
  top: 0px;
  left: 30px;
  transition: all 0.2s linear;
}

input[type="checkbox"]:checked:after {
  content: "";
  display: block;
  width: 2px;
  height: 10px;
  border: solid #ffcb9a;
  border-width: 0 5px 5px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  position: absolute;
  top: 2px;
  left: 10px;
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