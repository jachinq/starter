<template>
  <div class="popup">
    <form>
      <div class="form-item">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name">
      </div>
      <div class="form-item">
        <label for="url">url</label>
        <textarea type="text" id="url" v-model="url" />
      </div>
      <div class="form-item">
        <label for="description">Description</label>
        <textarea type="text" id="description" v-model="description" />
      </div>
      <div class="form-item">
        <label for="url">Tags</label>
        <textarea type="text" id="tags" v-model="tags" />
      </div>
      <div class="form-item">
        <label for="icon">Icon</label>
        <input type="text" id="icon" v-model="icon">
      </div>
      <button type="button" @click="handleClick">Save</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  data() {
    return {
      name: '',
      url: '',
      description: '',
      tags: '',
      icon: '',
    }
  },
  methods: {
    handleClick() {
      console.log('Save clicked', this.name, this.url, this.description, this.tags, this.icon);
    }
  }
}
</script>

<style scoped>

.form-item {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: var(--theme-background);
  color: var(--theme-text);
}
.popup {
  width: 200px;
  padding: 10px;
}

h1 {
  font-size: 16px;
  margin: 0;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}


</style>
