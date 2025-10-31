# TypeScript con la API de Opciones {#typescript-with-options-api}

> Esta página asume que ya has leído la visión general sobre [Usar Vue con TypeScript](./overview).

:::tip
Aunque Vue es compatible con el uso de TypeScript con la API de Opciones, se recomienda usar Vue con TypeScript a través de la API de Composición, ya que ofrece una inferencia de tipos más simple, eficiente y robusta.
:::

## Tipado de `props` de Componente {#typing-component-props}

La inferencia de tipos para las `props` en la API de Opciones requiere envolver el componente con `defineComponent()`. Con ello, Vue es capaz de inferir los tipos para las `props` basándose en la opción `props`, teniendo en cuenta opciones adicionales como `required: true` y `default`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // type: string | undefined
    this.id // type: number | string | undefined
    this.msg // type: string
    this.metadata // type: any
  }
})
```

Sin embargo, las opciones de `props` en tiempo de ejecución solo admiten el uso de funciones constructoras como tipo de `prop`; no hay forma de especificar tipos complejos como objetos con propiedades anidadas o firmas de llamadas de función.

Para anotar tipos de `props` complejos, podemos usar el tipo de utilidad `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // provide more specific type to `Object`
      type: Object as PropType<Book>,
      required: true
    },
    // can also annotate functions
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Error: argument of type 'string' is not
    // assignable to parameter of type 'number'
    this.callback?.('123')
  }
})
```

### Advertencias {#caveats}

Si tu versión de TypeScript es inferior a la `4.7`, debes tener cuidado al usar valores de función para las opciones de `props` `validator` y `default`; asegúrate de usar funciones de flecha:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Make sure to use arrow functions if your TypeScript version is less than 4.7
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Esto evita que TypeScript tenga que inferir el tipo de `this` dentro de estas funciones, lo que, desafortunadamente, puede hacer que la inferencia de tipos falle. Era una [limitación de diseño](https://github.com/microsoft/TypeScript/issues/38845) anterior, y ahora ha sido mejorada en [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods).

## Tipado de `emits` de Componente {#typing-component-emits}

Podemos declarar el tipo de `payload` esperado para un evento emitido usando la sintaxis de objeto de la opción `emits`. Además, todos los eventos emitidos no declarados arrojarán un error de tipo al ser llamados:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // perform runtime validation
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Type error!
      })

      this.$emit('non-declared-event') // Type error!
    }
  }
})
```

## Tipado de Propiedades Computadas {#typing-computed-properties}

Una propiedad computada infiere su tipo basándose en su valor de retorno:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // type: string
  }
})
```

En algunos casos, es posible que desees anotar explícitamente el tipo de una propiedad computada para asegurar que su implementación sea correcta:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // explicitly annotate return type
    greeting(): string {
      return this.message + '!'
    },

    // annotating a writable computed property
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

También pueden ser necesarias anotaciones explícitas en algunos casos excepcionales en los que TypeScript no logra inferir el tipo de una propiedad computada debido a bucles de inferencia circulares.

## Tipado de Manejadores de Eventos {#typing-event-handlers}

Al tratar con eventos DOM nativos, puede ser útil tipar correctamente el argumento que pasamos al manejador. Echemos un vistazo a este ejemplo:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` implicitly has `any` type
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Sin una anotación de tipo, el argumento `event` tendrá implícitamente un tipo `any`. Esto también resultará en un error de TS si se utilizan `"strict": true` o `"noImplicitAny": true` en `tsconfig.json`. Por lo tanto, se recomienda anotar explícitamente el argumento de los manejadores de eventos. Además, es posible que necesites usar aserciones de tipo al acceder a las propiedades de `event`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Aumentando Propiedades Globales {#augmenting-global-properties}

Algunos plugins instalan propiedades globalmente disponibles para todas las instancias de componentes a través de [`app.config.globalProperties`](/api/application#app-config-globalproperties). Por ejemplo, podemos instalar `this.$http` para la obtención de datos o `this.$translate` para la internacionalización. Para que esto funcione bien con TypeScript, Vue expone una interfaz `ComponentCustomProperties` diseñada para ser aumentada a través de la [aumentación de módulos de TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Ver también:

- [Tests unitarios de TypeScript para extensiones de tipo de componente](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

### Ubicación de la Aumentación de Tipo {#type-augmentation-placement}

Podemos colocar esta aumentación de tipo en un archivo `.ts`, o en un archivo `*.d.ts` a nivel de proyecto. De cualquier manera, asegúrate de que esté incluido en `tsconfig.json`. Para los autores de librerías/plugins, este archivo debe especificarse en la propiedad `types` en `package.json`.

Para aprovechar la aumentación de módulos, deberás asegurarte de que la aumentación se coloque en un [módulo de TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html). Es decir, el archivo debe contener al menos una declaración `import` o `export` de nivel superior, incluso si es solo `export {}`. Si la aumentación se coloca fuera de un módulo, ¡sobrescribirá los tipos originales en lugar de aumentarlos!

```ts
// Does not work, overwrites the original types.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Works correctly
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Aumentando Opciones Personalizadas {#augmenting-custom-options}

Algunos plugins, por ejemplo `vue-router`, brindan soporte para opciones de componente personalizadas como `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Sin una aumentación de tipo adecuada, los argumentos de este hook tendrán implícitamente un tipo `any`. Podemos aumentar la interfaz `ComponentCustomOptions` para soportar estas opciones personalizadas:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Ahora la opción `beforeRouteEnter` estará correctamente tipada. Ten en cuenta que esto es solo un ejemplo; las librerías bien tipadas como `vue-router` deberían realizar estas aumentaciones automáticamente en sus propias definiciones de tipo.

La ubicación de esta aumentación está sujeta a las [mismas restricciones](#type-augmentation-placement) que las aumentaciones de propiedades globales.

Ver también:

- [Tests unitarios de TypeScript para extensiones de tipo de componente](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

## Tipado de Directivas Personalizadas Globales {#typing-global-custom-directives}

Ver: [Tipado de Directivas Globales Personalizadas](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />