<template>
  <div class="about">
    <h4>This is an about page {{ dynamic_thing }} {{ secret }}</h4>
  </div>
  <Search/>
  <div class="flex-container">
  <div class="flex-child magenta">
      <SourceReader :pages="eng"/>
  </div>
  <div class="flex-child magenta">
      <SourceReader :pages="raw" :offset="1"/>
  </div>    
</div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import SourceReader from "@/components/SourceReader.vue"
// import { sources } from "../api/SourceController/Controller";
import Search from "@/components/Search.vue"

const eg_pages = [
  // "https://rawmanga.top/viewer/Karakai-Jouzu-no-Takagi-san/142/1",
  // "https://rawmanga.top/viewer/Karakai-Jouzu-no-Takagi-san/142/2",
  "https://rawmanga.top/viewer/Karakai-Jouzu-no-Takagi-san/142/3",
];

const eg_pages_raw = [
  // "https://cdn.mangakomi.com/manga_5e9d26b4ca744/486d69e3b6a928f6207d57e5df5fbd55/1.jpg",
  "https://cdn.mangakomi.com/manga_5e9d26b4ca744/486d69e3b6a928f6207d57e5df5fbd55/2.jpg",
  "https://cdn.mangakomi.com/manga_5e9d26b4ca744/486d69e3b6a928f6207d57e5df5fbd55/3.jpg",
];

export default defineComponent({
  name: "Home",
  components: {
    SourceReader,
    Search
  },
  data() {
    return {
      dynamic_thing: "Superman",
      secret: "Secret: Clark Kent",
      tampered_secret: "Haha You can't see that message again.",
      eng: eg_pages,
      raw: eg_pages_raw
    };
  },
});
</script>

<style scoped>
.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
    border: 2px solid rgb(53, 53, 53);
}  

.flex-child:first-child {
    margin-right: 5px;
}

.flex-child:last-child {
    margin-left: 5px;
} 
</style>