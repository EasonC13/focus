<template>
    <div class="heatmap">
        <!-- {{ test() }} -->
    </div>
</template>

<script>
import * as h337 from 'heatmap.js';
export default {
    data() {
        return {
            points : [],
        }
    },
    mounted() {
        function random( min, max ) {
            return Math.random() * (max - min) + min;
        }
        function CreatePoint(count) {
            let data = [] ;

            for (let i = 0; i < count; i++) {
                let x = Math.floor(random(0, window.innerWidth));
                let y = Math.floor(random(0, window.innerHeight));
                let value = Math.floor(random(0, 100));

                data.push( { x : x, y : y, value : value } ) ;


            }
            // console.log( data ) ;
            return data ;
        }
        this.points = CreatePoint( 100 ) ;

        this.test() ;
    },
    methods : {
        test() {
            console.log( this.points ) ;
            
            const heatmapInstance = h337.create( {
                container : document.querySelector('.heatmap'),  
            } ) ;

            // Data format use for generating heatmap
            const data = {  
                max: 100,
                data: this.points
            } ;
            heatmapInstance.setData(data);
        }
    }
}
</script>

<style>
.heatmap {
  width: 1280px;
  height: 720px;
}
</style>