# API Global: General {#global-api-general}

## version {#version}

Expone la versión actual de Vue.

- **Tipo:** `string`

- **Ejemplo**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Una utilidad para esperar el siguiente vaciado de actualizaciones del DOM.

- **Tipo**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Detalles**

  Cuando mutas el estado reactivo en Vue, las actualizaciones resultantes del DOM no se aplican sincrónicamente. En su lugar, Vue las almacena en un búfer hasta el "siguiente tick" para asegurar que cada `componente` se actualice solo una vez, sin importar cuántos cambios de estado hayas realizado.

  `nextTick()` se puede usar inmediatamente después de un cambio de estado para esperar que las actualizaciones del DOM se completen. Puedes pasar una `callback` como argumento, o esperar la `Promise` devuelta.

- **Ejemplo**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM not yet updated
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM is now updated
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM not yet updated
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM is now updated
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **Ver también** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Un asistente de tipos para definir un `componente` de Vue con inferencia de tipos.

- **Tipo**

  ```ts
  // options syntax
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // function syntax (requires 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > El tipo se simplifica para mayor legibilidad.

- **Detalles**

  El primer argumento espera un objeto de `opciones` del `componente`. El `valor de retorno` será el mismo objeto de `opciones`, ya que la función es esencialmente una operación nula en tiempo de ejecución solo para fines de inferencia de tipos.

  Ten en cuenta que el `tipo de retorno` es un poco especial: será un `tipo de constructor` cuyo `tipo de instancia` es el `tipo de instancia` de `componente` inferido basado en las `opciones`. Esto se usa para la inferencia de tipos cuando el `tipo de retorno` se usa como una etiqueta en TSX.

  Puedes extraer el `tipo de instancia` de un `componente` (equivalente al tipo de `this` en sus `opciones`) del `tipo de retorno` de `defineComponent()` de esta manera:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Firma de la Función {#function-signature}

  - Solo soportado en 3.3+

  `defineComponent()` también tiene una `firma` alternativa que está destinada a ser utilizada con la `Composition API` y [funciones de renderizado o JSX](/guide/extras/render-function.html).

  En lugar de pasar un objeto de `opciones`, se espera una `función`. Esta `función` funciona igual que la `función` [`setup()`](/api/composition-api-setup.html#composition-api-setup) de la `Composition API`: recibe las `props` y el `contexto de setup`. El `valor de retorno` debe ser una `función de renderizado` - tanto `h()` como JSX son soportados:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // use Composition API here like in <script setup>
      const count = ref(0)

      return () => {
        // render function or JSX
        return h('div', count.value)
      }
    },
    // extra options, e.g. declare props and emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  El principal caso de uso para esta `firma` es con `TypeScript` (y en particular con TSX), ya que soporta `genéricos`:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // use Composition API here like in <script setup>
      const count = ref(0)

      return () => {
        // render function or JSX
        return <div>{count.value}</div>
      }
    },
    // manual runtime props declaration is currently still needed.
    {
      props: ['msg', 'list']
    }
  )
  ```

  En el futuro, planeamos proporcionar un `plugin` de Babel que infiera e inyecte automáticamente las `props` en tiempo de ejecución (como para `defineProps` en SFCs) para que la `declaración de props` en tiempo de ejecución pueda omitirse.

  ### Nota sobre el `Treeshaking` de `webpack` {#note-on-webpack-treeshaking}

  Debido a que `defineComponent()` es una `llamada a función`, podría parecer que produciría `efectos secundarios` para algunas `herramientas de construcción`, por ejemplo, `webpack`. Esto evitará que el `componente` sea `tree-shaken` incluso cuando el `componente` nunca se use.

  Para indicar a `webpack` que esta `llamada a función` es segura para ser `tree-shaken`, puedes añadir una notación de `comentario` `/*#__PURE__*/` antes de la `llamada a función`:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Ten en cuenta que esto no es necesario si estás usando `Vite`, porque `Rollup` (el `bundler` de producción subyacente utilizado por `Vite`) es lo suficientemente inteligente como para determinar que `defineComponent()` es, de hecho, libre de `efectos secundarios` sin la necesidad de `anotaciones manuales`.

- **Ver también** [Guía - Uso de Vue con `TypeScript`](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Define un `componente asíncrono` que se carga perezosamente solo cuando se renderiza. El argumento puede ser una `función de cargador` o un objeto de `opciones` para un control más avanzado del `comportamiento de carga`.

- **Tipo**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Ver también** [Guía - `Componentes Asíncronos`](/guide/components/async)