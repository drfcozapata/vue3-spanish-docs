# Renderizado Condicional {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Free Vue.js Conditional Rendering Lesson"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

La directiva `v-if` se utiliza para renderizar un bloque condicionalmente. El bloque solo se renderizará si la expresión de la directiva devuelve un valor verdadero (truthy).

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

Puedes usar la directiva `v-else` para indicar un "bloque else" para `v-if`:

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLs5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Un elemento `v-else` debe seguir inmediatamente a un elemento `v-if` o `v-else-if`; de lo contrario, no será reconocido.

## `v-else-if` {#v-else-if}

`v-else-if`, como su nombre indica, sirve como un "bloque else if" para `v-if`. También se puede encadenar varias veces:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Similar a `v-else`, un elemento `v-else-if` debe seguir inmediatamente a un elemento `v-if` o `v-else-if`.

## `v-if` en `<template>` {#v-if-on-template}

Debido a que `v-if` es una directiva, debe adjuntarse a un solo elemento. Pero, ¿qué pasa si queremos alternar más de un elemento? En este caso, podemos usar `v-if` en un elemento `<template>`, que sirve como un envoltorio invisible. El resultado final renderizado no incluirá el elemento `<template>`.

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` y `v-else-if` también se pueden usar en `<template>`.

## `v-show` {#v-show}

Otra opción para mostrar condicionalmente un elemento es la directiva `v-show`. El uso es en gran medida el mismo:

```vue-html
<h1 v-show="ok">Hello!</h1>
```

La diferencia es que un elemento con `v-show` siempre se renderizará y permanecerá en el DOM; `v-show` solo alterna la propiedad CSS `display` del elemento.

`v-show` no soporta el elemento `<template>`, ni funciona con `v-else`.

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` es un renderizado condicional "real" porque asegura que los listeners de eventos y los componentes hijos dentro del bloque condicional sean correctamente destruidos y recreados durante las alternancias.

`v-if` también es **perezoso**: si la condición es falsa en el renderizado inicial, no hará nada; el bloque condicional no se renderizará hasta que la condición se vuelva verdadera por primera vez.

En comparación, `v-show` es mucho más simple: el elemento siempre se renderiza independientemente de la condición inicial, con alternancia basada en CSS.

En términos generales, `v-if` tiene mayores costos de alternancia mientras que `v-show` tiene mayores costos de renderizado inicial. Por lo tanto, prefiere `v-show` si necesitas alternar algo muy a menudo, y prefiere `v-if` si es poco probable que la condición cambie en tiempo de ejecución.

## `v-if` con `v-for` {#v-if-with-v-for}

Cuando `v-if` y `v-for` se usan ambos en el mismo elemento, `v-if` se evaluará primero. Consulta la [guía de renderizado de listas](list#v-for-with-v-if) para más detalles.

::: warning Nota
**No** se recomienda usar `v-if` y `v-for` en el mismo elemento debido a la precedencia implícita. Consulta la [guía de renderizado de listas](list#v-for-with-v-if) para más detalles.
:::