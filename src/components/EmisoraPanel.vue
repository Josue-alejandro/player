<template>
    <div class="emisora" v-if="emisorasShow">
        <div @click="$emit('left-handler')" style="padding: '10px';">
            <i class="material-icons" v-show="emisorasProgress !== 0" style="color: white">chevron_left</i>
        </div>
        <div class="emisoras_container">
            <div class="emisoras_slider" :style="{ 'transform': 'translateX(' + emisorasProgress + '%)' }">
                <div v-for="emisora in emisoras" :key="emisora.index" class="emisora_img">
                    <img 
                    :src="emisora.image" class="emisoraImg"
                    :style="{ 'border-radius': '6px', 'transform': this.emisoraSelected === emisora.selectId ? 'scale(1.6)' : 'scale(1)', 'filter': this.emisoraSelected !== emisora.selectId ? 'grayscale(100%)' : 'grayscale(0%)' }"
                    @click="$emit('select-emisora',emisora.selectId)" />
                </div>
            </div>
        </div>
        <div @click="$emit('right-handler')" style="padding: '10px';">
            <i class="material-icons" style="color: white" v-show="emisorasProgress > -90">chevron_right</i>
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
  background-color: rgba(0, 0, 0, 0);
  max-width: 100vw;
  width: 100%;
  max-height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 30px;
  position: static;
  bottom: 0px;
  left: 0px;
  margin-top: 0em;
  min-width: 250px;
}

.emisoras_slider{
  flex-direction: row;
  display: flex;
  justify-content: left;
  transition: transform 0.2s;
}

.emisoras_container{
  overflow: scroll;
  display: flex;
  align-items: center;
  height: 90px;
  scrollbar-width: none;
}

.emisoras_container::-webkit-scrollbar{
  width: 0px;
  height: 0px;
}

.emisora img {
  margin: 0.5em 1em;
  width: 50px;
  transition: transform 0.1s;
}

.emisora_img{
  display: flex;
  align-items: center;
}
</style>