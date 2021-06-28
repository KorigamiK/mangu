<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <br>
    <a href="https://github.com/KorigamiK/" class="onright">KorigamiK</a>
    <p>
      For more imformation about this project<br>
      check out the
      <a href="https://github.com/KorigamiK/mangu" target="_blank" rel="noopener">GitHub repository</a>.
    </p>
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
onright {
  text-align: right;
}
</style>
