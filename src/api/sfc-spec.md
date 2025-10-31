# Especificación de la Sintaxis SFC {#sfc-syntax-specification}

## Visión General {#overview}

Un Componente de Archivo Único (SFC) de Vue, que usa convencionalmente la extensión de archivo `*.vue`, es un formato de archivo personalizado que utiliza una sintaxis similar a HTML para describir un componente Vue. Un SFC de Vue es sintácticamente compatible con HTML.

Cada archivo `*.vue` consta de tres tipos de bloques de lenguaje de nivel superior: `<template>`, `<script>` y `<style>`, y opcionalmente bloques personalizados adicionales:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
```

## Bloques de Lenguaje {#language-blocks}

### `<template>` {#template}

- Cada archivo `*.vue` puede contener como máximo un bloque `<template>` de nivel superior.

- El contenido se extraerá y se pasará a `@vue/compiler-dom`, se precompilará en funciones de renderizado de JavaScript y se adjuntará al componente exportado como su opción `render`.

### `<script>` {#script}

- Cada archivo `*.vue` puede contener como máximo un bloque `<script>` (excluyendo [`<script setup>`](/api/sfc-script-setup)).

- El script se ejecuta como un Módulo ES.

- La **exportación por defecto** debe ser un objeto de opciones de componente de Vue, ya sea como un objeto plano o como el valor de retorno de [defineComponent](/api/general#definecomponent).

### `<script setup>` {#script-setup}

- Cada archivo `*.vue` puede contener como máximo un bloque `<script setup>` (excluyendo un `<script>` normal).

- El script se preprocesa y se utiliza como la función `setup()` del componente, lo que significa que se ejecutará **para cada instancia del componente**. Los enlaces de nivel superior en `<script setup>` se exponen automáticamente a la plantilla. Para más detalles, consulta la [documentación dedicada sobre `<script setup>`](/api/sfc-script-setup).

### `<style>` {#style}

- Un único archivo `*.vue` puede contener múltiples etiquetas `<style>`.

- Una etiqueta `<style>` puede tener atributos `scoped` o `module` (consulta [Características de Estilo SFC](/api/sfc-css-features) para más detalles) para ayudar a encapsular los estilos al componente actual. Múltiples etiquetas `<style>` con diferentes modos de encapsulación pueden mezclarse en el mismo componente.

### Bloques Personalizados {#custom-blocks}

Se pueden incluir bloques personalizados adicionales en un archivo `*.vue` para cualquier necesidad específica del proyecto, por ejemplo, un bloque `<docs>`. Algunos ejemplos reales de bloques personalizados incluyen:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#i18n-custom-block)

El manejo de los Bloques Personalizados dependerá de las herramientas; si deseas construir tus propias integraciones de bloques personalizados, consulta la [sección de herramientas de integraciones de bloques personalizados SFC](/guide/scaling-up/tooling#sfc-custom-block-integrations) para más detalles.

## Inferencia Automática de Nombres {#automatic-name-inference}

Un SFC infiere automáticamente el nombre del componente a partir de su **nombre de archivo** en los siguientes casos:

- Formato de advertencia de desarrollo
- Inspección en DevTools
- Autorreferencia recursiva, por ejemplo, un archivo llamado `FooBar.vue` puede referirse a sí mismo como `<FooBar/>` en su plantilla. Esto tiene menor prioridad que los componentes registrados/importados explícitamente.

## Preprocesadores {#pre-processors}

Los bloques pueden declarar lenguajes de preprocesador utilizando el atributo `lang`. El caso más común es usar TypeScript para el bloque `<script>`:

```vue-html
<script lang="ts">
  // use TypeScript
</script>
```

`lang` puede aplicarse a cualquier bloque; por ejemplo, podemos usar `<style>` con [Sass](https://sass-lang.com/) y `<template>` con [Pug](https://pugjs.org/api/getting-started.html):

```vue-html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Ten en cuenta que la integración con varios preprocesadores puede variar según la cadena de herramientas. Consulta la documentación respectiva para ver ejemplos:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importaciones `src` {#src-imports}

Si prefieres dividir tus componentes `*.vue` en múltiples archivos, puedes usar el atributo `src` para importar un archivo externo para un bloque de lenguaje:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Ten en cuenta que las importaciones `src` siguen las mismas reglas de resolución de rutas que las solicitudes de módulos de webpack, lo que significa:

- Las rutas relativas deben comenzar con `./`
- Puedes importar recursos de dependencias npm:

```vue
<!-- import a file from the installed "todomvc-app-css" npm package -->
<style src="todomvc-app-css/index.css" />
```

Las importaciones `src` también funcionan con bloques personalizados, por ejemplo:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

:::warning Nota
Al usar alias en `src`, no empieces con `~`, cualquier cosa después de este se interpreta como una solicitud de módulo. Esto significa que puedes hacer referencia a recursos dentro de los módulos de `node`:

```vue
<img src="~some-npm-package/foo.png">
```

:::

## Comentarios {#comments}

Dentro de cada bloque, debes usar la sintaxis de comentarios del lenguaje que se esté utilizando (HTML, CSS, JavaScript, Pug, etc.). Para comentarios de nivel superior, usa la sintaxis de comentarios de HTML: `<!-- comment contents here -->`
