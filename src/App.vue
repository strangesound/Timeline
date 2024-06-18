<script setup>
import { onMounted, ref, computed } from 'vue';

import TimelineItem from './components/TimelineItem.vue';
import EventDetail from './components/EventDetail.vue';
import data from '@/assets/json/data.json';

const events = ref(data);
const selectedEvent = ref(null);

const showDetail = (event) => {
  selectedEvent.value = event;
};

const closeDetail = () => {
  selectedEvent.value = null;
};


const uzelContainer = ref(null);
const yellowTimeline = ref(null);

onMounted(() => {
  const handleScroll = () => {
    const scrollLeft = uzelContainer.value.scrollLeft;
    const uzelWidth = uzelContainer.value.scrollWidth;
    const viewportWidth = window.innerWidth - 400;
    const maskWidth = viewportWidth * (viewportWidth / uzelWidth);
    const maskPosition = (scrollLeft / uzelWidth) * viewportWidth;

    yellowTimeline.value.style.maskPosition = `${maskPosition}px 0`;
  };

  uzelContainer.value.addEventListener('scroll', handleScroll);
});

// Compute only even indexed events
const evenEvents = computed(() => {
  return events.value.filter((_, index) => index % 2 === 0);
});
const oddEvents = computed(() => {
  return events.value.filter((_, index) => index % 2 !== 0);
});




</script>

<template>
  <div class="container">
    <div class="timeline gray"></div>
    <div class="timeline yellow" ref="yellowTimeline"></div>
    <div class="uzel-container" ref="uzelContainer">
      <div class="uzelok"></div>
      <div class="timeline-items-container">
        <TimelineItem v-for="event in evenEvents" :key="event.number" :event="event" @show-detail="showDetail" />
      </div>
      <div class="timeline-items-container bottom">
        <TimelineItem v-for="event in oddEvents" :key="event.number" :event="event" @show-detail="showDetail" />
      </div>
    </div>
    <Transition>
      <EventDetail v-if="selectedEvent" :event="selectedEvent" @close-detail="closeDetail" />
    </Transition>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: transparent;
  background-image: url("/back.webp");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.uzel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: scroll;
}

.uzel-container::-webkit-scrollbar {
  display: none;
}

.uzelok {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-image: url("/uzel.webp");
  height: 260px;
  width: 60000px;
  background-size: contain;
  background-position: center;
  background-repeat: repeat-x;
}

.timeline {
  width: 3440px;
  height: 370px;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.gray {
  background-image: url("/timeline.svg");
  background-repeat: no-repeat;
}

.yellow {
  background-image: url("/yellow.svg");
  mask-image: url("/mask.svg");
  mask-repeat: no-repeat;
  mask-size: 245px 100%;
  mask-position: 0 0;
}

.timeline-items-container {
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  flex-direction: row;
  width: 60000px;
  align-items: end;
  height: 40vh;
  margin-left: -5vw;
  /* gap: 30.5vw; */

}

.bottom {
  margin-top: 21vh;
  height: 43vh;
  align-items: start;
  margin-left: 17vw;

}
</style>
