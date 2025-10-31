# Transformación de Reactividad {#reactivity-transform}

:::danger Característica Experimental Eliminada
Reactivity Transform era una característica experimental y ha sido eliminada en la última versión 3.4. Por favor, lee [aquí la justificación](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Si aún tienes la intención de usarla, ahora está disponible a través del plugin [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

:::tip Específico de Composition API
Reactivity Transform es una característica específica de Composition API y requiere un paso de construcción.
:::

## Refs vs. Variables Reactivas {#refs-vs-reactive-variables}

Desde la introducción de la Composition API, una de las preguntas principales sin resolver ha sido el uso de `refs` vs. objetos reactivos. Es fácil perder reactividad al desestructurar objetos reactivos, mientras que puede ser engorroso usar `.value` en todas partes al usar `refs`. Además, `.value` es fácil de pasar por alto si no se utiliza un sistema de tipos.

[Vue Reactivity Transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) es una transformación en tiempo de compilación que nos permite escribir código como este:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

El método `$ref()` aquí es una **macro en tiempo de compilación**: no es un método real que se llamará en tiempo de ejecución. En su lugar, el compilador de Vue lo utiliza como una sugerencia para tratar la variable `count` resultante como una **variable reactiva.**

Las variables reactivas se pueden acceder y reasignar como variables normales, pero estas operaciones se compilan en `refs` con `.value`. Por ejemplo, la parte `<script>` del componente anterior se compila en:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Cada API de reactividad que devuelve `refs` tendrá un equivalente de macro con prefijo `$`. Estas APIs incluyen:

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

Estas macros están disponibles globalmente y no necesitan ser importadas cuando Reactivity Transform está habilitado, pero opcionalmente puedes importarlas desde `vue/macros` si quieres ser más explícito:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## Desestructuración con `$()` {#destructuring-with}

Es común que una función de composición devuelva un objeto de `refs`, y usar desestructuración para recuperar estas `refs`. Para este propósito, la transformación de reactividad proporciona la macro **`$()`**:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Salida compilada:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Ten en cuenta que si `x` ya es una `ref`, `toRef(__temp, 'x')` simplemente la devolverá tal cual y no se creará una `ref` adicional. Si un valor desestructurado no es una `ref` (por ejemplo, una función), seguirá funcionando: el valor se envolverá en una `ref` para que el resto del código funcione como se espera.

La desestructuración `$()` funciona tanto en objetos reactivos **como** en objetos planos que contienen `refs`.

## Convertir `Refs` Existentes en Variables Reactivas con `$()` {#convert-existing-refs-to-reactive-variables-with}

En algunos casos, podemos tener funciones envueltas que también devuelven `refs`. Sin embargo, el compilador de Vue no podrá saber de antemano que una función va a devolver una `ref`. En tales casos, la macro `$()` también se puede usar para convertir cualquier `refs` existente en variables reactivas:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Desestructuración de `Props` Reactivas {#reactive-props-destructure}

Hay dos puntos problemáticos con el uso actual de `defineProps()` en `<script setup>`:

1. Similar a `.value`, siempre necesitas acceder a las `props` como `props.x` para mantener la reactividad. Esto significa que no puedes desestructurar `defineProps` porque las variables desestructuradas resultantes no son reactivas y no se actualizarán.

2. Al usar la [declaración de `props` solo por tipo](/api/sfc-script-setup#type-only-props-emit-declarations), no hay una manera fácil de declarar valores predeterminados para las `props`. Introdujimos la API `withDefaults()` para este propósito exacto, pero sigue siendo incómodo de usar.

Podemos abordar estos problemas aplicando una transformación en tiempo de compilación cuando `defineProps` se usa con desestructuración, similar a lo que vimos anteriormente con `$()`:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // default value just works
    count = 1,
    // local aliasing also just works
    // here we are aliasing `props.foo` to `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // will log whenever the props change
    console.log(msg, count, bar)
  })
</script>
```

Lo anterior se compilará en el siguiente equivalente de declaración en tiempo de ejecución:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Mantener la Reactividad a Través de los Límites de las Funciones {#retaining-reactivity-across-function-boundaries}

Si bien las variables reactivas nos liberan de tener que usar `.value` en todas partes, crea un problema de "pérdida de reactividad" cuando pasamos variables reactivas a través de los límites de las funciones. Esto puede ocurrir en dos casos:

### Pasar a una función como argumento {#passing-into-function-as-argument}

Dada una función que espera una `ref` como argumento, por ejemplo:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x changed!')
  })
}

let count = $ref(0)
trackChange(count) // doesn't work!
```

El caso anterior no funcionará como se espera porque se compila a:

```ts
let count = ref(0)
trackChange(count.value)
```

Aquí `count.value` se pasa como un número, mientras que `trackChange` espera una `ref` real. Esto se puede arreglar envolviendo `count` con `$$()` antes de pasarlo:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Lo anterior se compila a:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Como podemos ver, `$$()` es una macro que sirve como una **sugerencia de escape**: las variables reactivas dentro de `$$()` no tendrán `.value` añadido.

### Devolver dentro del ámbito de la función {#returning-inside-function-scope}

La reactividad también se puede perder si las variables reactivas se usan directamente en una expresión de retorno:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // listen to mousemove...

  // doesn't work!
  return {
    x,
    y
  }
}
```

La declaración de retorno anterior se compila a:

```ts
return {
  x: x.value,
  y: y.value
}
```

Para mantener la reactividad, debemos devolver las `refs` reales, no el valor actual en el momento del retorno.

De nuevo, podemos usar `$$()` para solucionar esto. En este caso, `$$()` se puede usar directamente en el objeto devuelto; cualquier referencia a variables reactivas dentro de la llamada `$$()` conservará la referencia a sus `refs` subyacentes:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // listen to mousemove...

  // fixed
  return $$({
    x,
    y
  })
}
```

### Usar `$$()` en `props` desestructuradas {#using-on-destructured-props}

`$$()` funciona en `props` desestructuradas ya que también son variables reactivas. El compilador lo convertirá con `toRef` para mayor eficiencia:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

se compila a:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## Integración con TypeScript <sup class="vt-badge ts" /> {#typescript-integration}

Vue proporciona tipados para estas macros (disponibles globalmente) y todos los tipos funcionarán como se espera. No hay incompatibilidades con la semántica estándar de TypeScript, por lo que la sintaxis funcionará con todas las herramientas existentes.

Esto también significa que las macros pueden funcionar en cualquier archivo donde se permita JS / TS válido, no solo dentro de los SFC de Vue.

Dado que las macros están disponibles globalmente, sus tipos deben ser referenciados explícitamente (por ejemplo, en un archivo `env.d.ts`):

```ts
/// <reference types="vue/macros-global" />
```

Al importar explícitamente las macros desde `vue/macros`, el tipo funcionará sin declarar las globales.

## Habilitación Explícita {#explicit-opt-in}

:::danger Ya no es compatible con el núcleo
Lo siguiente solo se aplica hasta la versión 3.3 de Vue e inferiores. El soporte ha sido eliminado en el núcleo de Vue 3.4 y superiores, y `@vitejs/plugin-vue` 5.0 y superiores. Si tienes la intención de seguir utilizando la transformación, por favor, migra a [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) en su lugar.
:::

### Vite {#vite}

- Requiere `@vitejs/plugin-vue@>=2.0.0`
- Se aplica a SFCs y archivos js(x)/ts(x). Se realiza una comprobación rápida de uso en los archivos antes de aplicar la transformación, por lo que no debería haber costo de rendimiento para los archivos que no utilizan las macros.
- Ten en cuenta que `reactivityTransform` ahora es una opción a nivel raíz del plugin en lugar de anidada como `script.refSugar`, ya que afecta no solo a los SFCs.

```js [vite.config.js]
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- Actualmente solo afecta a los SFCs
- Requiere `vue-loader@>=17.0.0`

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### `webpack` simple + `vue-loader` {#plain-webpack-vue-loader}

- Actualmente solo afecta a los SFCs
- Requiere `vue-loader@>=17.0.0`

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```