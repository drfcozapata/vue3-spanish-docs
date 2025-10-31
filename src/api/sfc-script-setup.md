# \<script setup> {#script-setup}

`<script setup>` es un azúcar sintáctico en tiempo de compilación para usar la Composition API dentro de los Single-File Components (SFCs). Es la sintaxis recomendada si estás usando tanto SFCs como la Composition API. Ofrece varias ventajas sobre la sintaxis normal de `<script>`:

- Código más conciso con menos código repetitivo
- Capacidad de declarar `props` y eventos emitidos usando TypeScript puro
- Mejor rendimiento en tiempo de ejecución (la plantilla se compila en una función de renderizado en el mismo ámbito, sin un proxy intermedio)
- Mejor rendimiento de inferencia de tipos del IDE (menos trabajo para el servidor de lenguaje al extraer tipos del código)

## Sintaxis Básica {#basic-syntax}

Para activar la sintaxis, añade el atributo `setup` al bloque `<script>`:

```vue
<script setup>
console.log('hello script setup')
</script>
```

El código dentro se compila como el contenido de la función `setup()` del componente. Esto significa que, a diferencia de un `<script>` normal, que solo se ejecuta una vez cuando el componente se importa por primera vez, el código dentro de `<script setup>` se **ejecutará cada vez que se cree una instancia del componente**.

### Los bindings de nivel superior se exponen a la plantilla {#top-level-bindings-are-exposed-to-template}

Al usar `<script setup>`, cualquier binding de nivel superior (incluyendo variables, declaraciones de funciones e importaciones) declarado dentro de `<script setup>` es directamente utilizable en la plantilla:

```vue
<script setup>
// variable
const msg = 'Hello!'

// functions
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

Las importaciones se exponen de la misma manera. Esto significa que puedes usar directamente una función auxiliar importada en expresiones de plantilla sin tener que exponerla a través de la opción `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## Reactividad {#reactivity}

El estado reactivo debe crearse explícitamente usando las [Reactivity APIs](./reactivity-core). Similar a los valores devueltos por una función `setup()`, las `ref` se desenvuelven automáticamente cuando se referencian en plantillas:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Uso de Componentes {#using-components}

Los valores en el ámbito de `<script setup>` también pueden usarse directamente como nombres de etiquetas de componentes personalizados:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Piensa en `MyComponent` como si fuera referenciado como una variable. Si has usado JSX, el modelo mental es similar aquí. El equivalente en `kebab-case` `<my-component>` también funciona en la plantilla; sin embargo, se recomienda encarecidamente usar etiquetas de componentes en `PascalCase` para mantener la coherencia. También ayuda a diferenciarlos de los elementos personalizados nativos.

### Componentes Dinámicos {#dynamic-components}

Dado que los componentes se referencian como variables en lugar de registrarse bajo claves de cadena, debemos usar el binding dinámico `:is` cuando usemos componentes dinámicos dentro de `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Observa cómo los componentes pueden usarse como variables en una expresión ternaria.

### Componentes Recursivos {#recursive-components}

Un SFC puede referirse implícitamente a sí mismo a través de su nombre de archivo. Por ejemplo, un archivo llamado `FooBar.vue` puede referirse a sí mismo como `<FooBar/>` en su plantilla.

Ten en cuenta que esto tiene menor prioridad que los componentes importados. Si tienes una importación nombrada que entra en conflicto con el nombre inferido del componente, puedes aliasar la importación:

```js
import { FooBar as FooBarChild } from './components'
```

### Componentes con Espacio de Nombres {#namespaced-components}

Puedes usar etiquetas de componentes con puntos como `<Foo.Bar>` para referirte a componentes anidados bajo propiedades de objetos. Esto es útil cuando importas múltiples componentes desde un solo archivo:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## Uso de Directivas Personalizadas {#using-custom-directives}

Las directivas personalizadas registradas globalmente funcionan con normalidad. Las directivas personalizadas locales no necesitan ser registradas explícitamente con `<script setup>`, pero deben seguir el esquema de nombres `vNameOfDirective`:

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // do something with the element
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

Si estás importando una directiva de otro lugar, se le puede cambiar el nombre para que se ajuste al esquema de nombres requerido:

```vue
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## defineProps() & defineEmits() {#defineprops-defineemits}

Para declarar opciones como `props` y `emits` con soporte completo de inferencia de tipos, podemos usar las APIs `defineProps` y `defineEmits`, que están disponibles automáticamente dentro de `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` y `defineEmits` son **macros de compilador** solo utilizables dentro de `<script setup>`. No necesitan ser importadas y son eliminadas durante el procesamiento de `<script setup>`.

- `defineProps` acepta el mismo valor que la opción `props`, mientras que `defineEmits` acepta el mismo valor que la opción `emits`.

- `defineProps` y `defineEmits` proporcionan una inferencia de tipos adecuada basada en las opciones pasadas.

- Las opciones pasadas a `defineProps` y `defineEmits` se elevarán fuera de `setup` al ámbito del módulo. Por lo tanto, las opciones no pueden hacer referencia a variables locales declaradas en el ámbito de `setup`. Hacerlo resultará en un error de compilación. Sin embargo, _sí puede_ hacer referencia a bindings importados, ya que también se encuentran en el ámbito del módulo.

### Declaraciones de props/emit solo por tipo<sup class="vt-badge ts" /> {#type-only-props-emit-declarations}

Las `props` y `emits` también se pueden declarar usando una sintaxis puramente de tipo pasando un argumento de tipo literal a `defineProps` o `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternative, more succinct syntax
const emit = defineEmits<{
  change: [id: number] // named tuple syntax
  update: [value: string]
}>()
```

- `defineProps` o `defineEmits` solo pueden usar la declaración en tiempo de ejecución O la declaración de tipo. Usar ambas al mismo tiempo resultará en un error de compilación.

- Al usar la declaración de tipo, la declaración de tiempo de ejecución equivalente se genera automáticamente a partir del análisis estático para eliminar la necesidad de una doble declaración y asegurar el comportamiento correcto en tiempo de ejecución.

  - En modo desarrollo, el compilador intentará inferir la validación en tiempo de ejecución correspondiente a partir de los tipos. Por ejemplo, aquí `foo: String` se infiere del tipo `foo: string`. Si el tipo es una referencia a un tipo importado, el resultado inferido será `foo: null` (igual al tipo `any`), ya que el compilador no tiene información de archivos externos.

  - En modo producción, el compilador generará la declaración en formato de array para reducir el tamaño del paquete (las `props` aquí se compilarán en `['foo', 'bar']`).

- En la versión 3.2 y anteriores, el parámetro de tipo genérico para `defineProps()` estaba limitado a un tipo literal o a una referencia a una interfaz local.

  Esta limitación se ha resuelto en la versión 3.3. La última versión de Vue admite la referencia a tipos importados y a un conjunto limitado de tipos complejos en la posición del parámetro de tipo. Sin embargo, dado que la conversión de tipo a tiempo de ejecución sigue basándose en el AST, algunos tipos complejos que requieren un análisis de tipo real, como los tipos condicionales, no son compatibles. Puedes usar tipos condicionales para el tipo de una sola `prop`, pero no para todo el objeto `props`.

### Desestructuración Reactiva de Props <sup class="vt-badge" data-text="3.5+" /> {#reactive-props-destructure}

En Vue 3.5 y versiones posteriores, las variables desestructuradas del valor de retorno de `defineProps` son reactivas. El compilador de Vue antepone automáticamente `props.` cuando el código en el mismo bloque `<script setup>` accede a variables desestructuradas de `defineProps`:

```ts
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // runs only once before 3.5
  // re-runs when the "foo" prop changes in 3.5+
  console.log(foo)
})
```

Lo anterior se compila al siguiente equivalente:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` transformed to `props.foo` by the compiler
  console.log(props.foo)
})
```

Además, puedes usar la sintaxis nativa de JavaScript para declarar valores por defecto para las `props`. Esto es particularmente útil cuando se usa la declaración de `props` basada en tipos:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

### Valores por defecto de props al usar declaración de tipo <sup class="vt-badge ts" /> {#default-props-values-when-using-type-declaration}

En 3.5 y versiones posteriores, los valores por defecto pueden declararse de forma natural al usar la Desestructuración Reactiva de `Props`. Pero en 3.4 y versiones anteriores, la Desestructuración Reactiva de `Props` no está habilitada por defecto. Para declarar valores por defecto de `props` con declaración basada en tipos, es necesario el macro `withDefaults` del compilador:

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

Esto se compilará a opciones `default` de `props` de tiempo de ejecución equivalentes. Además, el asistente `withDefaults` proporciona comprobaciones de tipo para los valores por defecto y asegura que el tipo `props` devuelto tenga las banderas opcionales eliminadas para las propiedades que tienen valores por defecto declarados.

:::info
Ten en cuenta que los valores por defecto para tipos de referencia mutables (como arrays u objetos) deben encapsularse en funciones al usar `withDefaults` para evitar modificaciones accidentales y efectos secundarios externos. Esto asegura que cada instancia del componente obtenga su propia copia del valor por defecto. Esto **no** es necesario cuando se usan valores por defecto con desestructuración.
:::

## defineModel() {#definemodel}

- Solo disponible en 3.4+

Este macro se puede usar para declarar una `prop` de binding bidireccional que puede ser consumida a través de `v-model` desde el componente padre. El ejemplo de uso también se discute en la guía [Component `v-model`](/guide/components/v-model).

Internamente, este macro declara una `prop` de modelo y un evento de actualización de valor correspondiente. Si el primer argumento es una cadena literal, se usará como el nombre de la `prop`; de lo contrario, el nombre de la `prop` por defecto será `"modelValue"`. En ambos casos, también puedes pasar un objeto adicional que puede incluir las opciones de la `prop` y las opciones de transformación de valor de la `ref` del modelo.

```js
// declares "modelValue" prop, consumed by parent via v-model
const model = defineModel()
// OR: declares "modelValue" prop with options
const model = defineModel({ type: String })

// emits "update:modelValue" when mutated
model.value = 'hello'

// declares "count" prop, consumed by parent via v-model:count
const count = defineModel('count')
// OR: declares "count" prop with options
const count = defineModel('count', { type: Number, default: 0 })

function inc() {
  // emits "update:count" when mutated
  count.value++
}
```

:::warning
Si tienes un valor `default` para la `prop` de `defineModel` y no proporcionas ningún valor para esta `prop` desde el componente padre, esto puede causar una desincronización entre los componentes padre e hijo. En el siguiente ejemplo, `myRef` del padre es `undefined`, pero `model` del hijo es 1:

```vue [Child.vue]
<script setup>
const model = defineModel({ default: 1 })
</script>
```

```vue [Parent.vue]
<script setup>
const myRef = ref()
</script>

<template>
  <Child v-model="myRef"></Child>
</template>
```

:::

### Modificadores y Transformadores {#modifiers-and-transformers}

Para acceder a los modificadores utilizados con la directiva `v-model`, podemos desestructurar el valor de retorno de `defineModel()` de la siguiente manera:

```js
const [modelValue, modelModifiers] = defineModel()

// corresponds to v-model.trim
if (modelModifiers.trim) {
  // ...
}
```

Cuando un modificador está presente, probablemente necesitemos transformar el valor al leerlo o sincronizarlo de nuevo con el padre. Podemos lograr esto usando las opciones de transformador `get` y `set`:

```js
const [modelValue, modelModifiers] = defineModel({
  // get() omitted as it is not needed here
  set(value) {
    // if the .trim modifier is used, return trimmed value
    if (modelModifiers.trim) {
      return value.trim()
    }
    // otherwise, return the value as-is
    return value
  }
})
```

### Uso con TypeScript <sup class="vt-badge ts" /> {#usage-with-typescript}

Al igual que `defineProps` y `defineEmits`, `defineModel` también puede recibir argumentos de tipo para especificar los tipos del valor del modelo y los modificadores:

```ts
const modelValue = defineModel<string>()
//    ^? Ref<string | undefined>

// default model with options, required removes possible undefined values
const modelValue = defineModel<string>({ required: true })
//    ^? Ref<string>

const [modelValue, modifiers] = defineModel<string, 'trim' | 'uppercase'>()
//                 ^? Record<'trim' | 'uppercase', true | undefined>
```

## defineExpose() {#defineexpose}

Los componentes que usan `<script setup>` están **cerrados por defecto**; es decir, la instancia pública del componente, que se recupera a través de las `template refs` o las cadenas `$parent`, **no** expondrá ninguno de los bindings declarados dentro de `<script setup>`.

Para exponer propiedades explícitamente en un componente `<script setup>`, usa el macro de compilador `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Cuando un padre obtiene una instancia de este componente a través de `template refs`, la instancia recuperada tendrá la forma `{ a: number, b: number }` (las `refs` se desenvuelven automáticamente, al igual que en las instancias normales).

## defineOptions() {#defineoptions}

- Solo compatible con 3.3+

Este macro se puede usar para declarar opciones de componente directamente dentro de `<script setup>` sin tener que usar un bloque `<script>` separado:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
  customOptions: {
    /* ... */
  }
})
</script>
```

- Esto es un macro. Las opciones se elevarán al ámbito del módulo y no podrán acceder a variables locales en `<script setup>` que no sean constantes literales.

## defineSlots()<sup class="vt-badge ts"/> {#defineslots}

- Solo compatible con 3.3+

Este macro se puede usar para proporcionar sugerencias de tipo a los IDEs para la comprobación de tipos del nombre y las `props` del slot.

`defineSlots()` solo acepta un parámetro de tipo y ningún argumento en tiempo de ejecución. El parámetro de tipo debe ser un tipo literal donde la clave de la propiedad sea el nombre del slot, y el tipo de valor sea la función del slot. El primer argumento de la función son las `props` que el slot espera recibir, y su tipo se usará para las `slot props` en la plantilla. El tipo de retorno se ignora actualmente y puede ser `any`, pero podríamos aprovecharlo para la comprobación del contenido del slot en el futuro.

También devuelve el objeto `slots`, que es equivalente al objeto `slots` expuesto en el contexto `setup` o devuelto por `useSlots()`.

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

## useSlots() & useAttrs() {#useslots-useattrs}

El uso de `slots` y `attrs` dentro de `<script setup>` debería ser relativamente raro, ya que puedes acceder a ellos directamente como `$slots` y `$attrs` en la plantilla. En el raro caso en que los necesites, usa los asistentes `useSlots` y `useAttrs` respectivamente:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` y `useAttrs` son funciones reales en tiempo de ejecución que devuelven el equivalente de `setupContext.slots` y `setupContext.attrs`. También se pueden usar en funciones normales de Composition API.

## Uso junto con `<script>` normal {#usage-alongside-normal-script}

`<script setup>` puede usarse junto con un `<script>` normal. Un `<script>` normal puede ser necesario en los casos en que necesitemos:

- Declarar opciones que no pueden expresarse en `<script setup>`, por ejemplo, `inheritAttrs` u opciones personalizadas habilitadas a través de plugins (puede ser reemplazado por [`defineOptions`](/api/sfc-script-setup#defineoptions) en 3.3+).
- Declarar exportaciones con nombre.
- Ejecutar efectos secundarios o crear objetos que solo deben ejecutarse una vez.

```vue
<script>
// normal <script>, executed in module scope (only once)
runSideEffectOnce()

// declare additional options
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executed in setup() scope (for each instance)
</script>
```

El soporte para combinar `<script setup>` y `<script>` en el mismo componente está limitado a los escenarios descritos anteriormente. Específicamente:

- **NO** uses una sección `<script>` separada para opciones que ya pueden definirse usando `<script setup>`, como `props` y `emits`.
- Las variables creadas dentro de `<script setup>` no se añaden como propiedades a la instancia del componente, haciéndolas inaccesibles desde la Options API. Se desaconseja encarecidamente mezclar APIs de esta manera.

Si te encuentras en uno de los escenarios que no son compatibles, deberías considerar cambiar a una función `setup()` explícita, en lugar de usar `<script setup>`.

## await de nivel superior {#top-level-await}

Se puede usar `await` de nivel superior dentro de `<script setup>`. El código resultante se compilará como `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

Además, la expresión esperada se compilará automáticamente en un formato que preserva el contexto de la instancia del componente actual después del `await`.

:::warning Nota
`async setup()` debe usarse en combinación con [`Suspense`](/guide/built-ins/suspense.html), que actualmente sigue siendo una característica experimental. Planeamos finalizarla y documentarla en una versión futura, pero si tienes curiosidad ahora, puedes consultar sus [tests](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts) para ver cómo funciona.
:::

## Declaraciones de Importación {#imports-statements}

Las declaraciones de importación en Vue siguen la [especificación de módulos de ECMAScript](https://nodejs.org/api/esm.html).
Además, puedes usar los alias definidos en la configuración de tu herramienta de compilación:

```vue
<script setup>
import { ref } from 'vue'
import { componentA } from './Components'
import { componentB } from '@/Components'
import { componentC } from '~/Components'
</script>
```

## Genéricos <sup class="vt-badge ts" /> {#generics}

Los parámetros de tipo genéricos se pueden declarar usando el atributo `generic` en la etiqueta `<script>`:

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```

El valor de `generic` funciona exactamente igual que la lista de parámetros entre `<...>` en TypeScript. Por ejemplo, puedes usar múltiples parámetros, restricciones `extends`, tipos por defecto y tipos importados:

```vue
<script
  setup
  lang="ts"
  generic="T extends string | number, U extends Item"
>
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

Puedes usar la directiva `@vue-generic` para pasar tipos explícitos, para cuando el tipo no se puede inferir:

```vue
<template>
  <!-- @vue-generic {import('@/api').Actor} -->
  <ApiSelect v-model="peopleIds" endpoint="/api/actors" id-prop="actorId" />

  <!-- @vue-generic {import('@/api').Genre} -->
  <ApiSelect v-model="genreIds" endpoint="/api/genres" id-prop="genreId" />
</template>
```

Para usar una referencia a un componente genérico en un `ref`, necesitas usar la librería [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) ya que `InstanceType` no funcionará.

```vue
<script
  setup
  lang="ts"
>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

import type { ComponentExposed } from 'vue-component-type-helpers';

// Works for a component without generics
ref<InstanceType<typeof componentWithoutGenerics>>();

ref<ComponentExposed<typeof genericComponent>>();
```

## Restricciones {#restrictions}

- Debido a la diferencia en la semántica de ejecución de módulos, el código dentro de `<script setup>` depende del contexto de un SFC. Cuando se mueve a archivos `.js` o `.ts` externos, puede generar confusión tanto para desarrolladores como para herramientas. Por lo tanto, **`<script setup>`** no se puede usar con el atributo `src`.
- `<script setup>` no admite la plantilla de componente raíz en el DOM. ([Discusión Relacionada](https://github.com/vuejs/core/issues/8391))