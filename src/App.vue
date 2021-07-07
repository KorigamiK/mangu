<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/reader">Reader</router-link> | 
    <router-link to="/sources">Sources</router-link>
  </div>
  <!-- <Test /> -->
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import Test from "./components/TestingComponent.vue";
import { hello } from "./api/test";
console.log(hello.thing);
export default defineComponent({
  name: "App",
  components: {
    // Test,
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
  color: #e2e2e2;
}

body {
  background-color: rgb(48, 48, 48);
  color: #e6e6e6
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #e6e6e6;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.dark-background {
  background-color: aliceblue;
}

.dark-mode {
  color: #e6e6e6
}

</style>
