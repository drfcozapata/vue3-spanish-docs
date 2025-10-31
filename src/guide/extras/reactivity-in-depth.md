---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Reactividad en Profundidad {#reactivity-in-depth}

Una de las características más distintivas de Vue es el sistema de reactividad discreto. El estado del componente consiste en objetos JavaScript reactivos. Cuando los modificas, la vista se actualiza. Esto hace que la gestión del estado sea sencilla e intuitiva, pero también es importante entender cómo funciona para evitar algunos errores comunes. En esta sección, profundizaremos en algunos de los detalles de bajo nivel del sistema de reactividad de Vue.

## ¿Qué es la Reactividad? {#what-is-reactivity}

Este término aparece bastante en programación hoy en día, pero ¿a qué se refiere la gente cuando lo usa? La reactividad es un paradigma de programación que nos permite ajustarnos a los cambios de manera declarativa. El ejemplo canónico que la gente suele mostrar, porque es excelente, es una hoja de cálculo de Excel:

<SpreadSheet />

Aquí la celda A2 se define mediante una fórmula `= A0 + A1` (puedes hacer clic en A2 para ver o editar la fórmula), por lo que la hoja de cálculo nos da 3. Nada sorprendente. Pero si actualizas A0 o A1, notarás que A2 también se actualiza automáticamente.

JavaScript no suele funcionar así. Si escribiéramos algo comparable en JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Still 3
```

Cuando mutamos `A0`, `A2` no cambia automáticamente.

Entonces, ¿cómo haríamos esto en JavaScript? Primero, para volver a ejecutar el código que actualiza `A2`, vamos a envolverlo en una función:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Luego, necesitamos definir algunos términos:

- La función `update()` produce un **efecto secundario**, o **efecto** para abreviar, porque modifica el estado del programa.

- `A0` y `A1` se consideran **dependencias** del efecto, ya que sus valores se utilizan para realizar el efecto. Se dice que el efecto es un **suscriptor** de sus dependencias.

Lo que necesitamos es una función mágica que pueda invocar `update()` (el **efecto**) cada vez que `A0` o `A1` (las **dependencias**) cambien:

```js
whenDepsChange(update)
```

Esta función `whenDepsChange()` tiene las siguientes tareas:

1. Rastrea cuándo se lee una variable. Por ejemplo, al evaluar la expresión `A0 + A1`, se leen tanto `A0` como `A1`.

2. Si se lee una variable mientras hay un efecto en ejecución, convierte ese efecto en un suscriptor de esa variable. Por ejemplo, debido a que `A0` y `A1` se leen cuando se ejecuta `update()`, `update()` se convierte en un suscriptor tanto de `A0` como de `A1` después de la primera llamada.

3. Detecta cuándo se muta una variable. Por ejemplo, cuando se asigna un nuevo valor a `A0`, notifica a todos sus efectos suscriptores para que se vuelvan a ejecutar.

## Cómo Funciona la Reactividad en Vue {#how-reactivity-works-in-vue}

Realmente no podemos rastrear la lectura y escritura de variables locales como en el ejemplo. Simplemente no hay un mecanismo para hacerlo en JavaScript puro. Lo que sí **podemos** hacer es interceptar la lectura y escritura de **propiedades de objetos**.

Hay dos formas de interceptar el acceso a propiedades en JavaScript: [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) y [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 utilizaba getters / setters exclusivamente debido a limitaciones de soporte de navegadores. En Vue 3, se utilizan Proxies para objetos `reactive` y getters / setters para `refs`. Aquí hay un pseudocódigo que ilustra cómo funcionan:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Los fragmentos de código aquí y a continuación tienen como objetivo explicar los conceptos centrales de la forma más sencilla posible, por lo que se omiten muchos detalles y se ignoran los casos límite.
:::

Esto explica algunas [limitaciones de los objetos reactivos](/guide/essentials/reactivity-fundamentals#limitations-of-reactive) que hemos discutido en la sección de fundamentos:

- Cuando asignas o desestructuras la propiedad de un objeto `reactive` a una variable local, el acceso o la asignación a esa variable no es reactivo porque ya no dispara los "proxy traps" de `get` / `set` en el objeto de origen. Ten en cuenta que esta "desconexión" solo afecta la vinculación de la variable; si la variable apunta a un valor no primitivo, como un objeto, mutar el objeto seguiría siendo reactivo.

- El proxy devuelto por `reactive()`, aunque se comporta igual que el original, tiene una identidad diferente si lo comparamos con el original usando el operador `===`.

Dentro de `track()`, comprobamos si hay un efecto en ejecución. Si lo hay, buscamos los efectos suscriptores (almacenados en un `Set`) para la propiedad que se está rastreando y añadimos el efecto al `Set`:

```js
// This will be set right before an effect is about
// to be run. We'll deal with this later.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Las suscripciones de efectos se almacenan en una estructura de datos global `WeakMap<target, Map<key, Set<effect>>>`. Si no se encontró ningún `Set` de efectos suscriptores para una propiedad (rastreada por primera vez), se creará. Esto es lo que hace la función `getSubscribersForProperty()`, en resumen. Por simplicidad, omitiremos sus detalles.

Dentro de `trigger()`, volvemos a buscar los efectos suscriptores para la propiedad. Pero esta vez los invocamos en su lugar:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Ahora volvamos a la función `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Envuelve la función `update` original en un efecto que se establece a sí mismo como el efecto activo actual antes de ejecutar la actualización real. Esto permite que las llamadas a `track()` durante la actualización localicen el efecto activo actual.

En este punto, hemos creado un efecto que rastrea automáticamente sus dependencias y se vuelve a ejecutar cada vez que una dependencia cambia. A esto lo llamamos **Efecto Reactivo**.

Vue proporciona una API que te permite crear efectos reactivos: [`watchEffect()`](/api/reactivity-core#watcheffect). De hecho, es posible que hayas notado que funciona de manera bastante similar a la mágica `whenDepsChange()` del ejemplo. Ahora podemos reelaborar el ejemplo original utilizando APIs reales de Vue:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // tracks A0 and A1
  A2.value = A0.value + A1.value
})

// triggers the effect
A0.value = 2
```

Usar un efecto reactivo para mutar un `ref` no es el caso de uso más interesante; de hecho, usar una propiedad `computed` lo hace más declarativo:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Internamente, `computed` gestiona su invalidación y recálculo utilizando un efecto reactivo.

Entonces, ¿cuál es un ejemplo de un efecto reactivo común y útil? ¡Pues la actualización del DOM! Podemos implementar un "renderizado reactivo" simple como este:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Count is: ${count.value}`
})

// updates the DOM
count.value++
```

De hecho, esto se parece mucho a cómo un componente de Vue mantiene el estado y el DOM sincronizados: cada instancia de componente crea un efecto reactivo para renderizar y actualizar el DOM. Por supuesto, los componentes de Vue utilizan formas mucho más eficientes de actualizar el DOM que `innerHTML`. Esto se discute en [Mecanismo de Renderizado](./rendering-mechanism).

<div class="options-api">

Las APIs `ref()`, `computed()` y `watchEffect()` son todas parte de la Composition API. Si hasta ahora solo has estado usando la Options API con Vue, notarás que la Composition API está más cerca de cómo funciona el sistema de reactividad de Vue internamente. De hecho, en Vue 3 la Options API se implementa sobre la Composition API. Todo acceso a propiedades en la instancia del componente (`this`) dispara getters / setters para el rastreo de reactividad, y opciones como `watch` y `computed` invocan sus equivalentes de Composition API internamente.

</div>

## Reactividad en Tiempo de Ejecución vs. Tiempo de Compilación {#runtime-vs-compile-time-reactivity}

El sistema de reactividad de Vue se basa principalmente en el tiempo de ejecución: el rastreo y el disparo se realizan mientras el código se ejecuta directamente en el navegador. Las ventajas de la reactividad en tiempo de ejecución son que puede funcionar sin un paso de construcción y hay menos casos límite. Por otro lado, esto lo limita por las restricciones sintácticas de JavaScript, lo que lleva a la necesidad de contenedores de valores como los `refs` de Vue.

Algunos frameworks, como [Svelte](https://svelte.dev/), eligen superar tales limitaciones implementando la reactividad durante la compilación. Analiza y transforma el código para simular la reactividad. El paso de compilación permite al framework alterar la semántica del propio JavaScript, por ejemplo, inyectando implícitamente código que realiza análisis de dependencias y disparo de efectos alrededor del acceso a variables definidas localmente. La desventaja es que tales transformaciones requieren un paso de construcción, y alterar la semántica de JavaScript es esencialmente crear un lenguaje que se parece a JavaScript pero que compila a otra cosa.

El equipo de Vue exploró esta dirección a través de una característica experimental llamada [Reactivity Transform](/guide/extras/reactivity-transform), pero al final hemos decidido que no sería adecuada para el proyecto debido a [la justificación aquí](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Depuración de la Reactividad {#reactivity-debugging}

Es genial que el sistema de reactividad de Vue rastree automáticamente las dependencias, pero en algunos casos es posible que queramos saber exactamente qué se está rastreando o qué está causando que un componente se vuelva a renderizar.

### Hooks de Depuración de Componentes {#component-debugging-hooks}

Podemos depurar qué dependencias se utilizan durante el renderizado de un componente y qué dependencia está disparando una actualización utilizando los hooks de ciclo de vida <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> y <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span>. Ambos hooks recibirán un evento de depuración que contiene información sobre la dependencia en cuestión. Se recomienda colocar una declaración `debugger` en los callbacks para inspeccionar interactivamente la dependencia:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
Los hooks de depuración de componentes solo funcionan en modo de desarrollo.
:::

Los objetos de evento de depuración tienen el siguiente tipo:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Depuración de `computed` {#computed-debugging}

<!-- TODO options API equivalent -->

Podemos depurar propiedades `computed` pasando a `computed()` un segundo objeto de opciones con callbacks `onTrack` y `onTrigger`:

- `onTrack` se llamará cuando una propiedad `reactive` o `ref` sea rastreada como una dependencia.
- `onTrigger` se llamará cuando el callback del `watcher` se dispare por la mutación de una dependencia.

Ambos callbacks recibirán eventos de depuración en el [mismo formato](#debugger-event) que los hooks de depuración de componentes:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // triggered when count.value is tracked as a dependency
    debugger
  },
  onTrigger(e) {
    // triggered when count.value is mutated
    debugger
  }
})

// access plusOne, should trigger onTrack
console.log(plusOne.value)

// mutate count.value, should trigger onTrigger
count.value++
```

:::tip
Las opciones `computed` `onTrack` y `onTrigger` solo funcionan en modo de desarrollo.
:::

### Depuración de `watcher` {#watcher-debugging}

<!-- TODO options API equivalent -->

Similar a `computed()`, los `watchers` también soportan las opciones `onTrack` y `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
Las opciones `watcher` `onTrack` y `onTrigger` solo funcionan en modo de desarrollo.
:::

## Integración con Sistemas de Estado Externos {#integration-with-external-state-systems}

El sistema de reactividad de Vue funciona convirtiendo profundamente objetos JavaScript planos en `proxies` reactivos. La conversión profunda puede ser innecesaria o a veces no deseada al integrar con sistemas de gestión de estado externos (por ejemplo, si una solución externa también usa `Proxies`).

La idea general de integrar el sistema de reactividad de Vue con una solución externa de gestión de estado es mantener el estado externo en un [`shallowRef`](/api/reactivity-advanced#shallowref). Un `shallowRef` solo es reactivo cuando se accede a su propiedad `.value`; el valor interno se deja intacto. Cuando el estado externo cambia, se reemplaza el valor del `ref` para disparar las actualizaciones.

### Datos Inmutables {#immutable-data}

Si estás implementando una función de deshacer / rehacer, es probable que quieras tomar una instantánea del estado de la aplicación en cada edición del usuario. Sin embargo, el sistema de reactividad mutable de Vue no es el más adecuado para esto si el árbol de estado es grande, porque serializar todo el objeto de estado en cada actualización puede ser costoso tanto en términos de CPU como de memoria.

Las [estructuras de datos inmutables](https://en.wikipedia.org/wiki/Persistent_data_structure) resuelven esto al no mutar nunca los objetos de estado; en su lugar, crea nuevos objetos que comparten las mismas partes inalteradas con los antiguos. Hay diferentes formas de usar datos inmutables en JavaScript, pero recomendamos usar [Immer](https://immerjs.github.io/immer/) con Vue porque te permite usar datos inmutables mientras mantienes la sintaxis mutable más ergonómica.

Podemos integrar Immer con Vue a través de un simple composable:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### Máquinas de Estado {#state-machines}

Una [Máquina de Estado](https://en.wikipedia.org/wiki/Finite-state_machine) es un modelo para describir todos los estados posibles en los que puede estar una aplicación y todas las formas posibles en que puede transicionar de un estado a otro. Si bien puede ser excesivo para componentes simples, puede ayudar a que los flujos de estado complejos sean más robustos y manejables.

Una de las implementaciones de máquinas de estado más populares en JavaScript es [XState](https://xstate.js.org/). Aquí hay un composable que se integra con ella:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGjGrqk8SBSyQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVlept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFuYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) es una librería para trabajar con flujos de eventos asíncronos. La librería [VueUse](https://vueuse.org/) proporciona el complemento [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) para conectar flujos de RxJS con el sistema de reactividad de Vue.

## Conexión a Signals {#connection-to-signals}

Bastantes otros frameworks han introducido primitivas de reactividad similares a los `refs` de la Composition API de Vue, bajo el término "signals":

- [Solid Signals](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular Signals](https://angular.dev/guide/signals)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Qwik Signals](https://qwik.builder.io/docs/components/state/#usesignal)

Fundamentalmente, los `signals` son el mismo tipo de primitiva de reactividad que los `refs` de Vue. Es un contenedor de valores que proporciona rastreo de dependencias en el acceso y disparo de efectos secundarios en la mutación. Este paradigma basado en primitivas de reactividad no es un concepto particularmente nuevo en el mundo frontend: se remonta a implementaciones como [observables de Knockout](https://knockoutjs.com/documentation/observables.html) y [Meteor Tracker](https://docs.meteor.com/api/tracker.html) de hace más de una década. La Options API de Vue y la librería de gestión de estado de React [MobX](https://mobx.js.org/) también se basan en los mismos principios, pero ocultan las primitivas detrás de las propiedades de los objetos.

Aunque no es un rasgo necesario para que algo califique como `signals`, hoy en día el concepto a menudo se discute junto con el modelo de renderizado donde las actualizaciones se realizan a través de suscripciones de grano fino. Debido al uso de Virtual DOM, Vue actualmente [se basa en compiladores para lograr optimizaciones similares](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). Sin embargo, también estamos explorando una nueva estrategia de compilación inspirada en Solid, llamada [Vapor Mode](https://github.com/vuejs/core-vapor), que no depende de Virtual DOM y aprovecha más el sistema de reactividad integrado de Vue.

### Compromisos de Diseño de la API {#api-design-trade-offs}

El diseño de los `signals` de Preact y Qwik es muy similar al [`shallowRef`](/api/reactivity-advanced#shallowref) de Vue: los tres proporcionan una interfaz mutable a través de la propiedad `.value`. Centraremos la discusión en los `signals` de Solid y Angular.

#### Signals de Solid {#solid-signals}

El diseño de la API `createSignal()` de Solid enfatiza la segregación de lectura/escritura. Los `Signals` se exponen como un `getter` de solo lectura y un `setter` separado:

```js
const [count, setCount] = createSignal(0)

count() // access the value
setCount(1) // update the value
```

Observa cómo el `signal` `count` puede pasarse sin el `setter`. Esto asegura que el estado nunca puede ser mutado a menos que el `setter` también esté expuesto explícitamente. Si esta garantía de seguridad justifica la sintaxis más verbosa podría estar sujeta a los requisitos del proyecto y al gusto personal, pero en caso de que prefieras este estilo de API, puedes replicarlo fácilmente en Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Signals de Angular {#angular-signals}

Angular está experimentando algunos cambios fundamentales al abandonar la comprobación de cambios (dirty-checking) e introducir su propia implementación de una primitiva de reactividad. La API de `Signal` de Angular se ve así:

```js
const count = signal(0)

count() // access the value
count.set(1) // set new value
count.update((v) => v + 1) // update based on previous value
```

De nuevo, podemos replicar fácilmente la API en Vue:

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc0DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

En comparación con los `refs` de Vue, el estilo de API basado en `getter` de Solid y Angular ofrece algunas compensaciones interesantes cuando se utilizan en componentes de Vue:

- `()` es ligeramente menos verboso que `.value`, pero actualizar el valor es más verboso.
- No hay "ref-unwrapping": acceder a los valores siempre requiere `()`. Esto hace que el acceso a los valores sea consistente en todas partes. Esto también significa que puedes pasar `signals` sin procesar como `props` de componente.

Si estos estilos de API te convienen es, hasta cierto punto, subjetivo. Nuestro objetivo aquí es demostrar la similitud subyacente y las compensaciones entre estos diferentes diseños de API. También queremos mostrar que Vue es flexible: realmente no estás limitado a las APIs existentes. Si fuera necesario, puedes crear tu propia API primitiva de reactividad para satisfacer necesidades más específicas.