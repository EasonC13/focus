<template>
  <div class="login">
    <h3>FocusPlus</h3>
    <p class="text-secondary h4">Login Page</p>
    <p class="h4">
      Click the button to login by google <br>
    </p>
    <button @click="socialLogin" class="social-button">
        <img alt="Google Logo" src="https://png.monster/wp-content/uploads/2020/11/b64cc812d68e951149b3e1a21c9a49e7-12019a02.png">
    </button>
    <br>
    
    <!-- <p>建議使用您的 Google 帳號繼續，請選擇於報名實驗時填寫的 Email 即可</p> -->
    <!-- <p @click='account_password=!account_password'><u>Or Login by Account Password</u></p>
    <div v-if="account_password">
      <input type="text" v-model="email" placeholder="Email"><br>
      <input type="password" v-model="password" placeholder="Password"><br>
      <button @click="login">Login</button>
      <p>You don't have an account ? You can <router-link to="/sign-up">create one</router-link></p>
    </div> -->
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: '',
        account_password: false,
      }
    },
    methods: {
      login() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
          this.$router.replace('intro');
        }).catch((err) => {
          alert('Oops. ' + err.message)
        });
      },
      socialLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then((result) => {
          this.$router.replace('start');
          location.reload()
        }).catch((err) => {
          alert('Oops. ' + err.message)
        });
      }
    }
  }
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .login {
    margin-top: 40px;
  }
  input {
    margin: 10px 0;
    width: 20%;
    padding: 15px;
  }
  button {
    margin-top: 20px;
    width: 10%;
    cursor: pointer;
  }
  p {
    margin-top: 40px;
    font-size: 13px;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
  .social-button {
    width: 75px;
    background: white;
    padding: 10px;
    border-radius: 100%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    outline: 0;
    border: 0;
  }
  .social-button:active {
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  }
  .social-button img {
    width: 100%;
  }
</style>