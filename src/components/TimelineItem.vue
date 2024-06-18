<template>
  <div @click="showDetail" class="timeline-item" :id="`event-${event.number}`">
    <div v-if="event.number % 2 === 0" class="vertical-line top">
      <div class="round"></div>
    </div>

    <div class="date">{{formattedDate}}</div>
    <div class="short">{{ formattedShort }}</div>
    <!-- <div class="short">{{ event.number }}</div> -->
    <div v-if="event.number % 2 !== 0" class="vertical-line">
      <div class="round"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Typograf from 'typograf';
const tp = new Typograf({locale: ['ru', 'en-US']});


const props = defineProps({
  event: Object,
});

const formattedDate = computed(() => tp.execute(props.event.dates));
const formattedShort = computed(() => tp.execute(props.event.short));


const emit = defineEmits(['show-detail']);

const showDetail = () => {
  emit('show-detail', props.event);
};
</script>

<style scoped>
.timeline-item {
  cursor: pointer;
  /* padding: 10px; */
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.date {
  color: #ffffff;

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
  justify-content: end;
}

.top {
  justify-content: start;

}

.round {
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;

}
</style>