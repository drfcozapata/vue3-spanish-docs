# Características CSS de SFC {#sfc-css-features}

## CSS con ámbito {#scoped-css}

Cuando una etiqueta `<style>` tiene el atributo `scoped`, su CSS se aplicará solo a los elementos del componente actual. Esto es similar a la encapsulación de estilos que se encuentra en Shadow DOM. Viene con algunas advertencias, pero no requiere ningún polyfill. Se logra usando PostCSS para transformar lo siguiente:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

En lo siguiente:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### Elementos raíz del componente hijo {#child-component-root-elements}

Con `scoped`, los estilos del componente padre no se filtrarán a los componentes hijo. Sin embargo, el nodo raíz de un componente hijo se verá afectado tanto por el CSS con ámbito del padre como por el CSS con ámbito del hijo. Esto es intencional para que el padre pueda estilizar el elemento raíz hijo con fines de diseño (layout).

### Selectores profundos {#deep-selectors}

Si deseas que un selector en estilos `scoped` sea "profundo", es decir, que afecte a los componentes hijo, puedes usar la pseudo-clase `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

Lo anterior se compilará en:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
El contenido del DOM creado con `v-html` no se ve afectado por los estilos con ámbito, pero aún puedes estilizarlos usando selectores profundos.
:::

### Selectores de slot {#slotted-selectors}

Por defecto, los estilos con ámbito no afectan al contenido renderizado por `<slot/>`, ya que se consideran propiedad del componente padre que los pasa. Para apuntar explícitamente al contenido del slot, usa la pseudo-clase `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Selectores globales {#global-selectors}

Si deseas que solo una regla se aplique globalmente, puedes usar la pseudo-clase `:global` en lugar de crear otra etiqueta `<style>` (ver a continuación):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Mezcla de estilos locales y globales {#mixing-local-and-global-styles}

También puedes incluir estilos con ámbito y sin ámbito en el mismo componente:

```vue
<style>
/* global styles */
</style>

<style scoped>
/* local styles */
</style>
```

### Consejos de estilos con ámbito {#scoped-style-tips}

- **Los estilos con ámbito no eliminan la necesidad de clases**. Debido a la forma en que los navegadores renderizan varios selectores CSS, `p { color: red }` será mucho más lento cuando tenga ámbito (es decir, cuando se combine con un selector de atributo). Si usas clases o `id`s en su lugar, como en `.example { color: red }`, entonces eliminas virtualmente ese impacto en el rendimiento.

- **¡Ten cuidado con los selectores descendientes en componentes recursivos!** Para una regla CSS con el selector `.a .b`, si el elemento que coincide con `.a` contiene un componente hijo recursivo, entonces todos los `.b` en ese componente hijo serán coincidentes por la regla.

## Módulos CSS {#css-modules}

Una etiqueta `<style module>` se compila como [Módulos CSS](https://github.com/css-modules/css-modules) y expone las clases CSS resultantes al componente como un objeto bajo la clave de `$style`:

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

Las clases resultantes se codifican con hash para evitar colisiones, logrando el mismo efecto de ámbito del CSS solo al componente actual.

Consulta la [especificación de Módulos CSS](https://github.com/css-modules/css-modules) para más detalles, como [excepciones globales](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#exceptions) y [composición](https://github.com/css-modules/css-modules/blob/master/docs/composition.md#composition).

### Nombre de inyección personalizado {#custom-inject-name}

Puedes personalizar la clave de la propiedad del objeto de clases inyectadas dándole un valor al atributo `module`:

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Uso con la Composition API {#usage-with-composition-api}

Las clases inyectadas se pueden acceder en `setup()` y `<script setup>` a través de la API `useCssModule`. Para los bloques `<style module>` con nombres de inyección personalizados, `useCssModule` acepta el valor del atributo `module` coincidente como primer argumento:

```js
import { useCssModule } from 'vue'

// inside setup() scope...
// default, returns classes for <style module>
useCssModule()

// named, returns classes for <style module="classes">
useCssModule('classes')
```

- **Ejemplo**

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const classes = useCssModule()
</script>

<template>
  <p :class="classes.red">red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## `v-bind()` en CSS {#v-bind-in-css}

Las etiquetas `<style>` de SFC admiten la vinculación de valores CSS al estado dinámico del componente utilizando la función CSS `v-bind`:

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

La sintaxis funciona con [`<script setup>`](./sfc-script-setup), y admite expresiones de JavaScript (deben ir entre comillas):

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

El valor real se compilará en una propiedad CSS personalizada con hash, por lo que el CSS sigue siendo estático. La propiedad personalizada se aplicará al elemento raíz del componente mediante estilos en línea y se actualizará reactivamente si el valor de origen cambia.