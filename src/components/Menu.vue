<template>
  <div class="container mt-1">
    <div class='w-100 '>
      <welcome></welcome>
    </div>
      <div class="row mt-5">
        <div class="col-sm-4 d-flex align-items-stretch">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="/imgs/menu/PersonalUse.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">個人使用</h5>
                    <p class="card-text">紀錄自己的使用情況<br>協助自己了解現在的學習狀態</p>
                    <router-link :to="'/individual'" class="link btn btn-primary">開始個人使用</router-link>
                </div>
            </div>
        </div>
        <div class="col-sm-4 d-flex align-items-stretch">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="/imgs/menu/GroupRoom.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">群體共學</h5>
                    <p class="card-text">與房間內的夥伴一起<br>了解彼此的使用狀況，互相砥礪</p>
                    <div class='d-inline-block form-inline'>
                        
                        <input style='width: 50%' class='mr-2 form-control'
                        placeholder="# 輸入編號" v-on:keyup.enter='submit_room' v-model='input_room_id'>
                        <button class="btn btn-primary" @click='submit_room'>進入房間</button>
                        <button class="btn btn-link mt-1" @click='create_room'>創立您自己的房間</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4 d-flex align-items-stretch">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="/imgs/menu/WatchRecord.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">查看回放</h5>
                    <p class="card-text">檢視先前的專注紀錄<br>回顧自己的使用情況</p>
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