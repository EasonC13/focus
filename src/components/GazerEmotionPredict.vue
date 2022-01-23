<template lang="">
   <div class='mt-5'>
      <!--<button @click="getCurrent">Get Point</button>
      <button @click="pauseWebgazer">pauseWebgazer</button>
      <button @click="hideGazerVideoContainer">hideGazerVideoContainer</button>
      <button @click="clearGazer">ClearModel</button>
      <button @click="getFaceCrop">getFaceCrop</button>
      <button @click="predictEmotion">predictEmotion</button>
      <button @click="keepPredictEmotion">keepPredictEmotion</button> -->
      <div v-show='asPredictor==false'>
        <Fly v-if='training'
        @finish_training='finish_training'></Fly>
        <button @click='finish_training'>Finish Training （測試用）</button>
        <div class='container'>
          <p v-if='current_emotion.length == 0'>請等待模型載入</p>
          <p v-else>現在情緒為： {{current_emotion}}</p>
          <button @click="clearGazer" class='btn btn-primary mr-1'
          v-if='!training || trained'>完成訓練</button>
          <button @click="clearGazer" class='btn btn-secondary ml-1'
          v-if='!(!training || !trained)'>清空模型（重新訓練）</button>

        </div>
        <div v-show='false'>
        <img id='showImg' src=''>
        <img id='showFace' src=''>
        <canvas id='FaceCanvas'></canvas>
        </div>
      </div>
  </div>
</template>
<script>
const axios = require('axios');
import * as tf from '@tensorflow/tfjs';
var nj = require('numjs');

function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function scaleImageData(originalImageData, targetWidth, targetHeight) {
    const targetImageData = new ImageData(targetWidth, targetHeight);
    const h1 = originalImageData.height;
    const w1 = originalImageData.width;
    const h2 = targetImageData.height;
    const w2 = targetImageData.width;
    const kh = h1 / h2;
    const kw = w1 / w2;
    const cur_img1pixel_sum = new Int32Array(4);
    for (let i2 = 0; i2 < h2; i2 += 1) {
        for (let j2 = 0; j2 < w2; j2 += 1) {
            for (let i in cur_img1pixel_sum) cur_img1pixel_sum[i] = 0;
            let cur_img1pixel_n = 0;
            for (let i1 = Math.ceil(i2 * kh); i1 < (i2 + 1) * kh; i1 += 1) {
                for (let j1 = Math.ceil(j2 * kw); j1 < (j2 + 1) * kw; j1 += 1) {
                    const cur_p1 = (i1 * w1 + j1) * 4;
                    for (let k = 0; k < 4; k += 1) {
                        cur_img1pixel_sum[k] += originalImageData.data[cur_p1 + k];
                    };
                    cur_img1pixel_n += 1;
                };
            };
            const cur_p2 = (i2 * w2 + j2) * 4;
            for (let k = 0; k < 4; k += 1) {
                targetImageData.data[cur_p2 + k] = cur_img1pixel_sum[k] / cur_img1pixel_n;
            };
        };
    };
    return targetImageData;
};

import Fly from './Fly.vue'
export default {
  data (){
    return {
      current_emotion: "",
      model_path: localStorage['model'] || 'mobilenet_from_example',
      model: undefined,
      start_predict_emotion: 0,
      training: false,
      trained: false,
    }
  },
  props: {
    asPredictor: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  components: {
    Fly,
  },
  async mounted(){
    window.addEventListener("hashchange", () => {window.location.reload()}, false);
    
    await webgazer.begin()
    webgazer.showVideo(true)
    
    let vue = this
    setTimeout(async () => {
      // await webgazer.pause()
    }, 1000)
    setTimeout(async () => {
      vue.model = await vue.getModel()
    }, 1)
    window.addEventListener('gazerPredict', this.keepPredictEmotion)

    this.training = !(localStorage.getItem('trained') || false)
    
  },
  beforeDestroy() {
    console.log("DESTROY!")
    window.removeEventListener('gazerPredict', this.keepPredictEmotion);
    clearInterval(this.start_predict_emotion)
  },
  destroyed(){
    // window.location.reload()
  },
  methods: {
    finish_training(){
      localStorage.setItem("trained", true)
      this.trained = true
    },
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
    },
    async getFaceCrop(){
      let canvas = await this.createCanvasById("webgazerVideoFeed")
      let ctx = canvas.getContext('2d')
      let img_data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let result = this.getRgbByImageData(img_data)
      this.showCanvasByImgRGB(result, canvas.width, canvas.height)

      // Get the boundries of the face, then crop the image to the face part only.
      let faceMesh = await this.getfaceMesh()
      if(faceMesh == false){
        return []
      }
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
      

      let face_crop_1d = []
      for(var i = 0; i < face_crop.length; i++) face_crop_1d = face_crop_1d.concat(face_crop[i])
      this.showCanvasByImgRGB(face_crop_1d, face_crop[0].length, face_crop.length, 'showFace')

      return face_crop
    },
    async getModel(){
      const model = await tf.loadLayersModel(this.model_path+'/model.json');
      return model
    },
    async predictEmotion(){
      let face_img_array = await this.getFaceCrop()
      if(face_img_array.length == 0){
        this.current_emotion = '找不到臉'
        return 
      }
      
      var canvas = document.getElementById('FaceCanvas');
      var context = canvas.getContext('2d');
      var img = document.getElementById('showFace');
      canvas.width = 224;
      canvas.height = 224;
      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, 224, 224);
      
      let img_data = context.getImageData(0, 0, 224, 224)
      face_img_array = this.getRgbByImageData(img_data)
      let face_img_array_resized = []
      face_img_array = nj.array([face_img_array])
      face_img_array_resized = face_img_array.reshape(1, 224,224, 3)
      face_img_array = face_img_array_resized.tolist()
      window.face_img_array_resized = face_img_array_resized
      
      let model = this.model
      face_img_array = tf.tensor(face_img_array)
      
      let result = await model.predict(face_img_array)
      let emotion_prob, idx_to_class, valence, arousal

      if(result.length == 3){
        valence = parseFloat(await result[0].data())
        arousal = parseFloat(await result[1].data())
        emotion_prob = await result[2].data()
      }else{
        emotion_prob = await result.data()
        valence = parseFloat(0)
        arousal = parseFloat(0)
      }

      if(emotion_prob.length == 11){
        idx_to_class = {0: 'Neutral', 1: 'Happiness', 2: 'Sadness', 3: 'Surprise', 4: 'Fear', 5: 'Disgust', 6: 'Anger', 7: 'Contempt', 8: 'None', 9: 'Uncertain', 10: 'No-Face'}
        idx_to_class = {0: '平常心', 1: '開心', 2: '難過', 3: '驚訝', 4: '害怕', 5: '厭惡', 6: '生氣', 7: '鄙視', 8: '無表情', 9: '困惑', 10: '找不到臉'}
      }else{
        idx_to_class={0: 'Anger', 1: 'Disgust', 2: 'Fear', 3: 'Happiness', 4: 'Neutral', 5: 'Sadness', 6: 'Surprise'}
        idx_to_class={0: '憤怒', 1: '厭惡', 2: '害怕', 3: '高興', 4: '平常心', 5: '難過', 6: '驚訝'}
      }
      
      let argmax = argMax(Array.from(emotion_prob))
      let emotion = idx_to_class[argmax]
      this.current_emotion = emotion

      this.$emit("newPredict", {emotion, emotion_prob, valence, arousal})
      
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
      // console.log('showCanvasByImgRGB', {data, width, height, id})
      // var canvas=document.getElementById("FaceCanvas");
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
      localStorage.removeItem("trained")
      window.location.reload()
    },
    async pauseWebgazer(){
      console.log('pauseWebgazer')
      await webgazer.resume()
      setTimeout(async () => {
        await webgazer.pause()
      }, 300)
      
    },
    keepPredictEmotion(){
      if(this.start_predict_emotion == 0){
        let vue = this
        let interval = setInterval(async () => {
          vue.predictEmotion()
        }, 5000)
        document.getElementById('webgazerVideoContainer').style.top = '30%'
        document.getElementById('webgazerVideoContainer').style.left = '10px'
        this.start_predict_emotion = interval
      }
      
    }
  },
}
</script>
<style lang="">
    
</style>