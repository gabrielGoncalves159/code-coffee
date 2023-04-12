<template>
  <div class="modal" :class="{ 'is-active': showModal }" v-if="showModal">
    <div class="modal-background"></div>
    <form>
      <div class="modal-card">
        <header class="modal-card-head">
          <slot name="header" />
        </header>
        <section class="modal-card-body">
            <slot name="body" />
        </section>
        <footer class="modal-card-foot">
          <slot name="footer" />
        </footer>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "modal-padrao",
  props: {
    showModal: {
      type: Boolean,
      required: true
    }
  }
});
</script>
