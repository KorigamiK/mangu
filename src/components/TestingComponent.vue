<script lang="ts">
import { defineComponent } from "vue";
import { sources, Isources } from "../api/SourceController/Controller";
import { Imanga_source } from "../api/SourceController/MangaPrimitive";
import { non_renderer } from "../api/SourceController/NonRenderer/Test";

console.log("Testing component loaded");
sources as Isources;

async function test_source(src: Imanga_source) {
  console.log(src.TITLE);
  const search_results = await src.search("kanojo");
  if (!search_results) {
    console.log("search failed");
    return null;
  }
  console.log(search_results, search_results.length)
  const selected_result = search_results[0];
  const chapters = await src.get_chapters(selected_result.url);
  const imgs = await src.get_images(chapters[0].url);
  console.log(imgs)
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
  console.log("TESTS COMPLETED SUCCESSFULLY!");
};

// (async () => await test_source(sources.manga1001))();

// (async () => tester())();

const renderer_test = new non_renderer()

export default defineComponent({
  name: "Test",
  created() {
    this.get_img()
  },
  props: {
    msg: {
      default: "Module loaded",
    },
  },
  methods: {
    async get_img(){
      this.img_url = await renderer_test.test_method()
      }
  },
  data() {
      return {
        page_button: false,
        img_url: ''
      }
  }
});
</script>

<template>
  <h3>Testing {{ msg }}</h3>
  <button @click="page_button=!page_button" class="change-button">change!</button>
  <div class="container">
    <img class="inner" :class="page_button ? 'hide' : ''" style="background-color: white" :src="img_url" />
    <img :class="!page_button ? 'hide' : ''" class="inner" style="background-color: white" src="https://i1.wp.com/kumacdn.club/wp-content/uploads/K/Kanojo, Okarishimasu/Chapter 188/002.jpg" />
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