# Opciones: Estado {#options-state}

## data {#data}

Una función que devuelve el estado reactivo inicial para la instancia del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **Detalles**

  Se espera que la función devuelva un objeto JavaScript simple, que Vue hará reactivo. Una vez creada la instancia, se puede acceder al objeto de datos reactivo como `this.$data`. La instancia del componente también hace proxy de todas las propiedades encontradas en el objeto `data`, por lo que `this.a` será equivalente a `this.$data.a`.

  Todas las propiedades de `data` de nivel superior deben incluirse en el objeto de datos devuelto. Es posible añadir nuevas propiedades a `this.$data`, pero **no** se recomienda. Si el valor deseado de una propiedad aún no está disponible, se debe incluir un valor vacío como `undefined` o `null` como marcador de posición para asegurar que Vue sepa que la propiedad existe.

  Las propiedades que comienzan con `_` o `$` **no** se harán proxy en la instancia del componente porque pueden entrar en conflicto con las propiedades internas y los métodos de la API de Vue. Tendrás que acceder a ellas como `this.$data._property`.

  **No** se recomienda devolver objetos con su propio comportamiento con estado, como objetos de la API del navegador y propiedades de prototipo. El objeto devuelto debería ser idealmente un objeto simple que solo represente el estado del componente.

- **Ejemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  Ten en cuenta que si usas una función flecha con la propiedad `data`, `this` no será la instancia del componente, pero aún puedes acceder a la instancia como el primer argumento de la función:

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **Ver también** [Reactividad en profundidad](/guide/extras/reactivity-in-depth)

## props {#props}

Declara las `props` de un componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown, rawProps: object) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > Los tipos se simplifican para facilitar la lectura.

- **Detalles**

  En Vue, todas las `props` del componente deben declararse explícitamente. Las `props` del componente pueden declararse de dos formas:

  - Forma simple usando un array de cadenas de texto
  - Forma completa usando un objeto donde cada clave de propiedad es el nombre de la `prop`, y el valor es el tipo de la `prop` (una función constructora) o las opciones avanzadas.

  Con la sintaxis basada en objetos, cada `prop` puede definir además las siguientes opciones:

  - **`type`**: Puede ser uno de los siguientes constructores nativos: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, cualquier función constructora personalizada o un array de estos. En modo de desarrollo, Vue comprobará si el valor de una `prop` coincide con el tipo declarado y lanzará una advertencia si no es así. Consulta [Validación de `props`](/guide/components/props#prop-validation) para más detalles.

    Ten en cuenta también que una `prop` con tipo `Boolean` afecta a su comportamiento de conversión de valor tanto en desarrollo como en producción. Consulta [Conversión a `Boolean`](/guide/components/props#boolean-casting) para más detalles.

  - **`default`**: Especifica un valor por defecto para la `prop` cuando no es pasada por el padre o tiene un valor `undefined`. Los valores por defecto de tipo objeto o array deben devolverse usando una función fábrica. La función fábrica también recibe el objeto `props` original como argumento.

  - **`required`**: Define si la `prop` es requerida. En un entorno que no sea de producción, se lanzará una advertencia en la consola si este valor es verdadero y la `prop` no se pasa.

  - **`validator`**: Función validadora personalizada que toma el valor de la `prop` y el objeto `props` como argumentos. En modo de desarrollo, se lanzará una advertencia en la consola si esta función devuelve un valor falsy (es decir, la validación falla).

- **Ejemplo**

  Declaración simple:

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  Declaración de objeto con validaciones:

  ```js
  export default {
    props: {
      // comprobación de tipo
      height: Number,
      // comprobación de tipo más otras validaciones
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **Ver también**
  - [Guía - Props](/guide/components/props)
  - [Guía - Tipado de Props de Componente](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

Declara propiedades `computed` que se expondrán en la instancia del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **Detalles**

  La opción acepta un objeto donde la clave es el nombre de la propiedad `computed`, y el valor es un `getter` `computed`, o un objeto con métodos `get` y `set` (para propiedades `computed` escribibles).

  Todos los `getters` y `setters` tienen su contexto `this` automáticamente vinculado a la instancia del componente.

  Ten en cuenta que si usas una función flecha con una propiedad `computed`, `this` no apuntará a la instancia del componente, pero aún puedes acceder a la instancia como el primer argumento de la función:

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **Ejemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // solo lectura
      aDouble() {
        return this.a * 2
      },
      // escribible
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **Ver también**
  - [Guía - Propiedades Computed](/guide/essentials/computed)
  - [Guía - Tipado de Propiedades Computed](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

Declara los `methods` que se mezclarán en la instancia del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **Detalles**

  Los `methods` declarados pueden ser accedidos directamente en la instancia del componente, o usados en expresiones de plantilla. Todos los `methods` tienen su contexto `this` automáticamente vinculado a la instancia del componente, incluso cuando se pasan.

  Evita usar funciones flecha al declarar `methods`, ya que no tendrán acceso a la instancia del componente a través de `this`.

- **Ejemplo**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **Ver también** [Manejo de Eventos](/guide/essentials/event-handling)

## watch {#watch}

Declara las `callbacks` de `watch` que se invocarán al cambiar los datos.

- **Tipo**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > Los tipos se simplifican para facilitar la lectura.

- **Detalles**

  La opción `watch` espera un objeto donde las claves son las propiedades reactivas de la instancia del componente a observar (por ejemplo, propiedades declaradas a través de `data` o `computed`) — y los valores son las `callbacks` correspondientes. La `callback` recibe el nuevo valor y el valor antiguo de la fuente observada.

  Además de una propiedad de nivel raíz, la clave también puede ser una ruta simple delimitada por puntos, por ejemplo, `a.b.c`. Ten en cuenta que este uso **no** soporta expresiones complejas; solo se admiten rutas delimitadas por puntos. Si necesitas observar fuentes de datos complejas, usa la API imperativa [`$watch()`](/api/component-instance#watch) en su lugar.

  El valor también puede ser una cadena de texto con el nombre de un método (declarado a través de `methods`), o un objeto que contenga opciones adicionales. Cuando se usa la sintaxis de objeto, la `callback` debe declararse bajo el campo `handler`. Las opciones adicionales incluyen:

  - **`immediate`**: dispara la `callback` inmediatamente al crear el `watcher`. El valor antiguo será `undefined` en la primera llamada.
  - **`deep`**: fuerza el recorrido profundo de la fuente si es un objeto o un array, para que la `callback` se dispare en mutaciones profundas. Consulta [Watchers Profundos](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: ajusta el momento de vaciado de la `callback`. Consulta [Momento de Vaciado de la Callback](/guide/essentials/watchers#callback-flush-timing) y [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: depura las dependencias del `watcher`. Consulta [Depuración de Watchers](/guide/extras/reactivity-in-depth#watcher-debugging).

  Evita usar funciones flecha al declarar `callbacks` de `watch`, ya que no tendrán acceso a la instancia del componente a través de `this`.

- **Ejemplo**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // observando propiedad de nivel superior
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // nombre de método en cadena de texto
      b: 'someMethod',
      // la callback se llamará cada vez que cambie alguna de las propiedades del objeto observado, independientemente de su profundidad anidada
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // observando una sola propiedad anidada:
      'c.d': function (val, oldVal) {
        // do something
      },
      // la callback se llamará inmediatamente después del inicio de la observación
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // puedes pasar un array de callbacks, se llamarán una por una
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => new: 3, old: 1
    }
  }
  ```

- **Ver también** [Watchers](/guide/essentials/watchers)

## emits {#emits}

Declara los eventos personalizados emitidos por el componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **Detalles**

  Los eventos emitidos pueden declararse de dos formas:

  - Forma simple usando un array de cadenas de texto
  - Forma completa usando un objeto donde cada clave de propiedad es el nombre del evento, y el valor es `null` o una función validadora.

  La función de validación recibirá los argumentos adicionales pasados a la llamada `$emit` del componente. Por ejemplo, si se llama a `this.$emit('foo', 1)`, el validador correspondiente para `foo` recibirá el argumento `1`. La función validadora debe devolver un booleano para indicar si los argumentos del evento son válidos.

  Ten en cuenta que la opción `emits` afecta a qué `event listeners` se consideran `event listeners` del componente, en lugar de `event listeners` nativos del DOM. Los `listeners` para eventos declarados se eliminarán del objeto `$attrs` del componente, por lo que no se pasarán al elemento raíz del componente. Consulta [Atributos `Fallthrough`](/guide/components/attrs) para más detalles.

- **Ejemplo**

  Sintaxis de array:

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  Sintaxis de objeto:

  ```js
  export default {
    emits: {
      // sin validación
      click: null,

      // con validación
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

- **Ver también**
  - [Guía - Atributos `Fallthrough`](/guide/components/attrs)
  - [Guía - Tipado de Emits de Componente](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

Declara las propiedades públicas expuestas cuando se accede a la instancia del componente por un padre a través de `template refs`.

- **Tipo**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **Detalles**

  Por defecto, una instancia de componente expone todas las propiedades de instancia al padre cuando se accede a través de `$parent`, `$root`, o `template refs`. Esto puede ser indeseable, ya que un componente muy probablemente tiene estado interno o métodos que deberían mantenerse privados para evitar un acoplamiento estrecho.

  La opción `expose` espera una lista de cadenas de texto con nombres de propiedades. Cuando se usa `expose`, solo las propiedades explícitamente listadas se expondrán en la instancia pública del componente.

  `expose` solo afecta a las propiedades definidas por el usuario; no filtra las propiedades de instancia de componente incorporadas.

- **Ejemplo**

  ```js
  export default {
    // solo `publicMethod` estará disponible en la instancia pública
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```