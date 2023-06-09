<template>
  <div class="player" :style="{
    background: minimized === false ? 'black' : 'rgba(0,0,0,0)',
    height: minimized === true ? '15vh' : '100vh'
  }">
    <div class="minimized" 
    :style="{ 'background': 'linear-gradient(rgba(10,10,10,0.5), rgba(10,10,10,0.5)), url(' + songData.imagen + ')'}" 
    v-if="minimized">
      <div class="" @click="minimized = false">
        <i class="material-icons icons_m">open_in_new</i>
      </div>
      <div class="info_top">
        <img :src="songData.imagen" style="border-radius: 6px;" width="70" height="70" />
        <div class="title">
          <p>EN VIVO</p>
          <span style="font-size: 16px; font-weight: bold;">{{ songData.currentAuthor }}</span>
          <span>{{ songData.currentSongName }}</span>
        </div>
        <div class="play_button" @click="$emit('playSong')">
          <i class="material-icons play_icon" v-if="!isPlaying">play_arrow</i>
          <i class="material-icons play_icon" v-else>pause</i>
        </div>
      </div>
    </div>
    <Transition name="mini">
      <div v-if="minimized === false">
        <Transition name="fade-up">
          <div class="fixed-container" v-if="volumenUp">
            <i class="material-icons icons_m">volume_up</i>
            <input type="range" :value="volumen" @input="$emit('update-volumen', $event.target.value)" class="slider" />
          </div>
        </Transition>
        <div>
          <div class="top_bar">
            <div class="icons_top" @click="minizeWindow">
              <i class="material-icons icons_m">open_in_new</i>
            </div>
            <div class="icons_top" @click="playlistActive = !playlistActive">
              <i class="material-icons icons_m">playlist_play</i>\
            </div>
          </div>
          <div class="cover">
            <img :src="songData.imagen" class="cover" width="300" ref="image" @load="playAnimation">
            <span class="brand">IRADIODEMO</span>
            <span class="down_brand">Radio en HD, 24 horas en VIVO</span>
          </div>
          <div>
            <div class="song_duration">
              <span>{{ formattedDuration }}</span>
              <input :value="barTime" type="range" class="progress_bar" id="progress-bar" min="0" :max="duration" />
            </div>
          </div>
        </div>
        <div class="emisora">
          <EmisoraPanel 
          @left-handler="$emit('left-handler')"
          @right-handler="$emit('right-handler')"
          @select-emisora="selectEmisora"
          :emisorasShow="emisorasShow"
          :emisorasProgress="emisorasProgress"
          :emisoras="emisoras"
          :emisoraSelected="emisoraSelected"></EmisoraPanel>
        </div>
        <div class="player_bar">
          <div class="icons_div" @click="volumenUp = !volumenUp">
            <i class="material-icons icons_m">volume_up</i>
          </div>
          <div class="controllers_div">
            <div class="icons_div">
              <i class="material-icons icons_m" @click="$emit('previous-song')">skip_previous</i>
            </div>
            <div class="play_button" @click="$emit('playSong')">
              <i class="material-icons play_icon" v-if="!isPlaying">play_arrow</i>
              <i class="material-icons play_icon" v-else>pause</i>
            </div>
            <div class="icons_div">
              <i class="material-icons icons_m" @click="$emit('next-song')">skip_next</i>
            </div>
          </div>
          <div class="icons_div side_border">
            <i class="material-icons icons_m" @click="emisorasShow = !emisorasShow">radio</i>
          </div>
        </div>
        <div>
          <div class="songs_list" :style="{ bottom: playlistActive === true ? '0%' : '-100%' }">
            <div class="playlist_nav">
              <div style="width: 20px;" @click="playlistActive = !playlistActive">
                <i class="material-icons icons_m">close</i>
              </div>
              <div class="playlist_options">

                <div class="options" @click="optionActive = 0"
                  :style="{ borderBottom: optionActive === 0 ? '1px solid red' : '1px solid rgba(0,0,0,0)' }">
                  <div class="icons_nav">
                    <i class="material-icons icons_m">fast_rewind</i>
                  </div>
                  <p>Anteriores</p>
                </div>
                <div class="options" @click="optionActive = 1"
                  :style="{ borderBottom: optionActive === 1 ? '1px solid red' : '1px solid rgba(0,0,0,0)' }">
                  <div class="icons_nav">
                    <i class="material-icons icons_m">mic_none</i>
                  </div>
                  <p>Programacion</p>
                </div>

              </div>
            </div>
            <div class="menu" :style="{ transform: optionActive === 0 ? 'translateX(0px)' : 'translateX(-100vw)' }">
              <PlayList 
              @play-song="playSong" 
              :canciones="canciones" 
              :songData="songData"></PlayList>
              <ProgrammingList  
              :day="currentDay"
              @change-day="dayHandler"></ProgrammingList>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import PlayList from './PlayList.vue';
import ProgrammingList from './ProgrammingList.vue';
import EmisoraPanel from './EmisoraPanel.vue';
import emisora29 from '../json/29.json' 

export default {
  data() {
    return {
      playlistActive: false,
      optionActive: 0,
      localTime: 0,
      volumenUp: false,
      minimized: false,
      emisorasShow: false,
      currentDay: {},
      lun: null,
      mar: null,
      mier: null,
      jue: null,
      vie: null,
      sab: null,
      dom: null,
    }
  },
  props: {
    mobileMode: {
      required: true
    },
    canciones: {
      type: Array,
      required: true
    },
    volumen: {
      required: true
    },
    songData: {
      Type: Object,
      required: true
    },
    duration: {
      require: true
    },
    formattedDuration: {
      required: true
    },
    isPlaying: {
      required: true
    },
    barTime: {
      required: true
    },
    emisorasProgress: {
      required: true
    },
    emisoras: {
      required: true
    },
    emisoraSelected: {
      required: true
    }
  },
  components: {
    PlayList,
    ProgrammingList,
    EmisoraPanel
},
  mounted() {
    this.lun = emisora29.radio.programming[0].programs
    this.mar = emisora29.radio.programming[1].programs
    this.mier = emisora29.radio.programming[2].programs
    this.jue = emisora29.radio.programming[3].programs
    this.vie = emisora29.radio.programming[4].programs
    this.sab = emisora29.radio.programming[5].programs
    this.dom = emisora29.radio.programming[6].programs
  },
  methods: {
    playSong(cancion, nombre, autor, id, imagen) {
      const data = {
        cancion,
        nombre,
        autor,
        id,
        imagen
      }
      this.$emit('activeSong', data);
    },
    playAnimation() {
      const image = this.$refs.image;
      image.classList.remove('fade-slide'); // Elimina la clase de animación
      void image.offsetWidth; // Reinicia la animación
      image.classList.add('fade-slide'); // Agrega nuevamente la clase de animación
    },
    updateCurrentTime(event) {
      const audio = this.$refs.audioPlayer;
      this.currentTime = parseFloat(event.target.value);
      audio.currentTime = this.currentTime;
    },
    minizeWindow(){
      if(this.mobileMode === true){
        this.minimized = true
      }else{
        this.$emit('un-minimized')
      }
    },
    dayHandler(day){
      if(day == 'lun'){
        this.currentDay = this.lun
      }else if(day == 'mar'){
        this.currentDay = this.mar
      }else if(day == 'mier'){
        this.currentDay = this.mier
      }else if(day == 'jue'){
        this.currentDay = this.jue
      }else if(day == 'vie'){
        this.currentDay = this.vie
      }else if(day == 'sab'){
        this.currentDay = this.sab
      }else if(day == 'dom'){
        this.currentDay = this.dom
      }
    },
    selectEmisora(id){
      this.$emit('select-emisora', id)
    }
  },
}

</script>

<style scoped>
body {
  overflow: hidden;
}

.menu {
  display: flex;
  flex-direction: row;
  transition: 0.3s ease-in-out;
}

.options {
  cursor: pointer;
}

.info_top{
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-left: 1em;
}

.minimized {
  background-color: black;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
  background-size: cover;
}

.minimized img {
  margin-right: 10px;
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: start;
  text-align: left;
  color: white;
  width: 50%;
}

.title p {
  background-color: red;
  border-radius: 5px;
  padding: 0.2em;
  width: 60px;
  font-weight: bold;
  font-size: 10px;
  text-align: center;
  margin-bottom: 5px;
}

.songs_list {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(20, 20, 20, 0.7);
  transition: bottom 0.5s ease;
}

.cover {
  border-radius: 10px;
}

.player {
  overflow: hidden;
  height: 100vh;
  transition: background 1s, height 0.4s;
}

.close {
  width: 20px;
}

.playlist_options {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
}

.playlist_nav {
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: space-around;
  width: 100%;
  padding: 1em;
  background-color: rgb(30, 30, 30);
  justify-content: right;
  align-items: end;
}

.top_bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.icons_top {
  margin: 10px;
}

.player_bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;
  align-items: center;
  padding-bottom: 1.50em;
}

.carousel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.brand {
  color: red;
  font-weight: bold;
  margin-top: 1em;
}

.down_brand {
  color: white;
}

.progress_bar {
  max-width: 350px;
}

.song_duration {
  color: rgb(200, 200, 200);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
}

.song_duration span {
  margin-right: 10px;
}

.controllers_div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.play_button {
  border: 1px solid white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin-left: 20px;
  margin-right: 20px;
}

.play_button_top {
  border: 1px solid black;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin-left: 20px;
  margin-right: 20px;
}

.play_icon {
  font-size: 45px;

}

i {
  color: white;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background-color: rgba(200, 200, 200, 0);
  border: 0px;
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  background-color: rgba(200, 200, 200, 0);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 2px;
  background-color: rgba(200, 200, 200, 0);
}

input[type="range"]::-moz-range-thumb {
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
}

input[type="range"]::-ms-track {
  width: 100%;
  height: 2px;
  background-color: rgba(200, 200, 200, 0);
  border-color: transparent;
  color: transparent;
}

input[type="range"]::-ms-thumb {
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
}

input[type="range"]::-ms-fill-lower {
  background-color: red;
  border-radius: 20px;
  height: 6px;
}

input[type="range"]::-moz-range-progress {
  background-color: red;
  border-radius: 20px;
  height: 6px;
}

input[type="range"]::-webkit-progress-value {
  background-color: red;
  border-radius: 20px;
  height: 6px;
}

input[type="range"]::-ms-fill-upper {
  background-color: rgba(200, 200, 200, 0);
}

.fixed-container {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(20, 20, 20, 0.9);
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
}

.slider {
  width: 400px;
  height: 5px;
  background-color: #ccc;
  border-radius: 5px;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 40px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s;
}

.fade-up-enter,
.fade-up-leave-to {
  opacity: 0;
}

.fade-slide {
  animation: fadeAndSlide 0.3s ease-in-out;
}

@keyframes fadeAndSlide {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.menu-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.mini-enter-active {
  animation: bounce-in 0.5s;
}

.mini-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}</style>