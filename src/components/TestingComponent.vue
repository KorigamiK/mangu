<script lang="ts">
import { defineComponent } from "vue";
import { sources, Isources } from "../api/SourceController/Controller";
import { Imanga_source } from "../api/SourceController/MangaPrimitive";

console.log("Testing component loaded");
sources as Isources;

async function test_source(src: Imanga_source) {
  console.log(src.TITLE);
  const search_results = await src.search("takagi");
  if (!search_results) {
    console.log("search failed");
    return null;
  }
  const selected_result = search_results[0];
  const chapters = await src.get_chapters(selected_result.url);
  const imgs = await src.get_images(chapters[0]);
  console.log(selected_result.title, "Is selected");
  console.log(search_results);
  console.log(`Only ${chapters.length} chapters found`);
  console.log(imgs);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tester = async (): Promise<void> => {
  const tasks = [];
  for (const source in sources) {
    tasks.push(test_source(sources[source]));
  }
  await Promise.all(tasks);
  console.log("TESTS COMPLETED!");
};

// (async () => tester())();

export default defineComponent({
  name: "Test",
  props: {
    msg: {
      default: "Module loaded",
    },
  },
  data() {
      return {
          page_button: false
      }
  }
});
</script>

<template>
  <h3>Testing {{ msg }}</h3>
  <button @click="page_button=!page_button" class="change-button">change!</button>
  <div class="container">
    <img class="inner" :class="page_button ? 'hide' : ''" style="background-color: white" src="https://raw.senmanga.com/viewer/Karakai-Jouzu-no-Takagi-san/122/1" />
    <img :class="!page_button ? 'hide' : ''" class="inner" style="background-color: white" src="https://raw.senmanga.com/viewer/Karakai-Jouzu-no-Takagi-san/122/2" />
  </div>
</template>

<style scoped>
.container {
  width: 50vw;
  height: auto;
  margin: 0 auto;
  background-color: rgb(209, 209, 209);
  /* important part */
  display: grid;
  place-items: center;
  grid-template-areas:
                  "inner-div";
}

.change-button {
    margin-top: 30vw;
    margin-right: 5vw;
    width:auto;
    height: 3vw;
    float:right;
}

.inner {
	width: 100%;
	height: auto;
  /* important part */
 justify-content: center;

  grid-area: inner-div;
}

.hide {
  display: none;
}
</style>