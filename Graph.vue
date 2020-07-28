<template>
  <div>
    <div class="g">
      <div class="graph tit">
        <div class="header-logo-menu">
        <div class="logo-area t">Fan Vote</div>
        <div id="nav-drawer">
          <input id="nav-input" type="checkbox" class="nav-unshown">
          <label id="nav-open" for="nav-input"><span></span></label>
          <label class="nav-unshown" id="nav-close" for="nav-input"></label>
          <div id="nav-content">
            <ul>
              <li class="so" @click="signOut">Sign Out</li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        </div>
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
      </div>
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
        // const spollId = spollSnapshot.key;
        const song = spollSnapshot.val()
        // console.log('test');
        song.key = spollSnapshot.key
        // console.log(song);
        this.songs.push(song)
      })
      songRef.on('child_changed', (spollSnapshot) => { // 変更を監視
        const song = spollSnapshot.val() // 変更された���ブジェクト

        song.key = spollSnapshot.key // 変更されたkey

        console.log(song)
        const vm = this // javascriptはthisが文脈によって変わるので確実にvueオブジェクトを指すために代入しておく

        vm.songs.forEach((records, index) => { // vueのレンダリング実行のためには、indexが必要だったのでこの形でループ
          let newSong = vm.songs[index]
          if (records.key === song.key) { // 現在のデータのkeyと変更されたkeyを比較
            newSong = song // vote_countが更新されたデータ
          }

          // vueの$setで変更されたので再描画必要なことをVueに伝える
          vm.$set(vm.songs, index, newSong)
        })
      })
    },
    getRelativeVote (song) {
      // const voteMax = function (a, b) { return (a.vote_count > b.vote_count) ? a : b; };
      // let vMax = this.songs.reduce(voteMax).vote_count;
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

#nav-drawer {
  position: relative;
}

/*チェックボックス等は非表示に*/
.nav-unshown {
  display:none;
}

/*アイコンのスペース*/
#nav-open {
  display: inline-block;
  width: 30px;
  height: 22px;
  vertical-align: middle;
}

/*ハンバーガーの形をCSSで表現*/
#nav-open span, #nav-open span:before, #nav-open span:after {
  position: absolute;
  height: 3px;/*線の太さ*/
  width: 25px;/*長さ*/
  border-radius: 3px;
  background: #555;
  display: block;
  content: '';
  cursor: pointer;
}
#nav-open span:before {
  bottom: -10px;
}
#nav-open span:after {
  bottom: -20px;
}

/*閉じる用の薄黒箇所*/
#nav-close {
  display: none;
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0;
  transition: .3s ease-in-out;
}

/*メニューの中身*/
#nav-content {
  overflow: auto;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  width: 30%;
  max-width: 330px;/*最大幅（お好みで調整を）*/
  height: 70%;
  background: #fff;
  transition: .3s ease-in-out;
  -webkit-transform: translateX(105%);
  transform: translateX(105%);
  background-image: linear-gradient(135deg, rgb(242, 243, 253), rgb(107, 106, 136))
}

#nav-content ul {
  margin: 0;
  padding-right: 50px;
  padding-left: 50px;
  padding-bottom: 5px;
  border-bottom: 1px solid gray;
}

#nav-content ul li {
  text-align: center;
  list-style: none;
  font-size: 2rem;
  font-family: cursive;
}

.so {
  cursor: pointer;
}

/*チェックがついたら表示させる*/
#nav-input:checked ~ #nav-close {
  display: block;
  opacity: .5;
}

#nav-input:checked ~ #nav-content {
  -webkit-transform: translateX(0%);
  transform: translateX(0%);
  box-shadow: 6px 0 25px rgba(0,0,0,.15);
}

.header-logo-menu{
 display: flex;
 display: -moz-flex;
 display: -o-flex;
 display: -webkit-flex;
 display: -ms-flex;
 flex-direction: row;
 -moz-flex-direction: row;
 -o-flex-direction: row;
 -webkit-flex-direction: row;
 -ms-flex-direction: row;
}

/*ロゴやサイトタイトルをセンタリング*/
.logo-area{text-align:center;margin:auto;}

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

@media screen and (max-width: 500px) {
  .btn {
    width: 11%;
  }
}
@media screen and (max-width: 450px) {
  .g {
    overflow: hidden;
    max-height: 812px;
  }
  .t {
    font-size: 1.5rem;
    padding-top: 2px;
  }

  .header-logo-menu {
    height: 8%;
  }

  /*ハンバーガーの形をCSSで表現*/
  #nav-open span, #nav-open span:before, #nav-open span:after {
    position: absolute;
    bottom: 17px;
    height: 2px;/*線の太さ*/
    width: 18px;/*長さ*/
    border-radius: 3px;
    background: #555;
    display: block;
    content: '';
    cursor: pointer;
  }
  #nav-open span:before {
    bottom: -6px;
  }
  #nav-open span:after {
    bottom: -12px;
  }

  #nav-content {
    z-index: 100;
    width: 50%;
    height: 55%;
  }

  .graph {
    height: 308px;
  }

  #nav-drawer {
    left: 2%;
  }

  .table {
    font-size: 1.4rem;
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
