<template>
  <div class="modal" :class="{ 'is-active': show }" v-if="show">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Restrição</p>
        <button class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <Input :label="'Login'" :type="'text'" />
        <Input :label="'Senha'" :type="'pasward'" />
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary">Ok</button>
        <button class="button">Cancelar</button>
      </footer>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Input from "../form/Input.vue";

export default defineComponent({
  name: "modal-usuario",
  components: { Input },
  props: {
    show: {
      type: Boolean,
      requireted: true,
    }
  }
});
</script>
