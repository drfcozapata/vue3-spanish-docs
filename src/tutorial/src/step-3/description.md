# Enlaces de Atributos {#attribute-bindings}

En Vue, la sintaxis de bigotes solo se usa para la interpolación de texto. Para vincular un atributo a un valor dinámico, usamos la directiva `v-bind`:

```vue-html
<div v-bind:id="dynamicId"></div>
```

Una **directiva** es un atributo especial que comienza con el prefijo `v-`. Son parte de la sintaxis de plantillas de Vue. Similar a las interpolaciones de texto, los valores de las directivas son expresiones de JavaScript que tienen acceso al estado del componente. Todos los detalles de `v-bind` y la sintaxis de directivas se discuten en <a target="_blank" href="/guide/essentials/template-syntax.html">Guía - Sintaxis de Plantillas</a>.

La parte después de los dos puntos (`:id`) es el "argumento" de la directiva. Aquí, el atributo `id` del elemento se sincronizará con la propiedad `dynamicId` del estado del componente.

Debido a que `v-bind` se usa con tanta frecuencia, tiene una sintaxis abreviada dedicada:

```vue-html
<div :id="dynamicId"></div>
```

Ahora, intenta añadir un enlace dinámico de `class` al `<h1>`, usando la <span class="options-api">propiedad de datos</span><span class="composition-api">ref</span> `titleClass` como su valor. Si se vincula correctamente, el texto debería ponerse rojo.