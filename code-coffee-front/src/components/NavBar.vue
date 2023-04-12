<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="">
        <img src="@/assets/logo-1.png" width="112" height="28" />
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Home</router-link>
        <router-link to="/venda" class="navbar-item">Venda</router-link>
        <router-link to="/caixa" class="navbar-item">Caixa</router-link>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> Cadastro </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              <router-link to="/usuarios">Usuarios</router-link>
            </a>
            <hr class="navbar-divider" />
            <a class="navbar-item">
              <router-link to="/produtos">Produtos</router-link>
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light is-small"> Log out </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "nav-bar",
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
