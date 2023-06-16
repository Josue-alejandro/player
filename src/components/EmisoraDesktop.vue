<template>
    <div class="emisora" v-if="emisorasShow">
        <div @click="$emit('left-handler')" style="padding: '10px';">
            <i class="material-icons" style="color: white">chevron_left</i>
        </div>
        <div class="emisoras_container">
            <div class="emisoras_slider" :style="{ 'transform': 'translateX(' + emisorasProgress + '%)' }">
                <div v-for="emisora in emisoras" :key="emisora.index" class="emisora_img">
                    <img :src="emisora.image" class="emisoraImg"
                        :style="{ 'border-radius': '6px', 'transform': this.emisoraSelected === emisora.selectId ? 'scale(1.3)' : 'scale(1)','filter': this.emisoraSelected !== emisora.selectId ? 'grayscale(100%)' : 'grayscale(0%)' }"
                        @click="$emit('select-emisora',emisora.selectId)" />
                </div>
            </div>
        </div>
        <div @click="$emit('right-handler')" style="padding: '10px';">
            <i class="material-icons" style="color: white">chevron_right</i>
        </div>
    </div>
</template>

<script>
export default {
    props: ['emisorasShow', 'emisorasProgress', 'emisoras', 'emisoraSelected']
}
</script>

<style scoped>
.emisora {
  background-color: black;
  max-width: 300px;
  max-height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 30px;
  position: fixed;
  bottom: 70px;
  left: 330px;
}

.emisoras_slider{
  flex-direction: row;
  display: flex;
  justify-content: left;
  transition: transform 0.2s;
}

.emisoras_container{
  overflow: hidden;
}

.emisora img {
  margin: 0.5em;
  width: 40px;
  transition: transform 0.1s;
}

.emisora_img {
  display: flex;
  align-items: center;
}
</style>