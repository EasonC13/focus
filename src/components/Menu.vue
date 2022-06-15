<template>
  <div class="container mt-1">
    <div class='w-100 '>
      <welcome></welcome>
      <h5 class="mt-3">⬇️ Start by Scrolling Down ⬇️</h5>
    </div>
      <div class="row mt-5">
        <div class="col-sm-4 d-flex align-items-stretch">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="/imgs/menu/PersonalUse.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">Personal</h5>
                    <p class="card-text">Record your status,<br>know how you learn</p>
                    <router-link :to="'/individual'" class="link btn btn-primary">Go</router-link>
                </div>
            </div>
        </div>
        <div class="col-sm-4 d-flex align-items-stretch">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="/imgs/menu/GroupRoom.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">Co-learning</h5>
                    <p class="card-text">Learn together with your friends</p>
                    <div class='d-inline-block form-inline'>
                        
                        <input style='width: 50%' class='mr-2 form-control'
                        placeholder="# Enter room ID" v-on:keyup.enter='submit_room' v-model='input_room_id'>
                        <button class="btn btn-primary" @click='submit_room'>Enter room</button>
                        <button class="btn btn-link mt-1" @click='create_room'>Create your room</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4 d-flex align-items-stretch">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="/imgs/menu/WatchRecord.png" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">View Record</h5>
                    <p class="card-text">View your record,<br>know how you learn</p>
                    <router-link :to="'/view'" class="link btn btn-primary">Go</router-link>
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
          // alert("Room ID must not be blank.\nA demo ID has been filled.")
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
