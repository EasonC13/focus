<template lang="">
    <div class='container align-items-center mt-2'>
        <div class="row">
            <div class="col-sm-3">
            
            </div>
            <div class="col-sm-9">
                <div class="card">
                    <h5 class="card-header">個人使用介面</h5>
                    <div class="card-body">
                        <Log></Log>
                        <p>在顯示開始紀錄後，您可以前往其他視窗，自由的使用電腦。<br>本平台會自動記錄您的情緒變化、精神狀態、眼動軌跡及螢幕畫面</p>
                </div>
            </div>
        </div>
        
    </div>
        
    </div>
</template>
<script>
import Log from './LogData.vue'
export default {
    components: {
        Log
    },

}
</script>
<style lang="">
    
</style>