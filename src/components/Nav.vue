<template lang="">
  <div>
    
    <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand href="#">Focus<span class="text-danger">+</span></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">English</b-dropdown-item>
          <b-dropdown-item href="#" disabled>繁體中文</b-dropdown-item>
          <b-dropdown-item href="#" disabled>简体中文</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        
        <b-nav-item to='login' v-if="!isLogin()">Login</b-nav-item>
        <b-nav-item @click='logout' v-if="isLogin()">Logout</b-nav-item>
        <b-nav-item-dropdown right v-if="isLogin()">
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>{{currentUser.displayName}}</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
        

        <!-- <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->

        
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  </div>
</template>
<script>
export default {
  data(){
    return{
      currentUser: firebase.auth().currentUser,
    }
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