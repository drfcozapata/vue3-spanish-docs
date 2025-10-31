# Propiedad Computada {#computed-property}

Sigamos construyendo sobre la lista de tareas del paso anterior. Aquí, ya hemos añadido una funcionalidad de alternancia a cada tarea. Esto se logra añadiendo una propiedad `done` a cada objeto todo, y usando `v-model` para vincularla a una casilla de verificación:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

La siguiente mejora que podemos añadir es la capacidad de ocultar las tareas ya completadas. Ya tenemos un botón que alterna el estado `hideCompleted`. Pero, ¿cómo renderizamos diferentes elementos de la lista basándonos en ese estado?

<div class="options-api">

Presentamos la <a target="_blank" href="/guide/essentials/computed.html">propiedad computada</a>. Podemos declarar una propiedad que se calcula reactivamente a partir de otras propiedades utilizando la opción `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // return filtered todos based on `this.hideCompleted`
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // return filtered todos based on `this.hideCompleted`
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Presentamos <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Podemos crear una `ref` computada que calcula su `.value` basándose en otras fuentes de datos reactivas:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // return filtered todos based on
  // `todos.value` & `hideCompleted.value`
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // return filtered todos based on
      // `todos.value` & `hideCompleted.value`
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Una propiedad computada rastrea otros estados reactivos utilizados en su cálculo como dependencias. Almacena en caché el resultado y lo actualiza automáticamente cuando sus dependencias cambian.

Ahora, ¡intenta añadir la propiedad computada `filteredTodos` e implementar su lógica de cálculo! Si se implementa correctamente, marcar una tarea como completada mientras se ocultan los elementos completados debería ocultarla también al instante.