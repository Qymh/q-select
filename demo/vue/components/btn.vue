<template>
  <div class="button">
    <div class="button-value" @click="doClick">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Btn',
  methods: {
    doClick() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
.button {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 0 10px;
}
.button-value {
  background-color: deepskyblue;
  display: inline-block;
  padding: 5px;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}
</style>
