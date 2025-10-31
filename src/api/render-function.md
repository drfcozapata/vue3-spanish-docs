# APIs de Función de Renderizado {#render-function-apis}

## h() {#h}

Crea nodos de DOM virtual (vnodes).

- **Tipo**

  ```ts
  // full signature
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // omitting props
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Los tipos se simplifican para facilitar la lectura.

- **Detalles**

  El primer argumento puede ser una cadena (para elementos nativos) o la definición de un componente Vue. El segundo argumento son las `props` a pasar, y el tercer argumento son los `children`.

  Al crear un `vnode` de componente, los `children` deben pasarse como funciones de slot. Se puede pasar una única función de slot si el componente espera solo el slot predeterminado. De lo contrario, los slots deben pasarse como un objeto de funciones de slot.

  Para mayor comodidad, el argumento `props` puede omitirse cuando los `children` no son un objeto de slots.

- **Ejemplo**

  Creando elementos nativos:

  ```js
  import { h } from 'vue'

  // all arguments except the type are optional
  h('div')
  h('div', { id: 'foo' })

  // both attributes and properties can be used in props
  // Vue automatically picks the right way to assign it
  h('div', { class: 'bar', innerHTML: 'hello' })

  // class and style have the same object / array
  // value support like in templates
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

  Creando componentes:

  ```js
  import Foo from './Foo.vue'

  // passing props
  h(Foo, {
    // equivalent of some-prop="hello"
    someProp: 'hello',
    // equivalent of @update="() => {}"
    onUpdate: () => {}
  })

  // passing single default slot
  h(Foo, () => 'default slot')

  // passing named slots
  // notice the `null` is required to avoid
  // slots object being treated as props
  h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **Ver también** [Guía - Funciones de Renderizado - Creando VNodes](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

Fusiona múltiples objetos `props` con un manejo especial para ciertas `props`.

- **Tipo**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Detalles**

  `mergeProps()` admite la fusión de múltiples objetos `props` con un manejo especial para las siguientes `props`:

  - `class`
  - `style`
  - Escuchadores de eventos `onXxx` - múltiples escuchadores con el mismo nombre se fusionarán en un array.

  Si no necesitas el comportamiento de fusión y deseas simples sobrescrituras, se puede usar en su lugar la propagación de objetos nativos.

- **Ejemplo**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Clona un `vnode`.

- **Tipo**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Detalles**

  Devuelve un `vnode` clonado, opcionalmente con `props` adicionales para fusionar con el original.

  Los `vnodes` deben considerarse inmutables una vez creados, y no debes mutar las `props` de un `vnode` existente. En su lugar, clónalo con `props` diferentes / adicionales.

  Los `vnodes` tienen propiedades internas especiales, por lo que clonarlos no es tan simple como una propagación de objetos. `cloneVNode()` maneja la mayor parte de la lógica interna.

- **Ejemplo**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Comprueba si un valor es un `vnode`.

- **Tipo**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Para resolver manualmente un componente registrado por su nombre.

- **Tipo**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Detalles**

  **Nota: no necesitas esto si puedes importar el componente directamente.**

  `resolveComponent()` debe llamarse dentro<span class="composition-api"> de `setup()` o</span> de la función de renderizado para resolver desde el contexto de componente correcto.

  Si no se encuentra el componente, se emitirá una advertencia en tiempo de ejecución y se devolverá la cadena del nombre.

- **Ejemplo**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **Ver también** [Guía - Funciones de Renderizado - Componentes](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

Para resolver manualmente una directiva registrada por su nombre.

- **Tipo**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Detalles**

  **Nota: no necesitas esto si puedes importar la directiva directamente.**

  `resolveDirective()` debe llamarse dentro<span class="composition-api"> de `setup()` o</span> de la función de renderizado para resolver desde el contexto de componente correcto.

  Si no se encuentra la directiva, se emitirá una advertencia en tiempo de ejecución y la función devolverá `undefined`.

- **Ver también** [Guía - Funciones de Renderizado - Directivas Personalizadas](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

Para añadir directivas personalizadas a `vnodes`.

- **Tipo**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Directive, value, argument, modifiers]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Detalles**

  Envuelve un `vnode` existente con directivas personalizadas. El segundo argumento es un array de directivas personalizadas. Cada directiva personalizada también se representa como un array en la forma de `[Directive, value, argument, modifiers]`. Los elementos finales del array pueden omitirse si no son necesarios.

- **Ejemplo**

  ```js
  import { h, withDirectives } from 'vue'

  // a custom directive
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **Ver también** [Guía - Funciones de Renderizado - Directivas Personalizadas](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

Para añadir modificadores [`v-on`](/guide/essentials/event-handling#event-modifiers) incorporados a una función manejadora de eventos.

- **Tipo**

  ```ts
  function withModifiers(fn: Function, modifiers: ModifierGuardsKeys[]): Function
  ```

- **Ejemplo**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // equivalent of v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Ver también** [Guía - Funciones de Renderizado - Modificadores de Eventos](/guide/extras/render-function#event-modifiers)