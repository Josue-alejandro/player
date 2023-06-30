<template>
 <div class="player" :style="{
    background: minimized === false ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 1)), url('+ songData.imagen +')' : 'rgba(0,0,0,0)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backdropFilter: minimized === false ? 'blur(10px)' : 'none',
    height: minimized === true ? '130px' : '100vh'
  }">
    <div class="minimized"
      :style="{ 'background': 'linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.8)), url(' + songData.imagen + ')' }"
      v-if="minimized">
      <div class="popUpButton" @click="openMinimizedWindow">
        <i class="material-icons icons_m popUpButton">open_in_new</i>
      </div>
      <div class="info_top">
        <img width="25" height="25" class="live_icon" src="https://seeklogo.com/images/Y/youtube-live-logo-43F98BDB4C-seeklogo.com.png">
        <img :src="songData.imagen" style="border-radius: 6px; margin-left: 5px;" width="80" height="80" />
        <div class="title">
          <p>EN VIVO</p>
          <span style="font-size: 16px; font-weight: bold;">{{ songData.currentAuthor }}</span>
          <span style="font-size: 12px;">{{ songData.currentSongName }}</span>
        </div>
        <div class="play_button" @click="$emit('playSong')">
          <Transition name="change">
            <i class="material-icons play_icon" style="position: absolute;" v-if="!isPlaying">play_arrow</i>
            <i class="material-icons play_icon" style="position: absolute;" v-else>pause</i>
          </Transition>
        </div>
      </div>
    </div>
    <Transition name="mini">
      <div 
      v-if="minimized === false" 
      @click="handleVolumeContainer">
        <Transition name="fade-up">
          <div 
          class="fixed-container" 
          v-if="volumenUp">
            <i class="material-icons icons_m">volume_up</i>
            <input type="range" :value="volumen" @input="$emit('update-volumen', $event.target.value)" class="slider" />
          </div>
        </Transition>
        <div>
          <div class="top_bar">
            <div class="icons_top popUpButton" @click="openNewWindow">
              <i class="material-icons icons_m" style="font-size: 18px;">open_in_new</i>
            </div>
            <div class="icons_top" @click="playlistActive = !playlistActive">
              <i class="material-icons icons_m" style="font-size: 23px;">playlist_play</i>
            </div>
          </div>
          <div class="cover cover_back">
            <img :src="songData.imagen" class="cover cover_image" ref="image" @load="playAnimation">
            <span class="brand">IRADIODEMO</span>
            <span class="down_brand">Radio en HD, 24 horas en VIVO</span>
          </div>
          <div>
            <div class="song_duration">
              <span style="font-size: 12px;">{{ formattedDuration }}</span>
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
            <div class="play_button" @click="$emit('playSong')" style="background-color: rgba(0, 0, 0, 0);">
              <Transition name="change">
                <i class="material-icons play_icon" style="position: absolute;" v-if=" !isPlaying && isLoading === false ">play_arrow</i>
                <i class="material-icons play_icon" style="position: absolute;" v-else-if=" isPlaying && isLoading === false ">pause</i>
                <SpinIcon v-else style="position: absolute;"></SpinIcon>
              </Transition>
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
              <div @click="playlistActive = !playlistActive">
                <i class="material-icons icons_m"
                  style="border: 1px solid white; padding: 3px; border-radius: 100%; margin-top: 10px;">close</i>
              </div>
              <div class="playlist_options">

                <div class="options" @click="optionActive = 0"
                  :style="{ borderBottom: optionActive === 0 ? '3px solid red' : '3px solid rgba(0,0,0,0)' }">
                  <div class="icons_nav">
                    <i class="material-icons icons_m">fast_rewind</i>
                  </div>
                  <p>Anteriores</p>
                </div>
                <div class="options" @click="optionActive = 1"
                  :style="{ borderBottom: optionActive === 1 ? '3px solid red' : '3px solid rgba(0,0,0,0)' }">
                  <div class="icons_nav">
                    <i class="material-icons icons_m">mic_none</i>
                  </div>
                  <p>Programacion</p>
                </div>

              </div>
            </div>
            <div class="menu" :style="{ transform: optionActive === 0 ? 'translateX(0px)' : 'translateX(-100vw)' }">
              <PlayList @play-song="playSong" :canciones="canciones" :songData="songData"></PlayList>
              <ProgrammingList 
              :day="currentDay"
              :programmingShow="programmingShow" 
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
import SpinIcon from './SpinIcon.vue';

export default {
  data() {
    return {
      playlistActive: false,
      optionActive: 0,
      localTime: 0,
      volumenUp: false,
      minimized: false,
      windowSize: 300,
      emisorasShow: false,
      programmingShow: false,
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
    isLoading:{
      required: true
    },
    playerMode:{
      required: true
    },
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
    },
    programming: {
      required: true
    }
  },
  watch:{
    programming:{
      immediate: true,
      handler(newData, oldData){
        console.log(newData),
        console.log(oldData)
        this.updateProgramming()
      }
    }
  },
  components: {
    PlayList,
    ProgrammingList,
    EmisoraPanel,
    SpinIcon
  },
  mounted() {
    if(this.playerMode == 2){
      this.minimized = true
    }
    //if (window.screen.width < 750) {
    //  this.minimized = true;
   // }

    if ( window.screen.width < 400 ){
      this.windowSize = 150
    }


  },
  computed: {
     screenHeightWithoutBrowserBar() {
      const height = window.innerHeight;
      return height.toString() + "px";
    }
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
    openNewWindow(){
      var url = "/ruta1"; // Ruta a tu componente de ventana emergente
      var opciones = "width=300,height=550,scrollbars=yes";

      // Abrir ventana emergente
      window.open(url, "_blank", opciones);
    },
    openMinimizedWindow(){
      var url = "/ruta1"; // Ruta a tu componente de ventana emergente
      var opciones = "width=300,height=550,scrollbars=yes";

      // Abrir ventana emergente
      window.open(url, "_blank", opciones);
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
    minizeWindow() {
      if (this.mobileMode === true) {
        this.minimized = true
      } else {
        this.$emit('un-minimized')
      }
    },
    dayHandler(day) {
      if (day == 'lun') {
        this.currentDay = this.lun
      } else if (day == 'mar') {
        this.currentDay = this.mar
      } else if (day == 'mier') {
        this.currentDay = this.mier
      } else if (day == 'jue') {
        this.currentDay = this.jue
      } else if (day == 'vie') {
        this.currentDay = this.vie
      } else if (day == 'sab') {
        this.currentDay = this.sab
      } else if (day == 'dom') {
        this.currentDay = this.dom
      }
    },
    selectEmisora(id) {
      this.$emit('select-emisora', id)
      this.updateProgramming()
    },
    updateProgramming() {
      const days = ['lun', 'mar', 'mier', 'jue', 'vie', 'sab', 'dom'];

      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        if (this.programming[i]) {
          this[day] = this.programming[i].programs;
        } else {
          this[day] = [];
        }
      }

      this.currentDay = this.lun;
      this.programmingShow = Boolean(this.programming[0]);
    }
  }
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

.icons_m{
  font-size: 24px;
}

@media (max-width: 400px) {
  .icons_m{
    font-size: 20px;
  }
}

.options {
  cursor: pointer;
  width: 60%;
}

.info_top {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-left: 1em;
  align-items: center;
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
  justify-content: center;
  text-align: left;
  color: white;
  width: 50%;
}

.title p {
  background-color: red;
  border-radius: 5px;
  padding: 0em;
  width: 50px;
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
  border-radius: 4px;
}

.cover_image{
  width: 300px;
}

@media (max-width: 500px) {
  .cover_image{
    width: 73%;
  }
}

@media (max-width: 300px) {

  .popUpButton{
    display: none;
  }

  .emisora{
    margin-top: 0px;
  }
}


.player {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  position: fixed;
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

.live_icon{
  border-radius: 2px;
  position: absolute;
  top: 14px;
  left: 7px;
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
  padding-bottom: 10vh;
}

@media (max-width: 300px) {
  .player_bar{
    padding-bottom: 10px;
  }
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
  font-size: 12px;
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
  padding: 12px;
}

@media (max-width: 300px) {
  .song_duration{
    padding: 0px 12px;
  }
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
  width: 65px;
  height: 65px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: black;
}

@media (max-width: 500px) {
  .play_button{
    width: 50px;
    height: 50px;
  }
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
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background-color: rgba(200, 200, 200, 0);
  border: 0;
  outline: none;
  
  overflow: hidden;
  border-radius: 16px;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 2px;
  background-color: rgba(200, 200, 200, 0);
}

input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  border: none;
  margin-top: -4px;
}

input[type="range"]::-ms-track {
  width: 100%;
  height: 2px;
  background-color: rgba(200, 200, 200, 0);
  border-color: transparent;
  color: transparent;
}

input[type="range"]::-ms-thumb {
  -ms-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background-color: rgba(255, 0, 0, 0);
  border-radius: 50%;
  border: none;
  margin-top: -4px;
}

input[type="range"]::-moz-range-progress {
  background-color: red;
  border-radius: 20px;
  height: 6px;
}

input[type="range"]::-ms-fill-lower {
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
  background-color: #030303;
  border-radius: 5px;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  background-color: rgb(255, 0, 0);
  width: 8px;
  border-radius: 50%;
  cursor: pointer;

  /*  slider progress trick  */
  box-shadow: -407px 0 0 400px rgb(255, 0, 0);
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background-color: #ec0a0a00;
  border-radius: 2px;
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
}

@keyframes showIn {
  0% {
    opacity: 1;
    transform: scale(1)
  }

  100% {
    opacity: 0;
    transform: scale(0);
  }
}

.change-enter-active {
  animation: showIn 0.2s reverse;
}

.change-leave-to {
  animation: showIn 0.2s;
}
</style>