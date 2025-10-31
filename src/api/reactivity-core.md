# API de Reactividad: Núcleo {#reactivity-api-core}

:::info Ver también
Para comprender mejor las API de Reactividad, se recomienda leer los siguientes capítulos de la guía:

- [Fundamentos de Reactividad](/guide/essentials/reactivity-fundamentals) (con la preferencia de API establecida en Composition API)
- [Reactividad en Profundidad](/guide/extras/reactivity-in-depth)
:::

## ref() {#ref}

Toma un valor interno y devuelve un objeto `ref` reactivo y mutable, que tiene una única propiedad `.value` que apunta al valor interno.

- **Tipo**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Detalles**

  El objeto `ref` es mutable, es decir, puedes asignar nuevos valores a `.value`. También es reactivo, lo que significa que cualquier operación de lectura a `.value` es rastreada y las operaciones de escritura activarán los efectos asociados.

  Si un objeto se asigna como valor de un `ref`, el objeto se convierte en profundamente reactivo con [reactive()](#reactive). Esto también significa que si el objeto contiene `refs` anidados, estos serán desenvueltos profundamente.

  Para evitar la conversión profunda, usa [`shallowRef()`](./reactivity-advanced#shallowref) en su lugar.

- **Ejemplo**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Ver también**
  - [Guía - Fundamentos de Reactividad con `ref()`](/guide/essentials/reactivity-fundamentals#ref)
  - [Guía - Tipado de `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

Toma una [función getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) y devuelve un objeto [ref](#ref) reactivo de solo lectura para el valor devuelto por el getter. También puede tomar un objeto con funciones `get` y `set` para crear un objeto `ref` escribible.

- **Tipo**

  ```ts
  // solo lectura
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // ver enlace "Depuración de computed" a continuación
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // escribible
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Ejemplo**

  Creando un `ref` computed de solo lectura:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // error
  ```

  Creando un `ref` computed escribible:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Depuración:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Ver también**
  - [Guía - Propiedades `computed`](/guide/essentials/computed)
  - [Guía - Depuración de `computed`](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Guía - Tipado de `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [Guía - Rendimiento - Estabilidad de `computed`](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

Devuelve un proxy reactivo del objeto.

- **Tipo**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Detalles**

  La conversión reactiva es "profunda": afecta a todas las propiedades anidadas. Un objeto reactivo también desenvuelve profundamente cualquier propiedad que sea [ref](#ref) mientras mantiene la reactividad.

  También debe tenerse en cuenta que no se realiza ninguna envoltura de `ref` cuando se accede al `ref` como un elemento de un array reactivo o un tipo de colección nativo como `Map`.

  Para evitar la conversión profunda y solo mantener la reactividad a nivel raíz, usa [shallowReactive()](./reactivity-advanced#shallowreactive) en su lugar.

  El objeto devuelto y sus objetos anidados están envueltos con [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) y **no** son iguales a los objetos originales. Se recomienda trabajar exclusivamente con el proxy reactivo y evitar depender del objeto original.

- **Ejemplo**

  Creando un objeto reactivo:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Desenvuelto de `ref`:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref será desenvuelto
  console.log(obj.count === count.value) // true

  // actualizará `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // también actualizará el ref `count`
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Ten en cuenta que los `refs` **no** se desenvuelven cuando se acceden como elementos de un array o colección:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // necesita .value aquí
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // necesita .value aquí
  console.log(map.get('count').value)
  ```

  Al asignar un [ref](#ref) a una propiedad `reactive`, ese `ref` también se desenvolverá automáticamente:

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Ver también**
  - [Guía - Fundamentos de Reactividad](/guide/essentials/reactivity-fundamentals)
  - [Guía - Tipado de `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Toma un objeto (reactivo o simple) o un [ref](#ref) y devuelve un proxy de solo lectura al original.

- **Tipo**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Detalles**

  Un proxy `readonly` es profundo: cualquier propiedad anidada a la que se acceda también será de solo lectura. También tiene el mismo comportamiento de desenvolvimiento de `ref` que `reactive()`, excepto que los valores desenvueltos también se harán de solo lectura.

  Para evitar la conversión profunda, usa [shallowReadonly()](./reactivity-advanced#shallowreadonly) en su lugar.

- **Ejemplo**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // funciona para el seguimiento de reactividad
    console.log(copy.count)
  })

  // mutar el original activará watchers que dependen de la copia
  original.count++

  // mutar la copia fallará y resultará en una advertencia
  copy.count++ // warning!
  ```

## watchEffect() {#watcheffect}

Ejecuta una función inmediatamente mientras rastrea reactivamente sus dependencias y la vuelve a ejecutar cada vez que cambian las dependencias.

- **Tipo**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // por defecto: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // invocable, igual que `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Detalles**

  El primer argumento es la función de efecto a ejecutar. La función de efecto recibe una función que se puede usar para registrar una callback de limpieza. La callback de limpieza se llamará justo antes de la próxima vez que se vuelva a ejecutar el efecto, y se puede usar para limpiar efectos secundarios invalidados, por ejemplo, una solicitud asíncrona pendiente (ver ejemplo a continuación).

  El segundo argumento es un objeto de opciones opcional que se puede usar para ajustar el momento de ejecución del efecto o para depurar las dependencias del efecto.

  Por defecto, los watchers se ejecutarán justo antes del renderizado del componente. Establecer `flush: 'post'` pospondrá el watcher hasta después del renderizado del componente. Consulta [Momento de Ejecución de Callback](/guide/essentials/watchers#callback-flush-timing) para obtener más información. En casos raros, podría ser necesario activar un watcher inmediatamente cuando una dependencia reactiva cambia, por ejemplo, para invalidar una caché. Esto se puede lograr usando `flush: 'sync'`. Sin embargo, esta configuración debe usarse con precaución, ya que puede generar problemas de rendimiento y consistencia de datos si se actualizan varias propiedades al mismo tiempo.

  El valor de retorno es una función de manejo que se puede llamar para evitar que el efecto se ejecute nuevamente.

- **Ejemplo**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> registra 0

  count.value++
  // -> registra 1
  ```

  Deteniendo el watcher:

  ```js
  const stop = watchEffect(() => {})

  // cuando el watcher ya no sea necesario:
  stop()
  ```

  Pausando / reanudando el watcher: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // pausar temporalmente el watcher
  pause()

  // reanudar más tarde
  resume()

  // detener
  stop()
  ```

  Limpieza de efectos secundarios:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` se llamará si `id` cambia, cancelando
    // la solicitud anterior si aún no se ha completado
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Limpieza de efectos secundarios en 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` se llamará si `id` cambia, cancelando
    // la solicitud anterior si aún no se ha completado
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Opciones:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Ver también**
  - [Guía - Watchers](/guide/essentials/watchers#watcheffect)
  - [Guía - Depuración de Watchers](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Alias de [`watchEffect()`](#watcheffect) con la opción `flush: 'post'`.

## watchSyncEffect() {#watchsynceffect}

Alias de [`watchEffect()`](#watcheffect) con la opción `flush: 'sync'`.

## watch() {#watch}

Observa una o más fuentes de datos reactivas e invoca una función de callback cuando las fuentes cambian.

- **Tipo**

  ```ts
  // observando una única fuente
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // observando múltiples fuentes
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | (T extends object ? T : never) // objeto reactivo

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // por defecto: false
    deep?: boolean | number // por defecto: false
    flush?: 'pre' | 'post' | 'sync' // por defecto: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // por defecto: false (3.4+)
  }

  interface WatchHandle {
    (): void // invocable, igual que `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > Los tipos se simplifican para facilitar la lectura.

- **Detalles**

  `watch()` es perezoso por defecto, es decir, la callback solo se llama cuando la fuente observada ha cambiado.

  El primer argumento es la **fuente** del watcher. La fuente puede ser una de las siguientes:

  - Una función getter que devuelve un valor
  - Un `ref`
  - Un objeto reactivo
  - ...o un array de los anteriores.

  El segundo argumento es la callback que se llamará cuando la fuente cambie. La callback recibe tres argumentos: el nuevo valor, el valor antiguo y una función para registrar una callback de limpieza de efectos secundarios. La callback de limpieza se llamará justo antes de la próxima vez que se vuelva a ejecutar el efecto, y se puede usar para limpiar efectos secundarios invalidados, por ejemplo, una solicitud asíncrona pendiente.

  Al observar múltiples fuentes, la callback recibe dos arrays que contienen los valores nuevos y antiguos correspondientes al array de fuentes.

  El tercer argumento opcional es un objeto de opciones que admite las siguientes:

  - **`immediate`**: dispara la callback inmediatamente al crear el watcher. El valor antiguo será `undefined` en la primera llamada.
  - **`deep`**: fuerza el recorrido profundo de la fuente si es un objeto, para que la callback se dispare en mutaciones profundas. En 3.5+, esto también puede ser un número que indica la profundidad máxima de recorrido. Ver [Watchers Profundos](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: ajusta el momento de ejecución de la callback. Ver [Momento de Ejecución de Callback](/guide/essentials/watchers#callback-flush-timing) y [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: depura las dependencias del watcher. Ver [Depuración de Watchers](/guide/extras/reactivity-in-depth#watcher-debugging).
  - **`once`**: (3.4+) ejecuta la callback solo una vez. El watcher se detiene automáticamente después de la primera ejecución de la callback.

  Comparado con [`watchEffect()`](#watcheffect), `watch()` nos permite:

  - Realizar el efecto secundario de forma perezosa;
  - Ser más específico sobre qué estado debe activar la reactivación del watcher;
  - Acceder tanto al valor anterior como al actual del estado observado.

- **Ejemplo**

  Observando un getter:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Observando un `ref`:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  Cuando se observan múltiples fuentes, la callback recibe arrays que contienen los valores nuevos y antiguos correspondientes al array de fuentes:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  Cuando se usa una fuente getter, el watcher solo se dispara si el valor de retorno del getter ha cambiado. Si deseas que la callback se dispare incluso en mutaciones profundas, debes forzar explícitamente el watcher al modo profundo con `{ deep: true }`. Ten en cuenta que en el modo profundo, el valor nuevo y el antiguo serán el mismo objeto si la callback se activó por una mutación profunda:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  Cuando se observa directamente un objeto reactivo, el watcher está automáticamente en modo profundo:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* se dispara en mutación profunda a `state` */
  })
  ```

  `watch()` comparte las mismas opciones de momento de ejecución y depuración con [`watchEffect()`](#watcheffect):

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Deteniendo el watcher:

  ```js
  const stop = watch(source, callback)

  // cuando el watcher ya no sea necesario:
  stop()
  ```

  Pausando / reanudando el watcher: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // pausar temporalmente el watcher
  pause()

  // reanudar más tarde
  resume()

  // detener
  stop()
  ```

  Limpieza de efectos secundarios:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` se llamará si `id` cambia, cancelando
    // la solicitud anterior si aún no se ha completado
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Limpieza de efectos secundarios en 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **Ver también**

  - [Guía - Watchers](/guide/essentials/watchers)
  - [Guía - Depuración de Watchers](/guide/extras/reactivity-in-depth#watcher-debugging)

## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

Registra una función de limpieza para ser ejecutada cuando el watcher actual está a punto de volver a ejecutarse. Solo se puede llamar durante la ejecución síncrona de una función de efecto `watchEffect` o de una función de callback `watch` (es decir, no se puede llamar después de una declaración `await` en una función asíncrona).

- **Tipo**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Ejemplo**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` se llamará si `id` cambia, cancelando
    // la solicitud anterior si aún no se ha completado
    onWatcherCleanup(cancel)
  })
  ```