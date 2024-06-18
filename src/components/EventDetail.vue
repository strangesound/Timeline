<template>
    <div  @click="closeDetail" class="event-detail">
            <div class="content">
                <img src="/svitok.webp" alt="Свиток" class="svitok">
                <img class="landmark" :src="`/images/${event.id+1}.webp`" alt="">
                <p>{{formattedText}}</p>

            </div>
        <!-- </div> -->
        <!-- <button @click="closeDetail">Закрыть</button> -->
    </div>
</template>

<script setup>
import { computed } from 'vue';

import Typograf from 'typograf';
const tp = new Typograf({locale: ['ru', 'en-US']});



const props = defineProps({
    event: Object,
});

const formattedText = computed(() => tp.execute(props.event.long));


const emit = defineEmits(['close-detail']);

const closeDetail = () => {
    emit('close-detail');
};
</script>

<style scoped>
p{
    text-align: left;
    white-space: pre-wrap;
}

.scroll-container{
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

.svitok {
    width: 2490px;
    height: 1400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
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