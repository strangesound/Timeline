<template>
    <div  @click="closeDetail" class="event-detail">
        <!-- <div class="scroll-container" @click.stop> -->
            <div class="content">
                <img src="/svitok.webp" alt="Свиток" class="svitok">
                <img class="landmark" :src="`/images/image${event.number}.webp`" alt="">
                <!-- <h2>{{ event.group }}</h2> -->
                <!-- <h3>{{ event.dates }}</h3> -->
                <!-- <p><strong>{{ event.short }}</strong></p> -->
                <!-- <p>{{ event.description }}</p> -->
                <p>{{ event.long }}</p>

            </div>
        <!-- </div> -->
        <button @click="closeDetail">Закрыть</button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    event: Object,
});

const emit = defineEmits(['close-detail']);

const closeDetail = () => {
    emit('close-detail');
};
</script>

<style scoped>
p{
    text-align: left;
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