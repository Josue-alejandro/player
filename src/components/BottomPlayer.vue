<template>
  <div>
    <audio ref="audioPlayer" :volume="volume / 100" @timeupdate="timeUpdate" :src="songData.currentSong">
    </audio>
    <Transition name="slide-fade2">
      <EmisoraDesktop @left-handler="leftHandler" @right-handler="rightHandler" @select-emisora="selectEmisora"
        :emisorasShow="emisorasShow" :emisorasProgress="emisorasProgress" :emisoras="emisoras"
        :emisoraSelected="emisoraSelected"></EmisoraDesktop>
    </Transition>
    <Transition name="slide-fade">
      <i class="material-icons" v-if="emisorasShow" style="position: fixed; font-size: 50px; color: #000; bottom: 61px; left: 484px;">arrow_drop_down</i>
    </Transition>
    <Transition name="slide-fade2">
      <div class="slider-container" v-if="volumeShow">
        <input type="range" min="0" max="100" v-model="volume" @input="updateVolume">
      </div>
    </Transition>
    <Transition name="slide-fade">
      <div class="songs_list" v-if="listShow">
        <ul>
          <li class="song_in_the_list" v-for="cancion in canciones" :key="cancion.id">
            <div>
              <img class="list_img" :src="cancion.imagen" :alt="cancion.nombre">
            </div>
            <div class="song_info"
              @click="changeSong(cancion.cancion, cancion.nombre, cancion.autor); songData.id = cancion.id">
              <p class="grey-text small">{{ cancion.autor }}</p>
              <p class="" :style=" { color: cancion.id === this.songData.id ? 'red' : 'white' } ">{{ cancion.nombre }}</p>
              <p class="grey-text tiny">{{ cancion.tiempo }}</p>
            </div>
          </li>
        </ul>
      </div>
    </Transition>
    <Transition name="slide-fade">
      <i class="material-icons" v-if="listShow" style="position: fixed; font-size: 50px; color: #000; bottom: 61px; right: 100px;">arrow_drop_down</i>
    </Transition>
    <div class="player_bar" v-if=" minimizedState === true && mobileMode === false ">
      <div class="play_button" @click=" playHandle ">
        <Transition name="change">
          <i class="material-icons play_icon" v-if=" !isPlaying && isLoading === false ">play_arrow</i>
          <i class="material-icons play_icon" v-else-if=" isPlaying && isLoading === false ">pause</i>
          <SpinIcon v-else></SpinIcon>
        </Transition>
      </div>
      <div class="song_name">
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
          <span class="radio_text">
            IRADIODEMO
          </span>
          <span style="color: white; background-color: red; border-radius: 5px; font-size: 9px; padding: 0px 4px; margin-left: 3px;">
            EN VIVO
          </span>
        </div>
        <span style="width: 500px; text-align: left;" class="nameMotion">
          {{ songData.currentAuthor }} - {{ songData.currentSongName }}
        </span>
      </div>
      <div class="widgets_section">
        <div style="height: 70px;" class="desktop_widget">
          <img :src="songData.imagen" width="70">
        </div>
        <div class="icons_div desktop_widget" >
          <i class="material-icons icons_m" @click=" previousEmisora()">skip_previous</i>
        </div>
        <div class="icons_div desktop_widget">
          <i class="material-icons icons_m" @click=" nextEmisora()">skip_next</i>
        </div>
        <div class="icons_div side_border" @click=" emisorasShow = !emisorasShow; listShow = false">
          <i class="material-icons icons_m">radio</i>
        </div>
        <div class="song_duration desktop_widget">
          <span>{{ formattedDuration }}</span>
        </div>
        <div class="progress_bar desktop_widget">
          <input v-model="currentTime" type="range" id="progress-bar" min="0" :max="duration"
            @input="updateCurrentTime" />
        </div>
        <div class="icons_div playlist_div">
          <i class="material-icons icons_m playlist_button" @click=" listShow = !listShow; emisorasShow = false">playlist_play</i>
        </div>
        <div class="icons_div desktop_widget">
          <i class="material-icons icons_m" @click=" volumeShow = !volumeShow">volume_up</i>
        </div>
        <div class="icons_div openNew_div">
          <i class="material-icons icons_m"
            @click="openNewWindow">open_in_new</i>
        </div>
      </div>
    </div>
    <!-- Componente de modo vertical -->
      <MobilePlayer 
      v-if=" minimizedState === false " 
      class="mobile_bar" 
      :playerMode="playerMode"
      :mobileMode=" mobileMode "
      :programming=" programming "
      :canciones=" canciones " 
      :songData=" songData " 
      :duration=" duration " 
      :formattedDuration=" formattedDuration "
      :isPlaying=" isPlaying " 
      :isLoading=" isLoading "
      :barTime=" currentTime " 
      :volumen=" volume " 
      :emisorasShow=" emisorasShow "
      :emisorasProgress=" emisorasProgress " 
      :emisoras=" emisoras " 
      :emisoraSelected=" emisoraSelected "
      @update-volumen=" updateMobileVolume " 
      :updatebar=" updateCurrentTime " 
      @active-song=" changeSongMobile "
      @play-song=" playHandle " 
      @next-song=" nextEmisora() " 
      @previous-song=" previousEmisora() "
      @left-handler=" leftHandler " 
      @right-handler=" rightHandler " 
      @emisora-on=" emisorasShow = true "
      @select-emisora=" selectEmisora " 
      @un-minimized=" unMinimized "></MobilePlayer>
  </div>
</template>

<script>
import InMyBlood from '../songs/son1.mp3';
import EmisoraDesktop from './EmisoraDesktop.vue';
import SpinIcon from './SpinIcon.vue'
import DefaultImage from '../../public/default.jpeg'
import File11 from '../json/11.json'
import File36 from '../json/36.json'
import File13 from '../json/13.json'
import File15 from '../json/15.json'




function formatDuration(durationInSeconds) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

// const obtenerDatos = async (parametro) => {
//    try {
//      const response = await fetch('http://localhost:3000/datos/' + parametro);
//      if (response.ok) {
//        const datosObtenidos = await response.json();
//        return datosObtenidos;
//      } else {
//        throw new Error('Error al obtener los datos.');
//      }
//    } catch (error) {
//      console.error(error);
//      throw error;
//    }
//  };


import MobilePlayer from './MobilePlayer.vue';

export default {
  props: ['playerMode'],
  data() {
    return {
      mode: 1,
      mobileMode: false,
      minimizedState: true,
      isPlaying: false,
      isLoading: false,
      currentEmisoraId: 0,
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
      emisoras: [],
      programming: [],
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
      ]
    };
  },
  components: {
    MobilePlayer,
    EmisoraDesktop,
    SpinIcon
  },
  methods: {
    rightHandler() {
      if (this.emisorasProgress > -90) {
        this.emisorasProgress = this.emisorasProgress - 10
      }
    },
    leftHandler() {
      if (this.emisorasProgress < 0) {
        this.emisorasProgress = this.emisorasProgress + 10
      }
    },
    playHandle() {
      const audio = this.$refs.audioPlayer;

      if (this.isPlaying) {
        audio.pause();
        this.isPlaying = false;
      } else {
        this.isLoading = true; // Activar la carga
        audio.play();
        this.isPlaying = true;
        setTimeout(() => {
          this.isLoading = false; // Desactivar la carga después de medio segundo
        }, 500);
      }
    },
    changeSongMobile(data) {
      this.changeSong(data.cancion, data.nombre, data.autor);
      this.songData.id = data.id,
        this.songData.imagen = data.imagen
    },
    updateVolume() {
      const audio = this.$refs.audioPlayer;
      audio.volume = this.volume / 100;
    },
    updateMobileVolume(volumen) {
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
    timeUpdate(event) {
      const audio = event.target;
      const totalSeconds = Math.round(audio.currentTime);
      this.duration = audio.duration
      this.formattedDuration = formatDuration(totalSeconds);
    },
    changeSong(song, name, author, imagen) {
      this.isLoading = true;
      this.songData.currentAuthor = author;
      this.songData.currentSongName = name;
      this.songData.imagen = imagen;
      const audio = this.$refs.audioPlayer;
      audio.pause();
      audio.currentTime = 0;
      this.songData.currentSong = song;

      const playNewSong = () => {
        audio.play(); // Reproducir la nueva canción automáticamente una vez cargada
        this.isPlaying = true;
        this.isLoading = false;
        audio.removeEventListener('canplaythrough', playNewSong); // Eliminar el controlador de eventos después de que se haya reproducido
      };

      if (audio.readyState >= 2) {
        // Si el archivo de audio ya está cargado
        setTimeout(() => {
          playNewSong();
        }, 1000); // Mostrar un segundo de carga antes de reproducir
      } else {
        audio.addEventListener('canplaythrough', playNewSong);
      }
    },
    openNewWindow(){
      var url = "/ruta1"; // Ruta a tu componente de ventana emergente
      var opciones = "width=300,height=550,scrollbars=yes";

      // Abrir ventana emergente
      window.open(url, "_blank", opciones);
    },
    nextSong() {
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
    previousSong() {
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
    unMinimized() {
      this.minimizedState = true
    },
    previousEmisora(){
      const siguienteIndex = this.currentEmisoraId - 1
      if(siguienteIndex >= 0) {
        const idEmisora = this.emisoras[siguienteIndex].selectId
        this.selectEmisora(idEmisora)
      }else{
        const idEmisora = this.emisoras[this.emisoras.length - 1].selectId
        this.selectEmisora(idEmisora)
      }

    },
    nextEmisora(){
      const siguienteIndex = this.currentEmisoraId + 1
      if(this.emisoras.length > siguienteIndex) {
        const idEmisora = this.emisoras[siguienteIndex].selectId
        this.selectEmisora(idEmisora)
      }else{
        const idEmisora = this.emisoras[0].selectId
        this.selectEmisora(idEmisora)
      }

    },
    selectEmisora(id) {
      this.emisoraSelected = id
      //buscar emisora seleccionada
      const emisoraEncontrada = this.emisoras.find(val => val.selectId == id)
      const indiceEmisora = this.emisoras.findIndex(val => val.selectId == id)
      this.canciones = []
      this.programming = emisoraEncontrada.programming
      this.currentEmisoraId = indiceEmisora
      emisoraEncontrada.audio.forEach((val, index) => {
        this.canciones.push({
          id: index,
          nombre: emisoraEncontrada.song_name,
          autor: emisoraEncontrada.artist_name,
          cancion: val.url,
          imagen: emisoraEncontrada.image
        })
      });
      console.log(this.currentEmisoraId)
      this.changeSong(this.canciones[0].cancion, this.canciones[0].nombre, this.canciones[0].autor, this.canciones[0].imagen)
    }
  },
  async mounted() {
    this.mode = this.playerMode > 0 ? 1 : 0
    this.minimizedState = this.mode === 1 ? false : true

     const obtenerDatosLoop = async () => {
       let respuestas = 0;
       let nulos = 0;

       const radios = [
        File11,
        File36,
        File13,
        File15
       ]

       for (let parametro = 0; parametro <= 4; parametro++) {
         try {
           //const datosObtenidos = await obtenerDatos(parametro);
           const datosObtenidos = radios[parametro]
           console.log(datosObtenidos)
           if (datosObtenidos) {
             if (datosObtenidos.radio.logo == "") {
               const emisora = {
                 image: DefaultImage,
                 selectId: datosObtenidos.id,
                 audio: datosObtenidos.radio.audio,
                 artist_name: datosObtenidos.radio.name,
                 song_name: datosObtenidos.cid,
                 programming: datosObtenidos.radio.programming
               }
               this.emisoras.push(emisora)
             } else {
               const emisora = {
                 image: datosObtenidos.radio.logo,
                 selectId: datosObtenidos.id,
                 audio: datosObtenidos.radio.audio,
                 artist_name: datosObtenidos.radio.defaults.artist_name,
                 song_name: datosObtenidos.radio.defaults.song_name,
                 programming: datosObtenidos.radio.programming
               }
               this.emisoras.push(emisora)
             }
             respuestas++
           } else {
             nulos++
           }
         } catch (error) {
           nulos++;
         }
       }

       console.log(`Total de respuestas positivas: ${respuestas}`);
       console.log(`Total de respuestas nulas: ${nulos}`);
       console.log(this.emisoras)
     }

     obtenerDatosLoop();


    this.songData.currentSong = this.canciones[0].cancion
    this.songData.imagen = this.canciones[0].imagen
    this.songData.id = this.canciones[0].id
    this.songData.currentAuthor = this.canciones[0].autor
    this.songData.currentSongName = this.canciones[0].nombre
    const audio = this.$refs.audioPlayer;

    this.nextEmisora()


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
.player_bar {
  background-color: black;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.widgets_section{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  min-width: 900px;
}

@media (min-width: 1300px) {
  .widgets_section{
    min-width: 1600px;
  }
}

@media (max-width: 1070px) {
  .widgets_section{
    min-width: 720px;
  }
}

@media (max-width: 930px) {
  .desktop_widget{
    display: none;
  }

  .widgets_section{
    min-width: 100px;
  }
  
  .mobile_widget{
    display: block;
  }

  .song_name{
    width: 400px;
  }
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

.side_border {
  border-right: 1px solid rgba(100, 100, 100, 0.3);
}

.icons_div {
  color: white;
  width: 27px;
  padding-top: 0.5em;
}

.icons_m {
  font-size: 19px;
  cursor: pointer
}

.radio_text {
  color: red;
  font-weight: bold;
  margin-top: 3px;
}

.play_icon {
  font-size: 40px;
  position: absolute;
  top: 15px;
  transition: color 0.2s;
}

.play_icon:hover{
  color: rgb(252, 32, 32)
}

.song_name {
  color: rgba(200, 200, 200, 0.6);
  width: 200px;
  align-items: center;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: start;
  overflow: hidden;
}

.nameMotion{
  animation: read-text 15s infinite;
}

@keyframes read-text {
  0%{
    transform: translateX(0%);
  }

  50%{
    transform: translateX(-70%);
  }

  50.001%{
    transform: translateX(70%);
  }

  100%{
    transform: translateX(0%)
  }
}

.song_duration {
  font-size: 12px;
  color: rgba(200, 200, 200, 0.6);
}

.red_square {
  margin-left: 20px;
  width: 70px;
  background-color: red;
}

.progress_bar {
  width: 56%;
  padding: 0px 0px 0px 10px;
}

@media (min-width: 1300px) {
  .progress_bar{
    width: 70%;
  }
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

.songs_list {
  background-color: black;
  border-radius: 10px;
  color: white;
  width: 270px;
  height: 300px;
  padding: 1em;
  font-size: 12px;
  overflow-x: scroll;
  position: fixed;
  bottom: 90px;
  right: 100px;
}

@media (max-width: 930px) {
  .songs_list {
    bottom: 80px;
    right: 0px;
    height: 70vh;
    margin: 10px;
    margin-bottom: 0px;
  }
}

.song_info {
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

#progress-bar {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  background-color: #fff;
  outline: none;

  overflow: hidden;
  border-radius: 16px;
}

#progress-bar::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  background-color: #fff;
}

#progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
  /*  slider progress trick  */
  box-shadow: -407px 0 0 400px rgb(252, 236, 15);
}

#progress-bar::-moz-range-track {
  width: 100%;
  height: 2px;
  background-color: #fff;
}

#progress-bar::-moz-range-thumb {
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
}

#progress-bar::-ms-track {
  width: 100%;
  height: 2px;
  background-color: #fff;
  border-color: transparent;
  color: transparent;
}

#progress-bar::-ms-thumb {
  width: 0;
  height: 0;
  border: none;
  background-color: transparent;
}

#progress-bar::-ms-fill-lower {
  background-color: #ffbb00;
}

#progress-bar::-moz-range-progress {
  background-color: #ffbb00;
}

#progress-bar::-webkit-progress-value {
  background-color: #ffbb00;
}

#progress-bar::-ms-fill-upper {
  background-color: #fff;
}

@media (max-width: 767px) {
  .volume-slider {
    display: none;
  }

  body {
    background-image: url('https://images.unsplash.com/photo-1576249435502-2ee2b5064a63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&w=1000&q=80https://i0.hippopx.com/photos/144/586/492/people-crowd-party-spectators-preview.jpg');
  }

  .songs_list {
    width: 95.1%;
  }
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
  bottom: 154px;
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

/* transicion al modo vertical, (eliminada por el momento) */

/*

.mini-enter-active {
  animation: bounce-in 0.5s
}

.mini-leave-to {
  transition: opacity 0.5s, transform 0.5s ease;
  transform: translateX(100vh);
}

*/

@keyframes bounce-in {
  0% {
    transform: translateX(100vh);
  }

  100% {
    transform: translateX(0);
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

.slider_volumen {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  background: black; /* Fondo negro */
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.slider_volumen::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: white; /* Thumb blanco */
  border-radius: 50%;
  cursor: pointer;
}

.slider_volumen::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: white; /* Thumb blanco */
  border-radius: 50%;
  cursor: pointer;
}

.slider_volumen::-ms-thumb {
  width: 25px;
  height: 25px;
  background: white; /* Thumb blanco */
  border-radius: 50%;
  cursor: pointer;
}

.slider_volumen::-webkit-slider-runnable-track {
  height: 10px;
  background: yellow; /* Progreso amarillo */
}

.slider_volumen::-moz-range-track {
  height: 10px;
  background: yellow; /* Progreso amarillo */
}

.slider_volumen::-ms-fill-lower {
  background: yellow; /* Progreso amarillo */
}

.slider_volumen::-webkit-slider-runnable-track::before {
  background: black; /* Restante negro */
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 10px;
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background-color: rgba(200, 200, 200, 0);
  border: 0px;
  outline: none;
  overflow: hidden;
  border-radius: 16px;
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

.playlist_button{
  font-size: 25px;
}

@media (max-width: 930px) {
  .playlist_button{
    height: 31.5px;
  }

  .playlist_div{
    height: 32.5px;
    margin-left: 5px;
  }

  .openNew_div{
    height: 28px;
  }
}

</style>