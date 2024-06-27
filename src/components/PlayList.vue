<template>
<ul class="playlist">
    <li 
    class="song_in_the_list" 
    v-for="(register, index) in history" 
    :key="index" 
    >
    <div>
        <img class="list_img" :src="register.imagen" :alt="register.nombre">
    </div>
    <div class="song_info">
        <p class="small" :style="{ color: register.nombre !== register.nombre ? 'white' : 'grey' }">{{ register.autor }}</p>
        <p class="" :style="{ color: register.nombre === register.nombre ? 'white' : 'white' }">{{ register.nombre }}</p>
    </div>
    </li>
</ul>
</template>

<script>

export default {
    props:{
        history: {
          required: false
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
  height: 84vh;
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