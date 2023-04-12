<template>
  <div class="control is-expanded">
    <label class="title is-6">{{ label }}:</label>
    <div class="control is-expanded">
      <div class="select is-link">
        <select v-model="selectedOption" :value="selectedOption" :style="{ width: '200px' }">
          <option v-for="option in options" :value="option.value" :key="option.value">
            {{ option.title }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
export default ({
    name: "select-option",
    props: {
      label: {
        type: String
      },
      options: {
        type: Array,
        required: true
      }
    },
    data() {
      return{
        selectedOption: '',
      }
    },
})
</script>
