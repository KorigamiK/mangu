<template>
  <br/> <br/>
  <button v-if="!!previous_chapter" @click="$emit('load-previous-chapter', previous_chapter, component_key, source_identifier)">Previous chapter</button>
  <button v-if="!!next_chapter" @click="$emit('load-next-chapter', next_chapter, component_key, source_identifier)">Next chapter</button>
  <br/>
  <button @click="$emit('download-chapter', component_key)">Download</button>
  <p v-if="msg">{{msg}}</p>
  <MangaPages :imgs="pages" :offset="offset" />
  <!-- <h3>sources are {{ Sources }}</h3> -->
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MangaPages from "../components/MangaPages.vue";

export default defineComponent({
  name: "SourceReader",
  emits: ['load-next-chapter', 'load-previous-chapter', 'download-chapter'],
  props: {
    msg: {
      type: String,
      default: "",
    },
    pages: {
      type: Array,
      default: () => [],
      required: true,
    },
    component_key: {
      type: String,
      required: true,
    },
    offset: {
      type: Number,
      default: 0,
    },
    next_chapter: {
      type: String,
      default: '',
    },
    previous_chapter: {
      type: String,
      default: '',
    },
    source_identifier: {
      type: String,
      required: true,
    },
  },

  components: {
    MangaPages,
  },
});
</script>

<style>
</style>