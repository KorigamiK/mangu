<template>
  <div v-if="!show_form"><button @click="show_form = true; show_chapters=false">Add source</button></div>
  <div v-if="show_chapters"><button @click="show_chapters=false">Hide Chapters</button></div>
  <div v-if="chapters !== ['nothing'] && !show_chapters"><button @click="show_chapters=true">Show Chapters</button></div>

  <form @submit.prevent="handel_search" v-if="show_form">
    <h3>Pick</h3>
    <label>Series Name</label>
    <input type="search_query" v-model="search_query" required />

    <label>Role:</label>
    <select class="form-control" name="template" v-model="selected_source" required>
      <option
        v-for="source in sources"
        v-bind:value="source.IDENTIFIER"
        :key="source.IDENTIFIER"
      >
        {{ source.TITLE }}
      </option>
    </select>
    <div class="submit">
      <button :class="[!selected_source && !search_query ? 'inactive' : '']">
        Search
      </button>
    </div>
  </form>

  <p class="pill">query: {{ search_query }}</p>
  <p class="pill">source: {{ selected_source }}</p>
  <div class="results" v-if="show_results">
    Here are the results
    <div
      class="results-container"
      v-for="result in search_results"
      :key="result.title"
    >
      <p class="pill" @click="select_result(result, selected_source)">{{ result.title }}</p>
      <br />
    </div>
  </div>
  <div class="chapters" v-if="show_chapters">
    <div class="chapters-contain" v-for="chapter in chapters" :key="chapter">
      <p class="pill" @click="select_chapter(chapter, selected_source)">{{ chapter }}</p>
    </div>
  </div>

</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { sources } from "../api/SourceController/Controller";
import { search_result, Isearch_results } from "../api/SourceController/MangaPrimitive";

export default defineComponent({
  name: "Search",
  emits: ['load-chapter'],
  data() {
    return {
      search_query: "",
      selected_source: "",
      sources: sources,
      show_results: false,
      show_form: true,
      search_results: [{}] as Isearch_results,
      show_chapters: false,
      chapters: ['nothing']
    };
  },
  methods: {
    async handel_search() {
      console.log(this.search_query, this.selected_source);
      const results = await sources[this.selected_source].search(
        this.search_query
      );
      this.search_results = results ? results : [{ title: "", url: "" }];
      console.log(
        await sources[this.selected_source].search(this.search_query)
      );
      this.show_results = true;
      this.show_form = false;
    },

    async select_result(result: search_result, source_identifier: string) {
      console.log(result, source_identifier);
      this.chapters = await sources[source_identifier].get_chapters(result.url)
      this.show_results = false;
      this.show_chapters = true
    },

    async select_chapter(chapter: string, source_identifier: string) {
      const chapter_images = await sources[source_identifier].get_images(chapter)
      this.$emit('load-chapter', chapter_images)
      this.show_chapters = false
    }
  },
});
</script>

<style scoped>
form {
  max-width: 420px;
  margin: 30px auto;
  background: rgb(255, 231, 231);
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
label {
  color: #aaa;
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
  background: #0b6dff;
  border: 0;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
  color: white;
  border-radius: 20px;
}
.submit {
  text-align: center;
}
.inactive {
  background: #aaa;
}
</style>