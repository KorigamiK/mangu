<template>
  <div class="home">
      <h1>Change active sources</h1>
  </div>
  <br />
  <div class="grid">
      <h2 v-for="identifier in all_identifiers" 
      :key="identifier.identifier" 
      class="card" 
      :class="disabled(identifier.identifier) ? 'disabled' : ''"
      @click="toggle_source(identifier.identifier)"
      >
        {{ identifier.title }}
        <p class="small-text">{{ identifier.website_home }}</p>
      </h2>
  </div>
  <button v-if="tasks" @click="save()">Save</button>
  <h4 v-else>Reload the app for the changes to be applied.</h4>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { all_identifiers } from "../api/SourceController/Controller";
import file_system from "../api/Filesystem"

export default defineComponent({
  name: "Home",
  async created() {
    this.config = await file_system.config()
    this.fetched_disabled_sources  = true
  },
  data() {
    return {
      all_identifiers: all_identifiers,
      fetched_disabled_sources: false,
      disabled_sources: [] as string[],
      config: {manga_directory: '', disabled_sources: [] as string[]},
      tasks: false
    }
  },
  methods: {
    sleep (time: number): Promise<void> {
      return new Promise(function(resolve) { 
          setTimeout(resolve, time);
      });
    },

    disabled(identifier: string) {
      return this.config.disabled_sources.includes(identifier)
    },

    async save() {
      await file_system.update_config(JSON.parse(JSON.stringify(this.config)))
      this.tasks = false
    },

    async toggle_source(identifier: string) {
      if (this.disabled(identifier)) {
        this.config.disabled_sources = this.config.disabled_sources.filter(id => id !== identifier)
      } else {
        this.config.disabled_sources.push(identifier)
      }
      this.tasks = true
    }
  }
});
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    place-items: center;
    grid-template-rows: 100px 200px;
    
  }

  .card {
    background-color: #42b983;
    cursor: pointer;
    padding: 20px 20px 20px 20px;
    margin: 20px 10px 20px 10px;
    border-radius: 10px;
    height: 70px;
    width: 200px
  }

  .card:hover{
    box-shadow: 0 6px 12px 0 #7ac4a5;
  }

  .disabled {
    background-color: #979797;
  }

  .small-text {
    float: inline-end;
    font-size: small;
  }

  button {
    background: #5a6d60;
    border: 0;
    cursor: pointer;
    padding: 10px 20px;
    margin-top: 20px;
    color: #ffffff;
    border-radius: 20px;
}
</style>
