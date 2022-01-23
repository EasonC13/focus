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
        <p class='h3'>請點擊花圈</p>
        <p class='h4' v-if='total_need - click_times > 0'>您已經點擊 {{click_times}} 次<br>還需點擊 {{total_need - click_times}} 次來完成模型訓練</p>
        <p v-else class='h4'>您已經完成視線軌跡追蹤模型的訓練</p>
        <div id="fly_playground">

            <img id="wreath" src="../assets/wreath.png" style="display:none; position:absolute"
            @click='clap'>
            <!-- <div style="height: 120px;"></div> -->

            {{ fly() }}
        </div>
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
        }
    },
    mounted(){
        webgazer.showPredictionPoints(false)
        setTimeout(() => {
            document.getElementById('fly_playground')
            $( '#wreath' ).animate( { left : 100, top : 100 }, 1 ) ; 
        }, 1)
    },
    methods : {
        clap(){
          console.log("打到了")
          this.click_times += 1
          this.$emit('click')
          if(this.click_times > this.total_need/2){
              webgazer.showPredictionPoints(true)
          }
          if(this.click_times > this.total_need){
              this.$emit('finish_training')
          }
          this.animateFly() ;
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
            let blankWidth = window.innerWidth - document.getElementById('fly_playground').offsetLeft ;
            let blankHeight = window.innerHeight - document.getElementById('fly_playground').offsetTop ;
            let fly_img = document.getElementById( 'wreath' ) ;

            console.log( 'www', blankWidth, blankHeight ) ;
            console.log( 'www', this.fly_img_offset ) ;
            console.log( 'www', this.corner ) ;

            let newCoord = this.newPos( blankWidth - fly_img.width, blankHeight - fly_img.height ) ;
            // console.log( "I'm in", oldCoord, newCoord ) ;
            
            $( '#wreath' ).animate( { left : this.fly_img_offset[ 0 ] + newCoord[ 0 ], top : this.fly_img_offset[ 1 ] + newCoord[ 1 ] }, 1000 ) ; 

        },
        fly() {
            if ( this.fly_execute ) {
                console.log( "this shouldn't appear" ) ;

                var timeOutId = window.setInterval( () => {
                    if ( document.getElementById('wreath') ) {
                        // console.log( window.innerWidth - document.getElementById('fly_playground').offsetLeft, window.innerHeight - document.getElementById('fly_playground').offsetTop ) ;
                        // let fly_w = ( window.innerWidth - document.getElementById('fly_playground').offsetLeft ) / 10 ;
                        let fly_img = document.getElementById( 'wreath' ) ;
                        let fly_playground = document.getElementById('fly_playground') ;
                        let fly_h = ( window.innerHeight - fly_playground.offsetTop ) / 6 ;
                        fly_img.style.display = 'block' ;
                        fly_img.width = fly_h ;
                        fly_img.height = fly_h ;
                        window.clearInterval( timeOutId ) ;

                        this.fly_execute = 0 ;
                        this.fly_img_offset = [ fly_img.offsetLeft, fly_img.offsetTop ] ;

                        let blankWidth = window.innerWidth - document.getElementById('fly_playground').offsetLeft ;
                        let blankHeight = window.innerHeight - document.getElementById('fly_playground').offsetTop ;

                        this.blank = [ blankWidth, blankHeight ] ;
                        this.corner = [ [ blankWidth - fly_img.width, blankHeight - fly_img.height ], 
                                        [ fly_playground.offsetLeft, blankHeight - fly_img.height ], 
                                        [ blankWidth - fly_img.width, fly_playground.offsetHeight ] ] ;

                        // use js to do animation
                        // this.animateFly() ;
                    }
                    // console.log( "still checking" ) ;
                }, 1000
                ) ;
            }

        },

    }


}
</script>
<style lang="">
    
</style>