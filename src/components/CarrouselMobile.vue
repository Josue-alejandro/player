<template>
  <div class="carousel" ref="carousel" @mousedown="startDrag" @mousemove="handleDrag" @mouseup="endDrag">
    <div class="inner" ref="inner" :style="innerStyles">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :class="{ 'image-selection': true, 'selected': index === selectedIndex }"
        @mousedown="selectImage(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "https://i1.sndcdn.com/artworks-000331552113-31yptw-t500x500.jpg",
        "https://upload.wikimedia.org/wikipedia/en/1/1b/NF_-_The_Search.png",
        "https://i1.sndcdn.com/avatars-BlP716GSnFcuZmA5-MIJuMA-t500x500.jpg",
        "https://i1.sndcdn.com/artworks-000037594427-ztal2r-t500x500.jpg",
        "https://i.scdn.co/image/ab67616d0000b2731ca3627279615916e95c4685"
      ],
      selectedIndex: 0,
      innerStyles: {},
      isDragging: false,
      dragStartX: 0,
      dragOffset: 0
    };
  },
  mounted() {
    this.setStep();
  },
  methods: {
    setStep() {
      const carouselWidth = this.$refs.carousel.offsetWidth;
      const selectedImageWidth = this.$refs.inner.children[this.selectedIndex].offsetWidth;

      const leftOffset = (carouselWidth - selectedImageWidth) / 2;
      const scrollOffset = this.$refs.inner.children[this.selectedIndex].offsetLeft - leftOffset;

      this.innerStyles = {
        transform: `translateX(-${scrollOffset}px)`
      };
    },
    selectImage(index) {
      this.selectedIndex = index;
      this.setStep();
    },
    startDrag(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragOffset = this.$refs.inner.offsetLeft;
    },
    handleDrag(event) {
      if (!this.isDragging) return;
      const dragDistance = event.clientX - this.dragStartX;
      this.innerStyles = {
        transform: `translateX(${this.dragOffset + dragDistance}px)`
      };
    },
    endDrag() {
      this.isDragging = false;
      const carouselWidth = this.$refs.carousel.offsetWidth;
      const selectedImageWidth = this.$refs.inner.children[this.selectedIndex].offsetWidth;

      const leftOffset = (carouselWidth - selectedImageWidth) / 2;
      const scrollOffset = this.$refs.inner.children[this.selectedIndex].offsetLeft - leftOffset;

      this.innerStyles = {
        transform: `translateX(-${scrollOffset}px)`,
        transition: "transform 0.3s ease"
      };
    }
  }
};
</script>


<style>

.carousel {
  width: 300px;
  overflow: hidden;
  cursor: grab;
}

.inner {
  display: flex;
}

.image-selection {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  object-fit: cover;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 10px;
  transition: transform 0
}
</style>
