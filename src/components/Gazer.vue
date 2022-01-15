<template lang="">
  <div>
      <button @click="getCurrent">Get Point</button>
      <button @click="hideGazerVideoContainer">hideGazerVideoContainer</button>
      <button @click="clearGazer">ClearModel</button>
      <p>{{current_emotion}}</p>
  </div>
</template>
<script>
const axios = require('axios');
export default {
  data (){
    return {
      current_emotion: "None",
    }
  },
  methods: {
    async getCurrent(){
      // console.log("getPositions", webgazer.getTracker().getPositions())
      let prediction = await webgazer.getCurrentPrediction();
      if (prediction) {
          var x = prediction.x;
          var y = prediction.y;
      }
      let video = document.getElementById("webgazerVideoFeed")
      const canvas = document.createElement("canvas");
      // scale the canvas accordingly
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // draw the video at that frame
      canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      // convert it to a usable data URL
      let b64img = canvas.toDataURL();
      // console.log(prediction)
      prediction = await webgazer.get_facemash_model_predict()
      let vue = this
      axios({
        method: "POST",
        url: `https://gsoc.demo.eason.tw/model/facemesh`, 
        headers: {
                "accept": "application/json",
                'Content-Type': 'application/json'
        },
        data: {
            prediction: prediction,
        },
      }).then(response => {
        console.log(response.data)
        vue.current_emotion = response.data.emotion
      })
                      
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
  async mounted(){
    await webgazer.begin()
    // await webgazer.pause()
  },
  async clearGazer(){
    await webgazer.clearData()
  }
}
</script>
<style lang="">
    
</style>