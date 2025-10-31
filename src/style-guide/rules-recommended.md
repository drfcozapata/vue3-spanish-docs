# Reglas de Prioridad C: Recomendadas {#priority-c-rules-recommended}

::: warning Nota
Esta Guía de Estilo de Vue.js está desactualizada y necesita ser revisada. Si tienes alguna pregunta o sugerencia, por favor [abre una issue](https://github.com/vuejs/docs/issues/new).
:::

Cuando existen múltiples opciones igualmente buenas, se puede hacer una elección arbitraria para asegurar la consistencia. En estas reglas, describimos cada opción aceptable y sugerimos una elección predeterminada. Esto significa que puedes sentirte libre de hacer una elección diferente en tu propio código base, siempre y cuando seas consistente y tengas una buena razón. ¡Pero por favor, ten una buena razón! Al adaptarte al estándar de la comunidad, podrás:

1. Entrenar tu cerebro para analizar más fácilmente la mayor parte del código de la comunidad que encuentres
2. Poder copiar y pegar la mayoría de los ejemplos de código de la comunidad sin modificación
3. A menudo descubrir que los nuevos empleados ya están acostumbrados a tu estilo de codificación preferido, al menos en lo que respecta a Vue

## Orden de las opciones de componente/instancia {#component-instance-options-order}

**Las opciones de componente/instancia deben ordenarse de manera consistente.**

Este es el orden predeterminado que recomendamos para las opciones de componente. Están divididas en categorías, para que sepas dónde añadir nuevas propiedades de los plugins.

1.  **Conocimiento Global** (requiere conocimiento más allá del componente)

    -   `name`

2.  **Opciones del Compilador de Plantillas** (cambia la forma en que se compilan las plantillas)

    -   `compilerOptions`

3.  **Dependencias de Plantillas** (recursos utilizados en la plantilla)

    -   `components`
    -   `directives`

4.  **Composición** (fusiona propiedades en las opciones)

    -   `extends`
    -   `mixins`
    -   `provide`/`inject`

5.  **Interfaz** (la interfaz del componente)

    -   `inheritAttrs`
    -   `props`
    -   `emits`

6.  **Composition API** (el punto de entrada para usar la Composition API)

    -   `setup`

7.  **Estado Local** (propiedades reactivas locales)

    -   `data`
    -   `computed`

8.  **Eventos** (callbacks activados por eventos reactivos)

    -   `watch`
    -   Eventos del Ciclo de Vida (en el orden en que son llamados)
        -   `beforeCreate`
        -   `created`
        -   `beforeMount`
        -   `mounted`
        -   `beforeUpdate`
        -   `updated`
        -   `activated`
        -   `deactivated`
        -   `beforeUnmount`
        -   `unmounted`
        -   `errorCaptured`
        -   `renderTracked`
        -   `renderTriggered`

9.  **Propiedades No Reactivas** (propiedades de instancia independientes del sistema de reactividad)

    -   `methods`

10. **Renderizado** (la descripción declarativa de la salida del componente)
    -   `template`/`render`

## Orden de los atributos de elemento {#element-attribute-order}

**Los atributos de los elementos (incluyendo componentes) deben ordenarse de manera consistente.**

Este es el orden predeterminado que recomendamos para las opciones de componente. Están divididas en categorías, para que sepas dónde añadir atributos y directivas personalizados.

1.  **Definición** (proporciona las opciones del componente)

    -   `is`

2.  **Renderizado de Lista** (crea múltiples variaciones del mismo elemento)

    -   `v-for`

3.  **Condicionales** (si el elemento se renderiza/muestra)

    -   `v-if`
    -   `v-else-if`
    -   `v-else`
    -   `v-show`
    -   `v-cloak`

4.  **Modificadores de Renderizado** (cambia la forma en que se renderiza el elemento)

    -   `v-pre`
    -   `v-once`

5.  **Conocimiento Global** (requiere conocimiento más allá del componente)

    -   `id`

6.  **Atributos Únicos** (atributos que requieren valores únicos)

    -   `ref`
    -   `key`

7.  **Enlace Bidireccional** (combina enlace y eventos)

    -   `v-model`

8.  **Otros Atributos** (todos los atributos enlazados y no enlazados no especificados)

9.  **Eventos** (listeners de eventos del componente)

    -   `v-on`

10. **Contenido** (sobrescribe el contenido del elemento)
    -   `v-html`
    -   `v-text`

## Líneas vacías en las opciones de componente/instancia {#empty-lines-in-component-instance-options}

**Es posible que quieras añadir una línea vacía entre propiedades de varias líneas, particularmente si las opciones ya no caben en tu pantalla sin hacer scroll.**

Cuando los componentes empiezan a sentirse apretados o difíciles de leer, añadir espacios entre propiedades de varias líneas puede hacer que sean más fáciles de escanear de nuevo. En algunos editores, como Vim, las opciones de formato como esta también pueden hacerlos más fáciles de navegar con el teclado.

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```js
// Los espacios tampoco son un problema, siempre y cuando el componente
// siga siendo fácil de leer y navegar.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## Orden de los elementos de nivel superior en componentes de archivo único {#single-file-component-top-level-element-order}

**Los [Componentes de Archivo Único](/guide/scaling-up/sfc) siempre deben ordenar las etiquetas `<script>`, `<template>` y `<style>` de manera consistente, con `<style>` al final, porque al menos una de las otras dos es siempre necesaria.**

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html [ComponentX.vue]
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html [ComponentA.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html [ComponentA.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

o

```vue-html  [ComponentA.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

```vue-html [ComponentB.vue]
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>