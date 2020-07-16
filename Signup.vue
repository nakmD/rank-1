<template>
  <div class="al">
    <div class="dib">
      <div class="looks">
        <p class="pa">ファン投票へようこそ！</p>
        <p class="pb">
          好きな曲に投票しよう！
        </p>
      </div>
      <div class="signup">
        <p class="pc">アカウント登録</p>
        <input class="pd" type="email" placeholder="Email" v-model="email" required>
        <input class="pd" type="password" placeholder="Password" v-model="password" required>
        <button class="butt" @click="signUp">登録!</button>
        <div class="gogle">
          <a
            @click="googleLogin"
            class="button--green">
            Googleアカウントでログイン
          </a>
        </div>
        <p class="pe">アカウントを既にお持ちの方
          <router-link to="/signin">ログインページ</router-link>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Signup',
  data () {
    return {
      user: {},
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          alert('Create account: ', user.email)
          this.$router.push('/Graph')
        })
        .catch(error => {
          alert(error.message)
        })
    },
    googleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithPopup(provider)
        .then(result => {
          console.log(result.user)
          this.$router.push('/Graph')
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.al {
  background-size: cover;
  background-image: url(../../image/concert-768722_1280.jpg);
  background-color: rgba(255,255,255,0.2);
  background-blend-mode: lighten;
}

.dib {
  margin: 0 8%;
  min-height: 100vh;
  display: flex;
}

.pa {
  color: rgb(255,255,255);
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px #808080;
}

.pb {
  color: rgb(255,255,255);
  font-size: 3.5rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px #808080;
}

.pc {
  color: rgb(255,255,255);
  font-size: 2.7rem;
  font-weight: bold;
  text-shadow: 1px 2px 3px #808080;
}

.looks {
  font-size: 2.6rem;
  display: inline;
  flex: 1;
  margin: 10% 7%;
  padding-top: 10%;
}

.gogle {
  display: inline-block;
  padding: 7px 20px;
  border-radius: 25px;
  text-decoration: none;
  color: #FFF;
  background-image: linear-gradient(45deg, #FFC107 0%, #ff8b5f 100%);
  transition: .4s;
  margin: 5% 0;
}

.gogle:hover {
  background-image: linear-gradient(45deg, #FFC107 0%, #f76a35 100%);
  cursor: pointer;
}

.signup {
  font-size: 1.6rem;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding-right: 10%;
}

.pd {
  border: solid 1.5px rgb(234,70,111);
  border-radius: 4px;
}

.pe {
  font-size: 1.5rem;
  font-weight: bold;
}

input {
  margin: 10px 0;
  padding: 10px;
}

.butt {
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  border-radius: 3px;
  font-weight: bold;
  color: #FFF;
  background-image: linear-gradient(45deg, #B03232 0%, #b0c9ff 100%);
  transition: .4s;
  font-size: 1.2rem;
  margin-top: 2px;
}

.butt:hover {
  background-image: linear-gradient(45deg, #B03232 50%, #b0c9ff 100%);
}
</style>
