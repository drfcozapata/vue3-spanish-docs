# Composition API: <br>Inyección de Dependencias {#composition-api-dependency-injection}

## provide() {#provide}

Proporciona un valor que puede ser inyectado por componentes descendientes.

- **Type**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Detalles**

  `provide()` toma dos argumentos: la clave, que puede ser una cadena o un `symbol`, y el valor a inyectar.

  Cuando se usa TypeScript, la clave puede ser un `symbol` casteado como `InjectionKey` - un tipo de utilidad proporcionado por Vue que extiende `Symbol`, el cual puede ser usado para sincronizar el tipo de valor entre `provide()` e `inject()`.

  Similar a las APIs de registro de `lifecycle hook`, `provide()` debe ser llamado de forma síncrona durante la fase `setup()` de un componente.

- **Ejemplo**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // provide static value
  provide('path', '/project/')

  // provide reactive value
  const count = ref(0)
  provide('count', count)

  // provide with Symbol keys
  provide(countSymbol, count)
  </script>
  ```

- **Ver también**
  - [Guía - Provide / Inject](/guide/components/provide-inject)
  - [Guía - Tipado de Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Inyecta un valor proporcionado por un componente ancestro o la aplicación (a través de `app.provide()`).

- **Type**

  ```ts
  // without default value
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // with default value
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // with factory
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Detalles**

  El primer argumento es la clave de inyección. Vue recorrerá la cadena de padres para localizar un valor proporcionado con una clave coincidente. Si múltiples componentes en la cadena de padres proporcionan la misma clave, el más cercano al componente que inyecta "ensombrecerá" a los que estén más arriba en la cadena y se usará su valor. Si no se encontró ningún valor con una clave coincidente, `inject()` devuelve `undefined` a menos que se proporcione un valor por defecto.

  El segundo argumento es opcional y es el valor por defecto a usar cuando no se encontró ningún valor coincidente.

  El segundo argumento también puede ser una función `factory` que devuelve valores que son costosos de crear. En este caso, `true` debe pasarse como tercer argumento para indicar que la función debe usarse como `factory` en lugar del valor en sí.

  Similar a las APIs de registro de `lifecycle hook`, `inject()` debe ser llamado de forma síncrona durante la fase `setup()` de un componente.

  Cuando se usa TypeScript, la clave puede ser del tipo `InjectionKey` - un tipo de utilidad proporcionado por Vue que extiende `Symbol`, el cual puede ser usado para sincronizar el tipo de valor entre `provide()` e `inject()`.

- **Ejemplo**

  Asumiendo que un componente padre ha proporcionado valores como se muestra en el ejemplo `provide()` anterior:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // inject static value without default
  const path = inject('path')

  // inject reactive value
  const count = inject('count')

  // inject with Symbol keys
  const count2 = inject(countSymbol)

  // inject with default value
  const bar = inject('path', '/default-path')

  // inject with function default value
  const fn = inject('function', () => {})

  // inject with default value factory
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```
  
- **Ver también**
  - [Guía - Provide / Inject](/guide/components/provide-inject)
  - [Guía - Tipado de Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() {#has-injection-context}

- Solo compatible con 3.3+

Devuelve `true` si [`inject()`](#inject) puede usarse sin advertencia por ser llamado en el lugar incorrecto (por ejemplo, fuera de `setup()`). Este método está diseñado para ser usado por librerías que quieren usar `inject()` internamente sin activar una advertencia para el usuario final.

- **Type**

  ```ts
  function hasInjectionContext(): boolean
  ```