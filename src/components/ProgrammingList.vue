<template>
    <div class="programming_list">
        <div class="week_div" :style="{'background-color': mainColor, 'opacity': '0.6'}">
          <div
          v-for="day in days"
          :key="day.index"
          @click="dayHandler(day)" >
          <p
          :style="{'background-color': currentDay === day ? 'rgba(78, 6, 6, 0.7)' : 'rgba(0, 0, 0, 0)', 'border-radius': '7px', 'font-size': '12px', 'margin': '0px 10%', fontFamily: fontTheme}">
          {{ day.toLocaleUpperCase() }}</p>
          </div>
        </div>
        <div>
            <ul class="radio_list" v-if="programmingShow">
                <li v-for="pro in day" :key="pro.id">
                    <img :src="pro.image" width="60" style="border-radius: 5px;" />
                    <div class="programming_info">
                        <span :style="{fontSize: '12px', color: 'grey', fontFamily: fontTheme}">{{ pro.title }}</span>
                        <span :style="{fontSize: '14px', fontFamily: fontTheme}">{{ pro.locutor }}</span>
                        <span :style="{fontSize: '12px', color: 'grey', fontFamily: fontTheme}">{{ pro.start_time }} - {{ pro.end_time }}</span>
                    </div>
                </li>
            </ul>
            <div v-else>
              <h3 :style="{color: 'white', fontSize: '18px', fontFamily: fontTheme}">Programacion no disponible</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            currentDay:'lun',
            days:['lun', 'mar', 'mier', 'jue', 'vie', 'sab', 'dom']
        }
    },
    props:['day', 'programmingShow', 'mainColor', 'fontTheme'],
    methods:{
        dayHandler(day){
            this.currentDay = day
            this.$emit('change-day', day)
        }
	},
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

.week_div div {
  border-right: 1px solid white;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.week_div div p {
  cursor: pointer;
}
</style>