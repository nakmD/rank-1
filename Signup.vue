<template>
  <div class="container">
    <div class="form login-pw-form">
      <div class="form-body">
        <p class="pa">ファン投票へようこそ<span style="color: red;">！</span></p>
        <p class="pb">好きな曲に投票しよう<span style="color: red;">！</span></p>
        <p class="pc">アカウント<span style="color: red;">登録</span></p>
        <input class="pd" type="email" placeholder="Email" v-model="email" required>
        <input class="pd" type="password" placeholder="Password" v-model="password" required>
        <button class="butt" @click="signUp">登録 !</button>
        <div class="gogle">
          <a
            @click="googleLogin"
            class="button--green">
            Googleアカウントでログイン
          </a>
        </div>
        <p class="pe">アカウントを既にお持ちの方<br>
          <router-link to="/signin" class="moji-login">ログインページ</router-link>
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
.container {
  margin: 0;
  padding: 0;
  max-width: 1500px;
  height: 100vh;
  background: center;
  background-size: cover;
  background-image: url(../../image/music-2805506_1280.jpg);
  clear: both;
}

.form {
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.form-body {
  height: 100%;
  padding: 30px;
}

.pa {
  margin-top: 30px;
  color: rgb(255,255,255);
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px #808080;
}

.pb {
  color: rgb(255,255,255);
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 1px 1px 1px #808080;
}

.pc {
  margin-top: 125px;
  color: rgb(255,255,255);
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 1px 2px 3px #808080;
}

.pd {
  width: 80%;
  border: solid 2px rgb(234,70,111);
  border-radius: 4px;
  margin: 15px 0;
  padding: 10px;
}

.butt {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5em 1em;
  text-decoration: none;
  border-radius: 3px;
  font-weight: bold;
  color: #FFF;
  background-image: linear-gradient(45deg, #B03232 0%, #b0c9ff 100%);
  transition: .4s;
  font-size: 1.3rem;
  margin-top: 10px;
}

.butt:hover {
  background-image: linear-gradient(45deg, #B03232 50%, #b0c9ff 100%);
}

.button--green {
  font-size: 1.4rem;
}

.gogle {
  display: inline-block;
  padding: 7px 0px;
  border-radius: 25px;
  text-decoration: none;
  color: #FFF;
  background-image: linear-gradient(45deg, #FFC107 0%, #ff8b5f 100%);
  transition: .4s;
  margin: 4% 0;
  width: 50%;
}

.gogle:hover {
  background-image: linear-gradient(45deg, #FFC107 0%, #f76a35 100%);
  cursor: pointer;
}

.button--green {
  font-size: 1.4rem;
}

.pe {
  font-size: 1.6rem;
  font-weight: bold;
  color: white;
}

.moji-login {
  font-size: 1.4rem;
}

@media screen and (max-height: 400px) {
  .container {
    margin: 0px auto 60px auto;
    padding-left: 15px;
    padding-right: 15px;
    clear: both;
  }

  .form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-body {
    padding: 20px;
  }

  .pa {
    margin-top: 0;
    margin-bottom: 0;
    color: rgb(255,255,255);
    font-size: 1.4rem;
    font-weight: bold;
    text-shadow: 1px 1px 1px #808080;
  }

  .pc {
    margin: 0;
    color: rgb(255,255,255);
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 1px 2px 3px #808080;
  }

  .pd {
    margin: 5px auto;
    padding: 7px;
    width: 50%;
    border: solid 1.5px rgb(234,70,111);
    border-radius: 4px;
  }

  .butt {
    display: block;
    padding: 0.5em 1em;
    text-decoration: none;
    border-radius: 3px;
    font-weight: bold;
    color: #FFF;
    background-image: linear-gradient(45deg, #B03232 0%, #b0c9ff 100%);
    transition: .4s;
    font-size: .8rem;
    margin-bottom: 5px;
    margin-right: auto;
    margin-left: auto;
  }

  .butt:hover {
    background-image: linear-gradient(45deg, #B03232 50%, #b0c9ff 100%);
  }

  .gogle {
    display: block;
    padding: 5px 18px;
    border-radius: 25px;
    text-decoration: none;
    color: #FFF;
    background-image: linear-gradient(45deg, #FFC107 0%, #ff8b5f 100%);
    transition: .4s;
    margin: 0 auto;
    width: 50%;
  }

  .gogle:hover {
    background-image: linear-gradient(45deg, #FFC107 0%, #f76a35 100%);
    cursor: pointer;
  }

  .button--green {
    font-size: .8rem;
  }

  .pe {
    margin: 0;
    font-size: .8rem;
    font-weight: bold;
    color: white;
  }

  .moji-login {
    font-size: .8rem;
  }

}

@media screen and (max-width: 480px) {
  .container {
    height: 100vh;
    margin: 0;
    padding-left: 15px;
    padding-right: 15px;
    clear: both;
  }

  .form {
    height: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .form-body {
    padding: 30px;
  }

  .pa {
    margin: 60px auto 10px auto;
    color: rgb(255,255,255);
    font-size: 2.4rem;
    font-weight: bold;
    text-shadow: 1px 1px 1px #808080;
  }

  .pb {
    margin: 0 auto;
    color: rgb(255,255,255);
    font-size: 2.4rem;
    font-weight: bold;
    text-shadow: 1px 1px 1px #808080;
  }

  .pc {
    margin-top: 150px;
    margin-bottom: 5px;
    color: rgb(255,255,255);
    font-size: 2.4rem;
    font-weight: bold;
    text-shadow: 1px 2px 3px #808080;
  }

  .pd {
    width: 70%;
    border: solid 1.5px rgb(234,70,111);
    border-radius: 4px;
    margin: 12px 0;
    padding: 10px;
  }

  .butt {
    display: block;
    padding: 0.5em 1em;
    text-decoration: none;
    border-radius: 3px;
    font-weight: bold;
    color: #FFF;
    background-image: linear-gradient(45deg, #B03232 0%, #b0c9ff 100%);
    transition: .4s;
    font-size: 1.3rem;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .butt:hover {
    background-image: linear-gradient(45deg, #B03232 50%, #b0c9ff 100%);
  }

  .gogle {
    display: inline-block;
    padding: 5px 18px;
    border-radius: 25px;
    text-decoration: none;
    color: #FFF;
    background-image: linear-gradient(45deg, #FFC107 0%, #ff8b5f 100%);
    transition: .4s;
    margin: 5% 0;
    width: 60%;
  }

  .gogle:hover {
    background-image: linear-gradient(45deg, #FFC107 0%, #f76a35 100%);
    cursor: pointer;
  }

  .button--green {
    font-size: .8rem;
  }

  .pe {
    font-size: 1.4rem;
    font-weight: bold;
    color: white;
  }

  .moji-login {
    font-size: 1.2rem;
  }

}
</style>
