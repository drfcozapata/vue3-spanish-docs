---
outline: deep
---

# Indicadores de Tiempo de Compilación {#compile-time-flags}

:::tip
Los indicadores de tiempo de compilación solo se aplican al usar la construcción `esm-bundler` de Vue (es decir, `vue/dist/vue.esm-bundler.js`).
:::

Al usar Vue con un paso de compilación, es posible configurar una serie de indicadores de tiempo de compilación para habilitar/deshabilitar ciertas características. El beneficio de usar indicadores de tiempo de compilación es que las características deshabilitadas de esta manera pueden eliminarse del paquete final mediante tree-shaking.

Vue funcionará incluso si estas indicadores no están configuradas explícitamente. Sin embargo, se recomienda configurarlos siempre para que las características relevantes puedan eliminarse correctamente cuando sea posible.

Consulta las [Guías de Configuración](#configuration-guides) sobre cómo configurarlos según tu herramienta de compilación.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **Por defecto:** `true`

  Habilita / deshabilita el soporte para la Options API. Deshabilitar esto resultará en paquetes más pequeños, pero puede afectar la compatibilidad con bibliotecas de terceros si dependen de la Options API.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **Por defecto:** `false`

  Habilita / deshabilita el soporte para devtools en compilaciones de producción. Esto resultará en más código incluido en el paquete, por lo que se recomienda habilitarlo solo para propósitos de depuración.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **Por defecto:** `false`

  Habilita/deshabilita advertencias detalladas para las discrepancias de hidratación en compilaciones de producción. Esto resultará en más código incluido en el paquete, por lo que se recomienda habilitarlo solo para propósitos de depuración.

- Solo disponible en 3.4+

## Guías de Configuración {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` proporciona automáticamente valores por defecto para estas indicadores. Para cambiar los valores por defecto, usa la opción de configuración [`define` de Vite](https://vite.dev/config/shared-options.html#define):

```js [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` proporciona automáticamente valores por defecto para algunas de estas indicadores. Para configurar / cambiar los valores:

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Los indicadores deben definirse usando el [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) de webpack:

```js [webpack.config.js]
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Los indicadores deben definirse usando [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js [rollup.config.js]
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
