<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <br>
    <h1>This is very secret message {{ secret }}</h1>
    <h1> This is the message that you passed {{ derived_message }} </h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Google Test</h3>
    <ul>
      <li><a href="https://mail.google.com" target="_blank" rel="noopener">babel</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { hello } from '../api/test';
let x = new hello()
console.log(x.thing)
x.thing = "This was tampered with"
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
    derived_message: {
      type: String,
      required: false,
      default: x.thing
    },
    secret: String
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
