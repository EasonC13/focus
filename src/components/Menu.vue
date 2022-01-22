<template>
  <div class="container mt-5">
      <div class="row">
        <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="../assets/personal_use.jpeg" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">個人使用</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <router-link :to="'/login'" class="link nav-link">前往個人使用</router-link>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="../assets/personal_use.jpeg" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">群體共學</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <div class='d-inline-block'>
                        <input style='width: 50%' class='mr-2'
                        placeholder="# 輸入教室編號"><button href="#" class="btn btn-primary">進入教室</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="../assets/personal_use.jpeg" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">查看回放</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <router-link :to="'/login'" class="link nav-link">前往回放</router-link>
                </div>
            </div>
        </div>
      </div>
    
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: 'login',
    data() {
      return {
        user: firebase.auth().currentUser,
      }
    },
    methods: {
      
    }
  }
</script>

<style scoped>
 
</style>