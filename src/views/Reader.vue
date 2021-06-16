<template>
  <Search @load-chapter="push_new_component" :sources="sources"/>
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

      <SourceReader 
      :component_key="component_key"
      :source_identifier="component.source_identifier"
      :pages="component.imgs.images" 
      :msg="component.chapter_title" 
      :offset="component.offset" 
      :previous_chapter="component.imgs.previous_chapter" 
      :next_chapter="component.imgs.next_chapter"
      @load-next-chapter="load_next_prev_chapter"
      @load-previous-chapter="load_next_prev_chapter"
      />

    </div>
  </div>
  <div v-else>
    <CoolReader
      :reader_components="reader_components"
      :change_order_keyboard_listener="change_order_keyboard_listener"
      @change-order="change_order()"
      @offset-plus="offset_plus"
      @offset-minus="offset_minus"
      @remove-component="remove_component"
      @load-next-chapter="load_next_prev_chapter"
      @load-previous-chapter="load_next_prev_chapter"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import SourceReader from "@/components/SourceReader.vue";
import Search from "@/components/Search.vue";
import CoolReader from "@/components/CoolReader.vue";
import { Iimages } from "@/api/SourceController/MangaPrimitive";
import { sources } from "../api/SourceController/Controller";

interface Ireader_component {
  imgs: Iimages;
  offset: number;
  index: number;
  chapter_title: string;
  source_identifier: string
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

  mounted() {
    this.change_order_keyboard_listener = this.change_order_listener_wraper(this)    
  },

  methods: {
    // hack to bypass the fact that 'this' is already used by the browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    change_order_listener_wraper(self: any) {
      return function(event: KeyboardEvent) {
        if (event.key === ']') {
            self.change_order()
        }
      }
    },

    push_new_component(chapter_images: Iimages, chapter_title: string, source_identifier: string) {
      this.index += 1;
      this.reader_components[this.index] = {
        imgs: chapter_images,
        offset: 0,
        index: this.index,
        chapter_title: chapter_title,
        source_identifier: source_identifier
      };
      console.log(
        "Number of elements updated to: ",
        Object.keys(this.reader_components).length
      );
      if (Object.keys(this.reader_components).length === 1) {
        console.log('added listener')
        window.addEventListener('keypress', this.change_order_keyboard_listener)
      }
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
      this.reader_components[key].offset += 1;
    },
    offset_minus(key: number) {
      this.reader_components[key].offset -= 1;
    },
    async load_next_prev_chapter(link: string, component_key: number, source_identifier: string) {
      const imgs = await this.sources[source_identifier].get_images(link)
      this.reader_components[component_key].imgs = imgs
      if (imgs.title) {
        this.reader_components[component_key].chapter_title = imgs.title
      } else {
        console.log('Cannot update chapter title')
      }
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      change_order_keyboard_listener: function(e: KeyboardEvent) {return},
      sources: sources
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
  background: #5a6d60;
  border: 0;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #ffffff;
  border-radius: 20px;
}

.flex-child:first-child {
  margin-right: 5px;
}

.flex-child:last-child {
  margin-left: 5px;
}
</style>