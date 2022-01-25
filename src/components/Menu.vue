<template>
  <div class="container mt-1">
    <div class='w-100 container'>
      <welcome></welcome>
    </div>
      <div class="row mt-5">
        <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="https://i.imgur.com/we5ZfQ4.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">個人使用</h5>
                    <p class="card-text">評估自己的情況，協助自己了解現在的學習狀態。</p>
                    <router-link :to="'/individual'" class="link btn btn-primary">開始個人使用</router-link>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="https://i.imgur.com/dyeD6qp.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">群體共學</h5>
                    <p class="card-text">與房間的人互相幫助了解彼此的學習狀況，互助共學！</p>
                    <div class='d-inline-block form-inline'>
                        
                        <input style='width: 50%' class='mr-2 form-control'
                        placeholder="# 輸入編號" v-on:keyup.enter='submit_room' v-model='input_room_id'>
                        <button class="btn btn-primary" @click='submit_room'>進入房間</button>
                        <button class="btn btn-link mt-1" @click='create_room'>創立您自己的房間</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="https://i.imgur.com/Xc7vQJu.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">查看回放</h5>
                    <p class="card-text">檢視先前的專注紀錄，了解成長後的自己！</p>
                    <router-link :to="'/view'" class="link btn btn-primary">前往回放</router-link>
                </div>
            </div>
        </div>
      </div>
    
  </div>
</template>

<script>
  import firebase from 'firebase';
  import welcome from './IntroCarousel.vue'

  export default {
    name: 'login',
    components: {
      welcome,
    },
    data() {
      return {
        user: firebase.auth().currentUser,
        input_room_id: '',
      }
    },
    mounted(){
        console.log('menu!!')
        webgazer.showVideoPreview(false)
        webgazer.showPredictionPoints(false)
    },
    methods: {
      submit_room(){
        if(this.input_room_id.length == 0){
          // alert("房間號請勿空白，\n已為您填入 Demo 用號碼")
          this.input_room_id = '123'
        }else{
          this.$router.push({path: 'room', query: { id: this.input_room_id }})
        }
        
      },
      create_room(){
        // get new room
        this.$router.push({path: 'room', query: { id: '123' }})
      }
    }
  }
</script>

<style scoped>
 
</style>