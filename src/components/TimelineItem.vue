<template>
  <div @click="showDetail" class="timeline-item" :id="`event-${event.id}`">
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
import { computed } from 'vue';
import Typograf from 'typograf';
const tp = new Typograf({ locale: ['ru', 'en-US'] });


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
</script>

<style scoped>
.timeline-item {
  cursor: pointer;
  padding: 0 500px;
  width: calc(945px*2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

}

.date {
  color: #ffffff;

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