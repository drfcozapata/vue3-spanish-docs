<script setup lang="ts">
import PageHero from '@theme/components/PageHero.vue'

defineProps<{ title?: string }>()
</script>

<template>
  <PageHero>
    <template #title>{{ title || 'Socios de Vue' }}</template>
    <template #lead>
      <p>
        Los socios de Vue son agencias avaladas por el equipo de Vue que ofrecen servicios de consultoría y desarrollo de primera clase.
Si estás interesado en que tu empresa aparezca en la lista de socios, por favor,
<a class="link" href="https://airtable.com/shrCQhat57SApJI2l" target="_blank">registra tu interés aquí</a
>.
      </p>
    </template>
  </PageHero>
</template>
