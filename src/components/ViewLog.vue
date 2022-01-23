<template>
    <div class="container" style="position:absolute;">
        <div class="row">
            <div class="col-sm-8 left_img">
                <!-- <img src="../assets/personal_use.jpeg"> -->
            </div>
            <div class="col-sm-4">
                <div><span id="time">1 : 01 : 10</span></div>
                <div>情緒 : <span id="emotion">開心</span></div>
                <div>正向程度 : <span id="positive">普通</span></div>
                <button type="button" id="submit_btn">
                    <img id="btn_img" src="../assets/submit_btn.png">
                    匯出整體數據
                </button>
            </div>
            <div class="col-sm-12">
                <input type="range" min="1" max="10" value="1" id="slider">
                時間軸
            </div>
        </div>
    </div>
</template>

<script></script>

<style>
.container {
    width: 100vw;
    height: 80vh;
    left: 50vw;
    top: 50vh; 
    transform: translate(-50%, -17%);
}
.left_img {
    background-color: antiquewhite;
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
.col-sm-4 {
    margin-top: auto;
    margin-bottom: auto;
}
.col-sm-12 {
    padding: 0;
}
.row {
    transform: translateY(-26%);
}
#slider {
    margin-top: 42px;
    width: 100%;
}
</style>