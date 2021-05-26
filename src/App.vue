<template>
  <img alt="Vue logo" src="./assets/logo.png">
    <button @click="dynamic_thing='Ha Ha this was tampered with!'">CLICK ME!</button>
  <HelloWorld msg="Hi Sir, Welcome to Mangu-reader" :derived_message="dynamic_thing" :secret="my_secret"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { hello } from './api/test'
import { test_func } from './TestPlayground'

test_func()
console.log(hello.thing)
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {dynamic_thing: hello.thing, my_secret: hello.secret}
  },
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
