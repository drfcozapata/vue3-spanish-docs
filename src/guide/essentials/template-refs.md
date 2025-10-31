# Referencias de Plantilla {#template-refs}

Aunque el modelo de renderizado declarativo de Vue abstrae la mayoría de las operaciones directas del DOM por ti, todavía puede haber casos en los que necesitemos acceso directo a los elementos del DOM subyacentes. Para lograr esto, podemos usar el atributo especial `ref`:

```vue-html
<input ref="input">
```

`ref` es un atributo especial, similar al atributo `key` discutido en el capítulo de `v-for`. Nos permite obtener una referencia directa a un elemento DOM específico o a una instancia de componente hijo después de que se monta. Esto puede ser útil cuando quieres, por ejemplo, enfocar programáticamente un `input` al montar un componente, o inicializar una librería de terceros en un elemento.

## Accediendo a las Referencias {#accessing-the-refs}

<div class="composition-api">

Para obtener la referencia con la Composition API, podemos usar el helper [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// the first argument must match the ref value in the template
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

Cuando se utiliza TypeScript, el soporte IDE de Vue y `vue-tsc` inferirán automáticamente el tipo de `input.value` basándose en el elemento o componente en el que se utiliza el atributo `ref` coincidente.

<details>
<summary>Uso antes de 3.5</summary>

En versiones anteriores a la 3.5, donde `useTemplateRef()` no había sido introducido, necesitamos declarar una `ref` con un nombre que coincida con el valor del atributo `ref` de la plantilla:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// declare a ref to hold the element reference
// the name must match template ref value
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Si no estás usando `<script setup>`, asegúrate de también retornar la `ref` desde `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

La `ref` resultante se expone en `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Ten en cuenta que solo puedes acceder a la `ref` **después de que el componente esté montado.** Si intentas acceder a <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span> en una expresión de plantilla, será <span class="options-api">`undefined`</span><span class="composition-api">`null`</span> en el primer renderizado. ¡Esto se debe a que el elemento no existe hasta después del primer renderizado!

<div class="composition-api">

Si estás intentando observar los cambios de una `ref` de plantilla, asegúrate de considerar el caso en que la `ref` tenga un valor `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
})
```

Ver también: [Tipado de Referencias de Plantilla](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## `ref` en Componente {#ref-on-component}

> Esta sección asume conocimientos de [Componentes](/guide/essentials/component-basics). Siéntete libre de saltarla y volver más tarde.

`ref` también puede ser usado en un componente hijo. En este caso, la referencia será la de una instancia de componente:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value will hold an instance of <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Uso antes de 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value will hold an instance of <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child will hold an instance of <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Si el componente hijo está usando la Options API o no está usando `<script setup>`, la</span><span class="options-api">La</span> instancia referenciada será idéntica al `this` del componente hijo, lo que significa que el componente padre tendrá acceso completo a cada propiedad y método del componente hijo. Esto facilita la creación de detalles de implementación fuertemente acoplados entre el padre y el hijo, por lo que las `ref` de componentes solo deben usarse cuando sea absolutamente necesario; en la mayoría de los casos, primero deberías intentar implementar las interacciones padre/hijo utilizando las interfaces estándar de `props` y `emit`.

<div class="composition-api">

Una excepción aquí es que los componentes que usan `<script setup>` son **privados por defecto**: un componente padre que referencia un componente hijo usando `<script setup>` no podrá acceder a nada a menos que el componente hijo elija exponer una interfaz pública usando la macro `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Compiler macros, such as defineExpose, don't need to be imported
defineExpose({
  a,
  b
})
</script>
```

Cuando un padre obtiene una instancia de este componente a través de `ref` de plantilla, la instancia recuperada tendrá la forma `{ a: number, b: number }` (las `ref` se desenvuelven automáticamente al igual que en las instancias normales).

Ten en cuenta que `defineExpose` debe llamarse antes de cualquier operación `await`. De lo contrario, las propiedades y métodos expuestos después de la operación `await` no serán accesibles.

Ver también: [Tipado de `ref` de Plantilla de Componentes](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

La opción `expose` puede usarse para limitar el acceso a una instancia hija:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

En el ejemplo anterior, un padre que referencia este componente a través de una `ref` de plantilla solo podrá acceder a `publicData` y `publicMethod`.

</div>

## Referencias dentro de `v-for` {#refs-inside-v-for}

> Requiere v3.5 o superior

<div class="composition-api">

Cuando se usa `ref` dentro de `v-for`, la `ref` correspondiente debería contener un valor `Array`, que se poblará con los elementos después del montaje:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh3s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Uso antes de 3.5</summary>

En versiones anteriores a la 3.5, donde `useTemplateRef()` no había sido introducido, necesitamos declarar una `ref` con un nombre que coincida con el valor del atributo `ref` de la plantilla. La `ref` también debería contener un valor de array:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

Cuando se usa `ref` dentro de `v-for`, el valor `ref` resultante será un array que contiene los elementos correspondientes:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

Cabe señalar que el array de `ref` **no** garantiza el mismo orden que el array fuente.

## `ref` como Función {#function-refs}

En lugar de una clave de cadena, el atributo `ref` también puede vincularse a una función, que se llamará en cada actualización del componente y te da total flexibilidad sobre dónde almacenar la referencia del elemento. La función recibe la referencia del elemento como primer argumento:

```vue-html
<input :ref="(el) => { /* assign el to a property or ref */ }">
```

Ten en cuenta que estamos usando un enlace dinámico `:ref` para poder pasarle una función en lugar de una cadena de nombre de `ref`. Cuando el elemento se desmonta, el argumento será `null`. Por supuesto, puedes usar un método en lugar de una función `inline`.