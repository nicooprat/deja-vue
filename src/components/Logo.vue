<template>
  <header class="mb-16">
    <svg width="204" height="132" viewBox="0 0 408 264" class="logo mx-auto mb-8">
      <g fill-rule="nonzero" fill="none">
        <g fill="#41B883" opacity=".2">
          <path class="logo-left" d="M.5 101.6L53 131.8.5 162v100.7l226.7-131L.5 1z" />
          <path class="logo-right" d="M180.5 101.1l52.4 30.2-52.4 30.3v100.6l226.7-130.9L180.5.5z" />
        </g>
        <g class="logo-center">
          <path fill="#41B883" d="M91.5 102.1l52.4 30.2-52.4 30.3v100.6l226.7-130.9L91.5 1.5z" />
          <path fill="#34495E" d="M92.2 101.5l52.3 30.3L92.2 162v48.3l136-78.5-136-78.6z" />
        </g>
      </g>
    </svg>
    <h1 class="text-5xl text-greenvue font-black">DejaVue</h1>
    <a
      class="text-gray-500 underline text-sm hover:text-greenvue focus:text-greenvue focus:outline-none"
      href="https://github.com/nicooprat/deja-vue"
    >
      License, credits & fork on Github
    </a>
  </header>
</template>

<style scoped>
.logo {
  max-width: 260px;
  height: auto;
  overflow: visible;
}
.logo-center {
  animation: logo-center 800ms 500ms 1 both;
}

.logo-right {
  animation: logo-right 800ms 600ms 1 both;
}

.logo-left {
  animation: logo-left 800ms 900ms 1 both;
}

@keyframes logo-center {
  0% {
    transform: translateX(-50%);
    opacity: 0;
  }
  40% {
    transform: translateX(15%);
    opacity: 1;
  }
  65% {
    transform: translateX(-10%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes logo-right {
  0% {
    transform: translateX(-20%);
    opacity: 0;
  }
  40% {
    transform: translateX(8%);
  }
  60% {
    transform: translateX(-10%);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes logo-left {
  0% {
    transform: translateX(20%);
    opacity: 0;
  }
  40% {
    transform: translateX(-3%);
  }
  80% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
