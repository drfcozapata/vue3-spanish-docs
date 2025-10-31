# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Devuelve el objeto `attrs` del [Contexto de Setup](/api/composition-api-setup#setup-context), que incluye los [atributos de traspaso](/guide/components/attrs#fallthrough-attributes) del componente actual. Esto está diseñado para ser usado en `<script setup>` donde el objeto de contexto setup no está disponible.

- **Tipo**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Devuelve el objeto `slots` del [Contexto de Setup](/api/composition-api-setup#setup-context), que incluye los slots pasados por el padre como funciones invocables que devuelven nodos del Virtual DOM. Esto está diseñado para ser usado en `<script setup>` donde el objeto de contexto setup no está disponible.

Si usas TypeScript, se debe preferir [`defineSlots()`](/api/sfc-script-setup#defineslots) en su lugar.

- **Tipo**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

Este es el ayudante subyacente que impulsa a [`defineModel()`](/api/sfc-script-setup#definemodel). Si usas `<script setup>`, se debe preferir `defineModel()` en su lugar.

- Solo disponible en 3.4+

- **Tipo**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  ): ModelRef

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }

  type ModelRef<T, M extends PropertyKey = string, G = T, S = T> = Ref<
    G,
    S
  > &
    [ModelRef<T, M, G, S>, Record<M, true | undefined>]
  ```

- **Ejemplo**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Detalles**

  `useModel()` puede ser usado en componentes que no son SFC, p. ej. cuando se usa la función `setup()` en bruto. Espera el objeto `props` como primer argumento, y el nombre del modelo como segundo argumento. El tercer argumento opcional puede ser usado para declarar un getter y un setter personalizados para el ref de modelo resultante. Ten en cuenta que, a diferencia de `defineModel()`, eres responsable de declarar las `props` y los `emits` tú mismo.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Devuelve un `ref` superficial cuyo valor se sincronizará con el elemento de plantilla o componente que tenga un atributo `ref` coincidente.

- **Tipo**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Ejemplo**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Ver también**
  - [Guía - Refs de Plantilla](/guide/essentials/template-refs)
  - [Guía - Tipado de Refs de Plantilla](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Guía - Tipado de Refs de Plantilla de Componentes](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Se utiliza para generar IDs únicos por aplicación para atributos de accesibilidad o elementos de formulario.

- **Tipo**

  ```ts
  function useId(): string
  ```

- **Ejemplo**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Name:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Detalles**

  Los IDs generados por `useId()` son únicos por aplicación. Se pueden usar para generar IDs para elementos de formulario y atributos de accesibilidad. Múltiples llamadas en el mismo componente generarán IDs diferentes; múltiples instancias del mismo componente que llamen a `useId()` también tendrán IDs diferentes.

  Los IDs generados por `useId()` también están garantizados de ser estables entre las renderizaciones del servidor y del cliente, por lo que se pueden usar en aplicaciones SSR sin provocar desajustes de hidratación.

  Si tienes más de una instancia de aplicación Vue de la misma página, puedes evitar conflictos de ID dando a cada aplicación un prefijo de ID a través de [`app.config.idPrefix`](/api/application#app-config-idprefix).

  :::warning Precaución
  `useId()` no debe ser llamado dentro de una propiedad `computed()` ya que podría causar conflictos de instancia. En su lugar, declara el ID fuera de `computed()` y referéncialo dentro de la función computada.
  :::
