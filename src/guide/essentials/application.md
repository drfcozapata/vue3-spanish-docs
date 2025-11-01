# Creando una Aplicación Vue {#creating-a-vue-application}

## La instancia de aplicación {#the-application-instance}

Cada aplicación Vue comienza creando una nueva **instancia de aplicación** con la función [`createApp`](/api/application#createapp):

```js
import { createApp } from 'vue'

const app = createApp({
  /* root component options */
})
```

## El Componente Raíz {#the-root-component}

El objeto que pasamos a `createApp` es de hecho un componente. Cada aplicación requiere un "componente raíz" que puede contener otros componentes como sus hijos.

Si estás usando Componentes de Un Solo Archivo (Single-File Components), normalmente importamos el componente raíz de otro archivo:

```js
import { createApp } from 'vue'
// import the root component App from a single-file component.
import App from './App.vue'

const app = createApp(App)
```

Aunque muchos ejemplos en esta guía solo necesitan un único componente, la mayoría de las aplicaciones reales se organizan en un árbol de componentes anidados y reutilizables. Por ejemplo, el árbol de componentes de una aplicación de Tareas Pendientes (Todo) podría verse así:

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

En secciones posteriores de la guía, discutiremos cómo definir y componer múltiples componentes juntos. Antes de eso, nos centraremos en lo que sucede dentro de un solo componente.

## Montando la Aplicación {#mounting-the-app}

Una instancia de aplicación no renderizará nada hasta que se llame a su método `.mount()`. Espera un argumento "container", que puede ser un elemento DOM real o una cadena de selector:

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

El contenido del componente raíz de la aplicación se renderizará dentro del elemento contenedor. El elemento contenedor en sí no se considera parte de la aplicación.

El método `.mount()` siempre debe llamarse después de que todas las configuraciones de la aplicación y los registros de activos estén completos. También ten en cuenta que su valor de retorno, a diferencia de los métodos de registro de activos, es la instancia del componente raíz en lugar de la instancia de la aplicación.

### Template de Componente Raíz en el DOM {#in-dom-root-component-template}

La plantilla para el componente raíz suele ser parte del propio componente, pero también es posible proporcionar la plantilla por separado escribiéndola directamente dentro del contenedor de montaje:

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

Vue utilizará automáticamente el `innerHTML` del contenedor como plantilla si el componente raíz aún no tiene una opción `template`.

Las plantillas en el DOM a menudo se utilizan en aplicaciones que están [usando Vue sin un paso de construcción](/guide/quick-start.html#using-vue-from-cdn). También pueden usarse en conjunto con frameworks del lado del servidor, donde la plantilla raíz podría ser generada dinámicamente por el servidor.

## Configuraciones de la Aplicación {#app-configurations}

La instancia de aplicación expone un objeto `.config` que nos permite configurar algunas opciones a nivel de aplicación, por ejemplo, definir un manejador de errores a nivel de aplicación que captura errores de todos los componentes descendientes:

```js
app.config.errorHandler = (err) => {
  /* handle error */
}
```

La instancia de aplicación también proporciona algunos métodos para registrar activos con alcance de aplicación. Por ejemplo, registrando un componente:

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

Esto hace que el `TodoDeleteButton` esté disponible para su uso en cualquier parte de nuestra aplicación. Discutiremos el registro de componentes y otros tipos de activos en secciones posteriores de la guía. También puedes consultar la lista completa de APIs de la instancia de aplicación en su [referencia de API](/api/application).

¡Asegúrate de aplicar todas las configuraciones de la aplicación antes de montar la aplicación!

## Múltiples instancias de aplicación {#multiple-application-instances}

No estás limitado a una única instancia de aplicación en la misma página. La API `createApp` permite que múltiples aplicaciones Vue coexistan en la misma página, cada una con su propio alcance para la configuración y los activos globales:

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

Si estás utilizando Vue para mejorar HTML renderizado por el servidor y solo necesitas que Vue controle partes específicas de una página grande, evita montar una única instancia de aplicación Vue en toda la página. En su lugar, crea múltiples instancias de aplicación pequeñas y móntalas en los elementos de los que son responsables.
