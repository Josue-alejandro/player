<template>
<ul class="playlist">
    <li 
    class="song_in_the_list" 
    v-for="cancion in canciones" 
    :key="cancion.id" 
    @click="$emit('play-song' ,cancion.cancion, cancion.nombre, cancion.autor, cancion.id, cancion.imagen )"
    :style="{ backgroundColor: cancion.id === this.songData.id ? 'rgba(300,50,50, 0.5)' : 'rgba(20, 20, 20, 0.7)' }">
    <div>
        <img class="list_img" :src="cancion.imagen" :alt="cancion.nombre">
    </div>
    <div class="song_info">
        <p class="small" :style="{ color: cancion.id === this.songData.id ? 'white' : 'grey' }">{{ cancion.autor }}</p>
        <p class="" :style="{ color: cancion.id === this.songData.id ? 'white' : 'white' }">{{ cancion.nombre }}</p>
        <p class="tiny" :style="{ color: cancion.id === this.songData.id ? 'white' : 'grey' }">{{ cancion.tiempo }}</p>
    </div>
    </li>
</ul>
</template>

<script>

export default {
    props:{
        canciones:{
            required: true,
        },
        songData: {
            required: true
        }
    }
}

</script>

<style scoped>
.playlist{
  overflow: scroll;
  height: 85%;
  flex: 0 0 100vw; 
}

.song_in_the_list{
  display: flex;
  flex-direction: row;
  padding: 10px 0px 10px 20px;
  cursor: pointer;
  transition: 0.4s ease-out;
}

.song_info{
  text-align: left;
}

.list_img{
  width: 60px;
  border-radius: 5px;
  margin-right: 10px;
}
</style>