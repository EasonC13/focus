<template lang="">
  <div>
      <button @click="getCurrent">Get Point</button>
      <button @click="hideGazerVideoContainer">hideGazerVideoContainer</button>
      <button @click="clearGazer">ClearModel</button>
      <button @click="getFaceCrop">getFaceCrop</button>
      
      <p>{{current_emotion}}</p>

      <img id='showImg' src=''>
  </div>
</template>
<script>
const axios = require('axios');
const tf = webgazer.get_tfjs()
export default {
  data (){
    return {
      current_emotion: "None",
    }
  },
  methods: {
    async createCanvasById(id){
      let video = document.getElementById(id)
      const canvas = document.createElement("canvas");
      // scale the canvas accordingly
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // draw the video at that frame
      canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas
    },
    async getfaceMesh(){
      const canvas = await this.createCanvasById("webgazerVideoFeed")
      // convert it to a usable data URL
      let b64img = canvas.toDataURL();
      // console.log(prediction)
      let prediction = await webgazer.get_facemash_model_predict()
      return prediction
    },
    async getCurrent(){      
      // console.log("getPositions", webgazer.getTracker().getPositions())
      let prediction = await webgazer.getCurrentPrediction();
      if (prediction) {
          var x = prediction.x;
          var y = prediction.y;
      }
      return x, y
      
      let vue = this
      // axios({
      //   method: "POST",
      //   url: `https://gsoc.demo.eason.tw/model/facemesh`, 
      //   headers: {
      //           "accept": "application/json",
      //           'Content-Type': 'application/json'
      //   },
      //   data: {
      //       prediction: prediction,
      //   },
      // }).then(response => {
      //   console.log(response.data)
      //   vue.current_emotion = response.data.emotion
      // })
                      
    },
    async getFaceCrop(){
      let canvas = await this.createCanvasById("webgazerVideoFeed")
      let ctx = canvas.getContext('2d')
      let img_array = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let result = this.getRgbByImageData(img_array)
      console.log(result)
      this.showCanvasByImgRGB(result, canvas.width, canvas.height)

      // 下一步：取得 Face 的邊界，然後才切成功
      let faceMesh = await this.getfaceMesh()
      console.log(faceMesh)
      // axios({
      //   method: "POST",
      //   url: `https://home3.eason.tw/image`, 
      //   headers: {
      //           "accept": "application/json",
      //           'Content-Type': 'application/json'
      //   },
      //   data: {
      //       img: result,
      //       faceMesh: faceMesh
      //   },
      // }).then(response => {
      //   console.log(response.data)
      // })
      console.log("QQ")
    },
    getRgbByImageData(ImageData){
      let outArray = []
      console.log((ImageData))
      let idx;
      for(let i = 0; i < (ImageData.height * ImageData.width); i++){
        idx = i*4
        outArray.push([ImageData.data[idx], ImageData.data[idx+1], ImageData.data[idx+2]])
      }
      return outArray
    },
    showCanvasByImgRGB(data, width, height){
      console.log(width, height, data)
      var canvas=document.createElement("canvas");
      var ctx=canvas.getContext("2d");
      // size the canvas to your desired image
      canvas.width=width;
      canvas.height=height;
      let rgba = []
      for(var i=0;i<data.length;i++){
          rgba.push(...data[i])
          rgba.push(255)
      } 
      console.log(rgba)
      ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height) ,0,0);
      // create a new img object
      var image= document.getElementById('showImg');

      // set the img.src to the canvas data url
      image.src=canvas.toDataURL();

    },
    hideGazerVideoContainer(){
      if(document.getElementById("webgazerVideoContainer").style.display == 'none'){
        this.showGazerVideoContainer()
      }else{
        document.getElementById("webgazerVideoContainer").style.display = 'none'
      }
    },
    showGazerVideoContainer(){
      document.getElementById("webgazerVideoContainer").style.display = 'block'
    },
    hideGazeDot(){
      if(document.getElementById("webgazerGazeDot").style.display == 'none'){
        this.showGazeDot()
      }else{
        document.getElementById("webgazerGazeDot").style.display = 'none'
      }
    },
    showGazeDot(){
      document.getElementById("webgazerGazeDot").style.display = 'block'
    },
    async clearGazer(){
      await webgazer.clearData()
    },
  },
  async mounted(){
    await webgazer.begin()
    // await webgazer.pause()
  },
}
</script>
<style lang="">
    
</style>