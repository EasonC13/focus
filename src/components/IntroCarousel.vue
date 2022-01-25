<template lang="">
    <div id="IntroCarouselIndicators" class="carousel slide IntroCarouselIndicatorsClass"
    data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#IntroCarouselIndicators" :class="{'active': idx == 0}"
            v-for='(img_url, idx) in img_urls' :key='idx' :data-slide-to="idx" :_="img_url" :dummy='(idx) == 0'></li>
        </ol>
        <div class="carousel-inner">
            <div :class="{'carousel-item': true, 'active': idx == 0}"
             v-for='(img_url, idx) in img_urls' :key='idx'>
                <img class="d-block w-100" :src="img_url" :alt="`${idx} slide`"
                >
                <div class="carousel-caption d-none d-md-block">
                    <h5>⬇️ 下滑以開始 ⬇️</h5>
                </div>
            </div>
            
        </div>
        <a class="carousel-control-prev" href="#IntroCarouselIndicators" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#IntroCarouselIndicators" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>
</template>
<script>
export default {
    data(){
        return {
            img_urls: [],
            slides_count: 10,
            prefix: "IntroCarousel/Slide",
            postfix: ".png",
        }
    },
    mounted(){
        for(let i = 1; i <= this.slides_count; i++){
            console.log(i)
            this.img_urls.push(this.prefix+String(i)+this.postfix)
        }
        
        $('.IntroCarouselIndicatorsClass').carousel({
            interval: 5000
        })
    }
}
</script>
<style lang="">
    
</style>