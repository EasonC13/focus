<template lang="">
  <div>
    <div v-if="currentStatus == recordingFlag">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Emotion</th>
            <th scope="col">Arousal</th>
            <th scope="col">Valence</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{{ currentStatus }}</th>
            <td>{{ currentEmotion }}</td>
            <td>{{ currentArousal }}</td>
            <td>{{ currentValence }}</td>
            <td>{{ log.length }}</td>
          </tr>
        </tbody>
      </table>
      <div>
        Data wants to record
        <input
          type="checkbox"
          id="jack"
          class="m-1"
          value="Screenshot+EyeGazing"
          v-model="datas_want_to_log"
        />
        <label for="jack">Screen and Eye Gazing</label>
        <input
          type="checkbox"
          class="m-1"
          id="john"
          value="Emotion"
          v-model="datas_want_to_log"
        />
        <label for="john">Emotion</label>
        <input
          type="checkbox"
          id="mike"
          class="m-1"
          value="Valence+Arousal"
          v-model="datas_want_to_log"
        />
        <label for="mike">Valence and Arousal</label>
        <!-- <br>{{datas_want_to_log}} -->
      </div>
      <div v-if="group_mode">
        Data wants to share:
        <input
          type="checkbox"
          id="jack"
          class="m-1"
          value="Screenshot+EyeGazing"
          v-model="datas_want_to_share"
        />
        <label for="jack">Screen and Eye Gazing</label>
        <input
          type="checkbox"
          class="m-1"
          id="john"
          value="Emotion"
          v-model="datas_want_to_share"
        />
        <label for="john">Emotion</label>
        <input
          type="checkbox"
          id="mike"
          class="m-1"
          value="Valence+Arousal"
          v-model="datas_want_to_share"
        />
        <label for="mike">Valence and Arousal</label>
        <!-- <br>{{datas_want_to_share}} -->
      </div>
      <p>
        After starting the recording, you can go to other windows and use the
        computer freely. <br />
        This platform will automatically record your emotional changes, mental
        state, eye movements and screen images<br />
        By checking the options above, you can decide which data will be
        recorded<span v-if="group_mode">or sharing</span>
      </p>
      <button class="btn btn-secondary mr-1">Pause</button>
      <button class="btn btn-danger ml-1" @click="finish">End Recording</button>
    </div>
    <div v-else-if="currentStatus == '紀錄完成'">
      <p>{{ currentStatus }}</p>
      <ExportLogToCsv :storage_id="id"></ExportLogToCsv>
      <p>
        <br />The full version includes emotional probability, screenshots, and
        eye tracking. <br />Because the content is large, it needs to be
        analyzed by a program, or you can import it again to this website for
        analysis
      </p>
      <router-link :to="'/view'" class="link btn btn-primary"
        >前往回放</router-link
      >
    </div>
    <div v-else>
      <p>{{ currentStatus }}</p>
    </div>
    <div v-if="is_ready && !(currentStatus == '紀錄完成')">
      <Predictor :asPredictor="true" @newPredict="handlePredict"></Predictor>
      <MediaStream production></MediaStream>
    </div>
  </div>
</template>
<script>
const axios = require("axios");
import Predictor from "./GazerEmotionPredict.vue";
import MediaStream from "./MediaStream.vue";
import ExportLogToCsv from "./ExportLogToCsv.vue";
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let setStorage = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};
let getStorage = function (key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.log(e);
    return localStorage.getItem(key);
  }
};

export default {
  components: {
    Predictor,
    MediaStream,
    ExportLogToCsv,
  },
  props: {
    group_mode: {
      type: Boolean,
      required: false,
      default: false,
    },
    room_id: {
      type: String,
      required: false,
      default: "-1",
    },
  },
  data() {
    return {
      id: "",
      currentEmotion: "",
      currentValence: 0,
      currentArousal: 0,
      currentStatus: "Waiting",
      recordingFlag: "Recording",
      mediaStream: undefined,
      current_gaze_log: [],
      db: undefined,
      all_data_can_log: [`Screenshot+EyeGazing`, `Emotion`, `Valence+Arousal`],
      datas_want_to_log: [`Screenshot+EyeGazing`, `Emotion`, `Valence+Arousal`],
      datas_want_to_share: [
        `Screenshot+EyeGazing`,
        `Emotion`,
        `Valence+Arousal`,
      ],
      screen: `Screenshot+EyeGazing`,
      is_finish: false,
      is_ready: false,
      log: [],
    };
  },
  watch: {
    datas_want_to_log: function (new_arr, old_arr) {
      // console.log({new_value, old_value})
      let screen = this.screen;
      if (new_arr.includes(screen) && !old_arr.includes(screen)) {
        MediaStream.methods.StartScreenShot();
      }
      let ele;
      for (let i in this.all_data_can_log) {
        ele = this.all_data_can_log[i];
        // console.log(ele, old_arr.includes(ele) , !new_arr.includes(ele), {old_arr, new_arr})
        if (old_arr.includes(ele) && !new_arr.includes(ele)) {
          this.remove_item_from_array(ele, this.datas_want_to_share);
        }
      }
    },
    datas_want_to_share: function (new_arr, old_arr) {
      let ele;
      for (let i in this.all_data_can_log) {
        ele = this.all_data_can_log[i];
        // console.log(ele, old_arr.includes(ele) , !new_arr.includes(ele), {old_arr, new_arr})
        if (
          !old_arr.includes(ele) &&
          new_arr.includes(ele) &&
          !this.datas_want_to_log.includes(ele)
        ) {
          this.datas_want_to_log.push(ele);
        }
      }
    },
  },
  beforeCreate() {
    let trained = localStorage.getItem("trained") || false;
    if (trained == false) {
      this.$router.push("/model");
      return 0;
    }
  },
  mounted() {
    this.is_ready = true;
    this.id = makeid(10);
    console.log(`Create new log session at id ${this.id}`);
    let ids = getStorage("ids") || [];
    ids.push(this.id);
    setStorage("ids", ids);
    let logFormat = {
      startTime: new Date().getTime(),
      logs: [],
    };
    setStorage(this.id, logFormat);
    window.addEventListener("new gaze point", this.handleNewGazePoint);
    window.addEventListener("MediaStream fail to get screen", this.noScreen);

    this.init_indexedDB();
  },
  beforeDestroy() {
    window.removeEventListener("new gaze point", this.handleNewGazePoint);
    window.removeEventListener("MediaStream fail to get screen", this.noScreen);
    let log = getStorage(this.id);
    if (log.logs.length == 0) {
      localStorage.removeItem(this.id);
      console.log("remove log because no data logged.");
    }
  },
  methods: {
    remove_item_from_array(item, array) {
      array.splice(array.indexOf(item), 1);
    },
    noScreen() {
      this.remove_item_from_array(this.screen, this.datas_want_to_log);
      this.remove_item_from_array(this.screen, this.datas_want_to_share);
    },
    init_indexedDB() {
      const request = indexedDB.open("imgs");
      let db;
      let vue = this;

      request.onsuccess = function () {
        vue.db = request.result;
        db = vue.db;
        window.db = vue.db;
        console.log("request.onsuccess", { db });
      };

      request.onupgradeneeded = function () {
        console.log(
          "The database did not previously exist, so create object stores and indexes."
        );
        const db = request.result;
        const store = db.createObjectStore("imgs", { keyPath: "hash" });
        const imageIndex = store.createIndex("b64", "base_64", {
          unique: true,
        });
      };
    },
    handleNewGazePoint(e) {
      let gaze = e.detail;
      if (gaze) {
        this.current_gaze_log.push([gaze.x, gaze.y]);
      } else {
        this.current_gaze_log.push(null);
      }
      // console.log(this.current_gaze_log)
    },
    handlePredict(data) {
      this.currentStatus = this.recordingFlag;
      let log = getStorage(this.id);
      let gaze_log = this.current_gaze_log;
      this.current_gaze_log = [];

      let screenshot_id = makeid(8);
      let screenshot_b64 = this.screenshot();
      const tx = this.db.transaction("imgs", "readwrite");
      // console.log('tx', tx)
      const store = tx.objectStore("imgs");

      if (!this.datas_want_to_log.includes(`Screenshot+EyeGazing`)) {
        gaze_log = null;
        screenshot_id = null;
      } else {
        // setStorage(screenshot_id, screenshot_b64)
        console.log("this.db", this.db);
        store.put({ base_64: screenshot_b64, hash: screenshot_id });
        tx.oncomplete = function () {
          // console.log("Store Finish")
        };
      }

      if (!this.datas_want_to_log.includes(`Emotion`)) {
        data.emotion = null;
        data.emotion_prob = null;
      }

      if (!this.datas_want_to_log.includes(`Valence+Arousal`)) {
        data.valence = null;
        data.arousal = null;
      }
      let new_log_data = {
        time: new Date().getTime(),
        gaze_log: gaze_log,
        screenshot_id: screenshot_id,
        window_inner_size: [window.innerWidth, window.innerHeight],
        ...data,
      };
      log.logs.push(new_log_data);
      setStorage(this.id, log);
      // console.log('handlePredict for', this.id, {log})
      this.currentEmotion = data.emotion;
      this.currentArousal = data.arousal;
      this.currentValence = data.valence;
      this.log = log.logs;
      // console.log('this.group_mode',this.group_mode)
      if (this.group_mode) {
        this.shareLogData(new_log_data);
      }
    },
    shareLogData(data, screenshot_b64) {
      let vue = this;
      axios({
        method: "POST",
        url: `https://focus.plus.backend.ntnu.best/api/v1/user/status`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          display_name:
            localStorage.getItem("display_name") ||
            (firebase.auth().currentUser || {}).displayName ||
            "",
          account: (firebase.auth().currentUser || {}).email || "",
          room_id: this.room_id,
          arousal: data.arousal,
          valence: data.valence,
          emotion: data.emotion,
          emotion_prob: data.emotion_prob,
          gaze_log: data.gaze_log,
          screenshot_b64: screenshot_b64,
          window_inner_size: data.window_inner_size,
        },
      }).then((response) => {
        console.log("response.data", response.data);
      });
    },
    screenshot() {
      let screen_b64 = MediaStream.methods.getScreenShot();
      // console.log({screen_b64})
      console.log("screen shot");
      return screen_b64;
    },
    finish() {
      this.is_finish = true;
      this.currentStatus = "紀錄完成";
    },
  },
};
</script>
<style lang=""></style>
