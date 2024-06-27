<template>
    <div @click="closeDetail" class="event-detail">

        <video ref="svitok" class="svitok" playsinline autoplay muted :src="`/svitki/${props.event.length}.webm`"></video>
        <img ref="eventText" :src="`/figma_images/${String(event.id + 1).padStart(2, '0')}.webp`" alt="Свиток" class="fscreen opacity0">

        <!-- <div class="content">
                <img src="/svitok.webp" alt="Свиток" class="svitok">
                <img class="landmark" :src="`/images/${event.id+1}.webp`" alt="">
                <p>{{formattedText}}</p>

            </div> -->
        <!-- </div> -->
        <!-- <button @click="closeDetail">Закрыть</button> -->
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import Typograf from 'typograf';
const tp = new Typograf({ locale: ['ru', 'en-US'] });

const eventText = ref(null)
const svitok = ref(null)


const props = defineProps({
    event: Object,
});

// const formattedText = computed(() => tp.execute(props.event.long));



const emit = defineEmits(['close-detail']);

const closeDetail = () => {
    emit('close-detail');
};


onMounted(() => {

    svitok.value.style.width = `${props.event.length+400}px`;
        setTimeout(() => {
            eventText.value.style.opacity = 1
        }, 2000);

});

</script>

<style scoped>
.opacity0 {
    opacity: 0;
    transition: opacity 1s;
}

.fscreen {
    position: absolute;
    left: 50%;
    height: 50%;
    transform: translate(-50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: darken;
}

.svitok {
    width: 2490px;
    height: 1500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    object-fit: cover;
}

p {
    text-align: left;
    white-space: pre-wrap;
}

.scroll-container {
    mix-blend-mode: multiply;
}

.landmark {
    width: 700px;
    height: 500px;
    /* z-index: 1; */
    mix-blend-mode: multiply;
}

.event-detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.56);
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    z-index: 1000;

}



.content {
    display: flex;
    gap: 50px;
    padding: 20px;
    /* z-index: 999; */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: start;
    margin-left: -2vw;
}

button {
    position: absolute;
    top: 5%;
    right: 5%;
    margin-top: 20px;
    padding: 10px 20px;
    background: #ffcc00;
    border: none;
    cursor: pointer;
    font-size: 2vw;
}
</style>