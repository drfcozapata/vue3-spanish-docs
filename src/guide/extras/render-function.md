---
outline: deep
---

# Funciones de Renderizado & JSX {#render-functions-jsx}

Vue recomienda usar plantillas para construir aplicaciones en la gran mayoría de los casos. Sin embargo, hay situaciones en las que necesitamos todo el poder programático de JavaScript. Ahí es donde podemos usar la **función de renderizado**.

> Si eres nuevo en el concepto de DOM virtual y funciones de renderizado, asegúrate de leer primero el capítulo [Mecanismo de Renderizado](/guide/extras/rendering-mechanism).

## Uso Básico {#basic-usage}

### Creando Vnodes {#creating-vnodes}

Vue proporciona una función `h()` para crear vnodes:

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

`h()` es la abreviatura de **hyperscript**, que significa "JavaScript que produce HTML (hypertext markup language)". Este nombre se hereda de las convenciones compartidas por muchas implementaciones de DOM virtual. Un nombre más descriptivo podría ser `createVNode()`, pero un nombre más corto ayuda cuando tienes que llamar a esta función muchas veces en una función de renderizado.

La función `h()` está diseñada para ser muy flexible:

```js
// all arguments except the type are optional
h('div')
h('div', { id: 'foo' })

// both attributes and properties can be used in props
// Vue automatically picks the right way to assign it
h('div', { class: 'bar', innerHTML: 'hello' })

// props modifiers such as `.prop` and `.attr` can be added
// with `.` and `^` prefixes respectively
h('div', { '.name': 'some-name', '^width': '100' })

// class and style have the same object / array
// value support that they have in templates
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// event listeners should be passed as onXxx
h('div', { onClick: () => {} })

// children can be a string
h('div', { id: 'foo' }, 'hello')

// props can be omitted when there are no props
h('div', 'hello')
h('div', [h('span', 'hello')])

// children array can contain mixed vnodes and strings
h('div', ['hello', h('span', 'hello')])
```

El vnode resultante tiene la siguiente forma:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Nota
La interfaz `VNode` completa contiene muchas otras propiedades internas, pero se recomienda encarecidamente evitar depender de cualquier propiedad que no sea las aquí enumeradas. Esto evita roturas no intencionadas en caso de que las propiedades internas cambien.
:::

### Declarando Funciones de Renderizado {#declaring-render-functions}

<div class="composition-api">

Cuando se utilizan plantillas con la Composition API, el valor de retorno del hook `setup()` se usa para exponer datos a la plantilla. Sin embargo, cuando se usan funciones de renderizado, podemos retornar directamente la función de renderizado en su lugar:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // return the render function
    return () => h('div', props.msg + count.value)
  }
}
```

La función de renderizado se declara dentro de `setup()` para que tenga acceso natural a las props y a cualquier estado reactivo declarado en el mismo ámbito.

Además de retornar un solo vnode, también puedes retornar strings o arrays:

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // use an array to return multiple root nodes
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
¡Asegúrate de retornar una función en lugar de retornar directamente los valores! La función `setup()` se llama solo una vez por componente, mientras que la función de renderizado retornada se llamará varias veces.
:::

</div>
<div class="options-api">

Podemos declarar funciones de renderizado usando la opción `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

La función `render()` tiene acceso a la instancia del componente a través de `this`.

Además de retornar un solo vnode, también puedes retornar strings o arrays:

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // use an array to return multiple root nodes
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Si un componente con función de renderizado no necesita ningún estado de instancia, también se pueden declarar directamente como una función para mayor brevedad:

```js
function Hello() {
  return 'hello world!'
}
```

Así es, ¡este es un componente Vue válido! Consulta [Componentes Funcionales](#functional-components) para más detalles sobre esta sintaxis.

### Los Vnodes Deben Ser Únicos {#vnodes-must-be-unique}

Todos los vnodes en el árbol de componentes deben ser únicos. Eso significa que la siguiente función de renderizado es inválida:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Yikes - duplicate vnodes!
    p,
    p
  ])
}
```

Si realmente quieres duplicar el mismo elemento/componente muchas veces, puedes hacerlo con una función fábrica. Por ejemplo, la siguiente función de renderizado es una forma perfectamente válida de renderizar 20 párrafos idénticos:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) es una extensión de JavaScript similar a XML que nos permite escribir código como este:

```jsx
const vnode = <div>hello</div>
```

Dentro de las expresiones JSX, usa llaves para incrustar valores dinámicos:

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` y Vue CLI tienen opciones para configurar proyectos con soporte JSX preconfigurado. Si estás configurando JSX manualmente, consulta la documentación de [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) para obtener más detalles.

Aunque fue introducido por primera vez por React, JSX en realidad no tiene una semántica de tiempo de ejecución definida y se puede compilar en varias salidas diferentes. Si has trabajado con JSX antes, ten en cuenta que **la transformación JSX de Vue es diferente de la transformación JSX de React**, por lo que no puedes usar la transformación JSX de React en aplicaciones Vue. Algunas diferencias notables con React JSX incluyen:

- Puedes usar atributos HTML como `class` y `for` como props, no es necesario usar `className` o `htmlFor`.
- Pasar children a los componentes (es decir, slots) [funciona de manera diferente](#passing-slots).

La definición de tipos de Vue también proporciona inferencia de tipos para el uso de TSX. Cuando uses TSX, asegúrate de especificar `"jsx": "preserve"` en `tsconfig.json` para que TypeScript deje la sintaxis JSX intacta para que la procese la transformación JSX de Vue.

### Inferencia de Tipo JSX {#jsx-type-inference}

Similar a la transformación, el JSX de Vue también necesita diferentes definiciones de tipo.

A partir de Vue 3.4, Vue ya no registra implícitamente el espacio de nombres global `JSX`. Para indicar a TypeScript que use las definiciones de tipo JSX de Vue, asegúrate de incluir lo siguiente en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

También puedes optar por archivo agregando un comentario `/* @jsxImportSource vue */` en la parte superior del archivo.

Si hay código que depende de la presencia del espacio de nombres global `JSX`, puedes mantener el comportamiento global exacto anterior a 3.4 importando o referenciando explícitamente `vue/jsx` en tu proyecto, lo que registra el espacio de nombres global `JSX`.

## Recetas de Funciones de Renderizado {#render-function-recipes}

A continuación, proporcionaremos algunas recetas comunes para implementar características de plantillas como sus equivalentes en funciones de renderizado / JSX.

### `v-if` {#v-if}

Plantilla:

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

Función de renderizado / JSX equivalente:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

Plantilla:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Función de renderizado / JSX equivalente:

<div class="composition-api">

```js
h(
  'ul',
  // assuming `items` is a ref with array value
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Las props con nombres que comienzan con `on` seguidas de una letra mayúscula se tratan como listeners de eventos. Por ejemplo, `onClick` es el equivalente de `@click` en las plantillas.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Click Me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Click Me
</button>
```

#### Modificadores de Eventos {#event-modifiers}

Para los modificadores de eventos `.passive`, `.capture` y `.once`, se pueden concatenar después del nombre del evento usando camelCase.

Por ejemplo:

```js
h('input', {
  onClickCapture() {
    /* listener in capture mode */
  },
  onKeyupOnce() {
    /* triggers only once */
  },
  onMouseoverOnceCapture() {
    /* once + capture */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Para otros modificadores de eventos y teclas, se puede usar el helper [`withModifiers`](/api/render-function#withmodifiers):

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Componentes {#components}

Para crear un vnode para un componente, el primer argumento pasado a `h()` debe ser la definición del componente. Esto significa que cuando se usan funciones de renderizado, no es necesario registrar componentes, puedes usar los componentes importados directamente:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Como podemos ver, `h` puede funcionar con componentes importados de cualquier formato de archivo siempre que sea un componente Vue válido.

Los componentes dinámicos son sencillos con funciones de renderizado:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Si un componente está registrado por nombre y no se puede importar directamente (por ejemplo, registrado globalmente por una librería), se puede resolver programáticamente utilizando el helper [`resolveComponent()`](/api/render-function#resolvecomponent).

### Renderizando Slots {#rendering-slots}

<div class="composition-api">

En las funciones de renderizado, los slots se pueden acceder desde el contexto de `setup()`. Cada slot en el objeto `slots` es una **función que retorna un array de vnodes**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // default slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // named slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX equivalente:

```jsx
// default
<div>{slots.default()}</div>

// named
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

En las funciones de renderizado, los slots se pueden acceder desde [`this.$slots`](/api/component-instance#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX equivalente:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Pasando Slots {#passing-slots}

Pasar children a los componentes funciona un poco diferente a pasar children a los elementos. En lugar de un array, necesitamos pasar una función de slot o un objeto de funciones de slot. Las funciones de slot pueden retornar cualquier cosa que una función de renderizado normal pueda retornar, lo que siempre se normalizará a arrays de vnodes cuando se acceda a ellos en el componente hijo.

```js
// single default slot
h(MyComponent, () => 'hello')

// named slots
// notice the `null` is required to avoid
// the slots object being treated as props
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'one'), h('span', 'two')]
})
```

JSX equivalente:

```jsx
// default
<MyComponent>{() => 'hello'}</MyComponent>

// named
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

Pasar slots como funciones permite que el componente hijo los invoque de forma perezosa. Esto hace que las dependencias del slot sean rastreadas por el hijo en lugar del padre, lo que resulta en actualizaciones más precisas y eficientes.

### Scoped Slots {#scoped-slots}

Para renderizar un scoped slot en el componente padre, se pasa un slot al hijo. Observa cómo el slot ahora tiene un parámetro `text`. El slot se llamará en el componente hijo y los datos del componente hijo se pasarán al componente padre.

```js
// parent component
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Recuerda pasar `null` para que los slots no sean tratados como props.

```js
// child component
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX equivalente:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### Componentes Integrados {#built-in-components}

Los [componentes integrados](/api/built-in-components) como `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` y `<Suspense>` deben importarse para usarse en funciones de renderizado:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

La directiva `v-model` se expande a las props `modelValue` y `onUpdate:modelValue` durante la compilación de la plantilla; tendremos que proporcionar estas props nosotros mismos:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Directivas Personalizadas {#custom-directives}

Las directivas personalizadas se pueden aplicar a un vnode usando [`withDirectives`](/api/render-function#withdirectives):

```js
import { h, withDirectives } from 'vue'

// a custom directive
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Si la directiva está registrada por nombre y no se puede importar directamente, se puede resolver usando el helper [`resolveDirective`](/api/render-function#resolvedirective).

### Template Refs {#template-refs}

<div class="composition-api">

Con la Composition API, cuando se usa [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" /> los template refs se crean pasando el valor de cadena como prop al vnode:

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="my-div">
    return () => h('div', { ref: 'my-div' })
  }
}
```

<details>
<summary>Uso antes de 3.5</summary>

En versiones anteriores a la 3.5, donde `useTemplateRef()` no había sido introducido, los template refs se creaban pasando el propio `ref()` como prop al vnode:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```
</details>
</div>
<div class="options-api">

Con la Options API, los template refs se crean pasando el nombre del ref como una cadena en las props del vnode:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Componentes Funcionales {#functional-components}

Los componentes funcionales son una forma alternativa de componente que no tienen estado propio. Actúan como funciones puras: reciben props y devuelven vnodes. Se renderizan sin crear una instancia de componente (es decir, sin `this`) y sin los hooks del ciclo de vida habituales del componente.

Para crear un componente funcional, usamos una función simple, en lugar de un objeto de opciones. La función es efectivamente la función `render` para el componente.

<div class="composition-api">

La firma de un componente funcional es la misma que la del hook `setup()`:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Como no hay una referencia a `this` para un componente funcional, Vue pasará las `props` como primer argumento:

```js
function MyComponent(props, context) {
  // ...
}
```

El segundo argumento, `context`, contiene tres propiedades: `attrs`, `emit` y `slots`. Estas son equivalentes a las propiedades de instancia [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit) y [`$slots`](/api/component-instance#slots) respectivamente.

</div>

La mayoría de las opciones de configuración habituales para los componentes no están disponibles para los componentes funcionales. Sin embargo, es posible definir [`props`](/api/options-state#props) y [`emits`](/api/options-state#emits) agregándolas como propiedades:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Si la opción `props` no se especifica, entonces el objeto `props` pasado a la función contendrá todos los atributos, igual que `attrs`. Los nombres de las props no se normalizarán a camelCase a menos que se especifique la opción `props`.

Para los componentes funcionales con `props` explícitas, el [passthrough de atributos](/guide/components/attrs) funciona de manera muy similar a los componentes normales. Sin embargo, para los componentes funcionales que no especifican explícitamente sus `props`, solo los listeners de eventos `class`, `style` y `onXxx` se heredarán de los `attrs` por defecto. En cualquier caso, `inheritAttrs` puede establecerse en `false` para deshabilitar la herencia de atributos:

```js
MyComponent.inheritAttrs = false
```

Los componentes funcionales se pueden registrar y consumir como componentes normales. Si pasas una función como primer argumento a `h()`, se tratará como un componente funcional.

### Tipado de Componentes Funcionales<sup class="vt-badge ts" /> {#typing-functional-components}

Los componentes funcionales se pueden tipar según sean nombrados o anónimos. [Vue - Extensión oficial](https://github.com/vuejs/language-tools) también soporta la verificación de tipos de componentes funcionales correctamente tipados cuando se consumen en plantillas SFC.

**Componente Funcional Nombrado**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Componente Funcional Anónimo**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```