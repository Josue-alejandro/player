<template>
    <div class="programming_list">
        <div class="week_div">
            <p 
            @click="dayHandler('lun')" 
            :style="{'background-color': currentDay === 'lun' ? 'rgba(78, 6, 6, 0.7)' : 'rgba(200, 20, 20, 0.7)'}">Lun</p>
            <p 
            @click="dayHandler('mar')" 
            :style="{'background-color': currentDay === 'mar' ? 'rgba(78, 6, 6, 0.7)' : 'rgba(200, 20, 20, 0.7)'}">Mar</p>
            <p 
            @click="dayHandler('mier')" 
            :style="{'background-color': currentDay === 'mier' ? 'rgba(78, 6, 6, 0.7)' : 'rgba(200, 20, 20, 0.7)'}">Mier</p>
            <p 
            @click="dayHandler('jue')" 
            :style="{'background-color': currentDay === 'jue' ? 'rgba(78, 6, 6, 0.7)' : 'rgba(200, 20, 20, 0.7)'}">Jue</p>
            <p 
            @click="dayHandler('vie')" 
            :style="{'background-color': currentDay === 'vie' ? 'rgba(78, 6, 6, 0.7)'  :'rgba(200, 20, 20, 0.7)'}">Vie</p>
            <p 
            @click="dayHandler('sab')" 
            :style="{'background-color': currentDay === 'sab' ? 'rgba(78, 6, 6, 0.7)'  : 'rgba(200, 20, 20, 0.7)'}">Sab</p>
            <p 
            @click="dayHandler('dom')" 
            :style="{'background-color': currentDay === 'dom' ? 'rgba(78, 6, 6, 0.7)'  : 'rgba(200, 20, 20, 0.7)'}">Dom</p>
        </div>
        <div>
            <ul class="radio_list">
                <li v-for="pro in day" :key="pro.id">
                    <img :src="pro.image" width="60" style="border-radius: 5px;" />
                    <div class="programming_info">
                        <span style="font-size: 16px;">{{ pro.title }}</span>
                        <span>desde: {{ pro.start_time }} hasta las {{ pro.end_time }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            currentDay:'lun',
        }
    },
    props:['day'],
    methods:{
        dayHandler(day){
            this.currentDay = day
            this.$emit('change-day', day)
        }
    }
}
</script>

<style>
.programming_list {
  flex: 0 0 100vw;
}

.programming_info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}


.radio_list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: self-start;
  color: white
}

.radio_list li {
  width: 100%;
  display: flex;
  padding: 1em;
  text-align: left;
  background-color: rgba(20, 20, 20, 0.7);
}

.radio_list li img {
  margin-right: 20px;
}

.week_div {
  background-color: rgba(200, 20, 20, 0.7);
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.week_div p {
  border-right: 1px solid white;
  text-align: center;
  padding: 10px;
  width: 100%;
}
</style>