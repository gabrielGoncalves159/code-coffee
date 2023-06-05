<template>
    <div>
      <span>
        <button @click="editRow">
          E
        </button>
      </span>
      <span>
        <button @click="deleteRow">D</button>
      </span>
    </div>
</template>

<script>
export default {
  name: 'deleteUpdate',
  methods: {
    editRow() {
      this.$emit('edit-row')
    },
    deleteRow() {
      this.$emit('delete-row')
    }
  }
}
</script>

<style scoped>
.action-icons {
  display: flex;
  justify-content: space-between;
}
</style>