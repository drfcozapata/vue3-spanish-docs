# Reglas de Prioridad A: Esenciales {#priority-a-rules-essential}

::: warning Nota
Esta Guía de Estilo de Vue.js está desactualizada y necesita ser revisada. Si tienes alguna pregunta o sugerencia, por favor [abre una incidencia](https://github.com/vuejs/docs/issues/new).
:::

Estas reglas ayudan a prevenir errores, así que apréndelas y cúmplelas a toda costa. Pueden existir excepciones, pero deberían ser muy raras y solo ser hechas por aquellos con conocimientos expertos tanto de JavaScript como de Vue.

## Usa nombres de componente de varias palabras {#use-multi-word-component-names}

Los nombres de los componentes de usuario siempre deben ser de varias palabras, excepto para los componentes `App` raíz. Esto [previene conflictos](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) con elementos HTML existentes y futuros, ya que todos los elementos HTML son de una sola palabra.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<!-- in pre-compiled templates -->
<Item />

<!-- in in-DOM templates -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<!-- in pre-compiled templates -->
<TodoItem />

<!-- in in-DOM templates -->
<todo-item></todo-item>
```

</div>

## Usa definiciones de prop detalladas {#use-detailed-prop-definitions}

En el código comprometido, las definiciones de `prop` siempre deben ser lo más detalladas posible, especificando al menos el tipo (o tipos).

::: details Explicación Detallada
Las [definiciones de prop](/guide/components/props#prop-validation) detalladas tienen dos ventajas:

- Documentan la API del componente, de modo que es fácil ver cómo se debe utilizar el componente.
- En desarrollo, Vue te advertirá si a un componente se le proporcionan `props` con formato incorrecto, ayudándote a detectar posibles fuentes de error.
:::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
// This is only OK when prototyping
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```js
props: {
  status: String
}
```

```js
// Even better!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
// This is only OK when prototyping
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// Even better!

const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## Usa `v-for` con `key` {#use-keyed-v-for}

La `key` con `v-for` es _siempre_ requerida en los componentes, para mantener el estado interno del componente en el subárbol. Sin embargo, incluso para los elementos, es una buena práctica mantener un comportamiento predecible, como la [constancia de objetos](https://bost.ocks.org/mike/constancy/) en las animaciones.

::: details Explicación Detallada
Supongamos que tienes una lista de tareas (todos):

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: 'Learn to use v-for'
  },
  {
    id: 2,
    text: 'Learn to use key'
  }
])
```

</div>

Luego las ordenas alfabéticamente. Al actualizar el DOM, Vue optimizará la renderización para realizar las mutaciones del DOM más económicas posibles. Eso podría significar eliminar el primer elemento de la tarea, y luego agregarlo de nuevo al final de la lista.

El problema es que hay casos en los que es importante no eliminar elementos que permanecerán en el DOM. Por ejemplo, es posible que desees usar `<transition-group>` para animar la clasificación de la lista, o mantener el foco si el elemento renderizado es un `<input>`. En estos casos, añadir una `key` única para cada elemento (por ejemplo, `:key="todo.id"`) le dirá a Vue cómo comportarse de manera más predecible.

Según nuestra experiencia, es mejor _siempre_ añadir una `key` única, para que tú y tu equipo simplemente nunca tengan que preocuparse por estos casos extremos. Luego, en los escenarios raros y críticos para el rendimiento donde la constancia de objetos no es necesaria, puedes hacer una excepción consciente.
:::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Evita `v-if` con `v-for` {#avoid-v-if-with-v-for}

**Nunca uses `v-if` en el mismo elemento que `v-for`.**

Hay dos casos comunes en los que esto puede ser tentador:

- Para filtrar ítems en una lista (por ejemplo, `v-for="user in users" v-if="user.isActive"`). En estos casos, reemplaza `users` con una nueva propiedad `computed` que devuelva tu lista filtrada (por ejemplo, `activeUsers`).

- Para evitar renderizar una lista si debe estar oculta (por ejemplo, `v-for="user in users" v-if="shouldShowUsers"`). En estos casos, mueve el `v-if` a un elemento contenedor (por ejemplo, `ul`, `ol`).

::: details Explicación Detallada
Cuando Vue procesa las directivas, `v-if` tiene una prioridad más alta que `v-for`, de modo que esta plantilla:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Lanzará un error, porque la directiva `v-if` se evaluará primero y la variable de iteración `user` no existe en este momento.

Esto podría solucionarse iterando sobre una propiedad `computed` en su lugar, así:

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

Alternativamente, podemos usar una etiqueta `<template>` con `v-for` para envolver el elemento `<li>`:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Usa estilos con ámbito de componente {#use-component-scoped-styling}

Para las aplicaciones, los estilos en un componente `App` de nivel superior y en los componentes de diseño pueden ser globales, pero todos los demás componentes siempre deben tener un ámbito.

Esto solo es relevante para los [Single-File Components](/guide/scaling-up/sfc). _No_ requiere que se use el [`scoped` attribute](https://vue-loader.vuejs.org/guide/scoped-css.html). El ámbito podría ser a través de [CSS modules](https://vue-loader.vuejs.org/guide/css-modules.html), una estrategia basada en clases como [BEM](http://getbem.com/), u otra librería/convención.

**Las librerías de componentes, sin embargo, deberían preferir una estrategia basada en clases en lugar de usar el `scoped` attribute.**

Esto facilita la anulación de estilos internos, con nombres de clases legibles por humanos que no tienen una especificidad demasiado alta, pero que aún es muy poco probable que resulten en un conflicto.

::: details Explicación Detallada
Si estás desarrollando un proyecto grande, trabajando con otros desarrolladores, o a veces incluyes HTML/CSS de terceros (por ejemplo, de Auth0), un ámbito consistente asegurará que tus estilos solo se apliquen a los componentes para los que están destinados.

Más allá del `scoped` attribute, usar nombres de clase únicos puede ayudar a asegurar que el CSS de terceros no se aplique a tu propio HTML. Por ejemplo, muchos proyectos usan los nombres de clase `button`, `btn` o `icon`, por lo que incluso si no se utiliza una estrategia como BEM, añadir un prefijo específico de la aplicación y/o del componente (por ejemplo, `ButtonClose-icon`) puede proporcionar cierta protección.
:::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Using the `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Using CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Using the BEM convention -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>