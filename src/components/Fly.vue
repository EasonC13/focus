<template lang="">
  <div>
      <!-- <button @click="getCurrent">Get Point</button>
      <button @click="pauseWebgazer">pauseWebgazer</button> -->
      <button>hideGazerVideoContainer</button>
      <button>ClearModel</button>
      <!-- <button @click="getFaceCrop">getFaceCrop</button> -->
      <button>predictEmotion</button>
      <button>keepPredictEmotion</button>
      
        <div id="fly_playground">

            <img id="wreath" src="../assets/wreath.png" style="display:none; position:absolute">
            <!-- <div style="height: 120px;"></div> -->

            {{ fly() }}
        </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    methods : {
        clap(){
          console.log("打到了")
          this
        }
        newPos( bWidth, bHeight ) {
            var nW = Math.floor( Math.random() * bWidth ) ;
            var nH = Math.floor( Math.random() * bHeight ) ;
            console.log( bWidth, bHeight )
            return [ nW, nH ] ;
        },
        animateFly() {
            let blankWidth = window.innerWidth - document.getElementById('fly_playground').offsetLeft ;
            let blankHeight = window.innerHeight - document.getElementById('fly_playground').offsetTop ;
            let fly_img = document.getElementById( 'wreath' ) ;
            console.log( 'www', blankWidth, blankHeight ) ;

            let fly_left = fly_img.offsetLeft ;
            let fly_top = fly_img.offsetTop ;
            let oldCoord = [ fly_img.offsetLeft, fly_img.offsetTop ] ;

            window.setInterval( () => {
                let newCoord = this.newPos( blankWidth - fly_img.width, blankHeight - fly_img.height ) ;
                console.log( "I'm in", oldCoord, newCoord ) ;
                
                $( '#wreath' ).animate( { left : fly_left + newCoord[ 0 ], top : fly_top + newCoord[ 1 ] }, 4000 ) ;                
            }, 1000 ) ;

        },
        fly() {
            var timeOutId = window.setInterval( () => {
                if ( document.getElementById('wreath') ) {
                    // console.log( window.innerWidth - document.getElementById('fly_playground').offsetLeft, window.innerHeight - document.getElementById('fly_playground').offsetTop ) ;
                    let fly_w = ( window.innerWidth - document.getElementById('fly_playground').offsetLeft ) / 10 ;
                    let fly_h = ( window.innerHeight - document.getElementById('fly_playground').offsetTop ) / 6 ;
                    let fly_img = document.getElementById( 'wreath' ) ;
                    fly_img.style.display = 'block' ;
                    fly_img.width = fly_w ;
                    fly_img.height = fly_h ;
                    window.clearInterval( timeOutId ) ;

                    // use js to do animation
                    this.animateFly() ;
                }
                // console.log( "still checking" ) ;
            }, 1000
            ) ;
        },

    }


}
</script>
<style lang="">
    
</style>