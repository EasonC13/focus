<template lang="">
    <div v-show='production == false'>
    
        <p>This example shows you the contents of the selected part of your display.
        Click the Start Capture button to begin.</p>

        <p v-show='false'><button id="start">Start Capture</button>&nbsp;<button id="stop">Stop Capture</button></p>
        <button @click='StartScreenShot'>StartScreenShot</button>
        <button @click='StopScreenShot'>StopScreenShot</button>
        <button @click='getScreenShot'>getScreenShot</button><br>
        <video id="videoStream" autoplay></video>
        <canvas id="canvasStream"></canvas>
        <br>

        <strong>Log:</strong>
        <br>
        <pre id="log"></pre>

    
    </div>
</template>
<script>

// Options for getDisplayMedia()

var displayMediaOptions = {
video: {
    cursor: "always"
},
audio: false
};


// console.log = msg => logElem.innerHTML += `${msg}<br>`;
// console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
// console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
// console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
    const videoElem = document.getElementById("videoStream");
    const logElem = document.getElementById("log");
    logElem.innerHTML = "";

    try {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    } catch(err) {
        console.error("AAAAA Error: " + err);
        window.dispatchEvent(new Event('MediaStream fail to get screen'))
    }
}

function stopCapture(evt) {
    const videoElem = document.getElementById("videoStream");
    const logElem = document.getElementById("log");
    let tracks = videoElem.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}

function dumpOptionsInfo() {
    const videoElem = document.getElementById("videoStream");
    const logElem = document.getElementById("log");
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];

    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
export default {
    mounted(){
        const videoElem = document.getElementById("videoStream");
        const logElem = document.getElementById("log");
        const startElem = document.getElementById("start");
        const stopElem = document.getElementById("stop");

        // Set event listeners for the start and stop buttons
        let vue = this
        startElem.addEventListener("click", function(evt) {
        startCapture();
        }, false);

        stopElem.addEventListener("click", function(evt) {
        stopCapture();
        }, false);

        if(this.production){
            this.StartScreenShot()
        }
    },
    props: {
        production: {
        type: Boolean,
        required: false,
        default: true
        },
    },
    methods:{
        StartScreenShot(){
            const startElem = document.getElementById("start");
            startElem.click()
        },
        StopScreenShot(){
            const stopElem = document.getElementById("stop");
            stopElem.click()
        },
        getScreenShot(){
            const videoElem = document.getElementById("videoStream");
            return this.canvasStreamAndGetBase64()
        },
        canvasStreamAndGetBase64(){
            let canvas = document.getElementById("canvasStream")
            const videoElem = document.getElementById("videoStream");
            canvas.width = videoElem.videoWidth
            canvas.height = videoElem.videoHeight
            let ctx = canvas.getContext('2d')
            ctx.drawImage(
                videoElem,
                0,
                0,
                canvas.width,
                canvas.height
            )
            return canvas.toDataURL()
        }
    },
}
</script>
<style lang="">
    
</style>