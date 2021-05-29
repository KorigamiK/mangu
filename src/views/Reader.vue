<template>
  <div class="about">
    <h4>This is the reader {{ dynamic_thing }} {{ secret }}</h4>
  </div>
  <Search @load-chapter="push_new_component" />
  <div class="flex-container">
    <!-- this whole div tag repeats on every loop -->
    <div v-for="component in reader_components" :key="component.index" class="flex-child magenta">
        <button @click=remove_component(component.index)>Remove</button>
        <button @click="component.offset += 1">Offset +</button>
        <button @click="component.offset -= 1">Offset -</button>

        <SourceReader
          :pages="component.imgs"
          msg=""
          :offset="component.offset"
        />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import SourceReader from "@/components/SourceReader.vue";
import Search from "@/components/Search.vue";

interface Ireader_component {
  imgs: string[];
  offset: number;
  index: number;
}

export default defineComponent({
  name: "Home",
  components: {
    SourceReader,
    Search,
  },

  methods: {
    push_new_component(chapter_images: string[]) {
      console.log("message recieved!!");
      console.log(chapter_images);
      this.index += 1;
      this.reader_components.push({
        imgs: chapter_images,
        offset: 0,
        index: this.index,
      });
      console.log(this.reader_components.length);
    },
    remove_component(index: number) {
      this.reader_components = this.reader_components.splice(index, 1)
      console.log('remining elements are: ', this.reader_components.length)
    }
  },

  data() {
    return {
      dynamic_thing: "Superman",
      secret: "Secret: Clark Kent",
      tampered_secret: "Haha You can't see that message again.",
      reader_components: [] as Ireader_component[],
      index: 0,
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