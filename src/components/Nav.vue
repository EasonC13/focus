<template lang="">
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link :to="'/'" class="navbar-brand">Focus 福課使</router-link>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link :to="'/'" class="link nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="'/model'" class="link nav-link">AI</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="'/individual'" class="link nav-link">Start Focus</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="'/'" class="link nav-link" disabled>Teacher Version (Coming Soon)</router-link>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </li> -->
        </ul>
        <ul class="navbar-nav my-2 my-lg-0">
          
          <li class="nav-item dropdown" v-if='user'>
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Hello {{user.displayName}}
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Customize (Coming Soon)</a>
              <!-- <a class="dropdown-item" href="#"></a> -->
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" @click='logout'>Logout</a>
            </div>
          </li>
          <li class="nav-item" v-else>
            <router-link :to="'/login'" class="link nav-link">Login</router-link>
          </li>
        </ul>
        <!-- <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form> -->
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  data(){
    return{
      user: firebase.auth().currentUser,
    }
  },
  mounted(){
    let user = this.user
    console.log({user})
  },
  methods:{
    logout(){
      firebase.auth().signOut()
      location.reload()
    },
    isLogin(){
      return !!firebase.auth().currentUser
    }
  }
}
</script>
<style lang="">
    
</style>