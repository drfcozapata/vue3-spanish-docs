# Plugins {#plugins}

## Introducción {#introduction}

Los complementos son código autocontenido que usualmente añaden funcionalidad a nivel de aplicación a Vue. Así es como instalamos un complemento:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* optional options */
})
```

Un complemento se define como un objeto que expone un método `install()`, o simplemente como una función que actúa como la función de instalación en sí misma. La función de instalación recibe la [instancia de la aplicación](/api/application) junto con opciones adicionales pasadas a `app.use()`, si las hay:

```js
const myPlugin = {
  install(app, options) {
    // configure the app
  }
}
```

No hay un alcance estrictamente definido para un complemento, pero los escenarios comunes donde los complementos son útiles incluyen:

1.  Registrar uno o más componentes globales o directivas personalizadas con [`app.component()`](/api/application#app-component) y [`app.directive()`](/api/application#app-directive).

2.  Hacer un recurso [inyectable](/guide/components/provide-inject) en toda la aplicación llamando a [`app.provide()`](/api/application#app-provide).

3.  Añadir algunas propiedades o métodos de instancia globales adjuntándolos a [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4.  Una librería que necesita realizar alguna combinación de lo anterior (por ejemplo, [vue-router](https://github.com/vuejs/vue-router-next)).

## Escribiendo un Complemento {#writing-a-plugin}

Para comprender mejor cómo crear tus propios complementos de Vue.js, crearemos una versión muy simplificada de un complemento que muestra cadenas de `i18n` (abreviatura de [Internacionalización](https://en.wikipedia.org/wiki/Internationalization_and_localization)).

Comencemos configurando el objeto del complemento. Se recomienda crearlo en un archivo separado y exportarlo, como se muestra a continuación para mantener la lógica contenida y separada.

```js [plugins/i18n.js]
export default {
  install: (app, options) => {
    // Plugin code goes here
  }
}
```

Queremos crear una función de traducción. Esta función recibirá una cadena `key` delimitada por puntos, que utilizaremos para buscar la cadena traducida en las opciones proporcionadas por el usuario. Este es el uso previsto en las plantillas:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Dado que esta función debería estar disponible globalmente en todas las plantillas, la haremos así adjuntándola a `app.config.globalProperties` en nuestro complemento:

```js{3-10} [plugins/i18n.js]
export default {
  install: (app, options) => {
    // inject a globally available $translate() method
    app.config.globalProperties.$translate = (key) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Nuestra función `$translate` tomará una cadena como `greetings.hello`, buscará dentro de la configuración proporcionada por el usuario y devolverá el valor traducido.

El objeto que contiene las `key`s traducidas debe pasarse al complemento durante la instalación a través de parámetros adicionales a `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Ahora, nuestra expresión inicial `$translate('greetings.hello')` será reemplazada por ¡Bonjour! en tiempo de ejecución.

Ver también: [Aumentando las propiedades globales](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
Usa las propiedades globales con moderación, ya que puede volverse confuso rápidamente si se utilizan demasiadas propiedades globales inyectadas por diferentes complementos en toda una aplicación.
:::

### provide / inject con Complementos {#provide-inject-with-plugins}

Los complementos también nos permiten usar `provide` para dar a los usuarios del complemento acceso a una función o atributo. Por ejemplo, podemos permitir que la aplicación tenga acceso al parámetro `options` para poder usar el objeto de traducciones.

```js{3} [plugins/i18n.js]
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Los usuarios del complemento ahora podrán inyectar las opciones del complemento en sus componentes usando la clave `i18n`:

<div class="composition-api">

```vue{4}
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js{2}
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>

### Empaquetar para NPM

Si además quieres construir y publicar tu complemento para que otros lo usen, consulta la [sección de Vite sobre el Modo de Librería](https://vitejs.dev/guide/build.html#library-mode).
