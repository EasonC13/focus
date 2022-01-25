<template lang="">
    <div class='container align-items-center mt-2'>
        <div class="row">
            <div class="col-sm-3">
            
            </div>
            <div class="col-sm-9">
                <div class="card">
                    <h5 class="card-header">個人使用</h5>
                    <div class="card-body">
                        <Log></Log>
                        
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
    mounted(){
        
    }

}
</script>
<style lang="">
    
</style>