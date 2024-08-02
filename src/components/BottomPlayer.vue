<template>
  <div :style="{fontFamily: 'cursive'}">
    <audio ref="audioPlayer" :volume="volume / 100" @timeupdate="timeUpdate" :src="songData.currentSong">
    </audio>
    <Transition name="slide-fade2">
      <EmisoraDesktop 
      @left-handler="leftHandler" 
      @right-handler="rightHandler" 
      @select-emisora="selectEmisora"
      :emisorasShow="emisorasShow" 
      :emisorasProgress="emisorasProgress" 
      :emisoras="emisoras"
      :emisoraSelected="emisoraSelected"
      :fontTheme="fontTheme"></EmisoraDesktop>
    </Transition>
    <Transition name="slide-fade">
      <i class="material-icons drop_down" v-if="emisorasShow" style="position: fixed; font-size: 50px; color: #000; bottom: 61px;">arrow_drop_down</i>
    </Transition>
    <Transition name="slide-fade2">
      <div class="slider-container" v-if="volumeShow">
        <input type="range" min="0" max="100" v-model="volume" @input="updateVolume">
      </div>
    </Transition>
    <Transition name="slide-fade">
      <div class="songs_list" v-if="listShow">
        <ul>
          <li class="song_in_the_list" v-for="(cancion, index) in currentTrackHistory" :key="index">
            <div>
              <img class="list_img" :src="cancion.imagen" :alt="cancion.nombre">
            </div>
            <div class="song_info">
              <p class="grey-text small" :style="{fontFamily: fontTheme}">{{ cancion.autor.length > 25 ? cancion.autor.substring(0, 25) + '...' : cancion.autor }}</p>
              <p class="" :style=" { color: cancion.nombre === cancion.nombre ? mainColor : 'white', fontFamily: fontTheme } ">{{ cancion.nombre.substring(0, 29) }}</p>
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
          <span class="radio_text" :style="{color: mainColor, fontFamily: fontTheme}">
            {{ currentStationName }}
          </span>
          <span class="liveSquare" :style="{backgroundColor: mainColor, fontFamily: fontTheme}">
            EN VIVO
          </span>
        </div>
        <span :style="{width: '500px', textAlign: 'left', fontFamily: fontTheme}" class="nameMotion">
          {{ songData.currentAuthor }}{{ songData.currentSongName }}
        </span>
      </div>
      <div class="widgets_section">
        <div style="height: 70px;" class="desktop_widget">
          <img :src="songData.imagen" width="70">
        </div>
        <div class="icons_div desktop_widget" >
          <i class="material-icons icons_m" v-show="emisorasAvaliable" @click=" previousEmisora()">skip_previous</i>
        </div>
        <div class="icons_div desktop_widget">
          <i class="material-icons icons_m" v-show="emisorasAvaliable" @click=" nextEmisora()">skip_next</i>
        </div>
        <div class="icons_div side_border" v-if="emisorasAvaliable" @click=" emisorasShow = !emisorasShow; listShow = false">
          <i class="material-icons icons_m">radio</i>
        </div>
        <div class="song_duration desktop_widget">
          <span :style="{fontFamily: fontTheme}">{{ formattedDuration }}</span>
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
      :proAvaliable="proAvaliable"
      :fontTheme="fontTheme"
      :emisorasAvaliable="emisorasAvaliable"
      :currentStationName="currentStationName"
      :mainColor="mainColor" 
      :playerMode="playerMode"
      :mobileMode=" mobileMode "
      :programming=" programming "
      :canciones=" canciones "
      :history=" currentTrackHistory "
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
import InMyBlood from '../songs/son1.wav';
import EmisoraDesktop from './EmisoraDesktop.vue';
import SpinIcon from './SpinIcon.vue'



function formatDuration(durationInSeconds) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

const obtenerDatos = async (parametro) => {
    try {
      const url = `https://player-radio-backend.inovanex.com/radioget/${parametro}`;
      //const url = `http://localhost:3000/radioget/${parametro}`;

      const response = await fetch(url);
      if (response.ok) {
        console.log('parametro:', response)
        const datosObtenidos = await response.json();
        return datosObtenidos;
      } else {
        throw new Error('Error al obtener los datos.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
};

//const getMetadata = async (url) => {
//  try{
//    const response = await fetch(url);
//    if(response.ok){
//      return response.json()
//   }
//  }catch (error){
//    console.log(error)
//  }
//}

import MobilePlayer from './MobilePlayer.vue';

export default {
  props: ['playerMode'],
  data() {
    return {
      mode: 1,
      proAvaliable: false,
      mobileMode: false,
      minimizedState: true,
      isPlaying: false,
      isLoading: false,
      interacted: false,
      currentEmisoraId: 0,
      fontTheme: 'Arial, sans-serif',
      volume: 50,
      duration: 100,
      currentTime: 50,
      currentStationName: 'Cargando...',
      progressInterval: null,
      formattedDuration: '00:00',
      listShow: false,
      volumeShow: false,
      emisoraSelected: null,
      emisorasProgress: 0,
      emisorasShow: false,
      emisoras: [],
      programming: [],
      mainFont: '',
      mainColor: 'green',
      secondaryColor: 'white',
      currentTrackHistory: [],
      songData: {
        currentSong: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        currentAuthor: '',
        currentSongName: '',
        imagen: '',
        id: null
      },
      canciones: [
        {
          id: 1,
          nombre: 'Loading...',
          autor: '',
          tiempo: '3:45',
          cancion: InMyBlood,
          imagen: 'https://i1.sndcdn.com/artworks-000331552113-31yptw-t500x500.jpg'
        },
      ],
      emisorasAvaliable: true
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
    playHandle () {
      if(this.isLoading === false){
        this.interacted = true
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

      const playNewSong = async () => {
        try{
          await audio.play(); // Reproducir la nueva canción automáticamente una vez cargada
          this.isPlaying = true;
          this.isLoading = false;
          audio.removeEventListener('canplaythrough', playNewSong); // Eliminar el controlador de eventos después de que se haya reproducido
        }catch(error){
          console.log(error)
          audio.removeEventListener('canplaythrough', playNewSong); // Eliminar el controlador de eventos después de que se haya reproducido
        }
      };

      if (audio.readyState >= 2) {
        // Si el archivo de audio ya está cargado
        setTimeout(() => {
          playNewSong();
        }, 2000); // Mostrar un segundo de carga antes de reproducir
      } else {
        audio.addEventListener('canplaythrough', playNewSong);
      }
    },
    changeSongNoPlay(song, name, author, imagen) {
      this.songData.currentAuthor = author;
      this.songData.currentSongName = name;
      this.songData.imagen = imagen;
      const audio = this.$refs.audioPlayer;
      audio.pause();
      audio.currentTime = 0;
      this.songData.currentSong = song;
      this.songData.imagen = imagen
    },
    changeSongButPlay(song, name, author, imagen) {
      this.songData.currentAuthor = author;
      this.songData.currentSongName = name;
      this.songData.imagen = imagen;
      const audio = this.$refs.audioPlayer;
      audio.pause();
      audio.currentTime = 0;
      this.songData.currentSong = song;
      audio.play()
    },
    openNewWindow(){
      const nameid = this.$route.params.nameid
      var url = `/slim/${nameid}`; // Ruta a tu componente de ventana emergente
      var opciones = "width=800,height=300,scrollbars=yes";

      // Abrir ventana emergente
      window.open(url, "_blank", opciones);
    },
    nextSong() {
      const currentIndex = this.canciones.findIndex(cancion => cancion.id === this.songData.id);
      const siguienteIndex = currentIndex + 1;

      if (siguienteIndex < this.canciones.length) {
        const siguienteCancion = this.canciones[siguienteIndex];
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
        this.songData.id = siguienteCancion.id
        // Aquí puedes hacer lo que necesites con el objeto de la siguiente canción
      } else {
        // Si no hay siguiente canción, puedes hacer alguna otra acción, como volver al inicio del array
        // Por ejemplo, puedes acceder a la primera canción así:
        const siguienteCancion = this.canciones[0];
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
      }
    },
    previousSong() {
      const currentIndex = this.canciones.findIndex(cancion => cancion.id === this.songData.id);
      const siguienteIndex = currentIndex - 1;

      if (siguienteIndex < this.canciones.length) {
        const siguienteCancion = this.canciones[siguienteIndex];
        this.changeSong(siguienteCancion.cancion, siguienteCancion.nombre, siguienteCancion.autor, siguienteCancion.imagen)
        this.songData.id = siguienteCancion.id
        // Aquí puedes hacer lo que necesites con el objeto de la siguiente canción
      } else {
        // Si no hay siguiente canción, puedes hacer alguna otra acción, como volver al inicio del array
        // Por ejemplo, puedes acceder a la primera canción así:
        const siguienteCancion = this.canciones[0];
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
      if(this.programming.length > 5){
          this.proAvaliable = true;
        }
      this.currentEmisoraId = indiceEmisora
      this.currentTrackHistory = emisoraEncontrada.history
      this.currentStationName = emisoraEncontrada.station_name
      console.log('emisora:', emisoraEncontrada)
      emisoraEncontrada.audio.forEach((val, index) => {
        this.canciones.push({
          id: index,
          nombre: emisoraEncontrada.song_name,
          autor: emisoraEncontrada.artist_name,
          cancion: val,
          imagen: emisoraEncontrada.image
        })
      });

      this.changeSong(this.canciones[0].cancion, this.canciones[0].nombre, this.canciones[0].autor, this.canciones[0].imagen) 
    },
    changeLink(){
      let links = this.emisoras[this.currentEmisoraId].audio
      const oldLink = links.shift()
      links.push(oldLink)
      this.emisoras[this.currentEmisoraId].audio = links
    },
    checkState() {
      fetch(this.emisoras[this.currentEmisoraId].audio[0], {mode: 'no-cors'}).then(response => {
        console.log(response)
        this.isLoading = false
      }).catch(error => {
        console.log(error)
        this.isLoading = true // Inicia carga
        const currentEmisora = this.emisoras[this.currentEmisoraId]
        if(currentEmisora.audio.length > 1){

          this.changeLink()
          
          if(this.interacted === true){
            this.changeSong(this.emisoras[this.currentEmisoraId].audio[0], '', this.emisoras[this.currentEmisoraId].slogan, this.emisoras[this.currentEmisoraId].image)
          }else{
            this.changeSongNoPlay(
            this.emisoras[this.currentEmisoraId].audio[0], 
            '', 
            this.emisoras[this.currentEmisoraId].slogan, 
            this.emisoras[this.currentEmisoraId].image)
            this.isLoading = false
          }

        }
      })
      //this.isLoading = false    
    },
    selectEmisoraNoPlay(id) {
      this.emisoraSelected = id
      //buscar emisora seleccionada
      const emisoraEncontrada = this.emisoras.find(val => val.selectId == id)
      const indiceEmisora = this.emisoras.findIndex(val => val.selectId == id)
      this.canciones = []
      this.programming = emisoraEncontrada.programming
      if(this.programming.length > 5){
          this.proAvaliable = true;
        }
      this.currentEmisoraId = indiceEmisora
      this.currentTrackHistory = emisoraEncontrada.history
      emisoraEncontrada.audio.forEach((val, index) => {
        this.canciones.push({
          id: index,
          nombre: emisoraEncontrada.song_name,
          autor: emisoraEncontrada.artist_name,
          cancion: val,
          imagen: emisoraEncontrada.image
        })
      });
    }
  },
  async mounted() {
    setInterval(() => {
      if(this.interacted && this.isPlaying){
        this.checkState()
      }
      const metadataURL = this.emisoras[this.currentEmisoraId].metadataList[0]

        fetch(metadataURL).then(response => {
          if(response.ok){
            return response.json()
          }
        }).then(response => {
          if(response.status){
            const songDetails = response.nowplaying.split(' - ')
            const nombreAutor = songDetails[0]
            const nombreCancion = " - " + songDetails[1]
            this.songData.currentSongName = nombreCancion
            this.songData.currentAuthor = nombreAutor
            this.songData.imagen = response.coverart
          }
        })
    }, 5000)

    this.mode = this.playerMode > 0 ? 1 : 0
    this.minimizedState = this.mode === 1 ? false : true
    this.isLoading = true

    const nameid = this.$route.params.nameid
    const datafromRadio = await obtenerDatos(nameid);
    // Asignar configuraciones principales
    console.log(datafromRadio)
    this.mainColor = datafromRadio.config[0].color
    this.secondaryColor = datafromRadio.config[0].color2
    this.fontTheme = datafromRadio.config[0].font
    if(datafromRadio.station.length === 1){
      this.emisorasAvaliable = false
    }
    // Organizar datos de las emisoras
    const obtenerDatosLoop = async () => {

      const stationLenght = datafromRadio.station.length; // cantidad de radios
      let currentStation = 0;

      for (let i = 0; i < datafromRadio.station.length; i++) {
        const station = datafromRadio.station[i];

        const audioLinks = station.station_links.split(',');
        const metadataLinks = station.metadata.split(',')
        const imagenName = station.img.replace(/\s+/g,'%20');
        const imgCover = 'https://player-radio-backend.inovanex.com/images/' + imagenName
        console.log('imagen', imgCover)

        // Objeto de emisora a agregar a la lista
        let emisora = {
          station_name: station.station_name,
          image: imgCover,
          selectId: station.id,
          audioList: audioLinks,
          metadataList: metadataLinks,
          audio: audioLinks,
          artist_name: '',
          song_name: station.slogan,
          history: [],
          programming: [],
          slogan: station.slogan,
          emisoraImg: imgCover
        }

        console.log(audioLinks)

        if(station.programming.length > 5){
          this.proAvaliable = true;
          emisora.programming = station.programming
        }

        this.emisoras.push(emisora)
        
        currentStation++
        
        if(currentStation === stationLenght){
          console.log(this.emisoras[0])
          this.selectEmisoraNoPlay(this.emisoras[0].selectId)
          this.currentStationName = this.emisoras[0].station_name
          this.changeSongNoPlay(this.emisoras[0].audio[0], '', this.emisoras[0].slogan, this.emisoras[0].image)
          this.checkState()
          this.isLoading = false

          if(metadataLinks[0] !== ""){
            fetch(metadataLinks[0]).then(response => {
              if(response.ok){
                return response.json()
              }
            }).then(data => {
              if(data.status){
                const songDetails = data.nowplaying.split(' - ')
                const nombreAutor = songDetails[0]
                const nombreCancion = " - " + songDetails[1]
                let history = []
                data.trackhistory.forEach((track, index) => {
                  const result = track.split(' - ')
                  const register = {
                    nombre: result[0],
                    autor: result[1],
                    imagen: data.covers[index]
                  }
                  history.push(register)
                })
                
                this.emisoras[i].history = history
                this.emisoras[i].song_name = nombreCancion
                this.emisoras[i].artist_name = nombreAutor
                this.currentTrackHistory = history
                
                this.songData.currentAuthor = nombreAutor
                this.songData.currentSongName = nombreCancion
                this.songData.imagen = data.coverart
                console.log(this.emisoras[i])
              }
            })
          }
        }
        
      }


     }

    await obtenerDatosLoop();

    this.canciones

    this.songData.currentSong = this.canciones[0].cancion
    //this.songData.imagen = DefaultImage
    this.songData.id = this.canciones[0].id
    this.songData.currentAuthor = this.canciones[0].autor
    this.songData.currentSongName = this.canciones[0].nombre
    const audio = this.$refs.audioPlayer;

    //this.nextEmisora()

    audio.addEventListener('loadedmetadata', () => {
      //const totalSeconds = Math.round(audio.duration);
      //this.formattedDuration = formatDuration(totalSeconds);
    });
    this.progressInterval = setInterval(this.updateProgress, 1000); // Actualizar cada segundo
  },
  beforeUnmount() {
    clearInterval(this.progressInterval);
  },
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

.drop_down{
  left: 43%
}

@media (min-width: 1200px) {
  .widgets_section{
    min-width: 70vw;
  }
}

@media (max-width: 1070px) {
  .widgets_section{
    min-width: 60vw;
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
  width: 100px;
  border-right: 1px solid rgba(100, 100, 100, 0.3);
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;
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
  width: auto;
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

  30%{
    transform: translateX(0%);
  }

  40%{
    transform: translateX(-70%);
  }

  40.001%{
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

@media (min-width: 2100px) {
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
  position: fixed;
  bottom: 90px;
  right: 100px;
}

.songs_list ul{
  overflow: scroll;
  max-height: 285px;
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
  cursor: pointer;
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

.liveSquare{
  border: 1px solid rgba(0, 0, 0, 0);
  color: white; 
  background-color: red; 
  border-radius: 5px; 
  font-size: 9px; 
  padding: 0px 4px; 
  margin-left: 3px
}

</style>