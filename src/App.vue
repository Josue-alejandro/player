<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  mounted(){
    console.log(this.$route.params)
  }
}
</script>

<style>
*{
  margin: 0px;
  padding: 0px;
  font-family: 'Poppins', sans-serif;
}

@media (max-width: 767px) {
  body{
    /*background-image: url('https://images.unsplash.com/photo-1576249435502-2ee2b5064a63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&w=1000&q=80https://i0.hippopx.com/photos/144/586/492/people-crowd-party-spectators-preview.jpg');*/
    /*background-color: black;*/
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100vh;
  }
}

i {
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Versión sin prefijo, actualmente
                                      compatible con Chrome y Opera */
}

*{
    /* Barra personalizada de firefox */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 0, 0, 0) rgba(0,0,0,0);
}

*::selection{
  user-select: none;
}


/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

*::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}

*::-webkit-scrollbar-thumb {
  background-color: red;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0);
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
</style>
