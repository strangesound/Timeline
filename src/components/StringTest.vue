<template>
  <canvas ref="canvas" width="3840" height="2160"></canvas>
</template>

<style>
/* canvas {
  position: absolute;
  top: 0;
  left: 0;
} */
</style>



<script setup>
import { onMounted, ref, watch } from 'vue';


const canvas = ref(null);

onMounted(() => {
  const gl = canvas.value.getContext('webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    uniform vec2 u_resolution;
    uniform float u_time;
    varying vec2 v_texCoord;

    void main() {
      float amplitude = 50.0;
      float frequency = 2.0;
      vec2 position = a_position;

      // Нормализуем координаты по оси X
      float normalizedX = position.x / u_resolution.x;

      // edgeFactor будет 1 в центре и 0 на краях
      float edgeFactor = 1.0 - smoothstep(0.0, 0.5, abs(normalizedX - 0.5) * 0.9);

      // Вычисляем смещение
      float displacement = edgeFactor * amplitude * sin(normalizedX * frequency * 3.14159 + u_time);
      position.y += displacement;

      // Преобразуем координаты в диапазон от -1 до 1 для WebGL
      position = (position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(position * vec2(1, -1), 0, 1);
      v_texCoord = a_texCoord;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;

    void main() {
      // Используем текстуру
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    // console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    // console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
  const imageUniformLocation = gl.getUniformLocation(program, 'u_image');

  const positions = [];
  const texCoords = [];
  const width = 3840;
  const height = 200;
  const numVertices = width;

  for (let i = 0; i < numVertices; i++) {
    const x = i;
    const y1 = 980;
    const y2 = 1180;
    positions.push(x, y1, x, y2);
    texCoords.push(i / (numVertices - 1), 0, i / (numVertices - 1), 1);
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  const image = new Image();
  image.src = '/string1.png';  // Замените на путь к вашему изображению
  image.onload = () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    requestAnimationFrame(drawScene);
  };

  function drawScene(time) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    const u_time = time * 0.001;
    gl.uniform1f(timeUniformLocation, u_time);

    gl.uniform1i(imageUniformLocation, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices * 2);

    requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
});



</script>


