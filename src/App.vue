<template>
  <div class="container">
    <!-- <StringTest/> -->

    <div class="timeline gray"></div>
    <div class="timeline yellow" ref="yellowTimeline" @click="handleTimelineClick"></div>
    <!-- <div class="test-line" ref="testLine"></div> -->
    <div class="uzel-container" ref="uzelContainer" @scroll="handleScroll">
      <div class="uzelok"></div>
      <div class="timeline-crop">
        <div class="timeline-items-container">
          <TimelineItem v-for="event in evenEvents" :key="event.id" :event="event" @show-detail="showDetail" />
        </div>
        <div class="timeline-items-container bottom">
          <TimelineItem v-for="event in oddEvents" :key="event.id" :event="event" @show-detail="showDetail" />
        </div>
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
import StringTest from './components/StringTest.vue';
import data from '@/assets/json/data.json';

const events = ref(data.map((event, index) => ({ ...event, id: index })));
// console.log(events);

const selectedEvent = ref(null);
const eventYears = ref([]);
const uzelContainer = ref(null);
const yellowTimeline = ref(null);
// const testLine = ref(null);


const showDetail = (event) => {
  selectedEvent.value = event;
};

const closeDetail = () => {
  selectedEvent.value = null;
};


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
    const eventElement = document.getElementById(`event-${event.id}`);
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

    console.log('minYear-maxYear', minYear, ' - ', maxYear);

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

  console.log('startPercentage', startPercentage);
  console.log('endPercentage', endPercentage);
  console.log('maskWidth', maskWidth);
  console.log('maskPosition', maskPosition);
  console.log('timelineWidth', timelineWidth);

  yellowTimeline.value.style.maskSize = `${maskWidth}px 100vh`;
  yellowTimeline.value.style.maskPosition = `${maskPosition}px center`;
  // yellowTimeline.value.style.maskPosition = `${maskPosition - maskWidth / 2}px center`;

  // testLine.value.style.width = `${maskWidth}px`;
  // testLine.value.style.marginLeft = `${maskPosition}px`;

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
    const eventElement = document.getElementById(`event-${closestEvent.id}`);
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
  overflow-y: hidden;
  mask-image: url('/edges_mask.webp');
  /* animation: rotate 20s infinite alternate ease;  */

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
  width: 59535px;
  background-size: contain;
  background-position: center;
  background-repeat: repeat-x;
  filter: drop-shadow(100px 100px 50px #00000094);


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

.test-line {
  width: 3440px;
  height: 10px;
  background-color: red;
  position: absolute;
  left: 200px;
  top: 0;
  transition: all 1s;
  /* transform: translateX(-50%); */
  /* z-index: 999; */
}

.gray {
  background-image: url("/timeline.png");
  background-repeat: no-repeat;
}

.yellow {
  background-image: url("/yellow.png");
  mask-image: url("/mask.png");
  mask-repeat: no-repeat;
  mask-size: 0 100%;
  mask-position: 0 0;
  transition: all 1s;
}

.timeline-items-container {
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  flex-direction: row;
  /* width: 60480px; */
  align-items: end;
  height: 40vh;
  margin-left: calc(-945px/2);
  /* gap: 30.5vw; */

}

.timeline-crop {
  overflow: hidden;
  width: calc(945px*63);
  /* width: 100vw; */

}

.bottom {
  margin-top: 21vh;
  height: 43vh;
  align-items: start;
  grid-template-columns: repeat(31, 1890px);
  margin-left: calc(945px/2);
}


@keyframes rotate {
      0% {
        transform: translateY(-50px);
      }
      50% {
        transform: translateY(50px);
      }
      100% {
        transform: translateY(-50px);
      }
    }

</style>
