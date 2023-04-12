<template>
  <div class="field">
    <label class="title is-6">{{ label }}:</label>
    <div class="control">
      <input class="input" type="date" />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "input-data",
  props: {
    label: {
      type: String,
    },
  },
};
</script>
