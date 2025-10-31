# API de Composición: Hooks de Ciclo de Vida {#composition-api-lifecycle-hooks}

:::info Nota de Uso
Todas las APIs listadas en esta página deben ser llamadas sincrónicamente durante la fase `setup()` de un componente. Consulta [Guía - Hooks de Ciclo de Vida](/guide/essentials/lifecycle) para más detalles.
:::

## onMounted() {#onmounted}

Registra una función de callback para ser llamada después de que el componente haya sido montado.

- **Tipo**

  ```ts
  function onMounted(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Detalles**

  Un componente se considera montado después de que:

  - Todos sus componentes hijos síncronos han sido montados (no incluye `async components` o componentes dentro de árboles `<Suspense>`).

  - Su propio árbol DOM ha sido creado e insertado en el contenedor padre. Ten en cuenta que solo garantiza que el árbol DOM del componente está en el documento si el contenedor raíz de la aplicación también está en el documento.

  Este gancho se utiliza típicamente para realizar efectos secundarios que necesitan acceso al DOM renderizado del componente, o para limitar el código relacionado con el DOM al cliente en una [aplicación renderizada en el servidor](/guide/scaling-up/ssr).

  **Este gancho no se llama durante la renderización del lado del servidor.**

- **Ejemplo**

  Accediendo a un elemento a través de una `template ref`:

  ```vue
  <script setup>
  import { ref, onMounted } from 'vue'

  const el = ref()

  onMounted(() => {
    el.value // <div>
  })
  </script>

  <template>
    <div ref="el"></div>
  </template>
  ```

## onUpdated() {#onupdated}

Registra una función de callback para ser llamada después de que el componente haya actualizado su árbol DOM debido a un cambio de estado reactivo.

- **Tipo**

  ```ts
  function onUpdated(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Detalles**

  El gancho `updated` de un componente padre se llama después del de sus componentes hijos.

  Este gancho se llama después de cualquier actualización DOM del componente, que puede ser causada por diferentes cambios de estado, ya que múltiples cambios de estado pueden ser agrupados en un único ciclo de renderizado por razones de rendimiento. Si necesitas acceder al DOM actualizado después de un cambio de estado específico, usa [nextTick()](/api/general#nexttick) en su lugar.

  **Este gancho no se llama durante la renderización del lado del servidor.**

  :::warning
  No modifiques el estado del componente en el gancho `updated`: ¡esto probablemente llevará a un bucle de actualización infinito!
  :::

- **Ejemplo**

  Accediendo al DOM actualizado:

  ```vue
  <script setup>
  import { ref, onUpdated } from 'vue'

  const count = ref(0)

  onUpdated(() => {
    // el contenido de texto debería ser el mismo que el `count.value` actual
    console.log(document.getElementById('count').textContent)
  })
  </script>

  <template>
    <button id="count" @click="count++">{{ count }}</button>
  </template>
  ```

## onUnmounted() {#onunmounted}

Registra una función de callback para ser llamada después de que el componente haya sido desmontado.

- **Tipo**

  ```ts
  function onUnmounted(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Detalles**

  Un componente se considera desmontado después de que:

  - Todos sus componentes hijos han sido desmontados.

  - Todos sus efectos reactivos asociados (efecto de renderizado y `computed` / `watchers` creados durante `setup()`) han sido detenidos.

  Utiliza este gancho para limpiar efectos secundarios creados manualmente, como temporizadores, escuchadores de eventos DOM o conexiones con el servidor.

  **Este gancho no se llama durante la renderización del lado del servidor.**

- **Ejemplo**

  ```vue
  <script setup>
  import { onMounted, onUnmounted } from 'vue'

  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      // ...
    })
  })

  onUnmounted(() => clearInterval(intervalId))
  </script>
  ```

## onBeforeMount() {#onbeforemount}

Registra un gancho para ser llamado justo antes de que el componente vaya a ser montado.

- **Tipo**

  ```ts
  function onBeforeMount(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Detalles**

  Cuando se llama a este gancho, el componente ha terminado de configurar su estado reactivo, pero aún no se han creado nodos DOM. Está a punto de ejecutar su efecto de renderizado DOM por primera vez.

  **Este gancho no se llama durante la renderización del lado del servidor.**

## onBeforeUpdate() {#onbeforeupdate}

Registra un gancho para ser llamado justo antes de que el componente vaya a actualizar su árbol DOM debido a un cambio de estado reactivo.

- **Tipo**

  ```ts
  function onBeforeUpdate(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Detalles**

  Este gancho puede utilizarse para acceder al estado del DOM antes de que Vue actualice el DOM. También es seguro modificar el estado del componente dentro de este gancho.

  **Este gancho no se llama durante la renderización del lado del servidor.**

## onBeforeUnmount() {#onbeforeunmount}

Registra un gancho para ser llamado justo antes de que una instancia de componente vaya a ser desmontada.

- **Tipo**

  ```ts
  function onBeforeUnmount(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Detalles**

  Cuando se llama a este gancho, la instancia del componente sigue siendo completamente funcional.

  **Este gancho no se llama durante la renderización del lado del servidor.**

## onErrorCaptured() {#onerrorcaptured}

Registra un gancho para ser llamado cuando se ha capturado un error que se propaga desde un componente descendiente.

- **Tipo**

  ```ts
  function onErrorCaptured(callback: ErrorCapturedHook): void

  type ErrorCapturedHook = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => boolean | void
  ```

- **Detalles**

  Los errores pueden ser capturados de las siguientes fuentes:

  - Renderizados de componentes
  - Manejadores de eventos
  - Hooks de ciclo de vida
  - Función `setup()`
  - `Watchers`
  - Hooks de directivas personalizadas
  - Hooks de transición

  El gancho recibe tres argumentos: el error, la instancia del componente que activó el error y una cadena de información que especifica el tipo de fuente del error.

  :::tip
  En producción, el tercer argumento (`info`) será un código abreviado en lugar de la cadena de información completa. Puedes encontrar la correspondencia de código a cadena en la [Referencia de Códigos de Error de Producción](/error-reference/#runtime-errors).
  :::

  Puedes modificar el estado del componente en `onErrorCaptured()` para mostrar un estado de error al usuario. Sin embargo, es importante que el estado de error no renderice el contenido original que causó el error; de lo contrario, el componente entrará en un bucle de renderizado infinito.

  El gancho puede devolver `false` para detener la propagación del error. Consulta los detalles de propagación de errores a continuación.

  **Reglas de Propagación de Errores**

  - Por defecto, todos los errores se envían al [`app.config.errorHandler`](/api/application#app-config-errorhandler) a nivel de aplicación si está definido, para que estos errores puedan ser reportados a un servicio de análisis en un solo lugar.

  - Si existen múltiples ganchos `errorCaptured` en la cadena de herencia o en la cadena de padres de un componente, todos ellos serán invocados con el mismo error, en orden de abajo hacia arriba. Esto es similar al mecanismo de burbujeo de los eventos DOM nativos.

  - Si el propio gancho `errorCaptured` lanza un error, tanto este error como el error original capturado se envían a `app.config.errorHandler`.

  - Un gancho `errorCaptured` puede devolver `false` para evitar que el error se propague más. Esto esencialmente dice "este error ha sido manejado y debe ser ignorado". Evitará que cualquier gancho `errorCaptured` adicional o `app.config.errorHandler` sean invocados para este error.

## onRenderTracked() <sup class="vt-badge dev-only" /> {#onrendertracked}

Registra un gancho de depuración para ser llamado cuando una dependencia reactiva ha sido rastreada por el efecto de renderizado del componente.

**Este gancho es solo para modo de desarrollo y no se llama durante la renderización del lado del servidor.**

- **Tipo**

  ```ts
  function onRenderTracked(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Ver también** [Reactividad en Profundidad](/guide/extras/reactivity-in-depth)

## onRenderTriggered() <sup class="vt-badge dev-only" /> {#onrendertriggered}

Registra un gancho de depuración para ser llamado cuando una dependencia reactiva activa que el efecto de renderizado del componente se ejecute de nuevo.

**Este gancho es solo para modo de desarrollo y no se llama durante la renderización del lado del servidor.**

- **Tipo**

  ```ts
  function onRenderTriggered(callback: DebuggerHook): void

  type DebuggerHook = (e: DebuggerEvent) => void

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
    key: any
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
  }
  ```

- **Ver también** [Reactividad en Profundidad](/guide/extras/reactivity-in-depth)

## onActivated() {#onactivated}

Registra una función de callback para ser llamada después de que la instancia del componente se inserta en el DOM como parte de un árbol almacenado en caché por [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gancho no se llama durante la renderización del lado del servidor.**

- **Tipo**

  ```ts
  function onActivated(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Ver también** [Guía - Ciclo de Vida de Instancia Cacheada](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onDeactivated() {#ondeactivated}

Registra una función de callback para ser llamada después de que la instancia del componente se elimina del DOM como parte de un árbol almacenado en caché por [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este gancho no se llama durante la renderización del lado del servidor.**

- **Tipo**

  ```ts
  function onDeactivated(
    callback: () => void,
    target?: ComponentInternalInstance | null
  ): void
  ```

- **Ver también** [Guía - Ciclo de Vida de Instancia Cacheada](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## onServerPrefetch() <sup class="vt-badge" data-text="SSR only" /> {#onserverprefetch}

Registra una función `async` para ser resuelta antes de que la instancia del componente sea renderizada en el servidor.

- **Tipo**

  ```ts
  function onServerPrefetch(callback: () => Promise<any>): void
  ```

- **Detalles**

  Si la función de callback devuelve una Promise, el renderizador del servidor esperará hasta que la Promise se resuelva antes de renderizar el componente.

  Este gancho solo se llama durante la renderización del lado del servidor y puede utilizarse para realizar la obtención de datos solo en el servidor.

- **Ejemplo**

  ```vue
  <script setup>
  import { ref, onServerPrefetch, onMounted } from 'vue'

  const data = ref(null)

  onServerPrefetch(async () => {
    // el componente se renderiza como parte de la solicitud inicial
    // pre-obtiene datos en el servidor ya que es más rápido que en el cliente
    data.value = await fetchOnServer(/* ... */)
  })

  onMounted(async () => {
    if (!data.value) {
      // si `data` es null en el montado, significa que el componente
      // se renderiza dinámicamente en el cliente. Realiza una
      // obtención del lado del cliente en su lugar.
      data.value = await fetchOnClient(/* ... */)
    }
  })
  </script>
  ```

- **Ver también** [Renderización del Lado del Servidor](/guide/scaling-up/ssr)
