# Tipos de Utilidad {#utility-types}

:::info
Esta página solo enumera algunos tipos de utilidad de uso común que pueden necesitar explicación sobre su uso. Para una lista completa de los tipos exportados, consulta el [código fuente](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Se utiliza para anotar una `prop` con tipos más avanzados al usar declaraciones de `props` en tiempo de ejecución.

- **Ejemplo**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // provide more specific type to `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Ver también** [Guía - Tipado de `props` de Componente](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

- Solo soportado en 3.3+

Alias para `T | Ref<T>`. Útil para anotar los argumentos de los [Composables](/guide/reusability/composables.html).

## MaybeRefOrGetter\<T> {#maybereforgetter}

- Solo soportado en 3.3+

Alias para `T | Ref<T> | (() => T)`. Útil para anotar los argumentos de los [Composables](/guide/reusability/composables.html).

## ExtractPropTypes\<T> {#extractproptypes}

Extrae los tipos de `prop` de un objeto de opciones de `props` en tiempo de ejecución. Los tipos extraídos son de cara interna, es decir, las `props` resueltas que recibe el componente. Esto significa que las `props` booleanas y las `props` con valores predeterminados siempre están definidas, incluso si no son requeridas.

Para extraer las `props` de cara pública, es decir, las `props` que el padre puede pasar, usa [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Ejemplo**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

- Solo soportado en 3.3+

Extrae los tipos de `prop` de un objeto de opciones de `props` en tiempo de ejecución. Los tipos extraídos son de cara pública, es decir, las `props` que el padre puede pasar.

- **Ejemplo**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Se utiliza para aumentar el tipo de instancia del componente para soportar propiedades globales personalizadas.

- **Ejemplo**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  Las aumentos deben colocarse en un archivo de módulo `.ts` o `.d.ts`. Consulta [Ubicación del Aumento de Tipos](/guide/typescript/options-api#augmenting-global-properties) para más detalles.
  :::

- **Ver también** [Guía - Aumento de Propiedades Globales](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Se utiliza para aumentar el tipo de opciones del componente para soportar opciones personalizadas.

- **Ejemplo**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  Las aumentos deben colocarse en un archivo de módulo `.ts` o `.d.ts`. Consulta [Ubicación del Aumento de Tipos](/guide/typescript/options-api#augmenting-global-properties) para más detalles.
  :::

- **Ver también** [Guía - Aumento de Opciones Personalizadas](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Se utiliza para aumentar las `props` TSX permitidas con el fin de usar `props` no declaradas en elementos TSX.

- **Ejemplo**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // now works even if hello is not a declared prop
  <MyComponent hello="world" />
  ```

  :::tip
  Las aumentos deben colocarse en un archivo de módulo `.ts` o `.d.ts`. Consulta [Ubicación del Aumento de Tipos](/guide/typescript/options-api#augmenting-global-properties) para más detalles.
  :::

## CSSProperties {#cssproperties}

Se utiliza para aumentar los valores permitidos en los enlaces de propiedades de `style`.

- **Ejemplo**

  Permitir cualquier propiedad CSS personalizada

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
Las aumentos deben colocarse en un archivo de módulo `.ts` o `.d.ts`. Consulta [Ubicación del Aumento de Tipos](/guide/typescript/options-api#augmenting-global-properties) para más detalles.
:::

:::info Ver también
Las etiquetas `<style>` de SFC soportan la vinculación de valores CSS al estado dinámico del componente usando la función CSS `v-bind`. Esto permite propiedades personalizadas sin aumento de tipo.

- [`v-bind()` en CSS](/api/sfc-css-features#v-bind-in-css)
  :::