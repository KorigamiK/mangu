<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h4 v-if="version">v{{ version }}</h4>
    <h2 v-else>Loading version</h2>

    <div v-if="version && latest_version">
      <button @click="check_updates(force=true)" class="button">Check for updates</button>
      <h4 v-if="version === latest_version">You are on the latest version</h4>
      <h4 v-else>
        Version {{ latest_version }} now available. Get it from the GitHub
        repository releases.
      </h4>
    </div>
    <h4 v-else>Fetching version ...</h4>

    <a href="https://github.com/KorigamiK/" class="onright">KorigamiK</a>
    <p>
      <i>Subscribe to the latest updates by <br />Clicking on the watch button
        on the GitHub repository.</i>
    </p>
    <br />
    <p>
      For more imformation about this project<br />
      check out the
      <a
        href="https://github.com/KorigamiK/mangu"
        target="_blank"
        rel="noopener"
        >GitHub repository</a
      >.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { hello } from "../api/test";
import { request_client } from "../api/RequestClient";

let x = new hello();
console.log(x.thing);
x.thing = "This was tampered with";

export default defineComponent({
  name: "HelloWorld",
  props: {
    derived_message: {
      type: String,
      required: true,
    },
    msg: {
      required: true,
      type: String,
    },
    secret: String,
  },

  setup() {
    const version: Ref<null | string> = ref(null);
    const latest_version: Ref<null | string> = ref(null);


    const check_updates = (force=false) => {
      version.value = null
      latest_version.value = null
      request_client.get_current_version().then((val) => (version.value = val));
      request_client
        .get_latest_version(force)
        .then((val) => (latest_version.value = val));
    }

    check_updates()

    return { version, latest_version, check_updates };
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
.button {
  background-color: #42b983; /* Green */
  border: none;
  color: white;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
