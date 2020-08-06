<template>
  <!-- Chat section -->
  <div class="message-body mt-3">
    <div class="card">
      <div class="card-body">
        <div
          class="pl-2 pt-1 ml-2 message-text mb-2"
          v-for="(message, index) in messages"
          :key="index"
        >
          <span class="mg-text">{{ message.username }}</span>
          <p class="message pt-1">{{ message.text }}</p>
        </div>
      </div>
    </div>
    <div class="dod">
      <input v-model="showMessage" type="text" placeholder="コメントしよう！" class="mt-3 mr-2 pl-2 pr-2" />
      <button class="btn" @click="sendMessage">送信</button>
    </div>
  </div>  <!-- message-body -->
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Kanzen',
  data () {
    return {
      showMessage: '',
      messages: []
    }
  },
  methods: {
    sendMessage () {
      const message = {
        text: this.showMessage,
        username: this.name
      }
      firebase
        .database()
        .ref('messages')
        .push(message)
      this.showMessage = ''
    },
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    }
  }
}
</script>

<style scoped>
.message-body {
  width: 18%;
    height: 98%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin-left: auto;
}
.message-text {
  min-width: 10%;
  border-radius: 4px;
}
.message {
  font-size: 14px;
  text-align: left;
}
.mg-text {
  color: rgb(0, 195, 255);
  font-weight: bolder;
}
.card {
  width: 100%;
  height: 85%;
  background-image: linear-gradient(135deg, rgb(255, 179, 38), rgb(253, 81, 81));
}
.card-body {
  max-height: 83vh;
  overflow-x: scroll;
}
.dod {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.message-body input {
  width: 76%;
  border-radius: 4px;
  border: 1px solid rgb(156, 156, 156);
  height: 3vh;
}
.btn {
  margin-top: 14px;
  margin-left: 9px;
  padding: 0;
  width: 15%;
  height: 55%;
  border: 1px solid white;
  display: inline-block;
}

@media screen and (max-width: 1050px) {
  .message-body {
    width: 50%;
    margin-left: 0%;
    height: 47%;
  }
  .card {
    height: 83%;
    margin-top: 0;
    margin-bottom: 0;
  }
  .dod {
    height: 10%;
    padding: 0 0 0 18px;
    display: flex;
    flex-wrap: wrap;
  }
  .btn {
    margin-top: 14px;
    margin-left: 9px;
    padding: 0;
    width: 10%;
    height: 50%;
    border: 1px solid white;
    display: inline-block;
  }
  .message-body input {
    width: 82%;
    border-radius: 4px;
    border: 1px solid rgb(156, 156, 156);
    height: 3vh;
  }
}

@media screen and (max-width: 450px) {
  .message-body {
    width: 100%;
    height: 448px;
    visibility: scroll;
  }
  .card {
    height: 280px;
    margin-top: -143px;
    margin-bottom: 0;
  }
  .card-body {
    height: 202px;
  }
  .message-body input {
    height: 20px;
    width: 272px;
    margin-left: 18px;
  }
  .border {
    height: 27px;
  }
  .btn {
    width: 50px;
    padding-left: 0px;
    padding-top: 1px;
    margin-top: 11px;
    background: rgb(199, 206, 245);
  }
  .message {
    font-size: 11px;
  }
  .dod {
    display: inline-flex;
    height: 50px;
    padding: 10px 0 0 0;
  }
}
</style>
