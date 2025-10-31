# Componentes de Archivo Único (SFC) {#single-file-components}

## Introducción {#introduction}

Los Componentes de Archivo Único de Vue (también conocidos como archivos `*.vue`, abreviados como **SFC**) son un formato de archivo especial que nos permite encapsular la plantilla, la lógica **y** el estilado de un componente Vue en un solo archivo. Aquí tienes un ejemplo de SFC:

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

Como podemos ver, el SFC de Vue es una extensión natural del trío clásico de HTML, CSS y JavaScript. Los bloques `<template>`, `<script>` y `<style>` encapsulan y colocan juntos la vista, la lógica y el estilo de un componente en el mismo archivo. La sintaxis completa está definida en la [Especificación de Sintaxis de SFC](/api/sfc-spec).

## Por qué SFC {#why-sfc}

Aunque los SFC requieren un paso de compilación, ofrecen numerosos beneficios a cambio:

- Crear componentes modularizados utilizando la sintaxis familiar de HTML, CSS y JavaScript
- [Colocación conjunta de intereses inherentemente acoplados](#what-about-separation-of-concerns)
- Plantillas precompiladas sin costo de compilación en tiempo de ejecución
- [CSS con alcance de componente](/api/sfc-css-features)
- [Sintaxis más ergonómica al trabajar con la Composition API](/api/sfc-script-setup)
- Más optimizaciones en tiempo de compilación mediante el análisis cruzado de plantilla y script
- [Soporte para IDE](/guide/scaling-up/tooling#ide-support) con autocompletado y comprobación de tipos para expresiones de plantilla
- Soporte integrado para Hot-Module Replacement (HMR)

SFC es una característica definitoria de Vue como framework, y es el enfoque recomendado para usar Vue en los siguientes escenarios:

- Aplicaciones de Página Única (SPA)
- Generación de Sitios Estáticos (SSG)
- Cualquier frontend no trivial donde un paso de compilación pueda justificarse para una mejor experiencia de desarrollo (DX).

Dicho esto, somos conscientes de que hay escenarios en los que los SFC pueden parecer excesivos. Por eso, Vue todavía se puede usar a través de JavaScript plano sin un paso de compilación. Si solo buscas mejorar HTML en gran parte estático con interacciones ligeras, también puedes echar un vistazo a [petite-vue](https://github.com/vuejs/petite-vue), un subconjunto de Vue de 6 kB optimizado para la mejora progresiva.

## Cómo Funciona {#how-it-works}

El SFC de Vue es un formato de archivo específico del framework y debe ser precompilado por [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) en JavaScript y CSS estándar. Un SFC compilado es un módulo estándar de JavaScript (ES), lo que significa que con la configuración de compilación adecuada puedes importar un SFC como un módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

Las etiquetas `<style>` dentro de los SFC se inyectan típicamente como etiquetas `<style>` nativas durante el desarrollo para soportar las actualizaciones en caliente. Para producción, pueden ser extraídas y fusionadas en un solo archivo CSS.

Puedes jugar con SFC y explorar cómo se compilan en el [Vue SFC Playground](https://play.vuejs.org/).

En proyectos reales, normalmente integramos el compilador de SFC con una herramienta de construcción como [Vite](https://vitejs.dev/) o [Vue CLI](http://cli.vuejs.org/) (que se basa en [webpack](https://webpack.js.org/)), y Vue proporciona herramientas de andamiaje oficiales para que puedas empezar con los SFC lo más rápido posible. Consulta más detalles en la sección de [Herramientas de SFC](/guide/scaling-up/tooling).

## ¿Qué pasa con la Separación de Intereses? {#what-about-separation-of-concerns}

Algunos usuarios con experiencia en desarrollo web tradicional pueden tener la preocupación de que los SFC mezclan diferentes intereses en el mismo lugar, ¡algo que HTML/CSS/JS supuestamente debían separar!

Para responder a esta pregunta, es importante que estemos de acuerdo en que la **separación de intereses no es igual a la separación de tipos de archivo**. El objetivo final de los principios de ingeniería es mejorar la mantenibilidad de las bases de código. La separación de intereses, cuando se aplica dogmáticamente como separación de tipos de archivo, no nos ayuda a alcanzar ese objetivo en el contexto de aplicaciones frontend cada vez más complejas.

En el desarrollo de UI moderno, hemos descubierto que en lugar de dividir la base de código en tres grandes capas que se entrelazan entre sí, tiene mucho más sentido dividirlas en componentes débilmente acoplados y componerlos. Dentro de un componente, su plantilla, lógica y estilos están inherentemente acoplados, y colocarlos juntos realmente hace que el componente sea más cohesivo y mantenible.

Ten en cuenta que, incluso si no te agrada la idea de los Componentes de Archivo Único, aún puedes aprovechar sus características de recarga en caliente y precompilación separando tu JavaScript y CSS en archivos separados usando [Src Imports](/api/sfc-spec#src-imports).
