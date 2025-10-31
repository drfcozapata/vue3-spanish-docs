# Reglas de Prioridad D: Usar con Precaución {#priority-d-rules-use-with-caution}

::: warning Nota
Esta Guía de Estilo de Vue.js está desactualizada y necesita ser revisada. Si tienes alguna pregunta o sugerencia, por favor [abre una incidencia](https://github.com/vuejs/docs/issues/new).
:::

Algunas características de Vue existen para acomodar casos extremos raros o migraciones más fluidas desde una base de código heredada. Sin embargo, cuando se usan en exceso, pueden hacer que tu código sea más difícil de mantener o incluso convertirse en una fuente de errores. Estas reglas arrojan luz sobre características potencialmente riesgosas, describiendo cuándo y por qué deben evitarse.

## Selectores de elemento con `scoped` {#element-selectors-with-scoped}

**Los selectores de elemento deben evitarse con `scoped`.**

Prefiere los selectores de clase sobre los selectores de elemento en los estilos `scoped`, porque un gran número de selectores de elemento son lentos.

::: details Explicación Detallada
Para `scoped` estilos, Vue añade un `attribute` único a los elementos del componente, como `data-v-f3f3eg9`. Luego los selectores son modificados para que solo se seleccionen los elementos coincidentes con este `attribute` (por ejemplo, `button[data-v-f3f3eg9]`).

El problema es que un gran número de selectores de `attribute` de elemento (por ejemplo, `button[data-v-f3f3eg9]`) serán considerablemente más lentos que los selectores de `attribute` de clase (por ejemplo, `.btn-close[data-v-f3f3eg9]`), por lo que los selectores de clase deben preferirse siempre que sea posible.
:::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Comunicación implícita padre-hijo {#implicit-parent-child-communication}

**Las `props` y los `events` deben preferirse para la comunicación entre componentes padre-hijo, en lugar de `this.$parent` o mutar `props`.**

Una aplicación ideal de Vue es `props` hacia abajo, `events` hacia arriba. Mantener esta convención hace que tus componentes sean mucho más fáciles de entender. Sin embargo, hay casos extremos donde la mutación de `prop` o `this.$parent` puede simplificar dos componentes que ya están profundamente acoplados.

El problema es que también hay muchos casos _simples_ donde estos patrones pueden ofrecer conveniencia. Advertencia: no te dejes seducir para cambiar la simplicidad (ser capaz de entender el flujo de tu estado) por la conveniencia a corto plazo (escribir menos código).

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```

</div>

</div>