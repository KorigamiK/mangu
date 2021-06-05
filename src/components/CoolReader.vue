<template>
  <div class="change-button">
    <button @click="$emit('change-order')">Change Order</button>
    <div>
      <button
        v-for="key in Object.keys(reader_components)"
        :key="key"
        @click="offset_plus(key)"
      >
        {{ key }} +
      </button>
    </div>
    <!-- <br /> -->
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
  <div v-if="!!reader_components" class="align-left">
    <div v-for="images in get_manga()" :key="images" class="container">
      <img
        v-for="image in images"
        :key="image"
        class="inner"
        style="background-color: white"
        :src="image"
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
}

interface Ireader_conponents {
  [key: number]: Ireader_component;
}

export default defineComponent({
  data() {
    return { z_index_iterator: 1, current_z_index: 1 };
  },

  emits: ["change-order", "offset-plus", "offset-minus"],

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
    get_z_index() {
      let ret: number = this.z_index_iterator;
      if (
        this.z_index_iterator !== Object.keys(this.reader_components).length
      ) {
        this.z_index_iterator += 1;
      } else {
        this.z_index_iterator = 1;
      }
      console.log(ret);
      return ret;
    },
    offset_plus(key: number) {
      // console.log(key, typeof key)
      // console.log(this.reader_components[key])
      this.$emit("offset-plus", key);
    },
    offset_minus(key: number) {
      // console.log(key, typeof key)
      // console.log(this.reader_components[key])
      this.$emit("offset-minus", key);
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
</style>