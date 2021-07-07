<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent } from "vue";
import { sources, Isources } from "../api/SourceController/Controller";
import { Imanga_source } from "../api/SourceController/MangaPrimitive";
import { non_renderer } from "../api/SourceController/NonRenderer/Test";
// import { request_client } from '../api/RequestClient'

console.log("Testing component loaded");
sources as Isources;
// const client = new request_client();

console.log('hihihi');
// (async () => {let ret = await client.eval_js('https://otakuscan.net/chapter/125744/kanojo_okarishimasu-chap-187',
// "let x = []; for (i of document.querySelectorAll('img.canv.nor-pic:not(.loaded)')) {x.push(i.src)}; x", 3000)
// console.log(ret, 113)})()

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
  console.log(chapters)
  const imgs = await src.get_images(chapters[3].url);
  // const imgs = await src.get_images('url');
  console.log(selected_result.title, "Is selected");
  console.log(search_results);
  console.log(`Only ${chapters.length} chapters found`);
  console.log(JSON.stringify(imgs));
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

// (async () => await test_source(sources.catmanga))();

const download_test = async () => {
  const imgs = ["https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/20.jpg","https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/21.jpg","https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/22.jpg","https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/23.jpg","https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/24.jpg","https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/25.jpg","https://cdn.mangakomi.com/manga_60079e016ef1b/714f2d308a6e0c0929de7afb756ff983/26.jpg"]
  await sources.mangakomi.download(imgs, 'gin no', '1')
}

// (async () => tester())();

const renderer_test = new non_renderer();

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