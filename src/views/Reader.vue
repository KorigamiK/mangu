<template>
  <Search @load-chapter="push_new_component" />
  <br />
  <button class="viewer-button" @click="side_by_side = !side_by_side">
    Change Viewer
  </button>
  <div class="flex-container" v-if="side_by_side">
    <!-- this whole div tag repeats on every loop -->
    <div
      v-for="(component, component_key) in reader_components"
      :key="component.index"
      class="flex-child magenta"
    >
      <button @click="remove_component(component_key)">Remove</button>
      <button @click="component.offset += 1">Offset +</button>
      <button @click="component.offset -= 1">Offset -</button>

      <SourceReader :pages="component.imgs" :msg="component.chapter_title" :offset="component.offset" />
    </div>
  </div>
  <div v-else>
    <CoolReader
      :reader_components="reader_components"
      @change-order="change_order()"
      @offset-plus="offset_plus"
      @offset-minus="offset_minus"
      @remove-component="remove_component"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import SourceReader from "@/components/SourceReader.vue";
import Search from "@/components/Search.vue";
import CoolReader from "@/components/CoolReader.vue";

interface Ireader_component {
  imgs: string[];
  offset: number;
  index: number;
  chapter_title: string;
}

interface Ireader_conponents {
  [key: number]: Ireader_component;
}

export default defineComponent({
  name: "Home",
  components: {
    SourceReader,
    Search,
    CoolReader,
  },

  methods: {
    push_new_component(chapter_images: string[], chapter_title: string) {
      this.index += 1;
      this.reader_components[this.index] = {
        imgs: chapter_images,
        offset: 0,
        index: this.index,
        chapter_title: chapter_title,
      };
      console.log(
        "Number of elements updated to: ",
        Object.keys(this.reader_components).length
      );
    },
    remove_component(index: number) {
      delete this.reader_components[index];
      console.log(
        "remining elements are: ",
        Object.keys(this.reader_components).length
      );
    },
    change_order() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const first_manga = this.reader_components[Object.keys(this.reader_components)[0] as any];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete this.reader_components[Object.keys(this.reader_components)[0] as any];
      this.reader_components[this.counter] = first_manga;
      this.counter += 1;
    },
    offset_plus(key: number) {
      console.log(key);
      this.reader_components[key].offset += 1;
    },
    offset_minus(key: number) {
      console.log(key);
      this.reader_components[key].offset -= 1;
    },
  },

  data() {
    return {
      dynamic_thing: "Superman",
      secret: "Secret: Clark Kent",
      tampered_secret: "Haha You can't see that message again.",
      reader_components: {} as Ireader_conponents,
      index: 0,
      side_by_side: false,
      counter: 50,
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

.viewer-button {
  background: #0b6dff;
  border: 0;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: white;
  border-radius: 20px;
}

.flex-child:first-child {
  margin-right: 5px;
}

.flex-child:last-child {
  margin-left: 5px;
}
</style>