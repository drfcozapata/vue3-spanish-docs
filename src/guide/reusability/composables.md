# Composables {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
Esta sección asume conocimientos básicos de la Composition API. Si has estado aprendiendo Vue solo con la Options API, puedes establecer la Preferencia de API en Composition API (usando el interruptor en la parte superior de la barra lateral izquierda) y volver a leer los capítulos [Fundamentos de Reactividad](/guide/essentials/reactivity-fundamentals) y [Hooks de Ciclo de Vida](/guide/essentials/lifecycle).
:::

## ¿Qué es un "Composable"? {#what-is-a-composable}

En el contexto de las aplicaciones Vue, un "composable" es una función que aprovecha la Composition API de Vue para encapsular y reutilizar **lógica con estado**.

Al construir aplicaciones frontend, a menudo necesitamos reutilizar lógica para tareas comunes. Por ejemplo, es posible que necesitemos formatear fechas en muchos lugares, por lo que extraemos una función reutilizable para ello. Esta función de formateo encapsula **lógica sin estado**: toma una entrada e inmediatamente devuelve la salida esperada. Existen muchas librerías para reutilizar lógica sin estado, por ejemplo [lodash](https://lodash.com/) y [date-fns](https://date-fns.org/), de las que quizás hayas oído hablar.

Por el contrario, la lógica con estado implica gestionar un estado que cambia con el tiempo. Un ejemplo simple sería rastrear la posición actual del ratón en una página. En escenarios del mundo real, también podría ser una lógica más compleja, como gestos táctiles o el estado de conexión a una base de datos.

## Ejemplo de Seguimiento del Ratón {#mouse-tracker-example}

Si implementáramos la funcionalidad de seguimiento del ratón utilizando la Composition API directamente dentro de un componente, se vería así:

```vue [MouseComponent.vue]
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

Pero, ¿qué pasa si queremos reutilizar la misma lógica en varios componentes? Podemos extraer la lógica a un archivo externo, como una función composable:

```js [mouse.js]
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useMouse() {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}
```

Y así es como se puede usar en los componentes:

```vue [MouseComponent.vue]
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[Pruébalo en el Playground](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drLIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc5YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

Como podemos ver, la lógica central sigue siendo idéntica; todo lo que tuvimos que hacer fue moverla a una función externa y devolver el estado que debía exponerse. Al igual que dentro de un componente, puedes usar la gama completa de [funciones de la Composition API](/api/#composition-api) en los composables. La misma funcionalidad `useMouse()` ahora puede usarse en cualquier componente.

La parte más interesante de los composables, sin embargo, es que también puedes anidarlos: una función composable puede llamar a una o más funciones composable. Esto nos permite componer lógica compleja utilizando unidades pequeñas y aisladas, de manera similar a cómo componemos una aplicación completa utilizando componentes. De hecho, esta es la razón por la que decidimos llamar a la colección de APIs que hacen posible este patrón Composition API.

Por ejemplo, podemos extraer la lógica de añadir y eliminar un escuchador de eventos del DOM en su propio composable:

```js [event.js]
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

Y ahora nuestro composable `useMouse()` puede simplificarse a:

```js{2,8-11} [mouse.js]
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
Cada instancia de componente que llame a `useMouse()` creará sus propias copias del estado `x` e `y` para que no interfieran entre sí. Si deseas gestionar el estado compartido entre componentes, lee el capítulo [Gestión de Estado](/guide/scaling-up/state-management).
:::

## Ejemplo de Estado Asíncrono {#async-state-example}

El composable `useMouse()` no toma ningún argumento, así que veamos otro ejemplo que hace uso de uno. Al realizar la obtención de datos asíncronos, a menudo necesitamos manejar diferentes estados: cargando, éxito y error:

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

Sería tedioso tener que repetir este patrón en cada componente que necesita obtener datos. Vamos a extraerlo a un composable:

```js [fetch.js]
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

Ahora en nuestro componente podemos simplemente hacer:

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### Aceptar Estado Reactivo {#accepting-reactive-state}

`useFetch()` toma una cadena de URL estática como entrada, por lo que realiza la petición solo una vez y luego termina. ¿Qué pasa si queremos que vuelva a realizar la petición cada vez que la URL cambie? Para lograr esto, necesitamos pasar estado reactivo a la función composable, y dejar que el composable cree `watchers` que realicen acciones usando el estado pasado.

Por ejemplo, `useFetch()` debería poder aceptar una `ref`:

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// this should trigger a re-fetch
url.value = '/new-url'
```

O aceptar una [función getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description):

```js
// re-fetch when props.id changes
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

Podemos refactorizar nuestra implementación existente con las APIs [`watchEffect()`](/api/reactivity-core.html#watcheffect) y [`toValue()`](/api/reactivity-utilities.html#tovalue):

```js{7,12} [fetch.js]
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // reset state before fetching..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` es una API añadida en la versión 3.3. Está diseñada para normalizar `ref`s o `getter`s en valores. Si el argumento es una `ref`, devuelve el valor de la `ref`; si el argumento es una función, la llamará y devolverá su valor de retorno. De lo contrario, devuelve el argumento tal cual. Funciona de manera similar a [`unref()`](/api/reactivity-utilities.html#unref), pero con un tratamiento especial para las funciones.

Observa que `toValue(url)` se llama **dentro** de la función de callback de `watchEffect`. Esto asegura que cualquier dependencia reactiva accedida durante la normalización de `toValue()` sea rastreada por el `watcher`.

Esta versión de `useFetch()` ahora acepta cadenas de URL estáticas, `ref`s y `getter`s, lo que la hace mucho más flexible. El efecto `watch` se ejecutará inmediatamente y rastreará cualquier dependencia accedida durante `toValue(url)`. Si no se rastrea ninguna dependencia (por ejemplo, `url` ya es una cadena), el efecto se ejecuta solo una vez; de lo contrario, se volverá a ejecutar cada vez que una dependencia rastreada cambie.

Aquí tienes [la versión actualizada de `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP2GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGZ5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=), con un retraso artificial y un error aleatorio con fines de demostración.

## Convenciones y Mejores Prácticas {#conventions-and-best-practices}

### Nombres {#naming}

Es una convención nombrar las funciones composable con nombres camelCase que comienzan con "use".

### Argumentos de Entrada {#input-arguments}

Un composable puede aceptar argumentos `ref` o `getter` incluso si no dependen de ellos para la reactividad. Si estás escribiendo un composable que puede ser usado por otros desarrolladores, es una buena idea manejar el caso de que los argumentos de entrada sean `ref`s o `getter`s en lugar de valores directos. La función de utilidad [`toValue()`](/api/reactivity-utilities#tovalue) será útil para este propósito:

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // If maybeRefOrGetter is a ref or a getter,
  // its normalized value will be returned.
  // Otherwise, it is returned as-is.
  const value = toValue(maybeRefOrGetter)
}
```

Si tu composable crea efectos reactivos cuando la entrada es una `ref` o un `getter`, asegúrate de observar explícitamente la `ref` / `getter` con `watch()`, o de llamar a `toValue()` dentro de un `watchEffect()` para que se rastree correctamente.

La [implementación de `useFetch()` discutida anteriormente](#accepting-reactive-state) proporciona un ejemplo concreto de un composable que acepta `ref`s, `getter`s y valores planos como argumento de entrada.

### Valores de Retorno {#return-values}

Probablemente hayas notado que hemos estado usando exclusivamente `ref()` en lugar de `reactive()` en los composables. La convención recomendada es que los composables siempre devuelvan un objeto plano, no reactivo, que contenga múltiples `ref`s. Esto permite que se desestructure en los componentes manteniendo la reactividad:

```js
// x and y are refs
const { x, y } = useMouse()
```

Devolver un objeto `reactive` desde un composable hará que dichas desestructuraciones pierdan la conexión de reactividad con el estado dentro del composable, mientras que las `ref`s mantendrán esa conexión.

Si prefieres usar el estado devuelto de los composables como propiedades de objeto, puedes envolver el objeto devuelto con `reactive()` para que las `ref`s se desenvuelvan. Por ejemplo:

```js
const mouse = reactive(useMouse())
// mouse.x is linked to original ref
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### Efectos Secundarios {#side-effects}

Está bien realizar efectos secundarios (por ejemplo, añadir escuchadores de eventos del DOM o obtener datos) en los composables, pero presta atención a las siguientes reglas:

-   Si estás trabajando en una aplicación que usa [Server-Side Rendering](/guide/scaling-up/ssr) (SSR), asegúrate de realizar los efectos secundarios específicos del DOM en los hooks de ciclo de vida posteriores al montaje, por ejemplo, `onMounted()`. Estos hooks solo se llaman en el navegador, por lo que puedes estar seguro de que el código dentro de ellos tiene acceso al DOM.

-   Recuerda limpiar los efectos secundarios en `onUnmounted()`. Por ejemplo, si un composable configura un escuchador de eventos del DOM, debe eliminar ese escuchador en `onUnmounted()` como hemos visto en el ejemplo de `useMouse()`. Puede ser una buena idea usar un composable que haga esto automáticamente por ti, como el ejemplo de `useEventListener()`.

### Restricciones de Uso {#usage-restrictions}

Los composables solo deben llamarse en `<script setup>` o en el hook `setup()`. También deben llamarse **sincrónicamente** en estos contextos. En algunos casos, también puedes llamarlos en hooks de ciclo de vida como `onMounted()`.

Estas restricciones son importantes porque son los contextos en los que Vue puede determinar la instancia de componente activa actual. El acceso a una instancia de componente activa es necesario para que:

1.  Los hooks de ciclo de vida puedan registrarse en ella.

2.  Las propiedades `computed` y los `watchers` puedan vincularse a ella, para que puedan eliminarse cuando la instancia se desmonte y evitar fugas de memoria.

:::tip
`<script setup>` es el único lugar donde puedes llamar a los composables **después** de usar `await`. El compilador restaura automáticamente el contexto de instancia activa para ti después de la operación asíncrona.
:::

## Extrayendo Composables para la Organización del Código {#extracting-composables-for-code-organization}

Los composables se pueden extraer no solo para su reutilización, sino también para la organización del código. A medida que la complejidad de tus componentes crece, puedes terminar con componentes demasiado grandes para navegar y razonar sobre ellos. La Composition API te brinda total flexibilidad para organizar el código de tu componente en funciones más pequeñas basadas en preocupaciones lógicas:

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

Hasta cierto punto, puedes pensar en estos composables extraídos como servicios con ámbito de componente que pueden comunicarse entre sí.

## Usando Composables en la Options API {#using-composables-in-options-api}

Si estás utilizando la Options API, los composables deben llamarse dentro de `setup()`, y los enlaces devueltos deben retornarse desde `setup()` para que se expongan a `this` y a la plantilla:

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() exposed properties can be accessed on `this`
    console.log(this.x)
  }
  // ...other options
}
```

## Comparaciones con Otras Técnicas {#comparisons-with-other-techniques}

### vs. Mixins {#vs-mixins}

Los usuarios que vienen de Vue 2 pueden estar familiarizados con la opción [mixins](/api/options-composition#mixins), que también nos permite extraer la lógica del componente en unidades reutilizables. Hay tres inconvenientes principales en los mixins:

1.  **Fuente poco clara de las propiedades**: al usar muchos mixins, no queda claro qué propiedad de instancia es inyectada por qué mixin, lo que dificulta rastrear la implementación y comprender el comportamiento del componente. Esta es también la razón por la que recomendamos usar el patrón de `ref`s + desestructuración para los composables: hace que la fuente de la propiedad sea clara en los componentes que los consumen.

2.  **Colisiones de nombres**: múltiples mixins de diferentes autores pueden registrar las mismas claves de propiedad, causando colisiones de nombres. Con los composables, puedes cambiar el nombre de las variables desestructuradas si hay claves conflictivas de diferentes composables.

3.  **Comunicación implícita entre mixins**: múltiples mixins que necesitan interactuar entre sí tienen que depender de claves de propiedad compartidas, lo que los hace implícitamente acoplados. Con los composables, los valores devueltos de un composable pueden pasarse a otro como argumentos, al igual que las funciones normales.

Por las razones anteriores, ya no recomendamos usar mixins en Vue 3. La característica se mantiene solo por motivos de migración y familiaridad.

### vs. Componentes sin Renderizado {#vs-renderless-components}

En el capítulo sobre [slots de componentes](/guide/components/slots), discutimos el patrón de [Componentes sin Renderizado](/guide/components/slots#renderless-components) basado en slots con ámbito. Incluso implementamos la misma demostración de seguimiento del ratón utilizando componentes sin renderizado.

La principal ventaja de los composables sobre los componentes sin renderizado es que los composables no incurren en la sobrecarga adicional de una instancia de componente. Cuando se usa en toda una aplicación, la cantidad de instancias de componente adicionales creadas por el patrón de componentes sin renderizado puede convertirse en una sobrecarga de rendimiento notable.

La recomendación es usar composables cuando se reutiliza lógica pura, y usar componentes cuando se reutiliza tanto la lógica como el diseño visual.

### vs. React Hooks {#vs-react-hooks}

Si tienes experiencia con React, habrás notado que esto se parece mucho a los custom React hooks. La Composition API se inspiró en parte en los React hooks, y los composables de Vue son, de hecho, similares a los React hooks en cuanto a las capacidades de composición de lógica. Sin embargo, los composables de Vue se basan en el sistema de reactividad de grano fino de Vue, que es fundamentalmente diferente del modelo de ejecución de los React hooks. Esto se discute con más detalle en las [Preguntas Frecuentes de la Composition API](/guide/extras/composition-api-faq#comparison-with-react-hooks).

## Lectura Adicional {#further-reading}

-   [Reactivity In Depth](/guide/extras/reactivity-in-depth): para una comprensión de bajo nivel de cómo funciona el sistema de reactividad de Vue.
-   [State Management](/guide/scaling-up/state-management): para patrones de gestión de estado compartido por múltiples componentes.
-   [Testing Composables](/guide/scaling-up/testing#testing-composables): consejos sobre cómo hacer pruebas unitarias de composables.
-   [VueUse](https://vueuse.org/): una colección cada vez mayor de composables de Vue. El código fuente también es un excelente recurso de aprendizaje.