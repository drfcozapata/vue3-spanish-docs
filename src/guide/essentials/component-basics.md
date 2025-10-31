# Fundamentos de Componentes {#components-basics}

<ScrimbaLink href="https://scrimba.com/links/vue-component-basics" title="Lección Gratuita de Fundamentos de Componentes de Vue.js" type="scrimba">
  Ver una lección interactiva en video en Scrimba
</ScrimbaLink>

Los componentes nos permiten dividir la interfaz de usuario en piezas independientes y reutilizables, y pensar en cada pieza de forma aislada. Es común que una aplicación se organice en un árbol de componentes anidados:

![Component Tree](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Esto es muy similar a cómo anidamos los elementos HTML nativos, pero Vue implementa su propio modelo de componentes que nos permite encapsular contenido y lógica personalizada en cada componente. Vue también funciona bien con los Web Components nativos. Si tienes curiosidad sobre la relación entre los Componentes de Vue y los Web Components nativos, [lee más aquí](/guide/extras/web-components).

## Definición de un Componente {#defining-a-component}

Cuando se utiliza un paso de compilación, normalmente definimos cada componente de Vue en un archivo dedicado utilizando la extensión `.vue` - conocido como un [Componente de Archivo Único](/guide/scaling-up/sfc) (SFC, por sus siglas en inglés):

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

</div>

Cuando no se utiliza un paso de compilación, un componente de Vue puede definirse como un objeto JavaScript plano que contiene opciones específicas de Vue:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // Can also target an in-DOM template:
  // template: '#my-template-element'
}
```

</div>

Aquí la plantilla se incluye en línea como una cadena de JavaScript, que Vue compilará sobre la marcha. También puedes usar un selector de ID que apunte a un elemento (normalmente elementos `<template>` nativos); Vue utilizará su contenido como fuente de la plantilla.

El ejemplo anterior define un solo componente y lo exporta como la exportación por defecto de un archivo `.js`, pero puedes usar exportaciones con nombre para exportar múltiples componentes desde el mismo archivo.

## Uso de un Componente {#using-a-component}

:::tip
Utilizaremos la sintaxis SFC para el resto de esta guía; los conceptos relacionados con los componentes son los mismos independientemente de si estás utilizando un paso de compilación o no. La sección de [Ejemplos](/examples/) muestra el uso de componentes en ambos escenarios.
:::

Para usar un componente hijo, necesitamos importarlo en el componente padre. Suponiendo que colocamos nuestro componente contador dentro de un archivo llamado `ButtonCounter.vue`, el componente se expondrá como la exportación por defecto del archivo:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Para exponer el componente importado a nuestra plantilla, necesitamos [registrarlo](/guide/components/registration) con la opción `components`. El componente estará entonces disponible como una etiqueta usando la clave bajo la cual está registrado.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

Con `<script setup>`, los componentes importados se hacen disponibles automáticamente en la plantilla.

</div>

También es posible registrar globalmente un componente, haciéndolo disponible para todos los componentes de una aplicación dada sin necesidad de importarlo. Los pros y los contras del registro global frente al local se discuten en la sección dedicada a [Registro de Componentes](/guide/components/registration).

Los componentes pueden reutilizarse tantas veces como quieras:

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Observa que al hacer clic en los botones, cada uno mantiene su propio `count` separado. Esto se debe a que cada vez que utilizas un componente, se crea una nueva **instancia** de este.

En los SFC, se recomienda usar nombres de etiqueta `PascalCase` para los componentes hijos para diferenciarlos de los elementos HTML nativos. Aunque los nombres de etiqueta HTML nativos no distinguen entre mayúsculas y minúsculas, Vue SFC es un formato compilado, por lo que podemos usar nombres de etiqueta que sí distinguen entre mayúsculas y minúsculas. También podemos usar `/>` para cerrar una etiqueta.

Si estás creando tus plantillas directamente en el DOM (por ejemplo, como contenido de un elemento `<template>` nativo), la plantilla estará sujeta al comportamiento de análisis HTML nativo del navegador. En tales casos, deberás usar `kebab-case` y etiquetas de cierre explícitas para los componentes:

```vue-html
<!-- if this template is written in the DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Consulta [consideraciones sobre el análisis de plantillas en el DOM](#in-dom-template-parsing-caveats) para más detalles.

## Pasando `props` {#passing-props}

Si estamos construyendo un blog, es probable que necesitemos un componente que represente una entrada de blog. Queremos que todas las entradas de blog compartan el mismo diseño visual, pero con contenido diferente. Un componente así no será útil a menos que puedas pasarle datos, como el `title` y el contenido de la entrada específica que queremos mostrar. Ahí es donde entran las `props`.

Las `props` son atributos personalizados que puedes registrar en un componente. Para pasar un `title` a nuestro componente de entrada de blog, debemos declararlo en la lista de `props` que este componente acepta, utilizando la <span class="options-api">opción [`props`](/api/options-state#props)</span><span class="composition-api">macro [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue [BlogPost.vue]
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Cuando se pasa un valor a un atributo de `prop`, este se convierte en una propiedad de esa instancia de componente. El valor de esa propiedad es accesible dentro de la plantilla y en el contexto `this` del componente, al igual que cualquier otra propiedad del componente.

</div>
<div class="composition-api">

```vue [BlogPost.vue]
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` es una macro en tiempo de compilación que solo está disponible dentro de `<script setup>` y no necesita ser importada explícitamente. Las `props` declaradas se exponen automáticamente a la plantilla. `defineProps` también devuelve un objeto que contiene todas las `props` pasadas al componente, de modo que podemos acceder a ellas en JavaScript si es necesario:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Ver también: [Tipado de `props` de Componentes](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Si no estás usando `<script setup>`, las `props` deben declararse utilizando la opción `props`, y el objeto `props` se pasará a `setup()` como primer argumento:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Un componente puede tener tantas `props` como desees y, por defecto, cualquier valor puede pasarse a cualquier `prop`.

Una vez que una `prop` está registrada, puedes pasarle datos como un atributo personalizado, así:

```vue-html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

En una aplicación típica, sin embargo, es probable que tengas un array de entradas en tu componente padre:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])
```

</div>

Luego querrás renderizar un componente para cada uno, usando `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Observa cómo se utiliza la [sintaxis de `v-bind`](/api/built-in-directives#v-bind) (`:title="post.title"`) para pasar valores de `prop` dinámicos. Esto es especialmente útil cuando no conoces el contenido exacto que vas a renderizar de antemano.

Eso es todo lo que necesitas saber sobre las `props` por ahora, pero una vez que hayas terminado de leer esta página y te sientas cómodo con su contenido, te recomendamos volver más tarde para leer la guía completa sobre [Props](/guide/components/props).

## Escuchando Eventos {#listening-to-events}

A medida que desarrollamos nuestro componente `<BlogPost>`, algunas características pueden requerir comunicarse de vuelta al padre. Por ejemplo, podríamos decidir incluir una característica de accesibilidad para agrandar el texto de las entradas de blog, mientras que el resto de la página permanece en su tamaño por defecto.

En el componente padre, podemos soportar esta característica añadiendo una <span class="options-api">propiedad de datos</span><span class="composition-api">`ref`</span> `postFontSize`:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Que puede usarse en la plantilla para controlar el tamaño de la fuente de todas las entradas de blog:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Ahora agreguemos un botón a la plantilla del componente `<BlogPost>`:

```vue{5} [BlogPost.vue]
<!-- omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

El botón no hace nada todavía; queremos que al hacer clic en el botón se comunique al padre que debe agrandar el texto de todas las entradas. Para resolver este problema, los componentes proporcionan un sistema de eventos personalizado. El padre puede elegir escuchar cualquier evento en la instancia del componente hijo con `v-on` o `@`, tal como lo haríamos con un evento DOM nativo:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Entonces el componente hijo puede `emitir` un evento sobre sí mismo llamando al [método incorporado **`$emit`**](/api/component-instance#emit), pasando el nombre del evento:

```vue{5} [BlogPost.vue]
<!-- omitting <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

Gracias al oyente `@enlarge-text="postFontSize += 0.1"`, el padre recibirá el evento y actualizará el valor de `postFontSize`.

<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Opcionalmente, podemos declarar los eventos emitidos utilizando la <span class="options-api">opción [`emits`](/api/options-state#emits)</span><span class="composition-api">macro [`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{4} [BlogPost.vue]
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{3} [BlogPost.vue]
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

Esto documenta todos los eventos que un componente `emite` y opcionalmente los [valida](/guide/components/events#events-validation). También permite a Vue evitar aplicarlos implícitamente como oyentes nativos al elemento raíz del componente hijo.

<div class="composition-api">

Similar a `defineProps`, `defineEmits` solo se puede usar en `<script setup>` y no necesita ser importada. Devuelve una función `emit` que es equivalente al método `$emit`. Puede usarse para `emitir` eventos en la sección `<script setup>` de un componente, donde `$emit` no es directamente accesible:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Ver también: [Tipado de `emits` de Componentes](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Si no estás usando `<script setup>`, puedes declarar los eventos emitidos utilizando la opción `emits`. Puedes acceder a la función `emit` como una propiedad del contexto de `setup` (pasada a `setup()` como segundo argumento):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

Eso es todo lo que necesitas saber sobre los eventos de componentes personalizados por ahora, pero una vez que hayas terminado de leer esta página y te sientas cómodo con su contenido, te recomendamos volver más tarde para leer la guía completa sobre [Eventos Personalizados](/guide/components/events).

## Distribución de Contenido con `slots` {#content-distribution-with-slots}

Al igual que con los elementos HTML, a menudo es útil poder pasar contenido a un componente, así:

```vue-html
<AlertBox>
  Something bad happened.
</AlertBox>
```

Lo que podría renderizar algo como:

:::danger Esto es un Error para Fines de Demostración
Something bad happened.
:::

Esto se puede lograr utilizando el elemento `<slot>` personalizado de Vue:

```vue{4} [AlertBox.vue]
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Como verás arriba, usamos el `<slot>` como un marcador de posición donde queremos que vaya el contenido, ¡y eso es todo! ¡Hemos terminado!

<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

Eso es todo lo que necesitas saber sobre los `slots` por ahora, pero una vez que hayas terminado de leer esta página y te sientas cómodo con su contenido, te recomendamos volver más tarde para leer la guía completa sobre [Slots](/guide/components/slots).

## Componentes Dinámicos {#dynamic-components}

A veces, es útil cambiar dinámicamente entre componentes, como en una interfaz de pestañas:

<div class="options-api">

[Abre el ejemplo en el Playground](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Abre el ejemplo en el Playground](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

Lo anterior es posible gracias al elemento `<component>` de Vue con el atributo especial `is`:

<div class="options-api">

```vue-html
<!-- Component changes when currentTab changes -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- Component changes when currentTab changes -->
<component :is="tabs[currentTab]"></component>
```

</div>

En el ejemplo anterior, el valor pasado a `:is` puede contener cualquiera de los siguientes:

- la cadena de nombre de un componente registrado, O
- el objeto de componente importado real

También puedes usar el atributo `is` para crear elementos HTML regulares.

Al cambiar entre múltiples componentes con `<component :is="...">`, un componente será desmontado cuando se cambie de él. Podemos forzar a que los componentes inactivos permanezcan "vivos" con el [componente incorporado `<KeepAlive>`](/guide/built-ins/keep-alive).

## Consideraciones sobre el Análisis de Plantillas en el DOM {#in-dom-template-parsing-caveats}

Si estás escribiendo tus plantillas de Vue directamente en el DOM, Vue tendrá que recuperar la cadena de la plantilla del DOM. Esto conlleva algunas consideraciones debido al comportamiento nativo de análisis HTML de los navegadores.

:::tip
Cabe señalar que las limitaciones que se discuten a continuación solo se aplican si estás escribiendo tus plantillas directamente en el DOM. NO se aplican si estás utilizando plantillas de cadena de las siguientes fuentes:

- Componentes de Archivo Único
- Cadenas de plantilla en línea (por ejemplo, `template: '...'`)
- `<script type="text/x-template">`
  :::

### Insensibilidad a Mayúsculas y Minúsculas {#case-insensitivity}

Las etiquetas HTML y los nombres de atributos no distinguen entre mayúsculas y minúsculas, por lo que los navegadores interpretarán cualquier carácter en mayúscula como minúscula. Esto significa que cuando uses plantillas en el DOM, los nombres de componentes en `PascalCase` y los nombres de `prop` en `camelCase` o los nombres de eventos `v-on` deberán usar sus equivalentes en `kebab-case` (delimitados por guiones):

```js
// camelCase in JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- kebab-case in HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Etiquetas de Cierre Automático {#self-closing-tags}

Hemos estado utilizando etiquetas de cierre automático para componentes en ejemplos de código anteriores:

```vue-html
<MyComponent />
```

Esto se debe a que el analizador de plantillas de Vue respeta `/>` como una indicación para finalizar cualquier etiqueta, independientemente de su tipo.

Sin embargo, en las plantillas en el DOM, siempre debemos incluir etiquetas de cierre explícitas:

```vue-html
<my-component></my-component>
```

Esto se debe a que la especificación HTML solo permite que [unos pocos elementos específicos](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) omitan las etiquetas de cierre, siendo los más comunes `<input>` e `<img>`. Para todos los demás elementos, si omites la etiqueta de cierre, el analizador HTML nativo pensará que nunca terminaste la etiqueta de apertura. Por ejemplo, el siguiente fragmento:

```vue-html
<my-component /> <!-- we intend to close the tag here... -->
<span>hello</span>
```

se analizará como:

```vue-html
<my-component>
  <span>hello</span>
</my-component> <!-- but the browser will close it here. -->
```

### Restricciones de Colocación de Elementos {#element-placement-restrictions}

Algunos elementos HTML, como `<ul>`, `<ol>`, `<table>` y `<select>`, tienen restricciones sobre qué elementos pueden aparecer dentro de ellos, y algunos elementos como `<li>`, `<tr>` y `<option>` solo pueden aparecer dentro de ciertos otros elementos.

Esto causará problemas al usar componentes con elementos que tienen tales restricciones. Por ejemplo:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

El componente personalizado `<blog-post-row>` se extraerá como contenido no válido, causando errores en la salida renderizada final. Podemos usar el [`atributo especial `is`](/api/built-in-special-attributes#is) como solución alternativa:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
Cuando se utiliza en elementos HTML nativos, el valor de `is` debe ir prefijado con `vue:` para ser interpretado como un componente de Vue. Esto es necesario para evitar confusiones con los [elementos personalizados incorporados](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) nativos.
:::

Eso es todo lo que necesitas saber sobre las consideraciones del análisis de plantillas en el DOM por ahora, y de hecho, el final de los _Fundamentos_ de Vue. ¡Felicidades! Aún hay más que aprender, pero primero, te recomendamos tomar un descanso para jugar con Vue por tu cuenta: construye algo divertido, o consulta algunos de los [Ejemplos](/examples/) si aún no lo has hecho.

Una vez que te sientas cómodo con los conocimientos que acabas de asimilar, continúa con la guía para aprender más a fondo sobre los componentes.
