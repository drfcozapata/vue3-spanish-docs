# Oyentes de Eventos {#event-listeners}

Podemos escuchar eventos del DOM usando la directiva `v-on`:

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

Debido a su uso frecuente, `v-on` también tiene una sintaxis abreviada:

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

Aquí, `increment` hace referencia a una función declarada usando la opción `methods`:

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // update component state
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // update component state
      this.count++
    }
  }
})
```

</div>

Dentro de un método, podemos acceder a la instancia del componente usando `this`. La instancia del componente expone las propiedades de datos declaradas por `data`. Podemos actualizar el estado del componente mutando estas propiedades.

</div>

<div class="composition-api">

<div class="sfc">

Aquí, `increment` hace referencia a una función declarada en `<script setup>`:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // update component state
  count.value++
}
</script>
```

</div>

<div class="html">

Aquí, `increment` hace referencia a un método en el objeto devuelto por `setup()`:

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // update component state
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

Dentro de la función, podemos actualizar el estado del componente mutando `refs`.

</div>

Los manejadores de eventos también pueden usar expresiones en línea y pueden simplificar tareas comunes con modificadores. Estos detalles se cubren en <a target="_blank" href="/guide/essentials/event-handling.html">Guía - Manejo de Eventos</a>.

Ahora, intenta implementar el <span class="options-api">método</span><span class="composition-api">función</span> `increment` tú mismo y vincúlalo al botón usando `v-on`.