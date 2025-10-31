# Watchers {#watchers}

## Ejemplo Básico {#basic-example}

Las propiedades `computed` nos permiten calcular valores derivados de forma declarativa. Sin embargo, hay casos en los que necesitamos realizar "efectos secundarios" en reacción a cambios de estado, por ejemplo, mutar el DOM o cambiar otra parte del estado basándose en el resultado de una operación asíncrona.

<div class="options-api">

Con la API de Opciones, podemos usar la opción [`watch`](/api/options-state#watch) para activar una función siempre que una propiedad reactiva cambie:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Questions usually contain a question mark. ;-)',
      loading: false
    }
  },
  watch: {
    // whenever question changes, this function will run
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Thinking...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Error! Could not reach the API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Ask a yes/no question:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINrKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

La opción `watch` también soporta una ruta delimitada por puntos como clave:

```js
export default {
  watch: {
    // Note: only simple paths. Expressions are not supported.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

Con la API de Composición, podemos usar la función [`watch`](/api/reactivity-core#watch) para activar una función de callback siempre que una parte del estado reactivo cambie:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// watch works directly on a ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuJ/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### Tipos de Fuentes de `watch` {#watch-source-types}

El primer argumento de `watch` puede ser de diferentes tipos de "fuentes" reactivas: puede ser un `ref` (incluyendo `ref` computadas), un objeto reactivo, una [función `getter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description), o un array de múltiples fuentes:

```js
const x = ref(0)
const y = ref(0)

// ref única
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array de múltiples fuentes
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Ten en cuenta que no puedes observar una propiedad de un objeto reactivo de esta manera:

```js
const obj = reactive({ count: 0 })

// esto no funcionará porque estamos pasando un número a watch()
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`)
})
```

En su lugar, usa un `getter`:

```js
// en su lugar, usa un getter:
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
```

</div>

## Observadores Profundos {#deep-watchers}

<div class="options-api">

`watch` es superficial por defecto: la función de callback solo se activará cuando la propiedad observada haya sido asignada con un nuevo valor - no se activará en cambios de propiedades anidadas. Si quieres que la función de callback se dispare en todas las mutaciones anidadas, necesitas usar un observador profundo:

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Nota: `newValue` será igual a `oldValue` aquí
        // en mutaciones anidadas siempre y cuando el objeto en sí
        // no haya sido reemplazado.
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Cuando llamas a `watch()` directamente sobre un objeto reactivo, creará implícitamente un observador profundo - la función de callback se activará en todas las mutaciones anidadas:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // se dispara en mutaciones de propiedades anidadas
  // Nota: `newValue` será igual a `oldValue` aquí
  // ¡porque ambos apuntan al mismo objeto!
})

obj.count++
```

Esto debe diferenciarse de un `getter` que devuelve un objeto reactivo; en este último caso, la función de callback solo se disparará si el `getter` devuelve un objeto diferente:

```js
watch(
  () => state.someObject,
  () => {
    // se dispara solo cuando state.someObject es reemplazado
  }
)
```

Sin embargo, puedes forzar el segundo caso a ser un observador profundo usando explícitamente la opción `deep`:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Nota: `newValue` será igual a `oldValue` aquí
    // *a menos que* state.someObject haya sido reemplazado
  },
  { deep: true }
)
```

</div>

En Vue 3.5+, la opción `deep` también puede ser un número que indica la profundidad máxima de recorrido, es decir, cuántos niveles debe recorrer Vue las propiedades anidadas de un objeto.

:::warning Úsalo con Precaución
La observación profunda requiere recorrer todas las propiedades anidadas en el objeto observado, y puede ser costosa cuando se usa en grandes estructuras de datos. Úsala solo cuando sea necesario y ten en cuenta las implicaciones de rendimiento.
:::

## Observadores de Ejecución Inmediata {#eager-watchers}

`watch` es perezoso por defecto: la función de callback no se llamará hasta que la fuente observada haya cambiado. Pero en algunos casos es posible que queramos que la misma lógica de callback se ejecute de forma inmediata - por ejemplo, es posible que queramos obtener algunos datos iniciales y luego volver a obtener los datos cada vez que los estados relevantes cambien.

<div class="options-api">

Podemos forzar la ejecución inmediata de la función de callback de un observador declarándola usando un objeto con una función `handler` y la opción `immediate: true`:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // esto se ejecutará inmediatamente al crear el componente.
      },
      // forzar la ejecución inmediata del callback
      immediate: true
    }
  }
  // ...
}
```

La ejecución inicial de la función `handler` ocurrirá justo antes del `hook` `created`. Vue ya habrá procesado las opciones `data`, `computed` y `methods`, por lo que esas propiedades estarán disponibles en la primera invocación.

</div>

<div class="composition-api">

Podemos forzar la ejecución inmediata de la función de callback de un observador pasando la opción `immediate: true`:

```js
watch(
  source,
  (newValue, oldValue) => {
    // ejecutado inmediatamente, luego de nuevo cuando `source` cambie
  },
  { immediate: true }
)
```

</div>

## Observadores de Una Vez {#once-watchers}

- Solo soportado en 3.4+

La función de callback de un observador se ejecutará siempre que la fuente observada cambie. Si quieres que la función de callback se active solo una vez cuando la fuente cambie, usa la opción `once: true`.

<div class="options-api">

```js
export default {
  watch: {
    source: {
      handler(newValue, oldValue) {
        // cuando `source` cambia, se activa solo una vez
      },
      once: true
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(
  source,
  (newValue, oldValue) => {
    // cuando `source` cambia, se activa solo una vez
  },
  { once: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

Es común que la función de callback del observador use exactamente el mismo estado reactivo que la fuente. Por ejemplo, considera el siguiente código, que usa un observador para cargar un recurso remoto cada vez que el `ref` `todoId` cambia:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

En particular, fíjate cómo el observador usa `todoId` dos veces, una como fuente y otra dentro de la función de callback.

Esto se puede simplificar con [`watchEffect()`](/api/reactivity-core#watcheffect). `watchEffect()` nos permite rastrear automáticamente las dependencias reactivas de la función de callback. El observador anterior se puede reescribir como:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Aquí, la función de callback se ejecutará inmediatamente, no hay necesidad de especificar `immediate: true`. Durante su ejecución, rastreará automáticamente `todoId.value` como una dependencia (similar a las propiedades `computed`). Cada vez que `todoId.value` cambie, la función de callback se ejecutará de nuevo. Con `watchEffect()`, ya no necesitamos pasar `todoId` explícitamente como el valor de la fuente.

Puedes ver [este ejemplo](/examples/#fetching-data) de `watchEffect()` y la obtención de datos reactivos en acción.

Para ejemplos como estos, con una sola dependencia, el beneficio de `watchEffect()` es relativamente pequeño. Pero para observadores que tienen múltiples dependencias, usar `watchEffect()` elimina la carga de tener que mantener la lista de dependencias manualmente. Además, si necesitas observar varias propiedades en una estructura de datos anidada, `watchEffect()` puede resultar más eficiente que un observador profundo, ya que solo rastreará las propiedades que se usan en la función de callback, en lugar de rastrearlas todas recursivamente.

:::tip
`watchEffect` solo rastrea dependencias durante su ejecución **síncrona**. Cuando se usa con una función de callback asíncrona, solo se rastrearán las propiedades a las que se accede antes del primer `await`.
:::

### `watch` vs. `watchEffect` {#watch-vs-watcheffect}

`watch` y `watchEffect` nos permiten realizar efectos secundarios de forma reactiva. Su principal diferencia radica en la forma en que rastrean sus dependencias reactivas:

- `watch` solo rastrea la fuente observada explícitamente. No rastreará nada a lo que se acceda dentro de la función de callback. Además, la función de callback solo se activa cuando la fuente ha cambiado realmente. `watch` separa el rastreo de dependencias del efecto secundario, dándonos un control más preciso sobre cuándo debe dispararse la función de callback.

- `watchEffect`, por otro lado, combina el rastreo de dependencias y el efecto secundario en una sola fase. Rastrea automáticamente cada propiedad reactiva a la que se accede durante su ejecución síncrona. Esto es más conveniente y generalmente resulta en un código más conciso, pero hace que sus dependencias reactivas sean menos explícitas.

</div>

## Limpieza de Efectos Secundarios {#side-effect-cleanup}

A veces podemos realizar efectos secundarios, por ejemplo, peticiones asíncronas, en un observador:

<div class="composition-api">

```js
watch(id, (newId) => {
  fetch(`/api/${newId}`).then(() => {
    // callback logic
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId) {
      fetch(`/api/${newId}`).then(() => {
        // callback logic
      })
    }
  }
}
```

</div>

Pero, ¿qué pasa si `id` cambia antes de que se complete la petición? Cuando la petición anterior se complete, seguirá activando la función de callback con un valor de ID que ya está obsoleto. Idealmente, queremos poder cancelar la petición obsoleta cuando `id` cambie a un nuevo valor.

Podemos usar la API [`onWatcherCleanup()`](/api/reactivity-core#onwatchercleanup) <sup class="vt-badge" data-text="3.5+" /> para registrar una función de limpieza que se llamará cuando el observador se invalide y esté a punto de volver a ejecutarse:

<div class="composition-api">

```js {10-13}
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // callback logic
  })

  onWatcherCleanup(() => {
    // abortar petición obsoleta
    controller.abort()
  })
})
```

</div>
<div class="options-api">

```js {12-15}
import { onWatcherCleanup } from 'vue'

export default {
  watch: {
    id(newId) {
      const controller = new AbortController()

      fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
        // callback logic
      })

      onWatcherCleanup(() => {
        // abortar petición obsoleta
        controller.abort()
      })
    }
  }
}
```

</div>

Ten en cuenta que `onWatcherCleanup` solo es compatible con Vue 3.5+ y debe llamarse durante la ejecución síncrona de una función de efecto `watchEffect` o una función de callback `watch`: no puedes llamarla después de una sentencia `await` en una función asíncrona.

Alternativamente, una función `onCleanup` también se pasa a las funciones de callback del observador como tercer argumento<span class="composition-api">, y a la función de efecto `watchEffect` como primer argumento</span>:

<div class="composition-api">

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // lógica de limpieza
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // lógica de limpieza
  })
})
```

</div>
<div class="options-api">

```js
export default {
  watch: {
    id(newId, oldId, onCleanup) {
      // ...
      onCleanup(() => {
        // lógica de limpieza
      })
    }
  }
}
```

</div>

Esto funciona en versiones anteriores a la 3.5. Además, `onCleanup` pasado como argumento de función está vinculado a la instancia del observador, por lo que no está sujeto a la restricción síncrona de `onWatcherCleanup`.

## Momento de Vaciado de la Función de Callback {#callback-flush-timing}

Cuando mutas el estado reactivo, esto puede activar tanto las actualizaciones de los componentes de Vue como las funciones de callback de los observadores creados por ti.

De forma similar a las actualizaciones de componentes, las funciones de callback de los observadores creados por el usuario se agrupan para evitar invocaciones duplicadas. Por ejemplo, probablemente no queremos que un observador se active mil veces si insertamos mil elementos de forma síncrona en un array que está siendo observado.

Por defecto, la función de callback de un observador se llama **después** de las actualizaciones del componente padre (si las hay), y **antes** de las actualizaciones del DOM del componente propietario. Esto significa que si intentas acceder al propio DOM del componente propietario dentro de una función de callback de un observador, el DOM estará en un estado de pre-actualización.

### Observadores Post-Vaciado {#post-watchers}

Si quieres acceder al DOM del componente propietario en una función de callback de un observador **después** de que Vue lo haya actualizado, necesitas especificar la opción `flush: 'post'`:`

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

El `watchEffect()` de post-vaciado también tiene un alias de conveniencia, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* ejecutado después de que Vue actualice */
})
```

</div>

### Observadores Síncronos {#sync-watchers}

También es posible crear un observador que se dispara de forma síncrona, antes de cualquier actualización gestionada por Vue:

<div class="options-api">

```js{6}
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync'
    }
  }
}
```

</div>

<div class="composition-api">

```js{2,6}
watch(source, callback, {
  flush: 'sync'
})

watchEffect(callback, {
  flush: 'sync'
})
```

El `watchEffect()` síncrono también tiene un alias de conveniencia, `watchSyncEffect()`:

```js
import { watchSyncEffect } from 'vue'

watchSyncEffect(() => {
  /* ejecutado de forma síncrona al cambiar los datos reactivos */
})
```

</div>

:::warning Úsalo con Precaución
Los observadores síncronos no tienen agrupación y se activan cada vez que se detecta una mutación reactiva. Está bien usarlos para observar valores booleanos simples, pero evita usarlos en fuentes de datos que puedan mutarse sincrónicamente muchas veces, por ejemplo, arrays.
:::

<div class="options-api">

## `this.$watch()` \* {#this-watch}

También es posible crear observadores de forma imperativa usando el método de instancia [`$watch()`](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Esto es útil cuando necesitas configurar condicionalmente un observador, o solo observar algo en respuesta a la interacción del usuario. También te permite detener el observador de forma anticipada.

</div>

## Deteniendo un Observador {#stopping-a-watcher}

<div class="options-api">

Los observadores declarados usando la opción `watch` o el método de instancia `$watch()` se detienen automáticamente cuando el componente propietario se desmonta, por lo que en la mayoría de los casos no necesitas preocuparte por detener el observador tú mismo.

En el raro caso de que necesites detener un observador antes de que el componente propietario se desmonte, la API `$watch()` devuelve una función para ello:

```js
const unwatch = this.$watch('foo', callback)

// ...cuando el observador ya no es necesario:
unwatch()
```

</div>

<div class="composition-api">

Los observadores declarados de forma síncrona dentro de `setup()` o `<script setup>` están vinculados a la instancia del componente propietario, y se detendrán automáticamente cuando el componente propietario se desmonte. En la mayoría de los casos, no necesitas preocuparte por detener el observador tú mismo.

La clave aquí es que el observador debe crearse de forma **síncrona**: si el observador se crea en una función de callback asíncrona, no se vinculará al componente propietario y deberá detenerse manualmente para evitar fugas de memoria. Aquí tienes un ejemplo:

```vue
<script setup>
import { watchEffect } from 'vue'

// este se detendrá automáticamente
watchEffect(() => {})

// ...¡este no lo hará!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Para detener manualmente un observador, usa la función de manejo devuelta. Esto funciona tanto para `watch` como para `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...más tarde, cuando ya no sea necesario
unwatch()
```

Ten en cuenta que debería haber muy pocos casos en los que necesites crear observadores de forma asíncrona, y la creación síncrona debe preferirse siempre que sea posible. Si necesitas esperar algunos datos asíncronos, puedes hacer que tu lógica de observación sea condicional en su lugar:

```js
// datos a cargar de forma asíncrona
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // hacer algo cuando los datos estén cargados
  }
})
```

</div>
