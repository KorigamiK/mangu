<template>
  <div class="change-button" v-if="Object.keys(reader_components).length !== 0">
    <div class="active-text">Currently active: {{ Object.keys(reader_components)[Object.keys(reader_components).length -1] }}</div>
    <button @click="$emit('change-order')">Change Order ']'</button>
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
  <p v-for="({ chapter_title }, component_key) in reader_components" :key="chapter_title" @click="remove_component(component_key)" class="chapters"> {{chapter_title}} ✖ </p>
  <div v-if="Object.keys(reader_components).length !== 0" class="align-left">
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
import { defineComponent, PropType } from "vue";

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
  data() {
    return {  };
  },

  mounted() {
    const emit = this.$emit
    window.addEventListener('keypress', function(event) {
        if (event.key === ']') {
            emit('change-order')
        }
    })
  },

  emits: ["change-order", "offset-plus", "offset-minus", "remove-component"],

  props: {
    reader_components: {
      type: Object as PropType<Ireader_conponents>,
      required: true,
    },
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
            this.reader_components[i].imgs,
            this.reader_components[i].offset
          )
        );
      }
      return zipLongest(undefined, ...images_array);
    },

    offset_plus(key: number) {
      this.$emit("offset-plus", key);
    },

    offset_minus(key: number) {
      this.$emit("offset-minus", key);
    },

    remove_component(component_key: number) {
      this.$emit('remove-component', component_key)
    },

  },
});
</script>

<style scoped>
.container {
  width: 50vw;
  height: auto;
  margin: 0 auto;
  background-color: rgb(209, 209, 209);
  /* important part */
  display: grid;
  place-items: center;
  grid-template-areas: "inner-div";
}

.change-button > div > button {
  width: 6vw;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  color: #777;
  cursor: pointer;
  padding: 5px 10px;
  font-weight: bold;
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
}

.change-button {
  margin-top: 30vw;
  margin-right: 5vw;
  width: auto;
  height: 3vw;
  float: right;
  position: fixed;
  top: 0.1em;
  right: 1em;
}

.align-left {
  float: left;
  margin-left: 15vw;
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

.active-text {
  background-color:rgb(214, 214, 214);
  border-radius: 8px;
  margin-bottom: 8px;
}

.chapters {
  display: inline;
  border-radius: 5px;
  background-color: bisque;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 15px;
  cursor: pointer;
}
</style>