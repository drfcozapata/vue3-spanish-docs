# Options: Ciclo de Vida {#options-lifecycle}

:::info Ver también
Para el uso compartido de hooks de ciclo de vida, consulta [Guía - Hooks de Ciclo de Vida](/guide/essentials/lifecycle)
:::

## beforeCreate {#beforecreate}

Se llama cuando la instancia es inicializada.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeCreate?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Se llama inmediatamente cuando la instancia es inicializada y las `props` son resueltas.

  Luego, las `props` se definirán como propiedades reactivas y se configurará el estado, como `data()` o `computed`.

  Ten en cuenta que el hook `setup()` de la Composition API se llama antes que cualquier hook de Options API, incluso `beforeCreate()`.

## created {#created}

Se llama después de que la instancia ha terminado de procesar todas las opciones relacionadas con el estado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    created?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Cuando se llama a este hook, se han configurado lo siguiente: datos reactivos, propiedades `computed`, métodos y `watchers`. Sin embargo, la fase de montaje no ha comenzado y la propiedad `$el` aún no estará disponible.

## beforeMount {#beforemount}

Se llama justo antes de que el componente sea montado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeMount?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Cuando se llama a este hook, el componente ha terminado de configurar su estado reactivo, pero aún no se han creado nodos `DOM`. Está a punto de ejecutar su efecto de renderizado `DOM` por primera vez.

  **Este hook no se llama durante el renderizado en el lado del servidor.**

## mounted {#mounted}

Se llama después de que el componente ha sido montado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    mounted?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Un componente se considera montado después de que:

  - Todos sus componentes hijos síncronos han sido montados (no incluye componentes asíncronos o componentes dentro de árboles `<Suspense>`).

  - Su propio árbol `DOM` ha sido creado e insertado en el contenedor padre. Ten en cuenta que solo garantiza que el árbol `DOM` del componente esté en el documento si el contenedor raíz de la aplicación también está en el documento.

  Este hook se utiliza típicamente para realizar efectos secundarios que necesitan acceso al `DOM` renderizado del componente, o para limitar el código relacionado con el `DOM` al cliente en una [aplicación renderizada en el lado del servidor](/guide/scaling-up/ssr).

  **Este hook no se llama durante el renderizado en el lado del servidor.**

## beforeUpdate {#beforeupdate}

Se llama justo antes de que el componente vaya a actualizar su árbol `DOM` debido a un cambio de estado reactivo.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeUpdate?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Este hook se puede usar para acceder al estado del `DOM` antes de que Vue actualice el `DOM`. También es seguro modificar el estado del componente dentro de este hook.

  **Este hook no se llama durante el renderizado en el lado del servidor.**

## updated {#updated}

Se llama después de que el componente ha actualizado su árbol `DOM` debido a un cambio de estado reactivo.

- **Tipo**

  ```ts
  interface ComponentOptions {
    updated?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  El hook `updated` de un componente padre se llama después del de sus componentes hijos.

  Este hook se llama después de cualquier actualización del `DOM` del componente, la cual puede ser causada por diferentes cambios de estado. Si necesitas acceder al `DOM` actualizado después de un cambio de estado específico, usa [nextTick()](/api/general#nexttick) en su lugar.

  **Este hook no se llama durante el renderizado en el lado del servidor.**

  :::warning
  ¡No modifiques el estado del componente en el hook `updated` - esto probablemente conducirá a un bucle de actualización infinito!
  :::

## beforeUnmount {#beforeunmount}

Se llama justo antes de que una instancia de componente vaya a ser desmontada.

- **Tipo**

  ```ts
  interface ComponentOptions {
    beforeUnmount?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Cuando se llama a este hook, la instancia del componente sigue siendo completamente funcional.

  **Este hook no se llama durante el renderizado en el lado del servidor.**

## unmounted {#unmounted}

Se llama después de que el componente ha sido desmontado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    unmounted?(this: ComponentPublicInstance): void
  }
  ```

- **Detalles**

  Un componente se considera desmontado después de que:

  - Todos sus componentes hijos han sido desmontados.

  - Todos sus efectos reactivos asociados (efecto de renderizado y `computed` / `watchers` creados durante `setup()`) han sido detenidos.

  Usa este hook para limpiar los efectos secundarios creados manualmente, como temporizadores, escuchadores de eventos `DOM` o conexiones de servidor.

  **Este hook no se llama durante el renderizado en el lado del servidor.**

## errorCaptured {#errorcaptured}

Se llama cuando se ha capturado un error que se propaga desde un componente descendiente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    errorCaptured?(
      this: ComponentPublicInstance,
      err: unknown,
      instance: ComponentPublicInstance | null,
      info: string
    ): boolean | void
  }
  ```

- **Detalles**

  Los errores pueden ser capturados de las siguientes fuentes:

  - Renderizados del componente
  - Manejadores de eventos
  - Hooks de ciclo de vida
  - Función `setup()`
  - Watchers
  - Hooks de directivas personalizadas
  - Hooks de transición

  El hook recibe tres argumentos: el error, la instancia del componente que activó el error y una cadena de información que especifica el tipo de origen del error.

  :::tip
  En producción, el tercer argumento (`info`) será un código abreviado en lugar de la cadena de información completa. Puedes encontrar el mapeo de código a cadena en la [Referencia de Códigos de Error de Producción](/error-reference/#runtime-errors).
  :::

  Puedes modificar el estado del componente en `errorCaptured()` para mostrar un estado de error al usuario. Sin embargo, es importante que el estado de error no renderice el contenido original que causó el error; de lo contrario, el componente entrará en un bucle de renderizado infinito.

  El hook puede devolver `false` para detener la propagación del error. Consulta los detalles de propagación de errores a continuación.

  **Reglas de Propagación de Errores**

  - Por defecto, todos los errores se envían al [`app.config.errorHandler`](/api/application#app-config-errorhandler) a nivel de aplicación si está definido, para que estos errores aún puedan ser reportados a un servicio de análisis en un solo lugar.

  - Si existen múltiples hooks `errorCaptured` en la cadena de herencia de un componente o en la cadena de padres, todos ellos serán invocados para el mismo error, en orden de abajo hacia arriba. Esto es similar al mecanismo de burbujeo de los eventos `DOM` nativos.

  - Si el propio hook `errorCaptured` lanza un error, tanto este error como el error original capturado se envían a `app.config.errorHandler`.

  - Un hook `errorCaptured` puede devolver `false` para evitar que el error se propague más. Esto esencialmente significa "este error ha sido manejado y debe ser ignorado". Evitará que cualquier hook `errorCaptured` adicional o `app.config.errorHandler` sea invocado para este error.

  **Advertencias de Captura de Errores**

  - En componentes con una función `setup()` asíncrona (con `await` de nivel superior), Vue **siempre** intentará renderizar la plantilla del componente, incluso si `setup()` lanzó un error. Esto probablemente causará más errores porque durante el renderizado la plantilla del componente podría intentar acceder a propiedades no existentes del contexto `setup()` fallido. Al capturar errores en dichos componentes, prepárate para manejar errores tanto de un `setup()` asíncrono fallido (siempre vendrán primero) como del proceso de renderizado fallido.

  - <sup class="vt-badge" data-text="SSR only"></sup> Reemplazar un componente hijo con error en el componente padre profundamente dentro de `<Suspense>` causará desajustes de hidratación en SSR. En su lugar, intenta separar la lógica que posiblemente pueda lanzar errores de la función `setup()` del hijo en una función separada y ejecutarla en la función `setup()` del componente padre, donde puedes `try/catch` de forma segura el proceso de ejecución y realizar el reemplazo si es necesario antes de renderizar el componente hijo real.

## renderTracked <sup class="vt-badge" data-text="solo en desarrollo" /> {#rendertracked}

Se llama cuando una dependencia reactiva ha sido rastreada por el efecto de renderizado del componente.

**Este hook es solo para modo de desarrollo y no se llama durante el renderizado en el lado del servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    renderTracked?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

  type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes /* 'get' | 'has' | 'iterate' */
    key: any
  }
  ```

- **Ver también** [Reactividad en Profundidad](/guide/extras/reactivity-in-depth)

## renderTriggered <sup class="vt-badge" data-text="solo en desarrollo" /> {#rendertriggered}

Se llama cuando una dependencia reactiva activa el efecto de renderizado del componente para que se vuelva a ejecutar.

**Este hook es solo para modo de desarrollo y no se llama durante el renderizado en el lado del servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    renderTriggered?(this: ComponentPublicInstance, e: DebuggerEvent): void
  }

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

## activated {#activated}

Se llama después de que la instancia del componente se inserta en el `DOM` como parte de un árbol almacenado en caché por [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este hook no se llama durante el renderizado en el lado del servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    activated?(this: ComponentPublicInstance): void
  }
  ```

- **Ver también** [Guía - Ciclo de Vida de la Instancia en Caché](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## deactivated {#deactivated}

Se llama después de que la instancia del componente se elimina del `DOM` como parte de un árbol almacenado en caché por [`<KeepAlive>`](/api/built-in-components#keepalive).

**Este hook no se llama durante el renderizado en el lado del servidor.**

- **Tipo**

  ```ts
  interface ComponentOptions {
    deactivated?(this: ComponentPublicInstance): void
  }
  ```

- **Ver también** [Guía - Ciclo de Vida de la Instancia en Caché](/guide/built-ins/keep-alive#lifecycle-of-cached-instance)

## serverPrefetch <sup class="vt-badge" data-text="SSR only" /> {#serverprefetch}

Función asíncrona que se resolverá antes de que la instancia del componente sea renderizada en el servidor.

- **Tipo**

  ```ts
  interface ComponentOptions {
    serverPrefetch?(this: ComponentPublicInstance): Promise<any>
  }
  ```

- **Detalles**

  Si el hook devuelve una `Promise`, el renderizador del servidor esperará hasta que la `Promise` se resuelva antes de renderizar el componente.

  Este hook solo se llama durante el renderizado en el lado del servidor y se puede usar para realizar la obtención de datos solo en el servidor.

- **Ejemplo**

  ```js
  export default {
    data() {
      return {
        data: null
      }
    },
    async serverPrefetch() {
      // el componente se renderiza como parte de la solicitud inicial
      // pre-obtiene datos en el servidor ya que es más rápido que en el cliente
      this.data = await fetchOnServer(/* ... */)
    },
    async mounted() {
      if (!this.data) {
        // si data es null en el montaje, significa que el componente
        // se renderiza dinámicamente en el cliente. Realiza una
        // obtención de datos en el lado del cliente en su lugar.
        this.data = await fetchOnClient(/* ... */)
      }
    }
  }
  ```

- **Ver también** [Renderizado en el Lado del Servidor](/guide/scaling-up/ssr)
