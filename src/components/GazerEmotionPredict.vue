<template lang="">
  <div>
      <button @click="getCurrent">Get Point</button>
      <button @click="hideGazerVideoContainer">hideGazerVideoContainer</button>
      <button @click="clearGazer">ClearModel</button>
      <button @click="getFaceCrop">getFaceCrop</button>
      <button @click="predictEmotion">predictEmotion</button>
      
      
      <p>{{current_emotion}}</p>

      <img id='showImg' src=''>
      <img id='showFace' src=''>
  </div>
</template>
<script>
const axios = require('axios');
import * as tf from '@tensorflow/tfjs';
var nj = require('numjs');

function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

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
      console.log(prediction)
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
    },
    async getFaceCrop(){
      let canvas = await this.createCanvasById("webgazerVideoFeed")
      let ctx = canvas.getContext('2d')
      let img_data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let result = this.getRgbByImageData(img_data)
      this.showCanvasByImgRGB(result, canvas.width, canvas.height)

      // 下一步：取得 Face 的邊界，然後才切成功
      let faceMesh = await this.getfaceMesh()

      let mesh = faceMesh[0]['annotations']['silhouette']
      window.mesh = faceMesh[0]['annotations']['silhouette']

      let all_x = mesh.map(x => x[0])
      let all_y = mesh.map(x => x[1])
      let x_min = parseInt(Math.min(...all_x))
      let x_max = parseInt(Math.max(...all_x))
      let x_center = parseInt((x_max + x_min) / 2)
      let x_half = x_max - x_center
      let y_min = parseInt(Math.min(...all_y))
      let y_max = parseInt(Math.max(...all_y))
      let y_half_size = parseInt((y_max - y_min) / 2)
      
      // resshape
      let arr = [...result]
      let img_array = [];
      while(arr.length) img_array.push(arr.splice(0,640));
      

      let face_crop = img_array.slice(y_min, y_max)
      let sup = 0
      if(face_crop.length % 2 == 1) sup = 1
      face_crop = face_crop.map(x => x.slice(x_min, x_max))
      console.log({x_min, x_max, y_min, y_max})
      setTimeout((mesh = faceMesh[0]['scaledMesh']) => {
      let all_x = mesh.map(x => x[0])
      let all_y = mesh.map(x => x[1])
      let x_min = parseInt(Math.min(...all_x))
      let x_max = parseInt(Math.max(...all_x))
      let x_center = parseInt((x_max + x_min) / 2)
      let x_half = x_max - x_center
      let y_min = parseInt(Math.min(...all_y))
      let y_max = parseInt(Math.max(...all_y))
      let y_half_size = parseInt((y_max - y_min) / 2)
      
      console.log('scaledMesh', {x_min, x_max, y_min, y_max})
      }, 1);
      // face_crop = face_crop.map(x => x.slice(y_min, y_max))
      console.log('face_crop', face_crop)

      let face_crop_1d = []
      for(var i = 0; i < face_crop.length; i++) face_crop_1d = face_crop_1d.concat(face_crop[i])
      this.showCanvasByImgRGB(face_crop_1d, face_crop[0].length, face_crop.length, 'showFace')

      return face_crop
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
      console.log("QQQ")
    },
    async getModel(){
      const model = await tf.loadLayersModel('mobilenet/model.json');
      window.model = model
      return model
    },
    async predictEmotion(){
      let face_img_array = await this.getFaceCrop()
      face_img_array = this.normalize_face_img_array(face_img_array)
      let model = await this.getModel()
      face_img_array = tf.tensor(face_img_array)
      face_img_array = tf.image.resizeBilinear(face_img_array, [224,224])
      face_img_array = face_img_array.reshape([1, ...face_img_array.shape])
      window.face_img_array = face_img_array
      let result = model.predict(face_img_array)
      let idx_to_class={0: 'Anger', 1: 'Disgust', 2: 'Fear', 3: 'Happiness', 4: 'Neutral', 5: 'Sadness', 6: 'Surprise'}
      result = (await result.data())
      let argmax = result.indexOf(result.sort()[result.length-1])
      let emotion = idx_to_class[argmax]
      console.log({emotion, result})
      
    },
    normalize_face_img_array(face_img_array){
      for(let i=0;i< face_img_array.length; i++){
        for(let j = 0; j < face_img_array[0].length; j++){
          face_img_array[i][j][0] -= 103.939
          face_img_array[i][j][1] -= 116.779
          face_img_array[i][j][2] -= 123.68
        }
      }
      return face_img_array
    },
    getRgbByImageData(ImageData){
      let outArray = []
      let idx;
      for(let i = 0; i < (ImageData.height * ImageData.width); i++){
        idx = i*4
        outArray.push([ImageData.data[idx], ImageData.data[idx+1], ImageData.data[idx+2]])
      }
      return outArray
    },
    showCanvasByImgRGB(data, width, height, id='showImg'){
      console.log('showCanvasByImgRGB', {data, width, height, id})
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
      ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height) ,0,0);
      // create a new img object
      var image= document.getElementById(id);

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
    setTimeout(async () => {
      // await webgazer.pause()
    }, 1000)
    
  },
}
</script>
<style lang="">
    
</style>