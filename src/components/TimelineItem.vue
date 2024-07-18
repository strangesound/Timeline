<template>
  <div @click="showDetail" class="timeline-item" :id="`event-${event.id}`" :class="{ 'visible': isVisible }"
    ref="timelineItem">
    <div v-if="event.id % 2 !== 0" class="vertical-line top">
      <div class="round"></div>
    </div>

    <!-- <div class="index">{{ props.event.id + 1 }}</div> -->
    <div class="date">{{ formattedDate }}</div>
    <div class="short">{{ formattedShort }}</div>
    <!-- <div class="short">{{ event.index }}</div> -->
    <div v-if="event.id % 2 === 0" class="vertical-line">
      <div class="round"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import Typograf from 'typograf';
const tp = new Typograf({ locale: ['ru', 'en-US'] });

const timelineItem = ref(null);
const isVisible = ref(false);

const props = defineProps({
  event: Object,
});

// console.log(props.event);

const formattedDate = computed(() => tp.execute(props.event.dates));
const formattedShort = computed(() => tp.execute(props.event.short));


const emit = defineEmits(['show-detail']);

const showDetail = () => {
  emit('show-detail', props.event);
};

const observer = new IntersectionObserver((entries) => {
  const entry = entries[0];
  isVisible.value = entry.intersectionRatio >= 0.5;
}, {
  threshold: [0, 0.5, 1]
});

onMounted(() => {
  observer.observe(timelineItem.value);
});

onUnmounted(() => {
  observer.unobserve(timelineItem.value);
});




</script>

<style scoped>
.timeline-item {
  cursor: pointer;
  /* padding: 0 150px; */
  width: 837px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;


}

.timeline-item.visible {
  opacity: 1;
}


.date {
  color: #ffffff;
  font-size: 60px;
  white-space: pre-line;

}

.index {
  color: #ffffff;
  font-size: 1vw;
}

.short {
  color: #b3b3b3;
}

.vertical-line {
  width: 3px;
  height: 120px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin-top: 2vw;
  margin-bottom: 0;
}

.top {
  justify-content: end;
  margin-top: 0;
  margin-bottom: 1vw;


}

.round {
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;

}
</style>