<template lang="">
  <div>
      <!-- <button @click="getCurrent">Get Point</button>
      <button @click="pauseWebgazer">pauseWebgazer</button>
      <button>hideGazerVideoContainer</button>
      <button>ClearModel</button>
      <button @click="getFaceCrop">getFaceCrop</button>
      <button>predictEmotion</button>
      <button>keepPredictEmotion</button> -->
        <p class='h3'>校正模型</p>
        <p class='h3'>請用滑鼠雙擊來打蚊子十次</p>
        <p v-if='total_need - click_times > 0' class='h3'
            >🦟：{{'🧡'.repeat(total_need - click_times)}}{{'🤍'.repeat(click_times)}}</p>
        <!-- <p class='h4' v-if='total_need - click_times > 0'>您已經點擊 {{click_times}} 次<br>還需點擊 {{total_need - click_times}} 次來完成模型訓練</p> -->
        <p v-else class='h4'>您已經完成視線軌跡追蹤模型的訓練<br>但你可以多打幾下蚊子以增加模型的精確度</p>
        <p v-if='gazer_point_show'>紅色的點，就是模型預測您的視線焦點</p>
        <div id="fly_playground">

            <img id="fly_training_target" :src="display_src"
            :class="{zoom_training_target: target_zoom}"
            style="position:absolute; left: 100px; top: 100px; width: 77px; height: 77px"
            @dblclick='clap'>
            <!-- <div style="height: 120px;"></div> -->
        </div>
        <audio ref="fly_training_clap_audio" src="train_model_target/clap.mp3"></audio>


  </div>
</template>
<script>
var $ = require('jquery')

export default {
    data() {
        return {
            click_times: 0,
            total_need: 10,
            fly_execute : 1,
            fly_img_offset : [],
            blank : [],
            corner : [],
            prev: undefined,
            default_img: 'train_model_target/mosquito.png',
            clicked_img: 'train_model_target/mosquito_die.png',
            display_src: '',
            target_zoom: false,
            last_hit: new Date().getTime(),
            gazer_point_show: false,
        }
    },
    mounted(){
        this.display_src = this.default_img
        webgazer.showPredictionPoints(false)
        setTimeout(() => {
            document.getElementById('fly_playground')
            $( '#fly_training_target' ).animate( { left : '10%', top : '10%' }, 1 ) ; 
            this.prev = ['10%', '10%']
        }, 1)
        this.last_hit = new Date().getTime()
        this.mnw = '5%'
        this.mxw = '85%'
        this.mid = '48%'
        this.positions = [
            [this.mxw, this.mxw],
            [this.mxw, this.mnw],
            [this.mnw, this.mxw],
            [this.mnw, this.mnw],
        ]
        this.positions2 = [
            [this.mxw, this.mid],
            [this.mid, this.mnw],
            [this.mid, this.mnw],
        ]
    },
    watch:{
        last_hit: async function(){
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            let last_hit_remember = this.last_hit
            let vue = this
            setTimeout(async () => {
                console.log('last hit', vue.last_hit , {last_hit_remember})
                while(vue.last_hit == last_hit_remember){
                    vue.zoomTarget(true)
                    await sleep(300)
                    vue.zoomTarget(false)
                    await sleep(300)
                }
            }, 5000)
        }
    },
    methods : {
        zoomTarget(bool){
            this.target_zoom = bool
        },
        target_hit_effect(){
            let vue = this
            this.display_src = vue.clicked_img
            setTimeout(() => {
                vue.display_src = vue.default_img
            }, 1000)
        },
        clap(){
            if(this.last_hit > new Date().getTime() - 1000){
                console.log('too soon to hit... prevented!', this.last_hit, new Date().getTime() - 1000)
                return false
            }
            
            console.log("打到了")
            this.$refs.fly_training_clap_audio.play()
            this.click_times += 1
            this.last_hit = new Date().getTime()
            this.$emit('click')
            if(this.click_times > this.total_need/2){
                webgazer.showPredictionPoints(true)
                this.gazer_point_show = true
            }
            if(this.click_times == this.total_need){
                this.$emit('finish_training')
            }
            this.zoomTarget(false);
            this.target_hit_effect()
            this.animateFly();
        },
        newPos( bWidth, bHeight ) {
            if ( this.corner.length == 0 ) {
                var nW = Math.floor( Math.random() * bWidth ) ;
                var nH = Math.floor( Math.random() * bHeight ) ;
                console.log( bWidth, bHeight )
            } else {
                var nW = this.corner[ 0 ][ 0 ] ;
                var nH = this.corner[ 0 ][ 1 ] ;
                this.corner.shift() ;
                console.log( 'corner : ', nW, nH ) ;
            }
            return [ nW, nH ] ;
        },
        animateFly() {
            // let blankWidth = window.innerWidth - document.getElementById('fly_playground').offsetLeft ;
            // let blankHeight = window.innerHeight - document.getElementById('fly_playground').offsetTop ;
            // let fly_img = document.getElementById( 'fly_training_target' ) ;

            // console.log( 'www', blankWidth, blankHeight ) ;
            // console.log( 'www', this.fly_img_offset ) ;
            // console.log( 'www', this.corner ) ;

            // let newCoord = this.newPos( blankWidth - fly_img.width, blankHeight - fly_img.height ) ;
            // console.log( "I'm in", oldCoord, newCoord ) ;

            let arr = []
            let choice = this.prev

            while(choice == this.prev){
                if(this.click_times > this.total_need/2){
                arr = [...this.positions, ...this.positions2]
                choice = arr[Math.floor(Math.random() * arr.length)]
                }else{
                    arr = [...this.positions, ...this.positions]
                    choice = arr[this.click_times]
                }
            }
            this.prev = choice
            console.log({arr, choice})
            $( '#fly_training_target' ).animate( { left : choice[0], top : choice[1]}, 1000 ) ; 

        },
    }


}
</script>
<style>
    #fly_training_target {
        transition: transform .25s; /* Animation */
        margin: 20px;
    }
    .zoom_training_target{
        transform: scale(1.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
    }
</style>