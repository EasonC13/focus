<template>
    <div class="container view_log_container" style="position:absolute;">
        <div class="row row_" v-if='ready'>
            <div class="col-sm-8 col-sm-8_ left_img" v-if='showHeatMap'>
                <heatmap :image_b64='b64' :width='img_width' :height='img_height' :gazer_points="gazer_points"
                ></heatmap>
            </div>
            <div class="col-sm-4 col-sm-4_">
                <div class="dropdown mb-2">
                    <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{currentData}} Click to switch logs
                    </button>
                    <div class="dropdown-menu overflow-auto" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" :key='index' @click='selectNewData(item)'
                        v-for="(item, index) in dataList">{{item}}</a>
                    </div>
                </div>
                <table class="table table-hover table-sm table-bordered">
                    <tbody>
                        <tr>
                            <th scope="col">Timestamp</th>
                            <th scope="col">
                            {{`${timeStamp.getUTCFullYear()
                            }/${('0' + timeStamp.getMonth()+1).slice(-2)
                            }/${timeStamp.getUTCDate()
                            } ${('0' + timeStamp.getHours()).slice(-2)
                            }:${('0' + timeStamp.getMinutes()).slice(-2)
                            }:${('0' + timeStamp.getSeconds()).slice(-2)
                            }`}}</th>
                        </tr>
                        <tr>
                            <th scope="row">Emotion</th>
                            <td>{{emotion}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Arousal</th>
                            <td>{{arousal}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Valence</th>
                            <td>{{valence}}</td>
                        </tr>
                    </tbody>
                </table>
                <ExportLogToCsv :storage_id='currentData' :showHint='false'></ExportLogToCsv>
                <p>Full version includes emotional probability, screenshots, and eye movements. <br>Because the content is large, it needs to be analyzed by a program, or you can import it again to this website for analysis</p>
                <FileReader cls='btn btn-secondary' btn_text="選擇其他要匯入的紀錄"
                @load='upload_record'></FileReader>
            </div>
            <div class="col-sm-12 col-sm-12_">
                <input type="range" min="0" :max="total_data_length - 1" value="1" id="slider" v-model='idx'>
                Timeline
            </div>
        </div>
        <!-- <span>{{currentLog}}</span> -->
    </div>
</template>

<script>
import heatmap from './heatmap.vue'
import ExportLogToCsv from './ExportLogToCsv.vue'
import FileReader from './FileReader.vue'

let all_data = JSON.parse(localStorage.getItem('ids'))
export default {
    components: {
        ExportLogToCsv,
        heatmap,
        FileReader,
    },
    data(){
        return {
            dataList: [],
            logList: [],
            currentData: '',
            total_data_length: 1,
            b64: '',
            emotion: '',
            valence: '',
            arousal: '',
            timeStamp: '',
            db: null,
            idx: 0,
            showHeatMap: true,
            img_width: 1280,
            img_height: 720,
            ready: false,
        }
    },
    computed:{
        currentLog: function(){
            let log = localStorage.getItem(this.currentData)
            console.log(log)
            return log
        }
    },
    mounted(){
        const request = indexedDB.open("imgs");;
        let vue = this;

        request.onsuccess = function() {
            vue.db = request.result;
            vue.init()
        };
        // this.init()
    },
    watch: {
        idx: function(){
            this.initFrame()
        },
    },
    methods: {
        init(){
            let all_data = JSON.parse(localStorage.getItem('ids'))
            all_data = all_data.filter((x) => {
                return ((JSON.parse(localStorage.getItem(x)) ||
                 {logs: []}).logs.length > 0)
            })
            localStorage.setItem('ids', JSON.stringify(all_data))
            this.dataList = all_data
            this.currentData = this.$route.query.data || all_data[all_data.length -1]
            this.$router.replace({ query: { data: this.currentData} }).catch(()=>{});
            
            let log = JSON.parse(localStorage.getItem(this.currentData))
            // log = JSON.parse(localStorage.getItem('qq0lcirSwd'))
            console.log({log})
            if(log == null){
                alert("無效記錄檔")
                this.$router.replace({ query: { data: null } }).catch(()=>{});
                // window.location.reload()
            }
            this.total_data_length = log.logs.length
            this.logList = log.logs
            this.initFrame()
            window.vm = this
        },
        selectNewData(id){
            this.$router.replace({ query: { data: id } }).catch(()=>{});
            this.init()
        },
        initFrame(){
            let idx = this.idx
            let log = this.logList[idx]
            if(log==undefined && idx == 0){
                alert('紀錄檔內無內容')
            }
            this.timeStamp = new Date(log.time)
            this.emotion = log.emotion
            this.arousal = log.arousal
            this.valence = log.valence

            const tx = this.db.transaction('imgs', 'readwrite')
            const store = tx.objectStore('imgs')
            let vue = this
            // this.gazer_points = Array.from(log.logs[0].gaze_log.map((x) => {if(x){return {x: x[0], y: x[1], value: 0.5}}}))
            this.gazer_points = []
            let value = 50;
            console.log({log})
            
            for(let i_ in log.gaze_log){
                if(log.gaze_log[i_] == null)continue
                console.log(log.gaze_log[i_])
                value = 50;
                this.gazer_points.push( { 
                    x : Number.parseInt(log.gaze_log[i_][0]/log.window_inner_size[0]*this.img_width), 
                    y : Number.parseInt(log.gaze_log[i_][1]/log.window_inner_size[1]*this.img_height), 
                    value : value } ) ;
                // this.gazer_points.push( { x : 100, y : 100, value : value } ) ;
            }
            console.log('this.gazer_points', this.gazer_points)
            const request = store.get(log.screenshot_id);
            request.onsuccess = function() {
                let matching = request.result;
                if (matching !== undefined) {
                    console.log({matching})
                    vue.b64 = matching.base_64.split(',')[1]
                } else {
                    // No match was found.
                    console.log('No match was found.')
                }
            };
            this.ready = true
        },
        upload_record(d){
            console.log(d)
            alert("尚未支援此功能")
        }
    }
}

</script>

<style>
.view_log_container {
    width: 100vw;
    height: 80vh;
    left: 50vw;
    top: 50vh; 
    transform: translate(-50%, -17%);
}
.left_img {
    /* background-color: antiquewhite; */
    height: 64vh;
}
#submit_btn {
    text-align: right;
    width: 145px;
    height: 45px;
    padding-left: 0;
}
#btn_img {
    width: 30px;
    height: 30px;
    left: 0%;
    top: 0%;
    position: relative;
}
.col-sm-4_ {
    margin-top: auto;
    margin-bottom: auto;
}
.col-sm-12_ {
    padding: 0;
}
.row_ {
    transform: translateY(-26%);
}
#slider {
    margin-top: 42px;
    width: 100%;
}
</style>