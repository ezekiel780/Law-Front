<template>
  <div class="loading"></div>
</template>

<script>
export default {}
</script>

<style>
.loading {
  display: inline-block;
  height: 25px;
  width: 25px;
  border: 3px solid #fff;
  border-radius: 50%;
  border-top-color: #08085e;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
