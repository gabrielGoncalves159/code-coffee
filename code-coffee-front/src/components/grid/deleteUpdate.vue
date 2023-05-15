<template>
    <div>
      <a @click="editRow">
        <i class="fa fa-edit"></i>
      </a>
      <a @click="deleteRow">
        <i class="fa fa-trash"></i>
      </a>
    </div>
</template>

<script>
export default {
  name: 'ActionIcons',
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