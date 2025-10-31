# API de Reactividad: Avanzado {#reactivity-api-advanced}

## shallowRef() {#shallowref}

Versión superficial de [`ref()`](./reactivity-core#ref).

-   **Tipo**

    ```ts
    function shallowRef<T>(value: T): ShallowRef<T>

    interface ShallowRef<T> {
      value: T
    }
    ```

-   **Detalles**

    A diferencia de `ref()`, el valor interno de un `shallow ref` se almacena y expone tal cual, y no se hará profundamente reactivo. Solo el acceso a `.value` es reactivo.

    `shallowRef()` se utiliza típicamente para optimizaciones de rendimiento de grandes estructuras de datos, o integración con sistemas de gestión de estado externos.

-   **Ejemplo**

    ```js
    const state = shallowRef({ count: 1 })

    // does NOT trigger change
    state.value.count = 2

    // does trigger change
    state.value = { count: 2 }
    ```

-   **Ver también**
    -   [Guía - Reducir la sobrecarga de reactividad para grandes estructuras inmutables](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
    -   [Guía - Integración con sistemas de estado externos](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Fuerza el disparo de efectos que dependen de un [shallow ref](#shallowref). Esto se utiliza típicamente después de realizar mutaciones profundas al valor interno de un `shallow ref`.

-   **Tipo**

    ```ts
    function triggerRef(ref: ShallowRef): void
    ```

-   **Ejemplo**

    ```js
    const shallow = shallowRef({
      greet: 'Hello, world'
    })

    // Logs "Hello, world" once for the first run-through
    watchEffect(() => {
      console.log(shallow.value.greet)
    })

    // This won't trigger the effect because the ref is shallow
    shallow.value.greet = 'Hello, universe'

    // Logs "Hello, universe"
    triggerRef(shallow)
    ```

## customRef() {#customref}

Crea un `ref` personalizado con control explícito sobre su seguimiento de dependencias y el disparo de actualizaciones.

-   **Tipo**

    ```ts
    function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

    type CustomRefFactory<T> = (
      track: () => void,
      trigger: () => void
    ) => {
      get: () => T
      set: (value: T) => void
    }
    ```

-   **Detalles**

    `customRef()` espera una función de fábrica, la cual recibe las funciones `track` y `trigger` como argumentos y debe devolver un objeto con los métodos `get` y `set`.

    En general, `track()` debe llamarse dentro de `get()`, y `trigger()` debe llamarse dentro de `set()`. Sin embargo, tienes control total sobre cuándo deben llamarse, o si deben llamarse en absoluto.

-   **Ejemplo**

    Creando un `ref` con retardo (debounced) que solo actualiza el valor después de un cierto tiempo de espera tras la última llamada a `set`:

    ```js
    import { customRef } from 'vue'

    export function useDebouncedRef(value, delay = 200) {
      let timeout
      return customRef((track, trigger) => {
        return {
          get() {
            track()
            return value
          },
          set(newValue) {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              value = newValue
              trigger()
            }, delay)
          }
        }
      })
    }
    ```

    Uso en componente:

    ```vue
    <script setup>
    import { useDebouncedRef } from './debouncedRef'
    const text = useDebouncedRef('hello')
    </script>

    <template>
      <input v-model="text" />
    </template>
    ```

    [Pruébalo en el Playground](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

    :::warning Uso con precaución
    Al usar `customRef`, debemos ser cautelosos con el valor de retorno de su `getter`, particularmente al generar nuevos tipos de datos de objeto cada vez que se ejecuta el `getter`. Esto afecta la relación entre componentes padre e hijo, donde un `customRef` de este tipo ha sido pasado como una `prop`.

    La función de renderizado del componente padre podría dispararse por cambios en un estado reactivo diferente. Durante el redibujado, el valor de nuestro `customRef` se reevalúa, devolviendo un nuevo tipo de dato de objeto como una `prop` a un componente hijo. Esta `prop` se compara con su último valor en el componente hijo, y como son diferentes, las dependencias reactivas del `customRef` se disparan en el componente hijo. Mientras tanto, las dependencias reactivas en el componente padre no se ejecutan porque el `setter` de `customRef` no fue llamado, y sus dependencias no se dispararon como resultado.

    [Verlo en el Playground](https://play.vuejs.org/#eNqFVEtP3DAQ/itTS9Vm1ZCt1J6WBZUiDvTQIsoNcwiOkzU4tmU7+9Aq/71jO1mCWuhlN3PyfPP45kAujCk2HSdLsnLMCuPBcd+Zc6pEa7T1cADWOa/b215nYMPPtvRsDT3UVrcww+DZ0flStybpKSkWQQqPU0IVVUwr58FYvdvDWTgu6am1pqSHL0fS0vJw/z0xbN1jUPHY/Ys87Zkzzl4K5qG2zmcnUN2oAqg4T6bQ/wENKNXNk+CxWKsSlmLTSk7XlhedYxnWclYDiK+MkQCoK4wnVtnIiBJuuEJNA2qPof7hzkEoc8DXgg9yzYTBBFgNr4xyY4FbaK2p6qfI0iqFgtgulOe27HyQRy69Dk1JXY9C03JIeQ6wg4xWvJCqFpnlNytOcyC2wzYulQNr0Ao+Mhw0KnTTEttl/CIaIJiMz8NGBHFtYetVrPwa58/IL48Zag4N0ssquNYLYBoW16J0vOkC3VQtVqk7cG9QcHz1kj0QAlgVYkNMFk6d0bJ1pbGYKUkmtD42HmvFfi94WhOEiXwjUnBnlEzfOLTJwy5qCo44D4O7en71SIFjI/F9VuG4jEy/GHQKq5hQrJAKOc4uNVighBF5/cygS0GgOMoK+HQb7+EWvLdMM7weVIJy5mXWi0Rj+xaNRhLKRp1IvB9hxYegA6WJ1xkUe9PcF4e9a+suA3YwYiC5MQ79KlFUzw5rZCZEUtoRWuE5PaXCXmxtuWIkpJSSr39EXXHQcWYNWfP/9A/uV3QUXJjueN2E1ZhtPnSIqGS+er3T77D76Ox1VUn0fsd4y3HfewCxuT2vVMVwp74RbTX8WQI1dy5qx12xI1Fpa1K5AreeEHCCN8q/QXul+LrSC3s4nh93jltkVPDIYt5KJkcIKStCReo4rVQ/CZI6dyEzToCCJu7hAtry/1QH/qXncQB400KJwqPxZHxEyona0xS/E3rt1m9Ld1rZl+uhaxecRtP3EjtgddCyimtXyj9H/Ii3eId7uOGTkyk/wOEbQ9h)

    :::

## shallowReactive() {#shallowreactive}

Versión superficial de [`reactive()`](./reactivity-core#reactive).

-   **Tipo**

    ```ts
    function shallowReactive<T extends object>(target: T): T
    ```

-   **Detalles**

    A diferencia de `reactive()`, no hay conversión profunda: solo las propiedades de nivel raíz son reactivas para un objeto `shallow reactive`. Los valores de las propiedades se almacenan y exponen tal cual; esto también significa que las propiedades con valores `ref` **no** se desenvolverán automáticamente.

    :::warning Uso con Precaución
    Las estructuras de datos superficiales solo deben usarse para el estado de nivel raíz en un componente. Evita anidarlas dentro de un objeto reactivo profundo, ya que crea un árbol con un comportamiento de reactividad inconsistente que puede ser difícil de entender y depurar.
    :::

-   **Ejemplo**

    ```js
    const state = shallowReactive({
      foo: 1,
      nested: {
        bar: 2
      }
    })

    // mutating state's own properties is reactive
    state.foo++

    // ...but does not convert nested objects
    isReactive(state.nested) // false

    // NOT reactive
    state.nested.bar++
    ```

## shallowReadonly() {#shallowreadonly}

Versión superficial de [`readonly()`](./reactivity-core#readonly).

-   **Tipo**

    ```ts
    function shallowReadonly<T extends object>(target: T): Readonly<T>
    ```

-   **Detalles**

    A diferencia de `readonly()`, no hay conversión profunda: solo las propiedades de nivel raíz se hacen de solo lectura. Los valores de las propiedades se almacenan y exponen tal cual; esto también significa que las propiedades con valores `ref` **no** se desenvolverán automáticamente.

    :::warning Uso con Precaución
    Las estructuras de datos superficiales solo deben usarse para el estado de nivel raíz en un componente. Evita anidarlas dentro de un objeto reactivo profundo, ya que crea un árbol con un comportamiento de reactividad inconsistente que puede ser difícil de entender y depurar.
    :::

-   **Ejemplo**

    ```js
    const state = shallowReadonly({
      foo: 1,
      nested: {
        bar: 2
      }
    })

    // mutating state's own properties will fail
    state.foo++

    // ...but works on nested objects
    isReadonly(state.nested) // false

    // works
    state.nested.bar++
    ```

## toRaw() {#toraw}

Devuelve el objeto crudo y original de un proxy creado por Vue.

-   **Tipo**

    ```ts
    function toRaw<T>(proxy: T): T
    ```

-   **Detalles**

    `toRaw()` puede devolver el objeto original de proxies creados por [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive) o [`shallowReadonly()`](#shallowreadonly).

    Esta es una vía de escape que se puede usar para leer temporalmente sin incurrir en la sobrecarga de acceso/seguimiento del proxy o escribir sin disparar cambios. **No** se recomienda mantener una referencia persistente al objeto original. Úsalo con precaución.

-   **Ejemplo**

    ```js
    const foo = {}
    const reactiveFoo = reactive(foo)

    console.log(toRaw(reactiveFoo) === foo) // true
    ```

## markRaw() {#markraw}

Marca un objeto para que nunca se convierta en un proxy. Devuelve el objeto mismo.

-   **Tipo**

    ```ts
    function markRaw<T extends object>(value: T): T
    ```

-   **Ejemplo**

    ```js
    const foo = markRaw({})
    console.log(isReactive(reactive(foo))) // false

    // also works when nested inside other reactive objects
    const bar = reactive({ foo })
    console.log(isReactive(bar.foo)) // false
    ```

    :::warning Uso con Precaución
    `markRaw()` y APIs superficiales como `shallowReactive()` te permiten excluirte selectivamente de la conversión reactiva/de solo lectura profunda predeterminada e incrustar objetos crudos, no proxy, en tu grafo de estado. Se pueden usar por varias razones:

    -   Algunos valores simplemente no deberían hacerse reactivos, por ejemplo, una instancia de clase compleja de terceros, o un objeto de componente Vue.

    -   Omitir la conversión de proxy puede proporcionar mejoras de rendimiento al renderizar grandes listas con fuentes de datos inmutables.

    Se consideran avanzados porque la exclusión de "crudo" es solo a nivel de raíz, por lo tanto, si estableces un objeto crudo anidado y no marcado en un objeto reactivo y luego lo accedes de nuevo, obtienes la versión con proxy. Esto puede llevar a **riesgos de identidad** - es decir, realizar una operación que depende de la identidad del objeto pero usando tanto la versión cruda como la versión proxy del mismo objeto:

    ```js
    const foo = markRaw({
      nested: {}
    })

    const bar = reactive({
      // although `foo` is marked as raw, foo.nested is not.
      nested: foo.nested
    })

    console.log(foo.nested === bar.nested) // false
    ```

    Los riesgos de identidad son, en general, raros. Sin embargo, para utilizar correctamente estas APIs mientras se evitan de forma segura los riesgos de identidad se requiere una comprensión sólida de cómo funciona el sistema de reactividad.

    :::

## effectScope() {#effectscope}

Crea un objeto de alcance de efecto (`effect scope`) el cual puede capturar los efectos reactivos (es decir, `computed` y `watchers`) creados dentro de él para que estos efectos puedan eliminarse juntos. Para casos de uso detallados de esta API, consulta su [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondiente.

-   **Tipo**

    ```ts
    function effectScope(detached?: boolean): EffectScope

    interface EffectScope {
      run<T>(fn: () => T): T | undefined // undefined if scope is inactive
      stop(): void
    }
    ```

-   **Ejemplo**

    ```js
    const scope = effectScope()

    scope.run(() => {
      const doubled = computed(() => counter.value * 2)

      watch(doubled, () => console.log(doubled.value))

      watchEffect(() => console.log('Count: ', doubled.value))
    })

    // to dispose all effects in the scope
    scope.stop()
    ```

## getCurrentScope() {#getcurrentscope}

Devuelve el `effect scope` activo actual si existe uno.

-   **Tipo**

    ```ts
    function getCurrentScope(): EffectScope | undefined
    ```

## onScopeDispose() {#onscopedispose}

Registra una función de `dispose` (callback) en el `effect scope` activo actual. La función de `callback` se invocará cuando el `effect scope` asociado se detenga.

Este método puede usarse como un reemplazo de `onUnmounted` no acoplado a componentes en funciones de composición reutilizables, ya que la función `setup()` de cada componente Vue también se invoca en un `effect scope`.

Se lanzará una advertencia si esta función se llama sin un `effect scope` activo. En la versión 3.5+, esta advertencia se puede suprimir pasando `true` como segundo argumento.

-   **Tipo**

    ```ts
    function onScopeDispose(fn: () => void, failSilently?: boolean): void
    ```