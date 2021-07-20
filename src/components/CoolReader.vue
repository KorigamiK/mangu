<template>
  <button v-show="Object.keys(reader_components).length !== 0" class="control-button" @click="show_controls = !show_controls" data-tooltip="Press ` key (above Tab)">Toggle Controls</button>
  <br />
  <div class="change-button" v-if="Object.keys(reader_components).length !== 0 && show_controls">
    <div class="active-text">Currently active: {{ Object.keys(reader_components)[Object.keys(reader_components).length -1] }}</div>
    <div @click="$emit('download-chapter', get_active_component_key())" class="active-text clickable">Download</div>
    <div>
      <button 
      v-if="reader_components[get_active_component_key()].imgs.previous_chapter"
      @click="$emit('load-previous-chapter', reader_components[get_active_component_key()].imgs.previous_chapter, get_active_component_key(), reader_components[get_active_component_key()].source_identifier)"
      >Previous</button>
      &nbsp;
      <button 
      v-if="reader_components[get_active_component_key()].imgs.next_chapter"
      @click="$emit('load-next-chapter', reader_components[get_active_component_key()].imgs.next_chapter, get_active_component_key(), reader_components[get_active_component_key()].source_identifier)"
      >Next</button>

    </div>

    <button @click="$emit('change-order')" data-tooltip="Press ] key">Change Order</button>
    <div>
      <button
        v-for="key in Object.keys(reader_components)"
        :key="key"
        @click="offset_plus(key)"
      >
        {{ key }} +
      </button>
    </div>
    <div>
      <button
        v-for="key in Object.keys(reader_components)"
        :key="key"
        @click="offset_minus(key)"
      >
        {{ key }} -
      </button>
    </div>
  </div>
  <div class="active-components">
    <p v-for="({ chapter_title }, component_key) in reader_components" :key="chapter_title" @click="remove_component(component_key)" class="chapters become-red"> {{chapter_title}} ✖ </p>
  </div>
  <div v-if="Object.keys(reader_components).length !== 0" class="align-centre image-container">
    <div v-for="images in get_manga()" :key="images" class="container">
      <img
        v-for="image in images"
        :key="image"
        class="inner"
        style="background-color: white"
        :src="image"
        alt="Loading image"
      />
      &nbsp;
    </div>
  </div>
</template>

<script lang="ts">
import { Iimages } from "@/api/SourceController/MangaPrimitive";
import { defineComponent, PropType } from "vue";

interface Ireader_component {
  imgs: Iimages;
  offset: number;
  index: number;
  chapter_title: string;
  source_identifier: string;
  manga_name: string
}

interface Ireader_conponents {
  [key: string]: Ireader_component;
}

export default defineComponent({
  data() {
    return { show_controls: true, };
  },

  created() {
    window.addEventListener('keypress', this.toggle_controls_event_lstener)
  },

  emits: ["change-order", "offset-plus", "offset-minus", "remove-component", 'load-next-chapter', 'load-previous-chapter', 'download-chapter'],

  props: {
    reader_components: {
      type: Object as PropType<Ireader_conponents>,
      required: true,
    },
    change_order_keyboard_listener: {
      type: Function as PropType<(event: KeyboardEvent) => void>,
      required: true
    },
    next_chapter: {
      type: String,
      default: '',
    },
    previous_chapter: {
      type: String,
      default: '',
    }
  },

  methods: {
    get_manga() {
      const get_imgs_with_offset = (imgs: string[], offset: number) => {
        return imgs.slice(offset, imgs.length).concat(imgs.slice(0, offset));
      };

      const zipLongest = (
        placeholder = undefined,
        ...arrays: Array<Array<string>>
      ) => {
        const length = Math.max(
          ...arrays.map((arr: Array<string>) => arr.length)
        );
        return Array.from({ length }, (value, index) =>
          arrays.map((array: Array<string>) =>
            array.length - 1 >= index ? array[index] : placeholder
          )
        );
      };

      const images_array: Array<Array<string>> = [];
      for (let i in this.reader_components) {
        images_array.push(
          get_imgs_with_offset(
            this.reader_components[i].imgs.images,
            this.reader_components[i].offset
          )
        );
      }
      return zipLongest(undefined, ...images_array);
    },

    offset_plus(key: string) {
      this.$emit("offset-plus", key);
    },

    offset_minus(key: string) {
      this.$emit("offset-minus", key);
    },

    remove_component(component_key: string) {
      this.$emit('remove-component', component_key)
      if (Object.keys(this.reader_components).length === 0) {
        window.removeEventListener('keypress', this.change_order_keyboard_listener)
        console.log('listener removed')
      }
    },
    get_active_component_key(): string {
      return Object.keys(this.reader_components)[Object.keys(this.reader_components).length -1]
    },

    toggle_controls_event_lstener(event: KeyboardEvent): void {
      if (event.key === '`') this.show_controls = !this.show_controls
    },
  },
});
</script>

<style scoped>
.active-components {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.become-red:hover {
  color: rgb(167, 29, 29);
}

*[data-tooltip] {
    position: relative;
}

*[data-tooltip]::after {
    content: attr(data-tooltip);

    position: absolute;
    top: -30px;
    right: 0px;
    width: auto;

    pointer-events: none;
    opacity: 0;
    -webkit-transition: opacity .15s ease-in-out;
    -moz-transition: opacity .15s ease-in-out;
    -ms-transition: opacity .15s ease-in-out;
    -o-transition: opacity .15s ease-in-out;
    transition: opacity .15s ease-in-out;

    display: block;
    font-size: 12px;
    line-height: 16px;
    background: #b3b28d;
    padding: 2px 2px;
    border: 1px solid #c0c0c0;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
}

*[data-tooltip]:hover::after {
    opacity: 1;
}

.clickable {
  cursor: pointer;
}

.container {
  width: 40em;
  height: auto;
  margin: 0 auto;
  background-color: rgb(209, 209, 209);
  /* important part */
  display: grid;
  place-items: center;
  grid-template-areas: "inner-div";
}

.change-button > div > button {
  width: 5.5vw;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  color: #777;
  cursor: pointer;
  padding: 5px 10px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 5px;
  border: none;
}


.change-button > button {
  width: 12vw;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  color: #777;
  cursor: pointer;
  padding: 5px 10px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 5px;
  border: none;
}

.active-text {
  background-color:#eee;
  border-radius: 13px;
  margin-bottom: 8px;
  color: #777;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  padding: 6px 6px 6px 6px
}

.control-button {
  background: #5a6d60;
  border: 0;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #ffffff;
  border-radius: 20px;
}

.change-button {
  margin-top: 22vw;
  margin-right: 5vw;
  width: auto;
  height: 3vw;
  float: right;
  position: fixed;
  top: 0.1em;
  right: 1em;
}

.align-centre {
  /* float: left; */
  /* margin-left: 15vw; */
  justify-content: center;
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

.chapters {
  display: inline;
  border-radius: 5px;
  background-color: bisque;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
  color: #4e4e4e
}

.image-container {
  margin-top: 20px;
}
</style>