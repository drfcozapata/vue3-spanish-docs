<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# Eventos de Componente {#component-events}

> Esta página asume que ya has leído los [Fundamentos de Componentes](/guide/essentials/component-basics). Léela primero si eres nuevo en los componentes.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Lección gratuita de Vue.js sobre cómo definir eventos personalizados"/>
</div>

## Emitir y Escuchar Eventos {#emitting-and-listening-to-events}

Un componente puede emitir eventos personalizados directamente en expresiones de plantilla (por ejemplo, en un handler de `v-on`) usando el método `$emit` incorporado:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Haz clic</button>
```

<div class="options-api">

El método `$emit()` también está disponible en la instancia del componente como `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

El componente padre puede entonces escucharlo usando `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

El modificador `.once` también es compatible con los listeners de eventos de componente:

```vue-html
<MyComponent @some-event.once="callback" />
```

Al igual que los componentes y los props, los nombres de eventos proporcionan una transformación de mayúsculas y minúsculas automática. Observa que emitimos un evento en camelCase, pero podemos escucharlo usando un listener en kebab-cased en el padre. Al igual que con el [uso de mayúsculas/minúsculas en props](/guide/components/props#prop-name-casing), recomendamos usar listeners de eventos en kebab-cased en las plantillas.

:::tip
A diferencia de los eventos nativos del DOM, los eventos emitidos por componentes **no** hacen _bubbling_. Solo puedes escuchar los eventos emitidos por un componente hijo directo. Si necesitas comunicar entre componentes hermanos o profundamente anidados, utiliza un bus de eventos externo o una [solución de gestión de estado global](/guide/scaling-up/state-management).
:::

## Argumentos de Evento {#event-arguments}

A veces es útil emitir un valor específico con un evento. Por ejemplo, es posible que deseemos que el componente `<BlogPost>` sea el encargado de cuánto debe agrandar el texto. En esos casos, podemos pasar argumentos adicionales a `$emit` para proporcionar este valor:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Aumentar en 1
</button>
```

Luego, cuando escuchamos el evento en el componente padre, podemos usar una función de flecha en línea como listener, lo que nos permite acceder al argumento del evento:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

O, si el handler del evento es un método:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Entonces el valor se pasará como el primer parámetro de ese método:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Todos los argumentos adicionales pasados a `$emit()` después del nombre del evento se reenviarán al listener. Por ejemplo, con `$emit('foo', 1, 2, 3)`, la función listener recibirá tres argumentos.
:::

## Declarar Eventos Emitidos {#declaring-emitted-events}

Un componente puede declarar explícitamente los eventos que emitirá usando la <span class="composition-api">macro [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">opción [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

El método `$emit` que usamos en la `<template>` no es accesible dentro de la sección `<script setup>` de un componente, pero `defineEmits()` devuelve una función equivalente que podemos usar en su lugar:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

La macro `defineEmits()` **no puede** usarse dentro de una función, debe colocarse directamente dentro de `<script setup>`, como en el ejemplo anterior.

Si estás utilizando una función `setup` explícita en lugar de `<script setup>`, los eventos deben declararse usando la opción [`emits`](/api/options-state#emits), y la función `emit` se expone en el contexto de `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Al igual que con otras propiedades del contexto de `setup()`, `emit` se puede desestructurar de forma segura:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

La opción `emits` y la macro `defineEmits()` también admiten una sintaxis de objeto. Si usas TypeScript, puedes tipar los argumentos, lo que nos permite realizar la validación en tiempo de ejecución de la carga útil de los eventos emitidos:

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // devuelve `true` o `false` para indicar
    // si la validación pasó / falló
  }
})
</script>
```

Si estás utilizando TypeScript con `<script setup>`, también es posible declarar eventos emitidos usando anotaciones de tipo puro:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Más detalles: [Tipado de Emisiones de Componentes](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // devuelve `true` o `false` para indicar
      // si la validación pasó / falló
    }
  }
}
```

Ver también: [Tipado de Emisiones de Componentes](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Aunque es opcional, se recomienda definir todos los eventos emitidos para documentar mejor cómo debe funcionar un componente. También permite a Vue excluir listeners conocidos de los [atributos de _fallthrough_](/guide/components/attrs#v-on-listener-inheritance), evitando casos extremos causados por eventos del DOM enviados manualmente por código de terceros.

:::tip
Si un evento nativo (por ejemplo, `click`) se define en la opción `emits`, el listener ahora solo escuchará los eventos `click` emitidos por el componente y ya no responderá a los eventos `click` nativos.
:::

## Validación de Eventos {#events-validation}

Similar a la validación de tipo de prop, un evento emitido puede validarse si se define con la sintaxis de objeto en lugar de la sintaxis de array.

Para agregar validación, al evento se le asigna una función que recibe los argumentos pasados a la llamada <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> y devuelve un booleano para indicar si el evento es válido o no.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Sin validación
  click: null,

  // Validar evento submit
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('¡Carga útil de evento submit no válida!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Sin validación
    click: null,

    // Validar evento submit
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('¡Carga útil de evento submit no válida!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>