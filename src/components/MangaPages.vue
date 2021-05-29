<template>
    <div v-for="img in rotate_imgs_offset()" :key="img" class="img-container">
        <img :src="img" alt="../assets/logo.png"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MangaPages",
  props: {
    imgs: {
        type: Array,
        required: true
    },
    offset: {
      type: Number,
      required: true
    }
  },
  methods: {
      rotate_imgs_offset() {
        return this.imgs.slice(this.offset, this.imgs.length).concat(this.imgs.slice(0, this.offset));
      }
  }
});
</script>
 <style scoped>
.img-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  object-fit: fill;
  cursor: pointer;
  overflow: hidden; 
}
img {
    max-width: 100%;
    max-height: 100%;
}
</style>