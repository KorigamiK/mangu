<template>
  <p v-if="msg">{{msg}}</p>
  <MangaPages :imgs="pages" :offset="offset" />
  <!-- <h3>sources are {{ Sources }}</h3> -->
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MangaPages from "../components/MangaPages.vue";

export default defineComponent({
  name: "SourceReader",
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
    offset: {
      type: Number,
      default: 0,
    },
  },

  components: {
    MangaPages,
  },
});
</script>

<style>
</style>