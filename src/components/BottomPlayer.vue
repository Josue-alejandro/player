<template>
    <div>
        <audio 
        ref="audioPlayer" 
        :volume="volume / 100" 
        @timeupdate="timeUpdate" 
        :src="songData.currentSong">
        </audio>
        <Transition name="slide-fade2">
          <EmisoraPanel 
          @left-handler="leftHandler"
          @right-handler="rightHandler"
          @select-emisora="selectEmisora"
          :emisorasShow="emisorasShow"
          :emisorasProgress="emisorasProgress"
          :emisoras="emisoras"
          :emisoraSelected="emisoraSelected"></EmisoraPanel>
        </Transition>
        <Transition name="slide-fade2">
        <div class="slider-container" v-if="volumeShow">
          <input type="range" min="0" max="100" class="slider" v-model="volume" @input="updateVolume" id="volume-slider">
        </div>
        </Transition>
        <Transition name="slide-fade">
          <div class="songs_list" v-if="listShow">
            <ul>
              <li class="song_in_the_list" v-for="cancion in canciones" :key="cancion.id">
                <div>
                  <img class="list_img" :src="cancion.imagen" :alt="cancion.nombre">
                </div>
                <div class="song_info" @click="changeSong(cancion.cancion, cancion.nombre, cancion.autor); songData.id = cancion.id">
                  <p class="grey-text small" >{{ cancion.autor }}</p>
                  <p class="" :style="{ color: cancion.id === this.songData.id ? 'red' : 'white' }">{{ cancion.nombre }}</p>
                  <p class="grey-text tiny">{{ cancion.tiempo }}</p>
                </div>
              </li>
            </ul>
          </div>
        </Transition>
        <div class="player_bar" v-if="minimizedState === true && mobileMode === false">
            <div class="play_button" @click="playHandle">
              <Transition name="slide-fade2">
                <i class="material-icons play_icon" v-if="!isPlaying && isLoading === false">play_arrow</i>
                <i class="material-icons play_icon" v-else-if="isPlaying && isLoading === false">pause</i>
                <SpinIcon v-else></SpinIcon>
              </Transition>
            </div>
            <div class="song_name">
                <span class="radio_text">
                  IRADIODEMO
                </span>
                <span >
                    {{ songData.currentAuthor }} - {{ songData.currentSongName }}
                </span>
            </div>
            <div class="icons_div">
                <i class="material-icons icons_m" @click="previousSong()">skip_previous</i>
            </div>
            <div class="icons_div">
                <i class="material-icons icons_m" @click="nextSong()">skip_next</i>
            </div>
            <div class="icons_div side_border" @click="emisorasShow = !emisorasShow">
                <i class="material-icons icons_m">radio</i>
            </div>
            <div class="song_duration">
                <span>{{ formattedDuration }}</span>
            </div>
            <div class="progress_bar">
              <input v-model="currentTime" type="range" id="progress-bar" min="0" :max="duration" @input="updateCurrentTime" />
            </div>
            <div class="icons_div">
                <i class="material-icons icons_m" @click="listShow = !listShow">playlist_play</i>
            </div>
            <div class="icons_div">
                <i class="material-icons icons_m" @click="volumeShow = !volumeShow">volume_up</i>
            </div>
            <div class="icons_div">
                <i class="material-icons icons_m" @click="minimizedState = false; listShow = false; volumeShow = false">open_in_new</i>
            </div>
        </div>
        <Transition name="mini">
        <MobilePlayer
        v-if="minimizedState === false"
        class="mobile_bar" 
        :mobileMode="mobileMode"
        :canciones="canciones" 
        :songData="songData" 
        :duration="duration"
        :formattedDuration="formattedDuration"
        :isPlaying="isPlaying"
        :barTime="currentTime"
        :volumen="volume"
        :emisorasShow="emisorasShow"
        :emisorasProgress="emisorasProgress"
        :emisoras="emisoras"
        :emisoraSelected="emisoraSelected"
        @update-volumen="updateMobileVolume"
        :updatebar="updateCurrentTime"
        @active-song="changeSongMobile"
        @play-song="playHandle"
        @next-song="nextSong()"
        @previous-song="previousSong()"
        @left-handler="leftHandler"
        @right-handler="rightHandler"
        @emisora-on="emisorasShow = true"
        @select-emisora="selectEmisora"
        @un-minimized="unMinimized"
        ></MobilePlayer>
        </Transition>
    </div>
</template>

<script>
import InMyBlood from '../songs/son1.mp3';
import theSearch from '../songs/son2.mp3';
import Lost from '../songs/son3.mp3';
import EmisoraPanel from './EmisoraPanel.vue';
import SpinIcon from './SpinIcon.vue'


function formatDuration(durationInSeconds) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

import MobilePlayer from './MobilePlayer.vue';

export default {
  data() {
    return {
      mobileMode: false,
      minimizedState: true,
      isPlaying: false,
      isLoading: false,
      volume: 50,
      duration: 100,
      currentTime: 50,
      progressInterval: null,
      formattedDuration: '00:00',
      listShow: false,
      volumeShow: false,
      emisoraSelected: null,
      emisorasProgress: 0,
      emisorasShow: false,
      emisoras:[{
        image:'https://upload.wikimedia.org/wikipedia/en/2/20/Dua_Lipa_%28album%29.png',
        selectId: 1
      },
      {
        image:'https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png',
        selectId: 2
      },
      {
        image:'https://images.genius.com/335f5ba66a18c452f5f3fccf44021fac.1000x1000x1.jpg',
        selectId: 3
      },
      {
        image:'https://www.thebackstage.net/wp-content/uploads/2013/03/bringmethehorizon_s.jpg',
        selectId: 4
      },
      {
        image:'https://upload.wikimedia.org/wikipedia/en/2/20/Dua_Lipa_%28album%29.png',
        selectId: 5
      },
      {
        image:'https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png',
        selectId: 6
      },
      {
        image:'https://images.genius.com/335f5ba66a18c452f5f3fccf44021fac.1000x1000x1.jpg',
        selectId: 7
      },
      {
        image:'https://www.thebackstage.net/wp-content/uploads/2013/03/bringmethehorizon_s.jpg',
        selectId: 8
      }
      ],
      songData: {
        currentSong: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        currentAuthor: 'Kalimba',
        currentSongName: 'Kalimba',
        imagen: '',
        id: null
      },
      canciones: [
        {
          id: 1,
          nombre: 'In My Blood',
          autor: 'Shawn Mendes',
          tiempo: '3:45',
          cancion: InMyBlood,
          imagen: 'https://i1.sndcdn.com/artworks-000331552113-31yptw-t500x500.jpg'
        },
        {
          id: 3,
          nombre: 'NF',
          autor: 'The Search',
          tiempo: '4:12',
          cancion: theSearch,
          imagen: 'https://upload.wikimedia.org/wikipedia/en/1/1b/NF_-_The_Search.png'
        },
        {
          id: 4,
          nombre: 'LosT',
          autor: 'Bring Me the Horizon',
          tiempo: '4:12',
          cancion: Lost,
          imagen: 'https://i.scdn.co/image/ab67616d0000b273068b7b754072969555a095f5'
        },
        {
          id: 5,
          nombre: 'FM Vos 95.5',
          autor: 'Autor 5',
          tiempo: '4:12',
          cancion: 'https://cdn.instream.audio/:9081/stream',
          imagen: 'https://panel.instream.audio/storage.io/object/system-3H2Tx4521355422C30B3FF4A94ADF202A1186/logo-urbana.jpg'
        },
        {
          id: 6,
          nombre: 'Villareal',
          autor: 'Autor 6',
          tiempo: '4:12',
          cancion: 'https://cdn.instream.audio/:9060/stream',
          imagen: 'https://panel.instream.audio/storage.io/object/system-3H2Tx4521355422C30B3FF4A94ADF202A1186/logo-urbana.jpg'
        },
        {
          id: 7,
          nombre: 'Radio Vision',
          autor: 'Autor 7',
          tiempo: '4:12',
          cancion: 'https://cdn.instream.audio/:9061/stream',
          imagen: 'https://panel.instream.audio/storage.io/object/system-3H2Tx4521355422C30B3FF4A94ADF202A1186/logo-urbana.jpg'

        },
        {
          id: 8,
          nombre: 'FM del Lago',
          autor: 'Autor 8',
          tiempo: '4:12',
          cancion: 'https://cdn.instream.audio/:9180/stream',
          imagen: 'https://panel.instream.audio/storage.io/object/system-3H2Tx4521355422C30B3FF4A94ADF202A1186/logo-urbana.jpg'
        },
        {
          id: 9,
          nombre: 'FM la Rocka',
          autor: 'Autor 8',
          tiempo: '4:12',
          cancion: 'https://cdn.instream.audio/:8137/stream',
          imagen: 'https://i1.sndcdn.com/artworks-000037594427-ztal2r-t500x500.jpg'
        },
        // Agrega más objetos de canciones según sea necesario
      ]
    };
  },
  components:{
    MobilePlayer,
    EmisoraPanel,
    SpinIcon
  },
  methods: {
    rightHandler(){
      if(this.emisorasProgress > -100){
        this.emisorasProgress = this.emisorasProgress - 30
      }
    },
    leftHandler(){
      if(this.emisorasProgress  < 0){
        this.emisorasProgress = this.emisorasProgress + 30
      }
    },
    playHandle() {
      const audio = this.$refs.audioPlayer;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    changeSongMobile(data){
      this.changeSong(data.cancion, data.nombre, data.autor); 
      this.songData.id = data.id,
      this.songData.imagen = data.imagen
    },
    updateVolume() {
      const audio = this.$refs.audioPlayer;
      audio.volume = this.volume / 100;
    },
    updateMobileVolume(volumen){
      this.volume = volumen
      this.updateVolume();
      console.log(this.volume)
    },
    updateProgress() {
      const audio = this.$refs.audioPlayer;
      this.currentTime = audio.currentTime;
    },
    updateCurrentTime(event) {
      const audio = this.$refs.audioPlayer;
      this.currentTime = parseFloat(event.target.value);
      audio.currentTime = this.currentTime;
    },
    timeUpdate(event){
      const audio = event.target;
      const totalSeconds = Math.round(audio.currentTime);
      this.duration = audio.duration
      this.formattedDuration = formatDuration(totalSeconds);
    },
    changeSong(song, name, author, imagen) { 
      this.isLoading = true
      this.songData.currentAuthor = author;
      this.songData.currentSongName = name;
      this.songData.imagen = imagen;
      const audio = this.$refs.audioPlayer;
      audio.pause();
      audio.currentTime = 0;
      this.songData.currentSong = song;
      audio.addEventListener('loadedmetadata', () => {
        audio.play(); // Reproducir la nueva canción automáticamente una vez cargada
        this.isPlaying = true;
        this.isLoading = false;
      });
    },
    nextSong(){
      const currentIndex = this.canciones.findIndex(cancion => cancion.id === this.songData.id);
      const siguienteIndex = currentIndex + 1;
      
      if (siguienteIndex < this.canciones.length) {
        const siguienteCancion = this.canciones[siguienteIndex];
        console.log(siguienteCancion)
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
        this.songData.id = siguienteCancion.id
        // Aquí puedes hacer lo que necesites con el objeto de la siguiente canción
      } else {
        // Si no hay siguiente canción, puedes hacer alguna otra acción, como volver al inicio del array
        // Por ejemplo, puedes acceder a la primera canción así:
        const siguienteCancion = this.canciones[0];
        console.log(siguienteCancion)
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
      }
    },
    previousSong(){
      const currentIndex = this.canciones.findIndex(cancion => cancion.id === this.songData.id);
      const siguienteIndex = currentIndex - 1;
      
      if (siguienteIndex < this.canciones.length) {
        const siguienteCancion = this.canciones[siguienteIndex];
        console.log(siguienteCancion)
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
        this.songData.id = siguienteCancion.id
        // Aquí puedes hacer lo que necesites con el objeto de la siguiente canción
      } else {
        // Si no hay siguiente canción, puedes hacer alguna otra acción, como volver al inicio del array
        // Por ejemplo, puedes acceder a la primera canción así:
        const siguienteCancion = this.canciones[0];
        console.log(siguienteCancion)
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
      }
    },
    unMinimized(){
      this.minimizedState = true
    },
    selectEmisora(id){
      this.emisoraSelected = id
    }
  },
  async mounted() {
    if(window.screen.width < 750){
      this.mobileMode = true
      this.minimizedState = false
    }

    this.songData.currentSong = this.canciones[0].cancion
    this.songData.imagen = this.canciones[0].imagen
    this.songData.id = this.canciones[0].id
    this.songData.currentAuthor = this.canciones[0].autor
    this.songData.currentSongName = this.canciones[0].nombre
    const audio = this.$refs.audioPlayer;

    audio.addEventListener('loadedmetadata', () => {
      const totalSeconds = Math.round(audio.duration);
      this.formattedDuration = formatDuration(totalSeconds);
    });
    this.progressInterval = setInterval(this.updateProgress, 1000); // Actualizar cada segundo
  },
  beforeUnmount() {
    clearInterval(this.progressInterval);
  }
}
</script>

<style scoped>
.player_bar{
    background-color: black;
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.play_button {
    color: white;
    font-size: 17px;
    width: 70px;
    border-right: 1px solid rgba(100, 100, 100, 0.3);
    display: flex;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;
}

.side_border{
  border-right: 1px solid rgba(100, 100, 100, 0.3);
}

.icons_div {
    color: white;
    width: 27px;
    padding-top: 0.5em;
}

.icons_m{
  font-size: 17px;
  cursor: pointer
}

.radio_text {
  color: red;
  font-weight: bold-;
}

.play_icon {
  font-size: 40px;
}

.song_name {
    color: rgba(200, 200, 200, 0.6);
    width: 200px;
    align-items: center;
    font-size: 12px;
    padding: 0px 20px 0px 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    overflow: hidden;
}

.song_duration{
    font-size: 12px;
    color: rgba(200, 200, 200, 0.6);
}

.red_square{
    margin-left: 20px;
    width: 70px;
    background-color: red;
}

.progress_bar {
    width: 40%;
    padding: 0px 0px 0px 10px;
}

.volumen_container {
  background-color: black;
  padding: 1em;
   /* Posiciona el control deslizante en el centro vertical del contenedor */
   position: absolute;
  top: 0;
  left: 50%;
  width: 20px;
  height: 500px;
  transform: rotate('90deg');
}

.list_img {
  width: 50px;
  border-radius: 5px;
}

.songs_list{
  background-color: black;
  border-radius: 10px;
  color: white;
  width: 270px;
  height: 300px;
  padding: 1em;
  font-size: 12px;
  overflow-x: scroll;
  position: fixed;
  bottom: 70px;
  right: 100px;
}

.song_info{
  margin-left: 20px;
  text-align: left;
}

.song_in_the_list {
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin-bottom: 10px;
  cursor: pointer;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  background-color: #fff;
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  background-color: #fff;
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
  background-color: #fff;
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
  background-color: #fff;
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
  background-color: #ffbb00;
}

input[type="range"]::-moz-range-progress {
  background-color: #ffbb00;
}

input[type="range"]::-webkit-progress-value {
  background-color: #ffbb00;
}

input[type="range"]::-ms-fill-upper {
  background-color: #fff;
}

@media (max-width: 767px) {
  .volume-slider {
    display: none;
  }

  body{
    background-image: url('https://images.unsplash.com/photo-1576249435502-2ee2b5064a63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&w=1000&q=80https://i0.hippopx.com/photos/144/586/492/people-crowd-party-spectators-preview.jpg');
  }

  .songs_list{
    width: 100%;
  }
}

@media (min-width: 770px) {
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

.slide-fade2-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade2-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade2-enter-from,
.slide-fade2-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

.slider-container {
  height: 20px;
  background-color: black;
  border-radius: 4px;
  padding: 0.5em;
  display: flex;
  position: fixed;
  bottom: 134px;
  right: 0px;
  align-items: center;
  transform: rotate(270deg);
  width: 150px;
}

.slider {
  width: 10px;
  height: 100%;
  appearance: none;
  background-color: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #888;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background-color: #888;
  cursor: pointer;
}

.emisoraImg {
  transition: transform 0.2s;
}


.mini-enter-active
 {
  animation: bounce-in 0.5s

}

.mini-leave-to {
  transition: opacity 0.5s, transform 0.5s ease;
  opacity: 0;
  transform: translateY(100vh);
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(100vh);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-back {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>