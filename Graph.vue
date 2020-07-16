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
        const vm = this // javascriptはthisが文脈によって変わるので確実にvueオブジェクトを指すために代入しておく

        vm.songs.forEach((records, index) => { 
          let newSong = vm.songs[index]
          if (records.key === song.key) { 
            newSong = song 
          }

          // vueの$setで変更されたので再描画必要なことをVueに伝える
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

.tit {
  font-size: 2.5rem;
  font-weight: bold;
}

.table {
  font-size: 2rem;
  font-weight: normal;
}

.graph {
  height: 90%;
  width: 83%;
}

.g {
  margin: 5px auto;
  display: flex;
  max-width: 1440px;
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
  width: 17%;
  height: 80vh;
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
.message-body input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgb(156, 156, 156);
  height: 5vh;
  padding-left: 2px;
  padding-right: 2px;
}
.card {
  width: 100%;
  height: 75vh;
  margin: auto;
  border: none;
}
.card-body {
  max-height: 70vh;
  overflow-x: scroll;
}

.btn {
  margin-top: 1px;
  margin-left: 69%;
}
.dod {
  padding: 1.25rem;
  width: 100%;
}

@media screen and (max-width: 1050px) {
  .g {
    display: block;
  }
  .graph {
    width: 100%;
  }
  .message-body {
    width: 50%;
    margin-left: 0%;
  }
  .dod {

  }
}

@media screen and (max-width: 380px) {
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
    margin-bottom: 20px;
    font-size: 0.4rem;
  }
  .message-body {
    width: 100%;
    height: 504px;
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
    width: 300px;
  }
  .border {
    height: 27px;
  }
  .btn {
    height: 20px;
    margin: 0 auto 7px;
  }
  .message {
    font-size: 11px;
  }
  .dod {
    height: 100px;
  }
}
</style>
