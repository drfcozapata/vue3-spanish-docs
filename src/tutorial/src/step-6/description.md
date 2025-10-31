# Renderizado Condicional {#conditional-rendering}

Podemos usar la directiva `v-if` para renderizar condicionalmente un elemento:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

Este `<h1>` se renderizará solo si el valor de `awesome` es [verdadero](https://developer.mozilla.org/en-US/docs/Glossary/Truthy). Si `awesome` cambia a un valor [falso](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), será eliminado del DOM.

También podemos usar `v-else` y `v-else-if` para denotar otras ramas de la condición:

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

Actualmente, la demo está mostrando ambos `<h1>`s al mismo tiempo, y el botón no hace nada. Intenta añadir las directivas `v-if` y `v-else` a ellos, e implementa el método `toggle()` para que podamos usar el botón para alternar entre ellos.

Más detalles sobre `v-if`: <a target="_blank" href="/guide/essentials/conditional.html">Guía - Renderizado Condicional</a>