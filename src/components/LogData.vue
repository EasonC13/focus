<template lang="">
    <div>
        
        <div v-if='currentStatus == recordingFlag'>
            <p>紀錄狀態：{{currentStatus}}</p>
            <p>當前情緒：{{currentEmotion}}</p>
            <p>當前精神狀態：{{currentArousal}}</p>
            <p>當前正向程度：{{currentValence}}</p>
        </div>
        <p v-else>{{currentStatus}}</p>
        <!-- <button @click='screenshot'>Screenshot</button> -->
        
        <Predictor :asPredictor='true'
        @newPredict='handlePredict'></Predictor>
        <MediaStream production></MediaStream>
    </div>
</template>
<script>
import Predictor from './GazerEmotionPredict.vue'
import MediaStream from './MediaStream.vue'
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
        Predictor,
        MediaStream,
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
            db: undefined,
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
        this.init_indexedDB()
    },
    beforeDestroy(){
        window.removeEventListener('new gaze point', this.handleNewGazePoint)
    },
    methods: {
        init_indexedDB(){
            const request = indexedDB.open("imgs");
            let db;
            let vue = this

            request.onsuccess = function() {
                vue.db = request.result;
                db = vue.db;
                window.db = vue.db
                console.log('request.onsuccess', {db})
            };

            request.onupgradeneeded = function() {
            // The database did not previously exist, so create object stores and indexes.
            const db = request.result;
            const store = db.createObjectStore("imgs", {keyPath: "hash"});
            const imageIndex = store.createIndex("b64", "base_64", {unique: true});
            };
        },
        handleNewGazePoint(e){
            
            let gaze = e.detail
            if(gaze){
                this.current_gaze_log.push([gaze.x, gaze.y])
            }else{
                this.current_gaze_log.push(null)
            }
            // console.log(this.current_gaze_log)
            
        },
        handlePredict(data){
            this.currentStatus = this.recordingFlag;
            let log = getStorage(this.id)
            let gaze_log = this.current_gaze_log
            this.current_gaze_log = []

            let screenshot_id = makeid(8)
            let screenshot_b64 = this.screenshot()
            // setStorage(screenshot_id, screenshot_b64)
            console.log("this.db", this.db)
            const tx = this.db.transaction('imgs', 'readwrite')
            const store = tx.objectStore('imgs')
            store.put({base_64: screenshot_b64, hash: screenshot_id})
            tx.oncomplete = function() {
                // console.log("Store Finish")
            };
            log.logs.push({
                time: new Date().getTime(),
                gaze_log: gaze_log,
                screenshot_id: screenshot_id,
                ...data})
            setStorage(this.id, log)
            console.log('handlePredict for', this.id, {log})
            this.currentEmotion = data.emotion
            this.currentArousal = data.arousal
            this.currentValence = data.valence
        },
        screenshot(){
            let screen_b64 = MediaStream.methods.getScreenShot()
            // console.log({screen_b64})
            console.log("screen shot")
            return screen_b64
        }
    }
}
</script>
<style lang="">
    
</style>