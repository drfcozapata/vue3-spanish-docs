---
outline: deep
---

# Usando Vue con TypeScript {#using-vue-with-typescript}

Un sistema de tipos como TypeScript puede detectar muchos errores comunes mediante análisis estático en tiempo de construcción. Esto reduce la probabilidad de errores en tiempo de ejecución en producción, y también nos permite refactorizar código con mayor confianza en aplicaciones de gran escala. TypeScript también mejora la ergonomía del desarrollador mediante la auto-completación basada en tipos en los IDEs.

Vue está escrito en TypeScript y proporciona soporte de primera clase para TypeScript. Todos los paquetes oficiales de Vue vienen con declaraciones de tipo incluidas que deberían funcionar de inmediato.

## Configuración del Proyecto {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), la herramienta oficial de scaffolding de proyectos, ofrece las opciones para configurar un proyecto Vue impulsado por [Vite](https://vitejs.dev/) y listo para TypeScript.

### Resumen {#overview}

Con una configuración basada en Vite, el servidor de desarrollo y el empaquetador son solo de transpilación y no realizan ninguna verificación de tipos. Esto asegura que el servidor de desarrollo de Vite se mantenga increíblemente rápido incluso cuando se usa TypeScript.

- Durante el desarrollo, recomendamos depender de una buena [configuración de IDE](#ide-support) para obtener retroalimentación instantánea sobre errores de tipo.

- Si usas SFCs, utiliza la utilidad [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) para la verificación de tipos en línea de comandos y la generación de declaraciones de tipo. `vue-tsc` es un _wrapper_ para `tsc`, la interfaz de línea de comandos propia de TypeScript. Funciona en gran medida igual que `tsc` excepto que soporta SFCs de Vue además de archivos TypeScript. Puedes ejecutar `vue-tsc` en modo de observación (watch mode) en paralelo con el servidor de desarrollo de Vite, o usar un plugin de Vite como [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) que ejecuta las verificaciones en un hilo de trabajo (worker thread) separado.

- Vue CLI también proporciona soporte para TypeScript, pero ya no se recomienda. Consulta las [notas a continuación](#note-on-vue-cli-and-ts-loader).

### Soporte para IDE {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VS Code) es fuertemente recomendado por su excelente soporte inmediato para TypeScript.

  - [Vue - Oficial](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (anteriormente Volar) es la extensión oficial de VS Code que proporciona soporte para TypeScript dentro de los SFCs de Vue, junto con muchas otras excelentes características.

  :::tip
  La extensión Vue - Oficial reemplaza a [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), nuestra extensión oficial anterior de VS Code para Vue 2. Si tienes Vetur instalado actualmente, asegúrate de deshabilitarlo en proyectos de Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) también proporciona soporte inmediato para TypeScript y Vue. Otros IDEs de JetBrains también los soportan, ya sea de inmediato o mediante [un plugin gratuito](https://plugins.jetbrains.com/plugin/9442-vue-js). A partir de la versión 2023.2, WebStorm y el plugin de Vue vienen con soporte integrado para el Vue Language Server. Puedes configurar el servicio de Vue para usar la integración de Volar en todas las versiones de TypeScript, en Ajustes > Lenguajes y Frameworks > TypeScript > Vue. Por defecto, Volar se utilizará para las versiones de TypeScript 5.0 y superiores.

### Configuración de `tsconfig.json` {#configuring-tsconfig-json}

Los proyectos configurados mediante `create-vue` incluyen un `tsconfig.json` preconfigurado. La configuración base se abstrae en el paquete [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Dentro del proyecto, usamos [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) para asegurar tipos correctos para el código que se ejecuta en diferentes entornos (por ejemplo, el código de la aplicación y el código de prueba deberían tener diferentes variables globales).

Al configurar `tsconfig.json` manualmente, algunas opciones notables incluyen:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) se establece en `true` porque Vite usa [esbuild](https://esbuild.github.io/) para transpilación de TypeScript y está sujeto a limitaciones de transpilación de archivo único. [`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) es [un superconjunto de `isolatedModules`](https://github.com/microsoft/TypeScript/issues/53601) y también es una buena opción, es lo que usa [`@vue/tsconfig`](https://github.com/vuejs/tsconfig).

- Si estás usando la Options API, necesitas establecer [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) en `true` (o al menos habilitar [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), que es parte del flag `strict`) para aprovechar la verificación de tipos de `this` en las opciones del componente. De lo contrario, `this` será tratado como `any`.

- Si has configurado alias de resolutor en tu herramienta de construcción, por ejemplo, el alias `@/*` configurado por defecto en un proyecto `create-vue`, también necesitas configurarlo para TypeScript a través de [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

- Si tienes la intención de usar TSX con Vue, establece [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) en `"preserve"`, y establece [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) en `"vue"`.

Ver también:

- [Documentación oficial de opciones del compilador de TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Advertencias de compilación de TypeScript de esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Nota sobre Vue CLI y `ts-loader` {#note-on-vue-cli-and-ts-loader}

En configuraciones basadas en webpack, como Vue CLI, es común realizar la verificación de tipos como parte de la pipeline de transformación de módulos, por ejemplo con `ts-loader`. Sin embargo, esta no es una solución limpia porque el sistema de tipos necesita conocimiento de todo el grafo de módulos para realizar las verificaciones de tipos. El paso de transformación de un módulo individual simplemente no es el lugar adecuado para esta tarea. Esto lleva a los siguientes problemas:

- `ts-loader` solo puede verificar tipos en el código post-transformación. Esto no se alinea con los errores que vemos en los IDEs o de `vue-tsc`, los cuales se mapean directamente al código fuente.

- La verificación de tipos puede ser lenta. Cuando se realiza en el mismo hilo / proceso con transformaciones de código, afecta significativamente la velocidad de construcción de toda la aplicación.

- Ya tenemos la verificación de tipos ejecutándose directamente en nuestro IDE en un proceso separado, por lo que el costo de ralentizar la experiencia de desarrollo simplemente no es un buen intercambio.

Si actualmente estás usando Vue 3 + TypeScript a través de Vue CLI, recomendamos encarecidamente migrar a Vite. También estamos trabajando en opciones de CLI para habilitar el soporte de TS solo para transpilación, de modo que puedas cambiar a `vue-tsc` para la verificación de tipos.

## Notas de Uso General {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Para que TypeScript infiera correctamente los tipos dentro de las opciones del componente, necesitamos definir componentes con [`defineComponent()`](/api/general#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // type: string | undefined
    this.msg // type: string
    this.count // type: number
  }
})
```

`defineComponent()` también soporta la inferencia de las `props` pasadas a `setup()` cuando se usa la Composition API sin `<script setup>`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // type inference enabled
  props: {
    message: String
  },
  setup(props) {
    props.message // type: string | undefined
  }
})
```

Ver también:

- [Nota sobre el Tree-shaking de webpack](/api/general#note-on-webpack-treeshaking)
- [pruebas de tipo para `defineComponent`](https://github.com/vuejs/core/blob/main/packages-private/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` también habilita la inferencia de tipos para componentes definidos en JavaScript puro.
:::

### Uso en Componentes de Archivo Único {#usage-in-single-file-components}

Para usar TypeScript en SFCs, añade el atributo `lang="ts"` a las etiquetas `<script>`. Cuando `lang="ts"` está presente, todas las expresiones de la plantilla también disfrutan de una verificación de tipos más estricta.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- type checking and auto-completion enabled -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` también se puede usar con `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript enabled
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- type checking and auto-completion enabled -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript en Plantillas {#typescript-in-templates}

La etiqueta `<template>` también soporta TypeScript en expresiones de enlace (binding expressions) cuando se usa `<script lang="ts">` o `<script setup lang="ts">`. Esto es útil en casos donde necesitas realizar una conversión de tipos (type casting) en expresiones de la plantilla.

Aquí tienes un ejemplo forzado:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- error because x could be a string -->
  {{ x.toFixed(2) }}
</template>
```

Esto se puede solucionar con una conversión de tipos (type cast) en línea:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Si utilizas Vue CLI o una configuración basada en webpack, TypeScript en las expresiones de la plantilla requiere `vue-loader@^16.8.0`.
:::

### Uso con TSX {#usage-with-tsx}

Vue también soporta la creación de componentes con JSX / TSX. Los detalles se cubren en la guía [Función de Renderizado y JSX](/guide/extras/render-function.html#jsx-tsx).

## Componentes Genéricos {#generic-components}

Los componentes genéricos se soportan en dos casos:

- En SFCs: [`<script setup>` con el atributo `generic`](/api/sfc-script-setup.html#generics)
- Componentes de función de renderizado / JSX: [la firma de función de `defineComponent()`](/api/general.html#function-signature)

## Recetas Específicas de la API {#api-specific-recipes}

- [TS con Composition API](./composition-api)
- [TS con Options API](./options-api)
