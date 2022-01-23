<template>
<div class='heatmap'>
        <img :src="'data:image/jpeg;base64,' + image_b64" 
        :width='width' :height='height'
        >
        </div>
</template>

<script>
import * as h337 from 'heatmap.js';
var $ = require('jquery')

export default {
    data() {
        return {
            points: []
        }
    },
    props: {
      image_b64: {
        type: String,
        required: false,
        default: ''
      },
      gazer_points: {
        type: Array,
        required: false,
        default: () => []
      },
      width: {
        type: Number,
        required: false,
        default: 1920
      },
      height: {
        type: Number,
        required: false,
        default: 1080
      },
    mounted() {
        let newImg = new Image() ;
        newImg.src = 'data:image/jpeg;base64,' + myJson[ 'base_64' ] ;
        // --- Download and create Img from base64 ---
        function downloadImg() {
            let newImg = new Image() ;
            fetch( 'https://focus.plus.backend.ntnu.best/api/v0/example_b64' )
            .then( function( response ){
                return response.json() ;
            } )
            .then( function( myJson ){
                // console.log( "base64 string : ", myJson[ 'base_64' ] ) ;
                newImg.src = 'data:image/jpeg;base64,' + myJson[ 'base_64' ] ;
                document.getElementsByClassName( 'heatmap' )[ 0 ].appendChild( newImg ) ;
                // console.log( newImg.src ) ;

                return myJson[ 'base64' ] ;
            } )
            
        }
        downloadImg() ;
        // console.log( this.src ) ;

        // --- For generating random points ---
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
        console.log('CreatePoint', CreatePoint(100))
        this.points = CreatePoint( 100 ) ;
        console.log(this.points)
        this.points = this.gazer_points
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
}
</script>

<style>
.heatmap {
  width: 1280px;
  height: 720px;
}
</style>