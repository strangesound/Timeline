<template>
  <div class="container">
    <!-- <div class="string-container" :style="{ transform: `translateX(${-scrollLeft}px)` }">
      <StringTest v-for="n in 5" :key="n" />
    </div> -->
    <div class="timeline gray"></div>
    <div class="timeline yellow" ref="yellowTimeline" @click="handleTimelineClick"></div>
    <div class="group-container">
      <p class="group-name" :style="{ transform: `translateX(${groupPosition}px)` }" v-html="mostDatesGroup"></p>
    </div>
    <!-- <div class="group-range-line"
      :style="{ left: `${startPosition+200}px`, width: `${endPosition - startPosition}px` }">
    </div> -->

    <div class="uzel-container" ref="uzelContainer" @scroll="handleScroll">
      <div class="rope-left-right">
        <img src="/kanat/rope.webp" alt="" class="rope-left" ref="ropeLeft">
        <div class="uzel-and-timeline-container">
          <div class="uzelok" ref="uzelok"></div>
          <div class="timeline-crop">
            <div class="timeline-items-container">
              <TimelineItem v-for="event in evenEvents" :key="event.id" :event="event" @show-detail="showDetail" />
            </div>
            <div class="timeline-items-container bottom">
              <TimelineItem v-for="event in oddEvents" :key="event.id" :event="event" @show-detail="showDetail" />
            </div>
          </div>
        </div>
        <img src="/kanat/rope.webp" alt="" class="rope-left rope-right" ref="ropeRight">

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

    // console.log('minYear-maxYear', minYear, ' - ', maxYear);

    updateYellowTimeline(minYear, maxYear);
  } else {
    updateYellowTimeline(0, 0);
  }

  updateMostDatesGroup(visibleEvents)

};

const mostDatesGroup = ref('')

const updateMostDatesGroup = (visibleEvents) => {
  const groupCounts = visibleEvents.reduce((acc, event) => {
    acc[event.group] = (acc[event.group] || 0) + 1;
    return acc;
  }, {});

  mostDatesGroup.value = Object.keys(groupCounts).reduce((a, b) =>
    groupCounts[a] > groupCounts[b] ? a : b, '');

  calculateGroupCenter()
};


const minTimelineYear = 1685;
const maxTimelineYear = 2035;


const updateYellowTimeline = (minYear, maxYear) => {
  const timelineWidth = yellowTimeline.value.scrollWidth;

  const startPercentage = (minYear - minTimelineYear) / (maxTimelineYear - minTimelineYear);
  const endPercentage = (maxYear - minTimelineYear) / (maxTimelineYear - minTimelineYear);

  const maskWidth = (endPercentage - startPercentage) * timelineWidth;
  const maskPosition = startPercentage * timelineWidth;

  // console.log('startPercentage', startPercentage);
  // console.log('endPercentage', endPercentage);
  // console.log('maskWidth', maskWidth);
  // console.log('maskPosition', maskPosition);
  // console.log('timelineWidth', timelineWidth);

  yellowTimeline.value.style.maskSize = `${maskWidth}px 100vh`;
  yellowTimeline.value.style.maskPosition = `${maskPosition}px center`;


  // groupPosition.value = Math.min(Math.max(maskPosition - 1000 / 2, 0), 3440 - 1000);

};

const groupPosition = ref(0)
const startPosition = ref(0)
const endPosition = ref(0)
const centerPosition = ref(0)

const calculateGroupCenter = () => {
  const groupEvents = events.value.filter(event => event.group === mostDatesGroup.value);
  const years = groupEvents.flatMap(event => event.dates.match(/\d{4}/g).map(Number));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  // const averageYear = years.reduce((sum, year) => sum + year, 0) / years.length;
  const averageYear = maxYear - (maxYear - minYear) / 2;

  const timelineWidth = yellowTimeline.value.scrollWidth;
  // console.log('minYear', minYear);
  // console.log('maxYear', maxYear);
  // console.log('averageYear', averageYear);
  startPosition.value = ((minYear - minTimelineYear) / (maxTimelineYear - minTimelineYear)) * timelineWidth;
  endPosition.value = ((maxYear - minTimelineYear) / (maxTimelineYear - minTimelineYear)) * timelineWidth;
  centerPosition.value = ((averageYear - minTimelineYear) / (maxTimelineYear - minTimelineYear)) * timelineWidth;

  // console.log('centerPosition', centerPosition.value);



  const groupWidth = 1000;
  groupPosition.value = Math.min(Math.max((centerPosition.value - groupWidth / 2), 0), yellowTimeline.value.scrollWidth - groupWidth / 2);
  // console.log('groupPosition', groupPosition.value);
  // groupPosition.value = Math.min(Math.max(position - groupWidth / 2, 0), yellowTimeline.value.scrollWidth - groupWidth) + 200;

};



const scrollLeft = ref(0);
let lastScrollLeft = 0;
let lastTimestamp = Date.now();
const uzelok = ref(null);
const ropeLeft = ref(null);
const ropeRight = ref(null);

// Переменные для управления частотой и амплитудой волны
const amplitude = ref(10);
const maxAmplitude = 60;
const minAmplitude = 5;
let frequency = .5;
let animationFrameId;



const animate = () => {

  const time = Date.now() / 1000; // Время в секундах
  const timeDiff = time - lastTimestamp;
  const scrollSpeed = Math.abs(scrollLeft.value - lastScrollLeft) / timeDiff;
  console.log('scrollSpeed', scrollSpeed);

  if (uzelok.value) {
    const transformY = Math.sin(time * frequency * Math.PI * 2) * amplitude.value;

    uzelok.value.style.transform = `translateY(${transformY + 130}px)`;
    ropeLeft.value.style.transform = `translateY(${transformY + 130}px)`;
    ropeRight.value.style.transform = `translateY(${transformY + 130}px)`;
  }
  lastScrollLeft = scrollLeft.value;
  lastTimestamp = time;

  // Плавное затухание амплитуды, если прокрутка остановлена
  if (amplitude.value > minAmplitude) {
    amplitude.value -= 0.1; // Скорость затухания
    if (amplitude.value < minAmplitude) {
      amplitude.value = minAmplitude;
    }
  }

  if (scrollSpeed/120 > amplitude.value) {
    amplitude.value = Math.max(minAmplitude, Math.min(maxAmplitude, scrollSpeed/120));
  }

  animationFrameId = requestAnimationFrame(animate);

  console.log('amplitude.value',amplitude.value);


};

const handleScroll = (event) => {
  calculateYearsRange();

  scrollLeft.value = event.target.scrollLeft;


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

  animate(); // Запускаем анимацию


  calculateYearsRange();
  // window.addEventListener('resize', calculateYearsRange);


});
</script>

<style scoped>
.group-range-line {
  position: absolute;
  top: 15%;
  height: 2px;
  background-color: #B56E09;
  z-index: 999;
  transition: all 1s;
}


.rope-left-right {
  position: relative;
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: calc(506px*65);


}

.rope-left {
  /* position: absolute; */
  /* margin-right: 506px; */
  left: 0;
  margin-top: -11.3vh;
  width: 506px;
  height: 195px;
  object-fit: contain;
  transition: transform 0.1s linear;

  /* animation: moveUpDown 6s infinite ease-in-out; */

}

.rope-right {
  right: 0;
}

.uzel-and-timeline-container {
  position: relative;
  height: 2160px;
}


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
  top: 5%;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
  mask-image: url('/edges_mask.webp');
  /* animation: rotate 20s infinite alternate ease;  */

}

.string-container {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: start;
  top: 5%;
  left: 0;
  width: 59535px;
  height: 100vh;
  overflow-x: show;
  pointer-events: none;
}

.uzel-container::-webkit-scrollbar {
  display: none;
}

.uzelok {
  position: absolute;
  left: 0;
  top: 40%;
  /* transform: translateY(-50%); */
  background-image: url("/kanat/uzel.webp");
  height: 195px;
  width: calc(506px*63);
  background-size: contain;
  background-position: center;
  background-repeat: repeat-x;
  filter: drop-shadow(100px 100px 50px #00000094);
  /* animation: moveUpDown 6s infinite ease-in-out; */
  transition: transform 0.1s linear;


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

.group-container {
  position: absolute;
  left: 200px;
  right: 200px;
}


.group-name {
  position: absolute;
  z-index: 999;
  font-size: 30px;
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 11vh;
  width: 1000px;
  text-align: center;
  transition: transform 2s;



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
  position: absolute;
  display: grid;
  grid-template-columns: repeat(32, calc(506px*2));
  flex-direction: row;
  /* width: 60480px; */
  align-items: end;
  height: 40vh;
  margin-left: calc((-506px/2));
  margin-top: 3vh;
}

.timeline-crop {
  overflow: visible;
  width: calc(506px*63);
  /* width: 100vw; */

}

.bottom {
  height: 40vh;
  align-items: start;
  grid-template-columns: repeat(31, calc(506px*2));
  margin-left: calc(506px/2);
  margin-top: 58vh;
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

@keyframes moveUpDown {
  0% {
    transform: translateY(-72px);
  }

  50% {
    transform: translateY(-122px);
  }

  100% {
    transform: translateY(-72px);
  }
}
</style>
