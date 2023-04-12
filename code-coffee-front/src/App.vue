<template>
  <NavBar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import Login from "@/views/Login.vue"
import NavBar from "./components/NavBar.vue";

export default defineComponent({
  name: "login-page",
  components: {
    // Login,
    NavBar
},
});
</script>

<style>
nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
