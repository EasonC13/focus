<template lang="">
  <div>
      <button @click="getCurrent">Get Point</button>
      <button @click="hideGazerVideoContainer">hideGazerVideoContainer</button>
  </div>
</template>
<script>

export default {
  methods: {
    async getCurrent(){
      console.log("getPositions", webgazer.getTracker().getPositions())
      var prediction = await webgazer.getCurrentPrediction();
      if (prediction) {
          var x = prediction.x;
          var y = prediction.y;
      }
      console.log(prediction)
                      
    },
    hideGazerVideoContainer(){
      document.getElementById("webgazerVideoContainer").style.display = 'none'
    },
    showGazerVideoContainer(){
      document.getElementById("webgazerVideoContainer").style.display = 'block'
    },
    hideGazeDot(){
      document.getElementById("webgazerGazeDot").style.display = 'none'
    },
    showGazeDot(){
      document.getElementById("webgazerGazeDot").style.display = 'block'
    },
  },
  mounted(){
    webgazer.begin()
  }
}
</script>
<style lang="">
    
</style>