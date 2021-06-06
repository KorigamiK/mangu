<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br/>
    <HelloWorld
      msg="Welcome to Mangu-reader"
      :derived_message="dynamic_thing"
      :secret="tampered_secret"
    />
    <button @click="dynamic_thing = 'Ha Ha this was tampered with!'">
      Useless Button
    </button>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
  data(){
    return {dynamic_thing: "Superman", secret: "Secret: Clark Kent", tampered_secret: "Haha You can't see that message again."}
  },
});
</script>
