<template>
  <div>
    <div class="g">
      <div class="graph tit">
        <p class="t">Fan Vote</p>
        <table class="table">
          <transition-group name="songs" tag="tbody">
              <tr scope="row" class="col-4"
                v-for="song in sortedSongs"
                v-bind:key="song.key"
                @click="vote(song)"
              >
                <td>
                  {{ song.rank }}
                </td>
                <td>
                  {{ song.title }}
                </td>
                <td>
                  {{song.vote_count}}
                </td>
                <td>
                  <Eps :bar="getRelativeVote(song)"/>
                </td>
              </tr>
          </transition-group>
        </table>
        <button class="nel" @click="signOut">Sign out</button>
      </div>
      <!-- Chat section -->
      <div class="message-body mt-3">
        <div class="card">
          <div class="card-body">
            <div
              class="border pl-2 pt-1 ml-2 message-text mb-2"
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
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Eps from './Eps.vue'

export default {
  name: 'Graph',
  components: {
    Eps
  },
  data () {
    return {
      songs: [],
      bar: 0,
      userName: '',
      name: null,
      showMessage: '',
      messages: []
    }
  },
  created () {
    this.fetchSongsFromFirebase()
  },
  methods: {
    updateUsername () {
      this.name = this.userName
      console.log(this.userName)
      this.userName = ''
    },
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
    },
    vote: function (song) {
      firebase
        .database()
        .ref(`spoll/vote2061/${song.key}`)
        .set({
          title: song.title,
          vote_count: firebase.database.ServerValue.increment(1)
        })
    },
    fetchSongsFromFirebase () {
      const songRef = firebase.database().ref('spoll/vote2061')

      // 過去に登録したイベントハンドラを削除
      songRef.off('child_removed')
      songRef.off('child_added')

      songRef.on('child_added', (spollSnapshot) => {
        const song = spollSnapshot.val()
        song.key = spollSnapshot.key
        this.songs.push(song)
      })
      songRef.on('child_changed', (spollSnapshot) => { 
        const song = spollSnapshot.val() 

        song.key = spollSnapshot.key 

        console.log(song)
        const vm = this 

        vm.songs.forEach((records, index) => { 
          let newSong = vm.songs[index]
          if (records.key === song.key) { 
            newSong = song 
          }

          vm.$set(vm.songs, index, newSong)
        })
      })
    },
    getRelativeVote (song) {
      let vMax = 0
      for (let record of this.songs) {
        vMax = Math.max(record.vote_count, vMax)
      }
      console.log(`re-calculate-relative-vote: ${song.title} ${song.vote_count / vMax}`)
      return song.vote_count / vMax
    }
  },
  computed: {
    sortedSongs: function () {
      let songs = this.songs
      songs.sort(function (a, b) {
        return b.vote_count - a.vote_count
      })

      let currentRank = 0
      let currentVoteCount = 0
      for (let i = 0; i < songs.length; i++) {
        if (songs[i].vote_count !== currentVoteCount) {
          songs[i].rank = i + 1
          currentVoteCount = songs[i].vote_count
          currentRank = i + 1
        } else {
          songs[i].rank = currentRank
        }
      }

      return songs
    }
  },
  mounted () {
    let viewMessage = this
    const itemsRef = firebase.database().ref('messages')
    itemsRef.on('value', snapshot => {
      let data = snapshot.val()
      let messages = []
      Object.keys(data).forEach(key => {
        messages.push({
          id: key,
          username: data[key].username,
          text: data[key].text
        })
      })
      viewMessage.messages = messages
    })
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons");
.g {
  height: 100vh;
  margin: 0 auto;
  display: flex;
  max-width: 1440px;
  background-image: linear-gradient(135deg, rgb(255, 179, 38), rgb(253, 81, 81));
}

.graph {
  height: 90%;
  width: 82%;
}

.tit {
  font-size: 2.5rem;
  font-weight: bold;
}

.table {
  font-size: 2rem;
  font-weight: normal;
}

.songs-leave-active,
.songs-enter-active {
  transition: opacity .5s, transform .5s ease;
}
.songs-leave-to,
.songs-enter {
  opacity: 0;
  transform: translateX(50px);
}
.songs-leave,
.songs-enter-to {
  opacity: 1;
}
.songs-move {
  transition: transform .5s;
}

tbody {
  width: 20%;
}

.nel {
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  border-radius: 3px;
  font-weight: bold;
  color: #FFF;
  background-image: linear-gradient(45deg, #B03232 0%, #b0c9ff 100%);
  transition: .4s;
  font-size: 1.2rem;
  float: right;
  position: right;
}

.nel:hover {
  background-image: linear-gradient(45deg, #B03232 50%, #b0c9ff 100%);
}

h3 {
  font-size: 30px;
  text-align: center;
}

input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgb(156, 156, 156);
  padding-left: 2px;
  padding-right: 2px;
}

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
  .g {
    display: block;
    height: 100vh;
  }
  .graph {
    width: 100%;
    height: 50%;
  }
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

  .nel {
    height: 9%;
    width: 9%;
    font-size: 0.2rem;
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
@media screen and (max-width: 650px) {
  .nel {
    width: 13%;
  }
}
@media screen and (max-width: 500px) {
  .btn {
    width: 11%;
  }
  .nel {
    width: 13%;
  }
}
@media screen and (max-width: 450px) {
  .g {
    max-height: 812px;
  }
  .t {
    font-size: 1.2rem;
    margin-bottom: 0;
  }
  .graph {
    height: 308px;
  }
  .table {
    font-size: 1.4rem;
  }
  .nel {
    margin-right: 9px;
    margin-bottom: 20px;
    font-size: 0.4rem;
    width: 17%;
  }
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
    width: 294px;
    margin-left: 18px;
  }
  .border {
    height: 27px;
  }
  .btn {
    width: 50px;
    padding-left: 0px;
    padding-top: 6px;
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
