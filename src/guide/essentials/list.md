# Renderizado de Listas {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Lección Gratuita de Renderizado de Listas de Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Lección Gratuita de Renderizado de Listas de Vue.js"/>
</div>

## `v-for` {#v-for}

Podemos usar la directiva `v-for` para renderizar una lista de elementos basándose en un array. La directiva `v-for` requiere una sintaxis especial en la forma `item in items`, donde `items` es el array de datos fuente y `item` es un **alias** para el elemento del array que se está iterando:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

Dentro del ámbito de `v-for`, las expresiones de plantilla tienen acceso a todas las propiedades del ámbito padre. Además, `v-for` también soporta un segundo alias opcional para el índice del elemento actual:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJUAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

El ámbito de las variables de `v-for` es similar al siguiente JavaScript:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // has access to outer scope `parentMessage`
  // but `item` and `index` are only available in here
  console.log(parentMessage, item.message, index)
})
```

Observa cómo el valor de `v-for` coincide con la firma de la función del callback `forEach`. De hecho, puedes usar la desestructuración en el alias de elemento de `v-for` de forma similar a la desestructuración de argumentos de función:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- with index alias -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Para `v-for` anidados, el ámbito también funciona de forma similar a las funciones anidadas. Cada ámbito de `v-for` tiene acceso a los ámbitos padre:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

También puedes usar `of` como delimitador en lugar de `in`, para que se acerque más a la sintaxis de JavaScript para iteradores:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` con un Objeto {#v-for-with-an-object}

También puedes usar `v-for` para iterar a través de las propiedades de un objeto. El orden de iteración se basará en el resultado de llamar a `Object.values()` sobre el objeto:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

También puedes proporcionar un segundo alias para el nombre de la propiedad (también conocido como key):

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

Y otro para el índice:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33937Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxU provisional+E+o provisional/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` con un Rango {#v-for-with-a-range}

`v-for` también puede tomar un entero. En este caso, repetirá la plantilla esa cantidad de veces, basándose en un rango de `1...n`.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Ten en cuenta que aquí `n` comienza con un valor inicial de `1` en lugar de `0`.

## `v-for` en `<template>` {#v-for-on-template}

Similar a la plantilla `v-if`, también puedes usar una etiqueta `<template>` con `v-for` para renderizar un bloque de múltiples elementos. Por ejemplo:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` con `v-if` {#v-for-with-v-if}

Cuando existen en el mismo nodo, `v-if` tiene una prioridad más alta que `v-for`. Esto significa que la condición `v-if` no tendrá acceso a las variables del ámbito de `v-for`:

```vue-html
<!--
This will throw an error because property "todo"
is not defined on instance.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Esto se puede solucionar moviendo `v-for` a una etiqueta `<template>` de envoltura (lo cual también es más explícito):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

:::warning Nota
**No** se recomienda usar `v-if` y `v-for` en el mismo elemento debido a la precedencia implícita.

Hay dos casos comunes en los que esto puede ser tentador:

- Para filtrar elementos en una lista (por ejemplo, `v-for="user in users" v-if="user.isActive"`). En estos casos, reemplaza `users` con una nueva propiedad `computed` que devuelva tu lista filtrada (por ejemplo, `activeUsers`).

- Para evitar renderizar una lista si debe estar oculta (por ejemplo, `v-for="user in users" v-if="shouldShowUsers"`). En estos casos, mueve el `v-if` a un elemento contenedor (por ejemplo, `ul`, `ol`).
:::

## Mantener el Estado con `key` {#maintaining-state-with-key}

Cuando Vue está actualizando una lista de elementos renderizados con `v-for`, por defecto utiliza una estrategia de "parcheo in situ". Si el orden de los elementos de datos ha cambiado, en lugar de mover los elementos del DOM para que coincidan con el orden de los elementos, Vue parcheará cada elemento in situ y se asegurará de que refleje lo que debería renderizarse en ese índice particular.

Este modo predeterminado es eficiente, pero **solo es adecuado cuando la salida del renderizado de tu lista no depende del estado del componente hijo o del estado temporal del DOM (por ejemplo, valores de entrada de formularios)**.

Para darle una pista a Vue y que pueda rastrear la identidad de cada nodo, y así reutilizar y reordenar los elementos existentes, debes proporcionar un atributo `key` único para cada elemento:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

Cuando se usa `<template v-for>`, la `key` debe colocarse en el contenedor `<template>`:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Nota
Aquí `key` es un atributo especial que se vincula con `v-bind`. No debe confundirse con la variable `key` de propiedad al [usar `v-for` con un objeto](#v-for-with-an-object).
:::

Se recomienda proporcionar un atributo `key` con `v-for` siempre que sea posible, a menos que el contenido del DOM iterado sea simple (es decir, no contenga componentes o elementos del DOM con estado), o si dependes intencionalmente del comportamiento predeterminado para obtener mejoras de rendimiento.

La vinculación de `key` espera valores primitivos, es decir, cadenas y números. No uses objetos como `v-for` keys. Para un uso detallado del atributo `key`, consulta la [documentación de la API de `key`](/api/built-in-special-attributes#key).

## `v-for` con un Componente {#v-for-with-a-component}

> Esta sección asume conocimientos de [Componentes](/guide/essentials/component-basics). No dudes en omitirla y volver más tarde.

Puedes usar directamente `v-for` en un componente, como cualquier elemento normal (no olvides proporcionar una `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Sin embargo, esto no pasará automáticamente ningún dato al componente, porque los componentes tienen ámbitos aislados propios. Para pasar los datos iterados al componente, también deberíamos usar `props`:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

La razón para no inyectar automáticamente `item` en el componente es porque eso hace que el componente esté fuertemente acoplado a cómo funciona `v-for`. Ser explícito sobre el origen de sus datos hace que el componente sea reutilizable en otras situaciones.

<div class="composition-api">

Mira [este ejemplo de una lista de tareas simple](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=) para ver cómo renderizar una lista de componentes usando `v-for`, pasando diferentes datos a cada instancia.

</div>
<div class="options-api">

Mira [este ejemplo de una lista de tareas simple](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=) para ver cómo renderizar una lista de componentes usando `v-for`, pasando diferentes datos a cada instancia.

</div>

## Detección de Cambios en Arrays {#array-change-detection}

### Métodos de Mutación {#mutation-methods}

Vue es capaz de detectar cuándo se llaman los métodos de mutación de un array `reactive` y disparar las actualizaciones necesarias. Estos métodos de mutación son:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Reemplazando un Array {#replacing-an-array}

Los métodos de mutación, como su nombre indica, mutan el array original sobre el que se llaman. En comparación, también existen métodos no mutables, por ejemplo, `filter()`, `concat()` y `slice()`, que no mutan el array original pero **siempre devuelven un nuevo array**. Al trabajar con métodos no mutables, debemos reemplazar el array antiguo con el nuevo:

<div class="composition-api">

```js
// `items` is a ref with array value
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Podrías pensar que esto hará que Vue descarte el DOM existente y vuelva a renderizar toda la lista - afortunadamente, no es así. Vue implementa algunas heurísticas inteligentes para maximizar la reutilización de elementos del DOM, por lo que reemplazar un array con otro array que contenga objetos superpuestos es una operación muy eficiente.

## Mostrar Resultados Filtrados/Ordenados {#displaying-filtered-sorted-results}

A veces queremos mostrar una versión filtrada o ordenada de un array sin mutar o restablecer los datos originales. En este caso, puedes crear una propiedad `computed` que devuelva el array filtrado o ordenado.

Por ejemplo:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

En situaciones donde las propiedades `computed` no son factibles (por ejemplo, dentro de bucles `v-for` anidados), puedes usar un método:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

¡Ten cuidado con `reverse()` y `sort()` en una propiedad `computed`! Estos dos métodos mutarán el array original, lo cual debe evitarse en los `computed` getters. Crea una copia del array original antes de llamar a estos métodos:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```