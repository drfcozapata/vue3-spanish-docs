# Directivas Personalizadas {#custom-directives}

<script setup>
const vHighlight = {
  mounted: el => {
    el.classList.add('is-highlight')
  }
}
</script>

<style>
.vt-doc p.is-highlight {
  margin-bottom: 0;
}

.is-highlight {
  background-color: yellow;
  color: black;
}
</style>

## Introducción {#introduction}

Además del conjunto predeterminado de directivas que vienen en el core (como `v-model` o `v-show`), Vue también te permite registrar tus propias directivas personalizadas.

Hemos introducido dos formas de reutilización de código en Vue: [componentes](/guide/essentials/component-basics) y [composables](./composables). Los componentes son los bloques de construcción principales, mientras que los composables se centran en la reutilización de lógica con estado. Las directivas personalizadas, por otro lado, están principalmente destinadas a reutilizar lógica que involucra acceso de bajo nivel al DOM en elementos simples.

Una directiva personalizada se define como un objeto que contiene hooks de ciclo de vida similares a los de un componente. Los hooks reciben el elemento al que está vinculada la directiva. Aquí hay un ejemplo de una directiva que añade una `class` a un elemento cuando Vue lo inserta en el DOM:

<div class="composition-api">

```vue
<script setup>
// enables v-highlight in templates
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

</div>

<div class="options-api">

```js
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // enables v-highlight in template
    highlight
  }
}
```

```vue-html
<p v-highlight>This sentence is important!</p>
```

</div>

<div class="demo">
  <p v-highlight>¡Esta frase es importante!</p>
</div>

<div class="composition-api">

En `<script setup>`, cualquier variable `camelCase` que comience con el prefijo `v` puede usarse como una directiva personalizada. En el ejemplo anterior, `vHighlight` puede usarse en la plantilla como `v-highlight`.

Si no estás usando `<script setup>`, las directivas personalizadas pueden registrarse usando la opción `directives`:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // enables v-highlight in template
    highlight: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

Similar a los componentes, las directivas personalizadas deben registrarse para que puedan usarse en las plantillas. En el ejemplo anterior, estamos usando el registro local a través de la opción `directives`.

</div>

También es común registrar globalmente directivas personalizadas a nivel de la aplicación:

```js
const app = createApp({})

// make v-highlight usable in all components
app.directive('highlight', {
  /* ... */
})
```

Es posible tipar directivas personalizadas globales extendiendo la interfaz `ComponentCustomProperties` de `vue`

Más detalles: [Tipado de Directivas Globales Personalizadas](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />

## Cuándo usar directivas personalizadas {#when-to-use}

Las directivas personalizadas solo deben usarse cuando la funcionalidad deseada solo se puede lograr mediante manipulación directa del DOM.

Un ejemplo común de esto es una directiva personalizada `v-focus` que pone un elemento en foco.

<div class="composition-api">

```vue
<script setup>
// enables v-focus in templates
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // enables v-focus in template
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

Esta directiva es más útil que el atributo `autofocus` porque funciona no solo al cargar la página, ¡también funciona cuando el elemento es insertado dinámicamente por Vue!

La creación de plantillas declarativas con directivas incorporadas como `v-bind` se recomienda cuando sea posible porque son más eficientes y compatibles con el renderizado en el servidor.

## Ganchos de Directiva {#directive-hooks}

Un objeto de definición de directiva puede proporcionar varias funciones de hook (todas opcionales):

```js
const myDirective = {
  // called before bound element's attributes
  // or event listeners are applied
  created(el, binding, vnode) {
    // see below for details on arguments
  },
  // called right before the element is inserted into the DOM.
  beforeMount(el, binding, vnode) {},
  // called when the bound element's parent component
  // and all its children are mounted.
  mounted(el, binding, vnode) {},
  // called before the parent component is updated
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // called after the parent component and
  // all of its children have updated
  updated(el, binding, vnode, prevVnode) {},
  // called before the parent component is unmounted
  beforeUnmount(el, binding, vnode) {},
  // called when the parent component is unmounted
  unmounted(el, binding, vnode) {}
}
```

### Argumentos de los Ganchos {#hook-arguments}

Los hooks de directiva reciben estos argumentos:

- `el`: el elemento al que está vinculada la directiva. Esto se puede usar para manipular directamente el DOM.

- `binding`: un objeto que contiene las siguientes propiedades.

  - `value`: El valor pasado a la directiva. Por ejemplo, en `v-my-directive="1 + 1"`, el `value` sería `2`.
  - `oldValue`: El valor anterior, solo disponible en `beforeUpdate` y `updated`. Está disponible independientemente de si el valor ha cambiado o no.
  - `arg`: El argumento pasado a la directiva, si existe. Por ejemplo, en `v-my-directive:foo`, el `arg` sería `"foo"`.
  - `modifiers`: Un objeto que contiene modificadores, si existen. Por ejemplo, en `v-my-directive.foo.bar`, el objeto `modifiers` sería `{ foo: true, bar: true }`.
  - `instance`: La instancia del componente donde se usa la directiva.
  - `dir`: el objeto de definición de la directiva.

- `vnode`: el VNode subyacente que representa el elemento vinculado.
- `prevVnode`: el VNode que representa el elemento vinculado del renderizado anterior. Solo disponible en los hooks `beforeUpdate` y `updated`.

Como ejemplo, considera el siguiente uso de directiva:

```vue-html
<div v-example:foo.bar="baz">
```

El argumento `binding` sería un objeto con la forma de:

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* value of `baz` */,
  oldValue: /* value of `baz` from previous update */
}
```

Similar a las directivas incorporadas, los argumentos de las directivas personalizadas pueden ser dinámicos. Por ejemplo:

```vue-html
<div v-example:[arg]="value"></div>
```

Aquí el argumento de la directiva se actualizará reactivamente basándose en la propiedad `arg` en el estado de nuestro componente.

:::tip Nota
Aparte de `el`, debes tratar estos argumentos como de solo lectura y nunca modificarlos. Si necesitas compartir información entre hooks, se recomienda hacerlo a través del [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) del elemento.
:::

## Atajo de Función {#function-shorthand}

Es común que una directiva personalizada tenga el mismo comportamiento para `mounted` y `updated`, sin necesidad de los otros hooks. En tales casos podemos definir la directiva como una función:

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // this will be called for both `mounted` and `updated`
  el.style.color = binding.value
})
```

## Literales de Objeto {#object-literals}

Si tu directiva necesita múltiples valores, también puedes pasar un literal de objeto JavaScript. Recuerda, las directivas pueden tomar cualquier expresión JavaScript válida.

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## Uso en Componentes {#usage-on-components}

:::warning No recomendado
No se recomienda usar directivas personalizadas en componentes. Puede ocurrir un comportamiento inesperado cuando un componente tiene múltiples nodos raíz.
:::

Cuando se usan en componentes, las directivas personalizadas siempre se aplicarán al nodo raíz de un componente, de forma similar a los [Atributos de Traspaso](/guide/components/attrs).

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- template of MyComponent -->

<div> <!-- v-demo directive will be applied here -->
  <span>My component content</span>
</div>
```

Ten en cuenta que los componentes pueden tener potencialmente más de un nodo raíz. Cuando se aplica a un componente multi-raíz, una directiva será ignorada y se emitirá una advertencia. A diferencia de los atributos, las directivas no pueden pasarse a un elemento diferente con `v-bind="$attrs"`.
