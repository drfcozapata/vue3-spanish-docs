# Gestión del Estado {#state-management}

## ¿Qué es la Gestión del Estado? {#what-is-state-management}

Técnicamente, cada instancia de componente Vue ya "gestiona" su propio estado reactivo. Tomemos un componente de contador simple como ejemplo:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// state
const count = ref(0)

// actions
function increment() {
  count.value++
}
</script>

<!-- view -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // state
  data() {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- view -->
<template>{{ count }}</template>
```

</div>

Es una unidad autocontenida con las siguientes partes:

- El **estado**, la fuente de verdad que impulsa nuestra aplicación;
- La **vista**, un mapeo declarativo del **estado**;
- Las **acciones**, las posibles formas en que el estado podría cambiar en reacción a las entradas del usuario desde la **vista**.

Esta es una representación simple del concepto de "flujo de datos unidireccional":

<p style="text-align: center">
  <img alt="diagrama de flujo de estado" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

Sin embargo, la simplicidad comienza a romperse cuando tenemos **múltiples componentes que comparten un estado común**:

1. Múltiples vistas pueden depender de la misma porción de estado.
2. Las acciones de diferentes vistas pueden necesitar mutar la misma porción de estado.

Para el primer caso, una posible solución es "elevar" el estado compartido a un componente ancestro común, y luego pasarlo hacia abajo como `props`. Sin embargo, esto rápidamente se vuelve tedioso en árboles de componentes con jerarquías profundas, llevando a otro problema conocido como [Prop Drilling](/guide/components/provide-inject#prop-drilling).

Para el segundo caso, a menudo nos encontramos recurriendo a soluciones como acceder a instancias de padre/hijo directas a través de `template refs`, o intentar mutar y sincronizar múltiples copias del estado a través de eventos emitidos. Ambos patrones son frágiles y rápidamente llevan a código inmanejable.

Una solución más simple y directa es extraer el estado compartido de los componentes y gestionarlo en un singleton global. Con esto, nuestro árbol de componentes se convierte en una gran "vista", ¡y cualquier componente puede acceder al estado o desencadenar acciones, sin importar dónde se encuentre en el árbol!

## Gestión de Estado Simple con la API de Reactividad {#simple-state-management-with-reactivity-api}

<div class="options-api">

En la `Options API`, los datos reactivos se declaran utilizando la opción `data()`. Internamente, el objeto devuelto por `data()` se hace reactivo a través de la función [`reactive()`](/api/reactivity-core#reactive), que también está disponible como una API pública.

</div>

Si tienes una porción de estado que debe ser compartida por múltiples instancias, puedes usar [`reactive()`](/api/reactivity-core#reactive) para crear un objeto reactivo, y luego importarlo en múltiples componentes:

```js [store.js]
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue [ComponentA.vue]
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue [ComponentB.vue]
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue [ComponentA.vue]
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue [ComponentB.vue]
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

Ahora, cada vez que el objeto `store` se muta, tanto `<ComponentA>` como `<ComponentB>` actualizarán sus vistas automáticamente: ahora tenemos una única fuente de verdad.

Sin embargo, esto también significa que cualquier componente que importe `store` puede mutarlo como desee:

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

Si bien esto funciona en casos simples, el estado global que puede ser mutado arbitrariamente por cualquier componente no será muy mantenible a largo plazo. Para asegurar que la lógica de mutación de estado esté centralizada como el propio estado, se recomienda definir métodos en el `store` con nombres que expresen la intención de las acciones:

```js{5-7} [store.js]
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd3csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9JasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyL/I/tlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip
Ten en cuenta que el manejador de clic usa `store.increment()` con paréntesis; esto es necesario para llamar al método con el contexto `this` adecuado, ya que no es un método de componente.
:::

Aunque aquí estamos usando un único objeto reactivo como `store`, también puedes compartir estado reactivo creado usando otras [APIs de Reactividad](/api/reactivity-core) como `ref()` o `computed()`, o incluso devolver estado global desde un [Composable](/guide/reusability/composables):

```js
import { ref } from 'vue'

// global state, created in module scope
const globalCount = ref(1)

export function useCount() {
  // local state, created per-component
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

El hecho de que el sistema de reactividad de Vue esté desacoplado del modelo de componentes lo hace extremadamente flexible.

## Consideraciones de SSR {#ssr-considerations}

Si estás construyendo una aplicación que aprovecha el [Renderizado del Lado del Servidor (SSR)](./ssr), el patrón anterior puede llevar a problemas debido a que el `store` es un singleton compartido entre múltiples solicitudes. Esto se discute con [más detalles](./ssr#cross-request-state-pollution) en la guía de SSR.

## Pinia {#pinia}

Si bien nuestra solución de gestión de estado hecha a mano será suficiente en escenarios simples, hay muchas más cosas a considerar en aplicaciones de producción a gran escala:

- Convenciones más sólidas para la colaboración en equipo
- Integración con las Vue DevTools, incluyendo línea de tiempo, inspección en componente y depuración de viaje en el tiempo
- Hot Module Replacement
- Soporte para Renderizado del Lado del Servidor

[Pinia](https://pinia.vuejs.org) es una librería de gestión de estado que implementa todo lo anterior. Es mantenida por el equipo central de Vue y funciona tanto con Vue 2 como con Vue 3.

Los usuarios existentes pueden estar familiarizados con [Vuex](https://vuex.vuejs.org/), la anterior librería oficial de gestión de estado para Vue. Con Pinia desempeñando el mismo papel en el ecosistema, Vuex ahora está en modo de mantenimiento. Todavía funciona, pero ya no recibirá nuevas características. Se recomienda usar Pinia para nuevas aplicaciones.

Pinia comenzó como una exploración de cómo podría ser la próxima iteración de Vuex, incorporando muchas ideas de las discusiones del equipo central para Vuex 5. Finalmente, nos dimos cuenta de que Pinia ya implementa la mayoría de lo que queríamos en Vuex 5, y decidimos convertirla en la nueva recomendación en su lugar.

En comparación con Vuex, Pinia proporciona una API más simple con menos formalidades, ofrece APIs al estilo de la `Composition API` y, lo más importante, tiene un sólido soporte de inferencia de tipos cuando se usa con TypeScript.
