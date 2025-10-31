# Observadores {#watchers}

A veces puede que necesitemos realizar "efectos secundarios" de forma reactiva, por ejemplo, registrar un número en la consola cuando cambie. Podemos lograr esto con observadores:

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // yes, console.log() is a side effect
  console.log(`new count is: ${newCount}`)
})
```

`watch()` puede observar directamente un `ref`, y la función de `callback` se ejecuta cada vez que el valor de `count` cambia. `watch()` también puede observar otros tipos de fuentes de datos; más detalles se cubren en <a target="_blank" href="/guide/essentials/watchers.html">Guía - Observadores</a>.

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // yes, console.log() is a side effect
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

Aquí, estamos usando la opción `watch` para observar los cambios en la propiedad `count`. La función de `callback` de `watch` se llama cuando `count` cambia y recibe el nuevo valor como argumento. Más detalles se cubren en <a target="_blank" href="/guide/essentials/watchers.html">Guía - Observadores</a>.

</div>

Un ejemplo más práctico que registrar en la consola sería la obtención de nuevos datos cuando un ID cambia. El código que tenemos está obteniendo datos de tareas (todos) de una API simulada en el montaje del componente. También hay un botón que incrementa el ID de la tarea a obtener. Intenta implementar un observador que obtenga una nueva tarea cuando se haga clic en el botón.