<template>
  <div class="container">
    <div class="timeline gray" ></div>
    <div class="timeline yellow" ref="yellowTimeline" @click="handleTimelineClick"></div>
    <div class="uzel-container" ref="uzelContainer" @scroll="handleScroll">
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

<script setup>
import { onMounted, ref, computed } from 'vue';
import TimelineItem from './components/TimelineItem.vue';
import EventDetail from './components/EventDetail.vue';
import data from '@/assets/json/data.json';

const events = ref(data);
const selectedEvent = ref(null);
const eventYears = ref([]);
const uzelContainer = ref(null);
const yellowTimeline = ref(null);


const showDetail = (event) => {
  selectedEvent.value = event;
};

const closeDetail = () => {
  selectedEvent.value = null;
};


// Compute only even indexed events
const evenEvents = computed(() => {
  return events.value.filter((_, index) => index % 2 === 0);
});
const oddEvents = computed(() => {
  return events.value.filter((_, index) => index % 2 !== 0);
});

const getVisibleEvents = () => {
  const container = uzelContainer.value;
  const containerRect = container.getBoundingClientRect();
  const visibleEvents = events.value.filter(event => {
    const eventElement = document.getElementById(`event-${event.number}`);
    if (eventElement) {
      const eventRect = eventElement.getBoundingClientRect();
      return (
        eventRect.left < containerRect.right &&
        eventRect.right > containerRect.left
      );
    }
    return false;
  });
  // console.log(visibleEvents);
  return visibleEvents;
};


const calculateYearsRange = () => {
  const visibleEvents = getVisibleEvents();
  if (visibleEvents.length > 0) {
    const years = visibleEvents.flatMap(event => event.dates.match(/\d{4}/g).map(Number));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // console.log('minYear', minYear);
    // console.log('maxYear', maxYear);

    updateYellowTimeline(minYear, maxYear);
  } else {
    updateYellowTimeline(0, 0);
  }
};

const minTimelineYear = 1685;
  const maxTimelineYear = 2035;


const updateYellowTimeline = (minYear, maxYear) => {
  const timelineWidth = yellowTimeline.value.scrollWidth;

  const startPercentage = (minYear - minTimelineYear) / (maxTimelineYear - minTimelineYear);
  const endPercentage = (maxYear - minTimelineYear) / (maxTimelineYear - minTimelineYear);

  const maskWidth = (endPercentage - startPercentage) * timelineWidth;
  const maskPosition = startPercentage * timelineWidth;

  // console.log('maskWidth', maskWidth);
  // console.log('maskPosition', maskPosition);
  // console.log('timelineWidth', timelineWidth);

  yellowTimeline.value.style.maskSize = `${maskWidth}px 100%`;
  yellowTimeline.value.style.maskPosition = `${maskPosition - maskWidth / 2}px center`;
};


const handleScroll = () => {
  calculateYearsRange();
};

const handleTimelineClick = (event) => {
  const timelineRect = event.target.getBoundingClientRect();
  const clickX = event.clientX - timelineRect.left;
  const timelineWidth = timelineRect.width;

 
  // Calculate the clicked year based on the click position
  const clickYear = minTimelineYear + (clickX / timelineWidth) * (maxTimelineYear - minTimelineYear);

  // Find the closest event to the clicked year
  const closestEvent = findClosestEvent(clickYear);

  if (closestEvent) {
    // Get the element of the closest event
    const eventElement = document.getElementById(`event-${closestEvent.number}`);
    if (eventElement) {
      // Scroll the container to center the closest event
      const containerRect = uzelContainer.value.getBoundingClientRect();
      const eventRect = eventElement.getBoundingClientRect();
      const offset = eventRect.left - containerRect.left - (containerRect.width / 2) + (eventRect.width / 2);

      uzelContainer.value.scrollBy({
        left: offset,
        behavior: 'smooth'
      });

      // console.log('clickYear', clickYear);
      // console.log('closestEvent', closestEvent);
    }
  }
};

const findClosestEvent = (clickYear) => {
  let closestEvent = null;
  let closestDifference = Infinity;

  eventYears.value.forEach(({ event, minYear, maxYear }) => {
    const difference = Math.min(
      Math.abs(clickYear - minYear),
      Math.abs(clickYear - maxYear)
    );

    if (difference < closestDifference) {
      closestDifference = difference;
      closestEvent = event;
    }
  });

  return closestEvent;
};



onMounted(() => {

  eventYears.value = events.value.map(event => {
    const years = event.dates.match(/\d{4}/g).map(Number);
    return { event, minYear: Math.min(...years), maxYear: Math.max(...years) };
  });


  calculateYearsRange();
  window.addEventListener('resize', calculateYearsRange);
});
</script>

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
  z-index: 999;
}

.gray {
  background-image: url("/timeline.svg");
  background-repeat: no-repeat;
}

.yellow {
  background-image: url("/yellow.svg");
  mask-image: url("/mask.svg");
  mask-repeat: no-repeat;
  mask-size: 0 100%;
  mask-position: 0 0;
  transition: all 1s;
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
