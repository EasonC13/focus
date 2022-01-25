<template lang="">
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" :class="{'active': idx == 0}"
            v-for='(img_url, idx) in img_urls' :key='idx' :data-slide-to="idx" :_="img_url" :dummy='(idx) == 0'></li>
        </ol>
        <div class="carousel-inner">
            <div :class="{'carousel-item': true, 'active': idx == 0}"
             v-for='(img_url, idx) in img_urls' :key='idx'>
                <img class="d-block w-100" :src="img_url" :alt="`${idx} slide`"
                >
                <div class="carousel-caption d-none d-md-block">
                    <h5>⬇️ 開始使用 ⬇️</h5>
                </div>
            </div>
            
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>
</template>
<script>
export default {
    data(){
        return {
            img_urls: [
                "IntroCarousel/Slide1.png",
"IntroCarousel/Slide2.png",
"IntroCarousel/Slide3.png",
"IntroCarousel/Slide4.png",
"IntroCarousel/Slide5.png",
"IntroCarousel/Slide6.png",
            ]
        }
    }
}
</script>
<style lang="">
    
</style>