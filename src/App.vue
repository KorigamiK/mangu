<template>
  <Test />
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/reader">Reader</router-link>
  </div>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Test from "./components/TestingComponent.vue";
import { hello } from "./api/test";
// test_func()
console.log(hello.thing);
export default defineComponent({
  name: "App",
  components: {
    Test,
  },
  data() {
    return { dynamic_thing: hello.thing, my_secret: hello.secret };
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
