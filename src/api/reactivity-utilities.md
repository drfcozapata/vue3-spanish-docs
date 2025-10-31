# API de Reactividad: Utilidades {#reactivity-api-utilities}

## isRef() {#isref}

Comprueba si un valor es un objeto `ref`.

- **Tipo**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Ten en cuenta que el tipo de retorno es un [predicado de tipo](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), lo que significa que `isRef` puede usarse como una guardia de tipo:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // el tipo de `foo` se estrecha a Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Devuelve el valor interno si el argumento es un `ref`, de lo contrario devuelve el argumento mismo. Esta es una función de azúcar sintáctico para `val = isRef(val) ? val.value : val`.

- **Tipo**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Ejemplo**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // `unwrapped` está garantizado a ser number ahora
  }
  ```

## toRef() {#toref}

Puede usarse para normalizar valores / `refs` / `getters` en `refs` (3.3+).

También puede usarse para crear un `ref` para una propiedad en un objeto reactivo fuente. El `ref` creado se sincroniza con su propiedad fuente: la mutación de la propiedad fuente actualizará el `ref`, y viceversa.

- **Tipo**

  ```ts
  // normalization signature (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // object property signature
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Ejemplo**

  Firma de normalización (3.3+):

  ```js
  // devuelve refs existentes tal cual
  toRef(existingRef)

  // crea un ref de solo lectura que llama al getter al acceder a .value
  toRef(() => props.foo)

  // crea refs normales a partir de valores no funcionales
  // equivalente a ref(1)
  toRef(1)
  ```

  Firma de propiedad de objeto:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // un ref bidireccional que se sincroniza con la propiedad original
  const fooRef = toRef(state, 'foo')

  // mutar el ref actualiza el original
  fooRef.value++
  console.log(state.foo) // 2

  // mutar el original también actualiza el ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Ten en cuenta que esto es diferente de:

  ```js
  const fooRef = ref(state.foo)
  ```

  El `ref` anterior **no** está sincronizado con `state.foo`, porque el `ref()` recibe un valor numérico simple.

  `toRef()` es útil cuando quieres pasar el `ref` de una `prop` a una función composable:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // convierte `props.foo` en un ref, luego lo pasa a
  // un composable
  useSomeFeature(toRef(props, 'foo'))

  // sintaxis de getter - recomendada en 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Cuando `toRef` se utiliza con `props` de componente, las restricciones habituales sobre la mutación de las `props` siguen aplicándose. Intentar asignar un nuevo valor al `ref` es equivalente a intentar modificar la `prop` directamente y no está permitido. En ese escenario, quizás quieras considerar usar [`computed`](./reactivity-core#computed) con `get` y `set` en su lugar. Consulta la guía sobre [el uso de `v-model` con componentes](/guide/components/v-model) para más información.

  Cuando se utiliza la firma de propiedad de objeto, `toRef()` devolverá un `ref` utilizable incluso si la propiedad fuente no existe actualmente. Esto hace posible trabajar con propiedades opcionales, las cuales no serían detectadas por [`toRefs`](#torefs).

## toValue() {#tovalue}

- Solo soportado en 3.3+

Normaliza valores / `refs` / `getters` a valores. Esto es similar a [unref()](#unref), excepto que también normaliza `getters`. Si el argumento es un `getter`, será invocado y se devolverá su valor de retorno.

Esto puede usarse en [Composables](/guide/reusability/composables.html) para normalizar un argumento que puede ser un valor, un `ref` o un `getter`.

- **Tipo**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Ejemplo**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Normalizando argumentos en composables:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // reaccionar a los cambios de `id`
    })
  }

  // este composable soporta cualquiera de los siguientes:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Convierte un objeto reactivo en un objeto plano donde cada propiedad del objeto resultante es un `ref` que apunta a la propiedad correspondiente del objeto original. Cada `ref` individual se crea usando [`toRef()`](#toref).

- **Tipo**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Ejemplo**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Tipo de stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // El ref y la propiedad original están "vinculados"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` es útil al devolver un objeto reactivo desde una función composable para que el componente que lo consume pueda desestructurar/descomponer el objeto devuelto sin perder reactividad:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...lógica operando en state

    // convertir a refs al devolver
    return toRefs(state)
  }

  // se puede desestructurar sin perder reactividad
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` solo generará `refs` para las propiedades que son enumerables en el objeto fuente en el momento de la llamada. Para crear un `ref` para una propiedad que aún no existe, usa [`toRef`](#toref) en su lugar.

## isProxy() {#isproxy}

Comprueba si un objeto es un `proxy` creado por [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) o [`shallowReadonly()`](./reactivity-advanced#shallowReadonly).

- **Tipo**

  ```ts
  function isProxy(value: any): boolean
  ```

## isReactive() {#isreactive}

Comprueba si un objeto es un `proxy` creado por [`reactive()`](./reactivity-core#reactive) o [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Tipo**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Comprueba si el valor pasado es un objeto de solo lectura. Las propiedades de un objeto de solo lectura pueden cambiar, pero no pueden ser asignadas directamente a través del objeto pasado.

Los `proxies` creados por [`readonly()`](./reactivity-core#readonly) y [`shallowReadonly()`](./reactivity-advanced#shallowReadonly) se consideran de solo lectura, al igual que un `ref` [`computed()`](./reactivity-core#computed) sin una función `set`.

- **Tipo**

  ```ts
  function isReadonly(value: unknown): boolean
  ```