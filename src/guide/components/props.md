# Props {#props}

> Esta página asume que ya has leído [Fundamentos de Componentes](/guide/essentials/component-basics). Léelo primero si eres nuevo en los componentes.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Lección gratuita de props en Vue.js"/>
</div>

## Declaración de Props {#props-declaration}

Los componentes de Vue requieren una declaración explícita de `props` para que Vue sepa qué `props` externas pasadas al componente deben tratarse como atributos de paso directo (lo cual se discutirá en [su sección dedicada](/guide/components/attrs)).

<div class="composition-api">

En SFCs que usan `<script setup>`, las `props` pueden declararse usando la macro `defineProps()`:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

En componentes que no usan `<script setup>`, las `props` se declaran usando la opción [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() recibe props como primer argumento.
    console.log(props.foo)
  }
}
```

Nótese que el argumento pasado a `defineProps()` es el mismo que el valor proporcionado a la opción `props`: la misma API de opciones de `props` se comparte entre los dos estilos de declaración.

</div>

<div class="options-api">

Las `props` se declaran usando la opción [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  created() {
    // las props se exponen en `this`
    console.log(this.foo)
  }
}
```

</div>

Además de declarar las `props` usando un array de strings, también podemos usar la sintaxis de objeto:

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// en <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// en non-<script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

Para cada propiedad en la sintaxis de declaración de objeto, la clave es el nombre de la `prop`, mientras que el valor debe ser la función constructora del tipo esperado.

Esto no solo documenta tu componente, sino que también advertirá a otros desarrolladores que usen tu componente en la consola del navegador si pasan el tipo incorrecto. Discutiremos más detalles sobre la [validación de props](#prop-validation) más adelante en esta página.

<div class="options-api">

Ver también: [Tipado de props de Componentes](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

Si estás usando TypeScript con `<script setup>`, también es posible declarar `props` usando anotaciones de tipo puras:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Más detalles: [Tipado de props de Componentes](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

## Desestructuración Reactiva de Props <sup class="vt-badge" data-text="3.5+" /> \*\* {#reactive-props-destructure}

El sistema de reactividad de Vue rastrea el uso del estado basándose en el acceso a las propiedades. Por ejemplo, cuando accedes a `props.foo` en un `computed getter` o un `watcher`, la `prop` `foo` se rastrea como una dependencia.

Así, dado el siguiente código:

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // se ejecuta solo una vez antes de la 3.5
  // se vuelve a ejecutar cuando la prop "foo" cambia en la 3.5+
  console.log(foo)
})
```

En la versión 3.4 y anteriores, `foo` es una constante real y nunca cambiará. En la versión 3.5 y posteriores, el compilador de Vue antepone automáticamente `props.` cuando el código en el mismo bloque `<script setup>` accede a variables desestructuradas de `defineProps`. Por lo tanto, el código anterior se vuelve equivalente al siguiente:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` transformado a `props.foo` por el compilador
  console.log(props.foo)
})
```

Además, puedes usar la sintaxis de valores predeterminados nativa de JavaScript para declarar valores predeterminados para las `props`. Esto es particularmente útil cuando se utiliza la declaración de `props` basada en tipos:

```ts
const { foo = 'hello' } = defineProps<{ foo?: string }>()
```

Si prefieres tener una distinción visual mayor entre las `props` desestructuradas y las variables normales en tu IDE, la extensión de VSCode de Vue proporciona una configuración para habilitar `inlay-hints` para las `props` desestructuradas.

### Pasando Props Desestructuradas a Funciones {#passing-destructured-props-into-functions}

Cuando pasamos una `prop` desestructurada a una función, por ejemplo:

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

Esto no funcionará como se espera porque es equivalente a `watch(props.foo, ...)` - estamos pasando un valor en lugar de una fuente de datos reactiva a `watch`. De hecho, el compilador de Vue detectará tales casos y lanzará una advertencia.

De forma similar a cómo podemos observar una `prop` normal con `watch(() => props.foo, ...)`, podemos observar una `prop` desestructurada también envolviéndola en un `getter`:

```js
watch(() => foo, /* ... */)
```

Además, este es el enfoque recomendado cuando necesitamos pasar una `prop` desestructurada a una función externa mientras se mantiene la reactividad:

```js
useComposable(() => foo)
```

La función externa puede llamar al `getter` (o normalizarlo con [toValue](/api/reactivity-utilities.html#tovalue)) cuando necesite rastrear los cambios de la `prop` proporcionada, por ejemplo, en un `computed` o un `watcher getter`.

</div>

## Detalles de Pase de Props {#prop-passing-details}

### Casos de Nombres de Props {#prop-name-casing}

Declaramos nombres de `props` largos usando `camelCase` porque esto evita tener que usar comillas al usarlos como claves de propiedad, y nos permite referenciarlos directamente en expresiones de plantilla porque son identificadores JavaScript válidos:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

Técnicamente, también puedes usar `camelCase` al pasar `props` a un componente hijo (excepto en [plantillas en el DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats)). Sin embargo, la convención es usar `kebab-case` en todos los casos para alinearse con los atributos HTML:

```vue-html
<MyComponent greeting-message="hello" />
```

Usamos [PascalCase para etiquetas de componentes](/guide/components/registration#component-name-casing) cuando es posible porque mejora la legibilidad de la plantilla al diferenciar los componentes de Vue de los elementos nativos. Sin embargo, no hay tanto beneficio práctico en usar `camelCase` al pasar `props`, por lo que elegimos seguir las convenciones de cada lenguaje.

### Props Estáticas vs. Dinámicas {#static-vs-dynamic-props}

Hasta ahora, has visto `props` pasadas como valores estáticos, como en:

```vue-html
<BlogPost title="Mi viaje con Vue" />
```

También has visto `props` asignadas dinámicamente con `v-bind` o su atajo `:`, como en:

```vue-html
<!-- Asigna dinámicamente el valor de una variable -->
<BlogPost :title="post.title" />

<!-- Asigna dinámicamente el valor de una expresión compleja -->
<BlogPost :title="post.title + ' de ' + post.author.name" />
```

### Pasando Diferentes Tipos de Valores {#passing-different-value-types}

En los dos ejemplos anteriores, pasamos valores de `string`, pero _cualquier_ tipo de valor puede pasarse a una `prop`.

#### Número {#number}

```vue-html
<!-- Aunque `42` es estático, necesitamos v-bind para decirle a Vue que -->
<!-- esto es una expresión JavaScript en lugar de un string.           -->
<BlogPost :likes="42" />

<!-- Asigna dinámicamente el valor de una variable. -->
<BlogPost :likes="post.likes" />
```

#### Booleano {#boolean}

```vue-html
<!-- Incluir la prop sin valor implicará `true`. -->
<BlogPost is-published />

<!-- Aunque `false` es estático, necesitamos v-bind para decirle a Vue que -->
<!-- esto es una expresión JavaScript en lugar de un string.              -->
<BlogPost :is-published="false" />

<!-- Asigna dinámicamente el valor de una variable. -->
<BlogPost :is-published="post.isPublished" />
```

#### Array {#array}

```vue-html
<!-- Aunque el array es estático, necesitamos v-bind para decirle a Vue que -->
<!-- esto es una expresión JavaScript en lugar de un string.                -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Asigna dinámicamente el valor de una variable. -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Objeto {#object}

```vue-html
<!-- Aunque el objeto es estático, necesitamos v-bind para decirle a Vue que -->
<!-- esto es una expresión JavaScript en lugar de un string.                 -->
<BlogPost
  :author="{
    name: 'Verónica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Asigna dinámicamente el valor de una variable. -->
<BlogPost :author="post.author" />
```

### Enlazando Múltiples Propiedades Usando un Objeto {#binding-multiple-properties-using-an-object}

Si deseas pasar todas las propiedades de un objeto como `props`, puedes usar [`v-bind` sin un argumento](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) (`v-bind` en lugar de `:prop-name`). Por ejemplo, dado un objeto `post`:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'Mi Viaje con Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'Mi Viaje con Vue'
}
```

</div>

La siguiente plantilla:

```vue-html
<BlogPost v-bind="post" />
```

Será equivalente a:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## Flujo de Datos Unidireccional {#one-way-data-flow}

Todas las `props` forman un **enlace unidireccional descendente** entre la propiedad hija y la propiedad padre: cuando la propiedad padre se actualiza, fluirá hacia el hijo, pero no al revés. Esto evita que los componentes hijos muten accidentalmente el estado del padre, lo que puede dificultar la comprensión del flujo de datos de tu aplicación.

Además, cada vez que el componente padre se actualiza, todas las `props` en el componente hijo se actualizarán con el valor más reciente. Esto significa que **no** debes intentar mutar una `prop` dentro de un componente hijo. Si lo haces, Vue te advertirá en la consola:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ advertencia, ¡las props son de solo lectura!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ advertencia, ¡las props son de solo lectura!
    this.foo = 'bar'
  }
}
```

</div>

Normalmente, hay dos casos en los que es tentador mutar una `prop`:

1.  **La `prop` se utiliza para pasar un valor inicial; el componente hijo quiere usarlo como una propiedad de datos local después.** En este caso, lo mejor es definir una propiedad de datos local que use la `prop` como su valor inicial:

    <div class="composition-api">

    ```js
    const props = defineProps(['initialCounter'])

    // counter solo usa props.initialCounter como valor inicial;
    // está desconectado de futuras actualizaciones de props.
    const counter = ref(props.initialCounter)
    ```

    </div>
    <div class="options-api">

    ```js
    export default {
      props: ['initialCounter'],
      data() {
        return {
          // counter solo usa this.initialCounter como valor inicial;
          // está desconectado de futuras actualizaciones de props.
          counter: this.initialCounter
        }
      }
    }
    ```

    </div>

2.  **La `prop` se pasa como un valor bruto que necesita ser transformado.** En este caso, lo mejor es definir una propiedad `computed` usando el valor de la `prop`:

    <div class="composition-api">

    ```js
    const props = defineProps(['size'])

    // propiedad computed que se autoactualiza cuando la prop cambia
    const normalizedSize = computed(() => props.size.trim().toLowerCase())
    ```

    </div>
    <div class="options-api">

    ```js
    export default {
      props: ['size'],
      computed: {
        // propiedad computed que se autoactualiza cuando la prop cambia
        normalizedSize() {
          return this.size.trim().toLowerCase()
        }
      }
    }
    ```

    </div>

### Mutando Props de Objetos / Arrays {#mutating-object-array-props}

Cuando se pasan objetos y arrays como `props`, aunque el componente hijo no puede mutar el enlace de la `prop`, **sí** podrá mutar las propiedades anidadas del objeto o array. Esto se debe a que en JavaScript los objetos y arrays se pasan por referencia, y es excesivamente costoso para Vue evitar tales mutaciones.

El principal inconveniente de tales mutaciones es que permiten al componente hijo afectar el estado del padre de una manera que no es obvia para el componente padre, lo que potencialmente dificulta el razonamiento sobre el flujo de datos en el futuro. Como mejor práctica, debes evitar tales mutaciones a menos que el padre y el hijo estén fuertemente acoplados por diseño. En la mayoría de los casos, el hijo debe [emitir un evento](/guide/components/events) para permitir que el padre realice la mutación.

## Validación de Props {#prop-validation}

Los componentes pueden especificar requisitos para sus `props`, como los tipos que ya has visto. Si no se cumple un requisito, Vue te advertirá en la consola de JavaScript del navegador. Esto es especialmente útil al desarrollar un componente que está destinado a ser utilizado por otros.

Para especificar validaciones de `prop`, puedes proporcionar un objeto con requisitos de validación a la <span class="composition-api">macro `defineProps()`</span><span class="options-api">opción `props`</span>, en lugar de un array de strings. Por ejemplo:

<div class="composition-api">

```js
defineProps({
  // Verificación de tipo básica
  //  (los valores `null` y `undefined` permitirán cualquier tipo)
  propA: Number,
  // Múltiples tipos posibles
  propB: [String, Number],
  // String requerida
  propC: {
    type: String,
    required: true
  },
  // String requerida pero que puede ser nula
  propD: {
    type: [String, null],
    required: true
  },
  // Número con un valor predeterminado
  propE: {
    type: Number,
    default: 100
  },
  // Objeto con un valor predeterminado
  propF: {
    type: Object,
    // Los valores predeterminados de objetos o arrays deben ser devueltos
    // desde una función de fábrica. La función recibe las
    // props sin procesar recibidas por el componente como argumento.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Función validadora personalizada
  // todas las props se pasan como 2do argumento en 3.4+
  propG: {
    validator(value, props) {
      // El valor debe coincidir con uno de estos strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Función con un valor predeterminado
  propH: {
    type: Function,
    // A diferencia del valor predeterminado de objeto o array, esta no es
    // una función de fábrica - es una función para servir como valor predeterminado
    default() {
      return 'Función predeterminada'
    }
  }
})
```

:::tip
El código dentro del argumento `defineProps()` **no puede acceder a otras variables declaradas en `<script setup>`**, porque toda la expresión se mueve a un ámbito de función externa cuando se compila.
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // Verificación de tipo básica
    //  (los valores `null` y `undefined` permitirán cualquier tipo)
    propA: Number,
    // Múltiples tipos posibles
    propB: [String, Number],
    // String requerida
    propC: {
      type: String,
      required: true
    },
    // String requerida pero que puede ser nula
    propD: {
      type: [String, null],
      required: true
    },
    // Número con un valor predeterminado
    propE: {
      type: Number,
      default: 100
    },
    // Objeto con un valor predeterminado
    propF: {
      type: Object,
      // Los valores predeterminados de objetos o arrays deben ser devueltos
      // desde una función de fábrica. La función recibe las
      // props sin procesar recibidas por el componente como argumento.
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // Función validadora personalizada
    // todas las props se pasan como 2do argumento en 3.4+
    propG: {
      validator(value, props) {
        // El valor debe coincidir con uno de estos strings
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Función con un valor predeterminado
    propH: {
      type: Function,
      // A diferencia del valor predeterminado de objeto o array, esta no es
      // una función de fábrica - es una función para servir como valor predeterminado
      default() {
        return 'Función predeterminada'
      }
    }
  }
}
```

</div>

Detalles adicionales:

-   Todas las `props` son opcionales por defecto, a menos que se especifique `required: true`.

-   Una `prop` opcional ausente que no sea `Boolean` tendrá un valor `undefined`.

-   Las `props` `Boolean` ausentes se convertirán a `false`. Puedes cambiar esto configurando un `default` para ella, por ejemplo: `default: undefined` para que se comporte como una `prop` no booleana.

-   Si se especifica un valor `default`, se utilizará si el valor de la `prop` resuelto es `undefined`; esto incluye tanto cuando la `prop` está ausente como cuando se pasa un valor `undefined` explícito.

Cuando falla la validación de una `prop`, Vue producirá una advertencia en la consola (si se utiliza la versión de desarrollo).

<div class="composition-api">

Si se utilizan [declaraciones de props basadas en tipos](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />, Vue hará todo lo posible para compilar las anotaciones de tipo en declaraciones de `prop` equivalentes en tiempo de ejecución. Por ejemplo, `defineProps<{ msg: string }>` se compilará en `{ msg: { type: String, required: true }}`.

</div>
<div class="options-api">

::: tip Nota
Ten en cuenta que las `props` se validan **antes** de que se cree una instancia de componente, por lo que las propiedades de instancia (por ejemplo, `data`, `computed`, etc.) no estarán disponibles dentro de las funciones `default` o `validator`.
:::

</div>

### Verificaciones de Tipo en Tiempo de Ejecución {#runtime-type-checks}

El `type` puede ser uno de los siguientes constructores nativos:

-   `String`
-   `Number`
-   `Boolean`
-   `Array`
-   `Object`
-   `Date`
-   `Function`
-   `Symbol`
-   `Error`

Además, `type` también puede ser una clase o función constructora personalizada y la aserción se realizará con una verificación `instanceof`. Por ejemplo, dada la siguiente clase:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Podrías usarla como el `type` de una `prop`:

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue usará `instanceof Person` para validar si el valor de la `prop` `author` es realmente una instancia de la clase `Person`.

### Tipo Nulo {#nullable-type}

Si el tipo es requerido pero puede ser nulo, puedes usar la sintaxis de array que incluye `null`:

<div class="composition-api">

```js
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    id: {
      type: [String, null],
      required: true
    }
  }
}
```

</div>

Ten en cuenta que si `type` es solo `null` sin usar la sintaxis de array, permitirá cualquier tipo.

## Conversión Booleana {#boolean-casting}

Las `props` con tipo `Boolean` tienen reglas de conversión especiales para imitar el comportamiento de los atributos booleanos nativos. Dado un `<MyComponent>` con la siguiente declaración:

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

El componente puede usarse así:

```vue-html
<!-- equivalente a pasar :disabled="true" -->
<MyComponent disabled />

<!-- equivalente a pasar :disabled="false" -->
<MyComponent />
```

Cuando una `prop` se declara para permitir múltiples tipos, también se aplicarán las reglas de conversión para `Boolean`. Sin embargo, hay un caso límite cuando tanto `String` como `Boolean` están permitidos: la regla de conversión booleana solo se aplica si `Boolean` aparece antes de `String`:

<div class="composition-api">

```js
// disabled se convertirá a true
defineProps({
  disabled: [Boolean, Number]
})

// disabled se convertirá a true
defineProps({
  disabled: [Boolean, String]
})

// disabled se convertirá a true
defineProps({
  disabled: [Number, Boolean]
})

// disabled se analizará como un string vacío (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled se convertirá a true
export default {
  props: {
    disabled: [Boolean, Number]
  }
}

// disabled se convertirá a true
export default {
  props: {
    disabled: [Boolean, String]
  }
}

// disabled se convertirá a true
export default {
  props: {
    disabled: [Number, Boolean]
  }
}

// disabled se analizará como un string vacío (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>