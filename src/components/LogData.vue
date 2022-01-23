<template lang="">
    <div>
        
        <div v-if='currentStatus == recordingFlag'>
            <p>紀錄狀態：{{currentStatus}}</p>
            <p>當前情緒：{{currentEmotion}}</p>
            <p>當前精神狀態：{{currentArousal}}</p>
            <p>當前正向程度：{{currentValence}}</p>
        </div>
        <p v-else>{{currentStatus}}</p>
        <button @click='screenshot'>Screenshot</button>
        
        <Predictor :asPredictor='true'
        @newPredict='handlePredict'></Predictor>
    </div>
</template>
<script>
import Predictor from './GazerEmotionPredict.vue'
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

let setStorage = function(key, value){
    localStorage.setItem(key, JSON.stringify(value))
    
}
let getStorage = function(key){
    try{
        return JSON.parse(localStorage.getItem(key))
    }catch(e){
        console.log(e)
        return localStorage.getItem(key)
    }
}

export default {
    components: {
        Predictor
    },
    data(){
        return{
            id: '',
            currentEmotion: '',
            currentValence: 0,
            currentArousal: 0,
            currentStatus: '等待模型載入',
            recordingFlag: '紀錄中',
            mediaStream: undefined,
            current_gaze_log: [],
        }
    },
    mounted(){
        this.id = makeid(10)
        console.log(`Create new log session at id ${this.id}`)
        let ids = getStorage('ids') || []
        ids.push(this.id)
        setStorage('ids', ids)
        let logFormat = {
            startTime: new Date().getTime(),
            logs: []
        }
        setStorage(this.id, logFormat)
        window.addEventListener('new gaze point', this.handleNewGazePoint)
    },
    beforeDestroy(){
        window.removeEventListener('new gaze point', this.handleNewGazePoint)
    },
    methods: {
        handleNewGazePoint(e){
            
            let gaze = e.detail
            if(gaze){
                this.current_gaze_log.push([gaze.x, gaze.y])
            }else{
                this.current_gaze_log.push(null)
            }
            console.log(this.current_gaze_log)
            
        },
        handlePredict(data){
            this.currentStatus = this.recordingFlag;
            let log = getStorage(this.id)
            let gaze_log = this.current_gaze_log
            this.current_gaze_log = []
            log.logs.push({
                time: new Date().getTime(),
                gaze_log: gaze_log,
                ...data})
            setStorage(this.id, log)
            console.log('handlePredict for', this.id, {log})
            this.currentEmotion = data.emotion
            this.currentArousal = data.arousal
            this.currentValence = data.valence
        },
        async screenshot(){
            if(this.mediaStream == undefined){
                async function startCapture(displayMediaOptions) {
                    let captureStream = null;

                    try {
                        captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
                    } catch(err) {
                        console.error("Error: " + err);
                    }
                    return captureStream;
                }
                this.mediaStream = await startCapture()
            }
            window.mediaStream = this.mediaStream
        }
    }
}
</script>
<style lang="">
    
</style>