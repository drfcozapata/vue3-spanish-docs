# Propiedades Computadas {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Lección gratuita sobre Propiedades Computadas en Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Lección gratuita sobre Propiedades Computadas en Vue.js"/>
</div>

## Ejemplo Básico {#basic-example}

Las expresiones en plantilla son muy convenientes, pero están pensadas para operaciones sencillas. Poner demasiada lógica en tus plantillas puede hacerlas pesadas y difíciles de mantener. Por ejemplo, si tenemos un objeto con un array anidado:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Guía Avanzada',
          'Vue 3 - Guía Básica',
          'Vue 4 - El Misterio'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Guía Avanzada',
    'Vue 3 - Guía Básica',
    'Vue 4 - El Misterio'
  ]
})
```

</div>

Y queremos mostrar mensajes diferentes dependiendo de si `author` ya tiene algunos libros o no:

```vue-html
<p>Ha publicado libros:</p>
<span>{{ author.books.length > 0 ? 'Sí' : 'No' }}</span>
```

En este punto, la plantilla se está volviendo un poco recargada. Tenemos que mirarla un segundo antes de darnos cuenta de que realiza un cálculo que depende de `author.books`. Más importante aún, probablemente no queramos repetirnos si necesitamos incluir este cálculo en la plantilla más de una vez.

Por eso, para lógica compleja que incluye datos reactivos, se recomienda usar una **propiedad computada**. Aquí tienes el mismo ejemplo, refactorizado:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Guía Avanzada',
          'Vue 3 - Guía Básica',
          'Vue 4 - El Misterio'
        ]
      }
    }
  },
  computed: {
    // un getter computado
    publishedBooksMessage() {
      // `this` apunta a la instancia del componente
      return this.author.books.length > 0 ? 'Sí' : 'No'
    }
  }
}
```

```vue-html
<p>Ha publicado libros:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

Aquí hemos declarado una propiedad computada `publishedBooksMessage`.

Intenta cambiar el valor del array `books` en los `data` de la aplicación y verás cómo `publishedBooksMessage` cambia consecuentemente.

Puedes enlazar datos a propiedades computadas en las plantillas igual que a una propiedad normal. Vue sabe que `this.publishedBooksMessage` depende de `this.author.books`, por lo que actualizará cualquier enlace que dependa de `this.publishedBooksMessage` cuando `this.author.books` cambie.

Ver también: [Tipado de Propiedades Computadas](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Guía Avanzada',
    'Vue 3 - Guía Básica',
    'Vue 4 - El Misterio'
  ]
})

// una ref computada
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Sí' : 'No'
})
</script>

<template>
  <p>Ha publicado libros:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOtRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GntMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm6pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

Aquí hemos declarado una propiedad computada `publishedBooksMessage`. La función `computed()` espera que se le pase una [función getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description), y el valor devuelto es una **ref computada**. De forma similar a las refs normales, puedes acceder al resultado computado como `publishedBooksMessage.value`. Las refs computadas también se desempaquetan automáticamente en las plantillas, por lo que puedes referenciarlas sin `.value` en las expresiones de plantilla.

Una propiedad computada rastrea automáticamente sus dependencias reactivas. Vue sabe que el cálculo de `publishedBooksMessage` depende de `author.books`, por lo que actualizará cualquier enlace que dependa de `publishedBooksMessage` cuando `author.books` cambie.

Ver también: [Tipado de Computed](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## Caché Computada vs. Métodos {#computed-caching-vs-methods}

Quizás hayas notado que podemos lograr el mismo resultado invocando un método en la expresión:

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// en el componente
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Sí' : 'No'
  }
}
```

</div>

<div class="composition-api">

```js
// en el componente
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Sí' : 'No'
}
```

</div>

En lugar de una propiedad computada, podemos definir la misma función como un método. Para el resultado final, ambos enfoques son exactamente iguales. Sin embargo, la diferencia es que **las propiedades computadas se almacenan en caché basándose en sus dependencias reactivas.** Una propiedad computada solo se reevaluará cuando algunas de sus dependencias reactivas hayan cambiado. Esto significa que mientras `author.books` no haya cambiado, los accesos múltiples a `publishedBooksMessage` devolverán inmediatamente el resultado computado previamente sin tener que ejecutar la función getter de nuevo.

Esto también significa que la siguiente propiedad computada nunca se actualizará, porque `Date.now()` no es una dependencia reactiva:

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

En comparación, la invocación de un método **siempre** ejecutará la función cada vez que ocurra un re-renderizado.

¿Por qué necesitamos caché? Imagina que tenemos una propiedad computada costosa `list`, que requiere recorrer un array enorme y realizar muchos cálculos. Luego, podríamos tener otras propiedades computadas que a su vez dependen de `list`. ¡Sin caché, estaríamos ejecutando el getter de `list` muchas más veces de lo necesario! En los casos en que no quieras caché, utiliza una llamada a un método en su lugar.

## Propiedades Computadas Escribibles {#writable-computed}

Las propiedades computadas son por defecto solo de lectura (getter-only). Si intentas asignar un nuevo valor a una propiedad computada, recibirás una advertencia en tiempo de ejecución. En los casos raros en los que necesites una propiedad computada "escribible", puedes crear una proporcionando tanto un getter como un setter:

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // getter
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set(newValue) {
        // Nota: aquí estamos usando la sintaxis de asignación de desestructuración.
        ;[this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Ahora, cuando ejecutes `this.fullName = 'John Doe'`, el setter será invocado y `this.firstName` y `this.lastName` se actualizarán consecuentemente.

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // Nota: aquí estamos usando la sintaxis de asignación de desestructuración.
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Ahora, cuando ejecutes `fullName.value = 'John Doe'`, el setter será invocado y `firstName` y `lastName` se actualizarán consecuentemente.

</div>

## Obteniendo el Valor Anterior {#previous}

- Solo soportado en 3.4+

<p class="options-api">
En caso de que lo necesites, puedes obtener el valor anterior devuelto por la propiedad computada accediendo al segundo argumento del getter:
</p>

<p class="composition-api">
En caso de que lo necesites, puedes obtener el valor anterior devuelto por la propiedad computada accediendo al primer argumento del getter:
</p>

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    // Este cálculo devolverá el valor de count cuando sea menor o igual a 3.
    // Cuando count sea >=4, devolverá el último valor que cumpliera nuestra condición
    // hasta que count sea menor o igual a 3.
    alwaysSmall(_, previous) {
      if (this.count <= 3) {
        return this.count
      }

      return previous
    }
  }
}
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

// Este cálculo devolverá el valor de count cuando sea menor o igual a 3.
// Cuando count sea >=4, devolverá el último valor que cumpliera nuestra condición
// hasta que count sea menor o igual a 3.
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }

  return previous
})
</script>
```

</div>

En caso de que estés usando una propiedad computada escribible:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    alwaysSmall: {
      get(_, previous) {
        if (this.count <= 3) {
          return this.count
        }

        return previous
      },
      set(newValue) {
        this.count = newValue * 2
      }
    }
  }
}
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

const alwaysSmall = computed({
  get(previous) {
    if (count.value <= 3) {
      return count.value
    }

    return previous
  },
  set(newValue) {
    count.value = newValue * 2
  }
})
</script>
```

</div>

## Mejores Prácticas {#best-practices}

### Los getters deben estar libres de efectos secundarios {#getters-should-be-side-effect-free}

Es importante recordar que las funciones getter computadas solo deben realizar cálculos puros y estar libres de efectos secundarios. Por ejemplo, **¡no mutar otro estado, realizar solicitudes asíncronas o mutar el DOM dentro de un getter computado!** Piensa en una propiedad computada como la descripción declarativa de cómo derivar un valor basado en otros valores; su única responsabilidad debe ser calcular y devolver ese valor. Más adelante en la guía, discutiremos cómo podemos realizar efectos secundarios en reacción a los cambios de estado con [watchers](./watchers).

### Evitar mutar valores computados {#avoid-mutating-computed-value}

El valor devuelto por una propiedad computada es un estado derivado. Piénsalo como una instantánea temporal: cada vez que el estado de origen cambia, se crea una nueva instantánea. No tiene sentido mutar una instantánea, por lo que un valor de retorno computado debe tratarse como de solo lectura y nunca ser mutado; en su lugar, actualiza el estado de origen del que depende para activar nuevos cálculos.
