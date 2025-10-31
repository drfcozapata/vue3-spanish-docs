# Elementos Especiales Integrados {#built-in-special-elements}

:::info No son componentes
`<component>`, `<slot>` y `<template>` son características similares a componentes y parte de la sintaxis de la plantilla. No son componentes verdaderos y se compilan durante la compilación de la plantilla. Como tales, se escriben convencionalmente en minúsculas en las plantillas.
:::

## `<component>` {#component}

Un "meta componente" para renderizar componentes o elementos dinámicos.

- **Props**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Detalles**

  El componente real a renderizar se determina mediante la prop `is`.

  - Cuando `is` es una cadena, puede ser el nombre de una etiqueta HTML o el nombre registrado de un componente.

  - Alternativamente, `is` también puede vincularse directamente a la definición de un componente.

- **Ejemplo**

  Renderizado de componentes por nombre registrado (Options API):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Renderizado de componentes por definición (Composition API con `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Renderizado de elementos HTML:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Todos los [componentes incorporados](./built-in-components) pueden pasarse a `is`, pero debes registrarlos si quieres pasarlos por nombre. Por ejemplo:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  El registro no es necesario si pasas el componente mismo a `is` en lugar de su nombre, por ejemplo, en `<script setup>`.

  Si se utiliza `v-model` en una etiqueta `<component>`, el compilador de plantillas lo expandirá a una prop `modelValue` y un oyente de evento `update:modelValue`, de forma muy similar a como lo haría para cualquier otro componente. Sin embargo, esto no será compatible con los elementos HTML nativos, como `<input>` o `<select>`. Como resultado, usar `v-model` con un elemento nativo creado dinámicamente no funcionará:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- This won't work as 'input' is a native HTML element -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  En la práctica, este caso extremo no es común, ya que los campos de formulario nativos suelen estar envueltos en componentes en aplicaciones reales. Si necesitas usar un elemento nativo directamente, puedes dividir `v-model` en un atributo y un evento manualmente.

- **Ver también** [Componentes dinámicos](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Denota puntos de salida de contenido de slot en plantillas.

- **Props**

  ```ts
  interface SlotProps {
    /**
     * Any props passed to <slot> to passed as arguments
     * for scoped slots
     */
    [key: string]: any
    /**
     * Reserved for specifying slot name.
     */
    name?: string
  }
  ```

- **Detalles**

  El elemento `<slot>` puede usar el atributo `name` para especificar un nombre de slot. Cuando no se especifica `name`, renderizará el slot predeterminado. Los atributos adicionales pasados al elemento slot se pasarán como slot props al scoped slot definido en el padre.

  El elemento mismo será reemplazado por su contenido de slot coincidente.

  Los elementos `<slot>` en las plantillas de Vue se compilan en JavaScript, por lo que no deben confundirse con los [elementos `<slot>` nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

- **Ver también** [Componente - Slots](/guide/components/slots)

## `<template>` {#template}

La etiqueta `<template>` se usa como un marcador de posición cuando queremos usar una directiva incorporada sin renderizar un elemento en el DOM.

- **Detalles**

  El manejo especial para `<template>` solo se activa si se usa con una de estas directivas:

  - `v-if`, `v-else-if`, o `v-else`
  - `v-for`
  - `v-slot`

  Si ninguna de esas directivas está presente, se renderizará como un [elemento `<template>` nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) en su lugar.

  Una `<template>` con un `v-for` también puede tener un [`key` attribute](/api/built-in-special-attributes#key). Todos los demás atributos y directivas serán descartados, ya que no son significativos sin un elemento correspondiente.

  Los componentes de un solo archivo utilizan una [etiqueta `<template>` de nivel superior](/api/sfc-spec#language-blocks) para envolver toda la plantilla. Ese uso es independiente del uso de `<template>` descrito anteriormente. Esa etiqueta de nivel superior no forma parte de la plantilla en sí y no es compatible con la sintaxis de plantillas, como las directivas.

- **Ver también**
  - [Guía - `v-if` en `<template>`](/guide/essentials/conditional#v-if-on-template)
  - [Guía - `v-for` en `<template>`](/guide/essentials/list#v-for-on-template)
  - [Guía - Slots con nombre](/guide/components/slots#named-slots)
