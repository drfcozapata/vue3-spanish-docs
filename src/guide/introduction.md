---
footer: false
---

# Introducción {#introduction}

:::info ¡Estás leyendo la documentación de Vue 3!

- El soporte para Vue 2 finalizó el **31 de diciembre de 2023**. Obtén más información sobre el [Fin de Vida Útil (EOL) de Vue 2](https://v2.vuejs.org/eol/).
- ¿Actualizando desde Vue 2? Consulta la [Guía de Migración](https://v3-migration.vuejs.org/).
  :::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Aprende Vue con tutoriales en video en <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## ¿Qué es Vue? {#what-is-vue}

Vue (pronunciado /vjuː/, como **view**) es un framework de JavaScript para construir interfaces de usuario. Se basa en HTML, CSS y JavaScript estándar y proporciona un modelo de programación declarativo y basado en componentes que te ayuda a desarrollar de manera eficiente interfaces de usuario de cualquier complejidad.

Aquí tienes un ejemplo mínimo:

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

**Resultado**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>

El ejemplo anterior demuestra las dos características principales de Vue:

- **Renderizado Declarativo**: Vue extiende el HTML estándar con una sintaxis de plantilla que nos permite describir declarativamente la salida HTML basándose en el estado de JavaScript.

- **Reactividad**: Vue rastrea automáticamente los cambios de estado de JavaScript y actualiza de manera eficiente el DOM cuando ocurren cambios.

Es posible que ya tengas preguntas; no te preocupes. Cubriremos cada pequeño detalle en el resto de la documentación. Por ahora, sigue leyendo para que puedas tener una comprensión general de lo que ofrece Vue.

:::tip Requisitos previos
El resto de la documentación asume una familiaridad básica con HTML, CSS y JavaScript. Si eres completamente nuevo en el desarrollo frontend, quizás no sea la mejor idea sumergirte directamente en un framework como tu primer paso: ¡comprende los conceptos básicos y luego vuelve! Puedes verificar tu nivel de conocimiento con estas descripciones generales para [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML) y [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) si es necesario. La experiencia previa con otros frameworks ayuda, pero no es obligatoria.
:::

## El Framework Progresivo {#the-progressive-framework}

Vue es un framework y un ecosistema que cubre la mayoría de las características comunes necesarias en el desarrollo frontend. Pero la web es extremadamente diversa; las cosas que construimos en la web pueden variar drásticamente en forma y escala. Con esto en mente, Vue está diseñado para ser flexible y adaptable de forma incremental. Dependiendo de tu caso de uso, Vue puede utilizarse de diferentes maneras:

- Mejorando HTML estático sin un paso de construcción
- Incrustado como Web Components en cualquier página
- Aplicación de Una Sola Página (SPA)
- Fullstack / Renderizado del Lado del Servidor (SSR)
- Jamstack / Generación de Sitios Estáticos (SSG)
- Orientado a escritorio, móvil, WebGL e incluso la terminal

Si encuentras estos conceptos intimidantes, ¡no te preocupes! El tutorial y la guía solo requieren conocimientos básicos de HTML y JavaScript, y deberías poder seguirlos sin ser un experto en ninguno de ellos.

Si eres un desarrollador experimentado interesado en cómo integrar mejor Vue en tu stack, o tienes curiosidad sobre lo que significan estos términos, los discutimos con más detalle en [Formas de Usar Vue](/guide/extras/ways-of-using-vue).

A pesar de la flexibilidad, el conocimiento central sobre cómo funciona Vue se comparte en todos estos casos de uso. Incluso si eres un principiante ahora, el conocimiento adquirido a lo largo del camino seguirá siendo útil a medida que crezcas para abordar objetivos más ambiciosos en el futuro. Si eres un veterano, puedes elegir la forma óptima de aprovechar Vue basándote en los problemas que intentas resolver, manteniendo la misma productividad. Por eso llamamos a Vue "El Framework Progresivo": es un framework que puede crecer contigo y adaptarse a tus necesidades.

## Componentes de un Solo Archivo {#single-file-components}

En la mayoría de los proyectos Vue que utilizan herramientas de construcción, creamos componentes Vue usando un formato de archivo similar a HTML llamado **Componente de un Solo Archivo** (también conocido como archivos `*.vue`, abreviado como **SFC**). Un SFC de Vue, como su nombre indica, encapsula la lógica (JavaScript), la plantilla (HTML) y los estilos (CSS) del componente en un solo archivo. Aquí tienes el ejemplo anterior, escrito en formato SFC:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

SFC es una característica distintiva de Vue y es la forma recomendada de crear componentes Vue **si** tu caso de uso justifica una configuración de construcción. Puedes aprender más sobre el [cómo y por qué de los SFC](/guide/scaling-up/sfc) en su sección dedicada, pero por ahora, solo ten en cuenta que Vue se encargará de toda la configuración de las herramientas de construcción por ti.

## Estilos de API {#api-styles}

Los componentes Vue pueden crearse en dos estilos de API diferentes: **Options API** y **Composition API**.

### Options API {#options-api}

Con Options API, definimos la lógica de un componente usando un objeto de opciones como `data`, `methods` y `mounted`. Las propiedades definidas por las opciones se exponen en `this` dentro de las funciones, lo que apunta a la instancia del componente:

```vue
<script>
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      count: 0
    }
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    increment() {
      this.count++
    }
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### Composition API {#composition-api}

Con Composition API, definimos la lógica de un componente usando funciones de API importadas. En SFC, Composition API se utiliza típicamente con [`<script setup>`](/api/sfc-script-setup). El atributo `setup` es una indicación que hace que Vue realice transformaciones en tiempo de compilación que nos permiten usar Composition API con menos boilerplate. Por ejemplo, las importaciones y las variables/funciones de nivel superior declaradas en `<script setup>` son directamente utilizables en la plantilla.

Aquí está el mismo componente, con la misma plantilla, pero usando Composition API y `<script setup>` en su lugar:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### ¿Cuál Elegir? {#which-to-choose}

Ambos estilos de API son completamente capaces de cubrir casos de uso comunes. Son interfaces diferentes impulsadas por el mismo sistema subyacente. De hecho, ¡la Options API está implementada sobre la Composition API! Los conceptos fundamentales y el conocimiento sobre Vue se comparten entre los dos estilos.

La Options API se centra en el concepto de "instancia de componente" (`this` como se ve en el ejemplo), lo que generalmente se alinea mejor con un modelo mental basado en clases para usuarios provenientes de lenguajes orientados a objetos. También es más amigable para principiantes al abstraer los detalles de reactividad y al hacer cumplir la organización del código a través de grupos de opciones.

La Composition API se centra en declarar variables de estado reactivas directamente en un ámbito de función y en componer el estado a partir de múltiples funciones para manejar la complejidad. Es más de estilo libre y requiere una comprensión de cómo funciona la reactividad en Vue para ser utilizada eficazmente. A cambio, su flexibilidad permite patrones más potentes para organizar y reutilizar la lógica.

Puedes aprender más sobre la comparación entre los dos estilos y los beneficios potenciales de Composition API en las [Preguntas Frecuentes de Composition API](/guide/extras/composition-api-faq).

Si eres nuevo en Vue, aquí está nuestra recomendación general:

- Para propósitos de aprendizaje, opta por el estilo que te resulte más fácil de entender. De nuevo, la mayoría de los conceptos centrales se comparten entre los dos estilos. Siempre puedes aprender el otro estilo más adelante.

- Para uso en producción:

  - Opta por Options API si no estás usando herramientas de construcción, o planeas usar Vue principalmente en escenarios de baja complejidad, por ejemplo, mejora progresiva.

  - Opta por Composition API + Componentes de un Solo Archivo si planeas construir aplicaciones completas con Vue.

No tienes que comprometerte con un solo estilo durante la fase de aprendizaje. El resto de la documentación proporcionará ejemplos de código en ambos estilos cuando sea aplicable, y puedes alternar entre ellos en cualquier momento usando los **interruptores de Preferencia de API** en la parte superior de la barra lateral izquierda.

## ¿Aún Tienes Preguntas? {#still-got-questions}

Consulta nuestras [Preguntas Frecuentes](/about/faq).

## Elige Tu Ruta de Aprendizaje {#pick-your-learning-path}

Diferentes desarrolladores tienen diferentes estilos de aprendizaje. Siéntete libre de elegir una ruta de aprendizaje que se adapte a tus preferencias, ¡aunque sí recomendamos revisar todo el contenido, si es posible!

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Prueba el Tutorial</p>
    <p class="next-steps-caption">Para aquellos que prefieren aprender de forma práctica.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Lee la Guía</p>
    <p class="next-steps-caption">La guía te lleva a través de cada aspecto del framework con todo detalle.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Revisa los Ejemplos</p>
    <p class="next-steps-caption">Explora ejemplos de características principales y tareas comunes de UI.</p>
  </a>
</div>