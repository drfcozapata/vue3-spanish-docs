# Instancia de Componente {#component-instance}

:::info
Esta página documenta las propiedades y métodos integrados expuestos en la instancia pública del componente, es decir, `this`.

Todas las propiedades listadas en esta página son de solo lectura (excepto las propiedades anidadas en `$data`).
:::

## $data {#data}

El objeto devuelto por la opción [`data`](./options-state#data), hecho reactivo por el componente. La instancia del componente proxy (actúa como proxy para) el acceso a las propiedades de su objeto `data`.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Un objeto que representa las `props` actuales y resueltas del componente.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Detalles**

  Solo se incluirán las `props` declaradas a través de la opción [`props`](./options-state#props). La instancia del componente proxy (actúa como proxy para) el acceso a las propiedades de su objeto `props`.

## $el {#el}

El nodo DOM raíz que la instancia del componente está gestionando.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $el: any
  }
  ```

- **Detalles**

  `$el` será `undefined` hasta que el componente sea [montado](./options-lifecycle#mounted).

  - Para componentes con un único elemento raíz, `$el` apuntará a ese elemento.
  - Para componentes con una raíz de texto, `$el` apuntará al nodo de texto.
  - Para componentes con múltiples nodos raíz, `$el` será el nodo DOM marcador de posición que Vue usa para rastrear la posición del componente en el DOM (un nodo de texto, o un nodo de comentario en modo de hidratación SSR).

  :::tip
  Para mayor consistencia, se recomienda usar [refs de plantilla](/guide/essentials/template-refs) para acceder directamente a los elementos en lugar de depender de `$el`.
  :::

## $options {#options}

Las opciones de componente resueltas utilizadas para instanciar la instancia de componente actual.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Detalles**

  El objeto `$options` expone las opciones resueltas para el componente actual y es el resultado de la fusión de estas posibles fuentes:

  - Mixins globales
  - Base de `extends` del componente
  - Mixins del componente

  Normalmente se utiliza para soportar opciones de componente personalizadas:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Ver también** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

La instancia padre, si la instancia actual tiene una. Será `null` para la propia instancia raíz.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

La instancia de componente raíz del árbol de componentes actual. Si la instancia actual no tiene padres, este valor será ella misma.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Un objeto que representa los [slots](/guide/components/slots) pasados por el componente padre.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Detalles**

  Normalmente se utiliza al crear manualmente [render functions](/guide/extras/render-function), pero también se puede usar para detectar si un slot está presente.

  Cada slot se expone en `this.$slots` como una función que devuelve un array de vnodes bajo la clave correspondiente al nombre de ese slot. El slot predeterminado se expone como `this.$slots.default`.

  Si un slot es un [scoped slot](/guide/components/slots#scoped-slots), los argumentos pasados a las funciones del slot están disponibles para el slot como sus `slot props`.

- **Ver también** [Render Functions - Rendering Slots](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

Un objeto de elementos DOM e instancias de componente, registrados a través de [template refs](/guide/essentials/template-refs).

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Ver también**

  - [Template refs](/guide/essentials/template-refs)
  - [Special Attributes - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Un objeto que contiene los atributos de paso (fallthrough attributes) del componente.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Detalles**

  Los [atributos de paso](/guide/components/attrs) son atributos y manejadores de eventos pasados por el componente padre, pero no declarados como una prop o un evento emitido por el hijo.

  Por defecto, todo en `$attrs` se heredará automáticamente en el elemento raíz del componente si solo hay un único elemento raíz. Este comportamiento se deshabilita si el componente tiene múltiples nodos raíz, y se puede deshabilitar explícitamente con la opción [`inheritAttrs`](./options-misc#inheritattrs).

- **Ver también**

  - [Fallthrough Attributes](/guide/components/attrs)

## $watch() {#watch}

API imperativa para crear observadores (`watchers`).

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Detalles**

  El primer argumento es la fuente a observar (`watch source`). Puede ser una cadena con el nombre de una propiedad del componente, una cadena de ruta simple separada por puntos, o una [función getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description).

  El segundo argumento es la función de callback. El callback recibe el nuevo valor y el valor antiguo de la fuente observada.

  - **`immediate`**: dispara el callback inmediatamente al crear el observador. El valor antiguo será `undefined` en la primera llamada.
  - **`deep`**: fuerza un recorrido profundo de la fuente si es un objeto, para que el callback se dispare en mutaciones profundas. Consulta [Deep Watchers](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: ajusta el tiempo de vaciado del callback. Consulta [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) y [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: depura las dependencias del observador. Consulta [Watcher Debugging](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Ejemplo**

  Observar el nombre de una propiedad:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Observar una ruta separada por puntos:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Usar un `getter` para expresiones más complejas:

  ```js
  this.$watch(
    // cada vez que la expresión `this.a + this.b` produce
    // un resultado diferente, se llamará al manejador.
    // Es como si estuviéramos observando una propiedad computada
    // sin definir la propiedad computada en sí.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Detener el observador:

  ```js
  const unwatch = this.$watch('a', cb)

  // más tarde...
  unwatch()
  ```

- **Ver también**
  - [Opciones - `watch`](/api/options-state#watch)
  - [Guía - Watchers](/guide/essentials/watchers)

## $emit() {#emit}

Dispara un evento personalizado en la instancia actual. Cualquier argumento adicional se pasará a la función de callback del `listener`.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Ejemplo**

  ```js
  export default {
    created() {
      // solo evento
      this.$emit('foo')
      // con argumentos adicionales
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **Ver también**

  - [Componente - Eventos](/guide/components/events)
  - [Opción `emits`](./options-state#emits)

## $forceUpdate() {#forceupdate}

Fuerza a la instancia del componente a renderizar de nuevo.

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Detalles**

  Esto rara vez debería ser necesario dado el sistema de reactividad totalmente automático de Vue. Los únicos casos en los que podrías necesitarlo es cuando has creado explícitamente un estado de componente no reactivo utilizando APIs de reactividad avanzadas.

## $nextTick() {#nexttick}

Versión ligada a la instancia de la API global [`nextTick()`](./general#nexttick).

- **Tipo**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **Detalles**

  La única diferencia con la versión global de `nextTick()` es que el callback pasado a `this.$nextTick()` tendrá su contexto `this` ligado a la instancia del componente actual.

- **Ver también** [`nextTick()`](./general#nexttick)