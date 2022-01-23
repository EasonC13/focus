<template>
  <div id="heatmapArea">
      <heatmapjs-vue
        class="heatmapjs-container"
        :max="max"
        :min="min"
        :data="data"
        :options="options"
        :move-drawable="moveDrawable"
        :click-drawable="clickDrawable"
        :draw-value="drawValue"
        @change="handleChange"></heatmapjs-vue>
  </div>
</template>
<script>
export default {
    //   el: '#app',
      data() {
          return {
            max: 100,
            min: 0,
            data: [{ x: 10, y: 15, value: 5}],
            moveDrawable: true,
            clickDrawable: true,
            drawValue: 5,
            options: {
            // backgroundColor: 'white'
            },
          }
      },
      methods: {
        handleChange: function (val) {
          this.data = val
        }
      }
}
</script>
<style>
#heatmapArea {
  background: #ffecd2;
  width: 1280px;
  height: 720px;
}
.heatmapjs-container {
  width: 1280px;
  height: 720px;
}
</style>
