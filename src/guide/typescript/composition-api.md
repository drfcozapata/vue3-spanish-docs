# TypeScript con Composition API {#typescript-with-composition-api}

<ScrimbaLink href="https://scrimba.com/links/vue-ts-composition-api" title="Lección gratuita de Vue.js TypeScript con Composition API" type="scrimba">
  Mira una lección de video interactiva en Scrimba
</ScrimbaLink>

> Esta página asume que ya has leído la descripción general sobre [Uso de Vue con TypeScript](./overview).

## Tipado de `props` de componente {#typing-component-props}

### Uso de `<script setup>` {#using-script-setup}

Al usar `<script setup>`, la macro `defineProps()` admite la inferencia de los tipos de `props` basándose en su argumento:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Esto se llama "declaración en tiempo de ejecución", porque el argumento pasado a `defineProps()` se utilizará como la opción de `props` en tiempo de ejecución.

Sin embargo, suele ser más sencillo definir `props` con tipos puros a través de un argumento de tipo genérico:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Esto se llama "declaración basada en tipo". El compilador hará todo lo posible para inferir las opciones de tiempo de ejecución equivalentes basándose en el argumento de tipo. En este caso, nuestro segundo ejemplo se compila en exactamente las mismas opciones de tiempo de ejecución que el primer ejemplo.

Puedes usar la declaración basada en tipo O la declaración en tiempo de ejecución, pero no puedes usar ambas al mismo tiempo.

También podemos mover los tipos de `props` a una interfaz separada:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

Esto también funciona si `Props` se importa de una fuente externa. Esta característica requiere que TypeScript sea una dependencia par de Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Limitaciones de Sintaxis {#syntax-limitations}

En la versión 3.2 y anteriores, el parámetro de tipo genérico para `defineProps()` estaba limitado a un literal de tipo o una referencia a una interfaz local.

Esta limitación se ha resuelto en 3.3. La última versión de Vue admite la referencia de tipos importados y un conjunto limitado de tipos complejos en la posición del parámetro de tipo. Sin embargo, debido a que la conversión de tipo a tiempo de ejecución sigue siendo basada en AST, algunos tipos complejos que requieren un análisis de tipo real, por ejemplo, tipos condicionales, no son compatibles. Puedes usar tipos condicionales para el tipo de una sola `prop`, pero no para todo el objeto `props`.

### Valores por Defecto de las `props` {#props-default-values}

Al usar la declaración basada en tipo, perdemos la capacidad de declarar valores por defecto para las `props`. Esto se puede resolver usando [Desestructuración Reactiva de Props](/guide/components/props#reactive-props-destructure) <sup class="vt-badge" data-text="3.5+" />:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

En 3.4 y anteriores, la Desestructuración Reactiva de Props no está habilitada por defecto. Una alternativa es usar la macro del compilador `withDefaults`:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

Esto se compilará a opciones por defecto de `props` equivalentes en tiempo de ejecución. Además, el asistente `withDefaults` proporciona comprobaciones de tipo para los valores por defecto y asegura que el tipo de `props` devuelto no tenga las banderas opcionales eliminadas para las propiedades que sí tienen valores por defecto declarados.

:::info
Ten en cuenta que los valores por defecto para tipos de referencia mutables (como arrays u objetos) deben envolverse en funciones al usar `withDefaults` para evitar modificaciones accidentales y efectos secundarios externos. Esto asegura que cada instancia de componente obtenga su propia copia del valor por defecto. Esto **no** es necesario cuando se usan valores por defecto con desestructuración.
:::

### Sin `<script setup>` {#without-script-setup}

Si no se usa `<script setup>`, es necesario usar `defineComponent()` para habilitar la inferencia de tipos de `props`. El tipo del objeto `props` pasado a `setup()` se infiere de la opción `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- type: string
  }
})
```

### Tipos de `props` complejos {#complex-prop-types}

Con la declaración basada en tipo, una `prop` puede usar un tipo complejo como cualquier otro tipo:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Para la declaración en tiempo de ejecución, podemos usar el tipo de utilidad `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Esto funciona de manera muy similar si estamos especificando la opción `props` directamente:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

La opción `props` se usa más comúnmente con la Options API, por lo que encontrarás ejemplos más detallados en la guía de [TypeScript con Options API](/guide/typescript/options-api#typing-component-props). Las técnicas mostradas en esos ejemplos también se aplican a las declaraciones en tiempo de ejecución usando `defineProps()`.

## Tipado de `emits` de componente {#typing-component-emits}

En `<script setup>`, la función `emit` también puede ser tipada usando la declaración en tiempo de ejecución O la declaración de tipo:

```vue
<script setup lang="ts">
// runtime
const emit = defineEmits(['change', 'update'])

// options based
const emit = defineEmits({
  change: (id: number) => {
    // return `true` or `false` to indicate
    // validation pass / fail
  },
  update: (value: string) => {
    // return `true` or `false` to indicate
    // validation pass / fail
  }
})

// type-based
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternative, more succinct syntax
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

El argumento de tipo puede ser uno de los siguientes:

1.  Un tipo de función invocable, pero escrito como un literal de tipo con [Firmas de Llamada](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Se utilizará como el tipo de la función `emit` devuelta.
2.  Un literal de tipo donde las claves son los nombres de los eventos, y los valores son tipos de array / tupla que representan los parámetros adicionales aceptados para el evento. El ejemplo anterior usa tuplas con nombre para que cada argumento pueda tener un nombre explícito.

Como podemos ver, la declaración de tipo nos da un control mucho más granular sobre las restricciones de tipo de los eventos emitidos.

Cuando no se usa `<script setup>`, `defineComponent()` es capaz de inferir los eventos permitidos para la función `emit` expuesta en el contexto de `setup`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- type check / auto-completion
  }
})
```

## Tipado de `ref()` {#typing-ref}

Los `refs` infieren el tipo del valor inicial:

```ts
import { ref } from 'vue'

// inferred type: Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

A veces podemos necesitar especificar tipos complejos para el valor interno de un `ref`. Podemos hacerlo usando el tipo `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

O, pasando un argumento genérico al llamar a `ref()` para anular la inferencia por defecto:

```ts
// resulting type: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Si especificas un argumento de tipo genérico pero omites el valor inicial, el tipo resultante será un tipo de unión que incluye `undefined`:

```ts
// inferred type: Ref<number | undefined>
const n = ref<number>()
```

## Tipado de `reactive()` {#typing-reactive}

`reactive()` también infiere implícitamente el tipo de su argumento:

```ts
import { reactive } from 'vue'

// inferred type: { title: string }
const book = reactive({ title: 'Vue 3 Guide' })
```

Para tipar explícitamente una propiedad `reactive`, podemos usar interfaces:

```ts
import { reactive } => 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 Guide' })
```

:::tip
No se recomienda usar el argumento genérico de `reactive()` porque el tipo devuelto, que maneja el desenvolvimiento de `ref` anidados, es diferente del tipo de argumento genérico.
:::

## Tipado de `computed()` {#typing-computed}

`computed()` infiere su tipo basándose en el valor de retorno del getter:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// inferred type: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

También puedes especificar un tipo explícito a través de un argumento genérico:

```ts
const double = computed<number>(() => {
  // type error if this doesn't return a number
})
```

## Tipado de Manejadores de Eventos {#typing-event-handlers}

Al tratar con eventos DOM nativos, podría ser útil tipar correctamente el argumento que pasamos al manejador. Echemos un vistazo a este ejemplo:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` implicitly has `any` type
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Sin anotación de tipo, el argumento `event` tendrá implícitamente un tipo `any`. Esto también resultará en un error de `TS` si se usan `"strict": true` o `"noImplicitAny": true` en `tsconfig.json`. Por lo tanto, se recomienda anotar explícitamente el argumento de los manejadores de eventos. Además, es posible que necesites usar aserciones de tipo al acceder a las propiedades de `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Tipado de `provide` / `inject` {#typing-provide-inject}

`provide` e `inject` se realizan generalmente en componentes separados. Para tipar correctamente los valores inyectados, Vue proporciona una interfaz `InjectionKey`, que es un tipo genérico que extiende `Symbol`. Se puede usar para sincronizar el tipo del valor inyectado entre el proveedor y el consumidor:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // providing non-string value will result in error

const foo = inject(key) // type of foo: string | undefined
```

Se recomienda colocar la clave de inyección en un archivo separado para que pueda ser importada en múltiples componentes.

Al usar claves de inyección de `string`, el tipo del valor inyectado será `unknown` y debe declararse explícitamente a través de un argumento de tipo genérico:

```ts
const foo = inject<string>('foo') // type: string | undefined
```

Ten en cuenta que el valor inyectado aún puede ser `undefined`, porque no hay garantía de que un proveedor proporcionará este valor en tiempo de ejecución.

El tipo `undefined` puede eliminarse proporcionando un valor por defecto:

```ts
const foo = inject<string>('foo', 'bar') // type: string
```

Si estás seguro de que el valor siempre se proporciona, también puedes forzar la conversión del valor:

```ts
const foo = inject('foo') as string
```

## Tipado de `Template Refs` {#typing-template-refs}

Con Vue 3.5 y `@vue/language-tools` 2.1 (que impulsa tanto el servicio de lenguaje del IDE como `vue-tsc`), el tipo de `refs` creados por `useTemplateRef()` en `SFCs` puede ser **inferido automáticamente** para `refs` estáticos basándose en el elemento donde se usa el atributo `ref` coincidente.

En casos donde la inferencia automática no es posible, aún puedes convertir el `template ref` a un tipo explícito a través del argumento genérico:

```ts
const el = useTemplateRef<HTMLInputElement>('el')
```

<details>
<summary>Uso antes de 3.5</summary>

Los `Template refs` deben crearse con un argumento de tipo genérico explícito y un valor inicial de `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

</details>

Para obtener la interfaz `DOM` correcta, puedes consultar páginas como [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary).

Ten en cuenta que para una estricta seguridad de tipo, es necesario usar encadenamiento opcional o guardas de tipo al acceder a `el.value`. Esto se debe a que el valor inicial de `ref` es `null` hasta que el componente se monta, y también puede establecerse en `null` si el elemento referenciado es desmontado por `v-if`.

## Tipado de `Template Refs` de Componente {#typing-component-template-refs}

Con Vue 3.5 y `@vue/language-tools` 2.1 (que impulsa tanto el servicio de lenguaje del IDE como `vue-tsc`), el tipo de `refs` creados por `useTemplateRef()` en `SFCs` puede ser **inferido automáticamente** para `refs` estáticos basándose en el elemento o componente donde se usa el atributo `ref` coincidente.

En casos donde la inferencia automática no es posible (por ejemplo, uso no `SFC` o componentes dinámicos), aún puedes convertir el `template ref` a un tipo explícito a través del argumento genérico.

Para obtener el tipo de instancia de un componente importado, primero necesitamos obtener su tipo a través de `typeof`, luego usar la utilidad `InstanceType` incorporada de TypeScript para extraer su tipo de instancia:

```vue{6,7} [App.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

En casos donde el tipo exacto del componente no está disponible o no es importante, se puede usar `ComponentPublicInstance` en su lugar. Esto solo incluirá propiedades que son compartidas por todos los componentes, como `$el`:

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

En casos donde el componente referenciado es un [componente genérico](/guide/typescript/overview.html#generic-components), por ejemplo `MyGenericModal`:

```vue [MyGenericModal.vue]
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

Debe ser referenciado usando `ComponentExposed` de la librería [vue-component-type-helpers](https://www.npmjs.com/package/vue-component-type-helpers) ya que `InstanceType` no funcionará.

```vue [App.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal =
  useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

Ten en cuenta que con `@vue/language-tools` 2.1+, los tipos de `template refs` estáticos pueden inferirse automáticamente y lo anterior solo es necesario en casos excepcionales.

## Tipado de Directivas Personalizadas Globales {#typing-global-custom-directives}

Para obtener sugerencias de tipo y comprobación de tipo para directivas personalizadas globales declaradas con `app.directive()`, puedes extender `ComponentCustomProperties`

```ts [src/directives/highlight.ts]
import type { Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement, string>

declare module 'vue' {
  export interface ComponentCustomProperties {
    // prefix with v (v-highlight)
    vHighlight: HighlightDirective
  }
}

export default {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective
```

```ts [main.ts]
import highlight from './directives/highlight'
// ...other code
const app = createApp(App)
app.directive('highlight', highlight)
```

Uso en componente

```vue [App.vue]
<template>
  <p v-highlight="'blue'">This sentence is important!</p>
</template>
```