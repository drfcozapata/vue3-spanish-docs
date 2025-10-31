# Componentes {#components}

Hasta ahora, solo hemos estado trabajando con un único componente. Las aplicaciones Vue reales se crean típicamente con componentes anidados.

Un componente padre puede renderizar otro componente en su plantilla como un componente hijo. Para usar un componente hijo, primero necesitamos importarlo:

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

También necesitamos registrar el componente usando la opción `components`. Aquí estamos usando la abreviatura de propiedad de objeto para registrar el componente `ChildComp` bajo la clave `ChildComp`.

</div>
</div>

<div class="sfc">

Luego, podemos usar el componente en la plantilla como:

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

También necesitamos registrar el componente usando la opción `components`. Aquí estamos usando la abreviatura de propiedad de objeto para registrar el componente `ChildComp` bajo la clave `ChildComp`.

Debido a que estamos escribiendo la plantilla en el DOM, estará sujeta a las reglas de análisis del navegador, que no distinguen entre mayúsculas y minúsculas para los nombres de etiquetas. Por lo tanto, necesitamos usar el nombre en `kebab-case` para referenciar el componente hijo:

```vue-html
<child-comp></child-comp>
```

</div>

Ahora inténtalo tú mismo: importa el componente hijo y renderízalo en la plantilla.