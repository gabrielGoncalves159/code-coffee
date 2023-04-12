<template>
  <div class="container">
    <div class="field">
      <label class="title is-6">{{ label }}:</label>
      <div class="control">
        <input class="input" type="{{ type }}" style="width={{ width }}" :value="inputValue" @input="updateInputValue" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputValue",
  props: {
    label: {
      type: String,
    },
    type: {
      type: String,
    },
    width: {
      type: String,
    },
    value: {
      type: String,
      default: ''
    }
  },
};
</script>
