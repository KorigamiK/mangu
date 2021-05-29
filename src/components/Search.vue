<template>
  <h3>Search</h3>
  <form>
    <label>Series Name</label>
    <input type="search_query" v-model="search_query" required />

    <label>Role:</label>
    <select class="form-control" name="template" v-model="selected_source">
      <option
        v-for="source in sources"
        v-bind:value="source.IDENTIFIER"
        :key="source.IDENTIFIER"
      >
        <pill> {{ source.TITLE }}</pill>
      </option>
    </select>
  </form>

  <p>query: {{ search_query }}</p>
  <p>source: {{ selected_source }}</p>

</template>

<script lang='ts'>
import { defineComponent } from "vue";
import { sources } from "../api/SourceController/Controller";

export default defineComponent({
  name: "Search",
  data() {
    return {
      search_query: "",
      selected_source: "",
      sources: sources,
    };
  },
});
</script>

<style scoped>
form {
  max-width: 420px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input,
select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
input[type="checkbox"] {
  display: inline-block;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}
.pill {
  display: inline-block;
  margin: 20px 10px 0 0;
  padding: 6px 12px;
  background: #eee;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: bold;
  color: #777;
  cursor: pointer;
}
</style>