<template lang="">
    <div>
        <button @click='exportCSV' :class='this.class_text'
        >{{text}}</button>
        <input type="checkbox" id="jack" class='ml-3 mr-1' value="匯出僅能用程式讀取的版本" v-model="checkedForProgramVer">
        <label for="jack">匯出完整版</label>
    </div>
</template>
<script>


function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var download = function(content, fileName, mimeType) {
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    navigator.msSaveBlob(new Blob([content], {
      type: mimeType
    }), fileName);
  } else if (URL && 'download' in a) { //html5 A[download]
    a.href = URL.createObjectURL(new Blob([content], {
      type: mimeType
    }));
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
  }
}


export default {
    props: {
      showHint: {
        type: Boolean,
        required: false,
        default: true
      },
      storage_id: {
        type: String,
        required: false,
        default: 's8QgR3hA5L'
      },
      text: {
        type: String,
        required: false,
        default: '匯出為 CSV'
      },
      class_text: {
        type: String,
        required: false,
        default: 'btn btn-danger'
      },
    },
    data(){
        return {
            checkedForProgramVer: []
        }
    },
    mounted(){
      let request = indexedDB.open("imgs");;
      let db;
      let vue = this

      request.onsuccess = function() {
        vue.db = request.result;
      };
    },
    beforeDestroy(){
        this.db.close()
    },
    methods: {
        async exportCSV(){
          let db = this.db
            console.log(db)
            let data = JSON.parse(localStorage.getItem(this.storage_id))
            console.log(data)
            let imgs = {}
            let vue = this
            data.logs.forEach((log) => {
                const tx = db.transaction('imgs', 'readwrite')
                const store = tx.objectStore('imgs')

                const request = store.get(log.screenshot_id);
                request.onsuccess = function() {
                const matching = request.result;
                if (matching !== undefined) {
                    imgs[log.screenshot_id] = matching.base_64
                } else {
                    // No match was found.
                    console.log('No match was found.')
                }
                };
            })
            while(Object.getOwnPropertyNames(imgs).length != data.logs.length){
                await sleep()
            }
            console.log({imgs})
            data.logs.forEach((log) => {
                if(this.checkedForProgramVer.length > 0){
                    log.screenshot = imgs[log.screenshot_id].split(',')[1]
                    log.gaze_log = log.gaze_log.map((x) => {if(x){return x.join('_')}else return '_'}).join("|")
                    let out = []
                    for(let i in log.emotion_prob){
                        out.push(`${i}_${log.emotion_prob[i]}`)
                    }
                    log.emotion_prob = out.join("|")
                    log.window_inner_size = log.window_inner_size.join("|")
                }else{
                    delete log.gaze_log
                    delete log.emotion_prob
                    delete log.window_inner_size
                }
                delete log.screenshot_id
                let mapping = {'平常心':'Netural','開心':'Happiness','難過':'Sadness','驚訝':'Surprise','害怕':'Fear','厭惡':'Disgust','生氣':'Anger','鄙視':'Contempt','無表情':'None','困惑':'Uncertain','找不到臉':'No-Face'}
                log.emotion = mapping[log.emotion]
                log.time = new Date(log.time)
            })
            console.log(data.logs)
            let csvContent = this.ConvertToCSV(data.logs)
            download(csvContent, 'download.csv', 'text/csv;encoding:utf-8');
        },
        ConvertToCSV(objArray) {
            let pointer = objArray[0]
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = `${Object.getOwnPropertyNames(pointer).join(',')}\n`;

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }
                str += line + '\r\n';
            }

            return str;
        }
    }
}
</script>
<style lang="">
    
</style>