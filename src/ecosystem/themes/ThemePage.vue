<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Temas</template>
      <template #lead>Echa un vistazo a los temas, kits de interfaz de usuario y plugins. Podrás ver cómo nuestros socios crean aplicaciones reales con Vue.</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Want to feature your themes here? <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">Contact us!</a>
    </ThemeContact>
  </div>
</template>
