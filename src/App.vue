<template>
  <img alt="Vue logo" src="./assets/logo.png">
    <button @click="dynamic_thing='Ha Ha this was tampered with!'">CLICK ME!</button>
  <HelloWorld msg="Hi origamiK Welcome to Your Vue.js + TypeScript App" :derived_message="dynamic_thing"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { hello } from './api/test'
console.log(hello.thing)
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {dynamic_thing: hello.thing}
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
  color: bisque;
  background-color: brown;
  border-radius: 15px;
}
</style>
