---
outline: deep
---

# Rendimiento {#performance}

## Visión General {#overview}

Vue está diseñado para ser performante en la mayoría de los casos de uso comunes sin necesidad de muchas optimizaciones manuales. Sin embargo, siempre existen escenarios desafiantes donde se requiere un ajuste fino adicional. En esta sección, discutiremos a qué debes prestar atención en cuanto al rendimiento en una aplicación Vue.

Primero, discutamos los dos aspectos principales del rendimiento web:

- **Rendimiento de Carga de Página**: qué tan rápido la aplicación muestra contenido y se vuelve interactiva en la visita inicial. Esto generalmente se mide utilizando métricas vitales web como [Largest Contentful Paint (LCP)](https://web.dev/lcp/) e [Interaction to Next Paint](https://web.dev/articles/inp).

- **Rendimiento de Actualización**: qué tan rápido se actualiza la aplicación en respuesta a la entrada del usuario. Por ejemplo, qué tan rápido se actualiza una lista cuando el usuario escribe en un cuadro de búsqueda, o qué tan rápido cambia la página cuando el usuario hace clic en un enlace de navegación en una Aplicación de Una Sola Página (SPA).

Si bien sería ideal maximizar ambos, las diferentes arquitecturas de frontend tienden a afectar la facilidad con la que se logra el rendimiento deseado en estos aspectos. Además, el tipo de aplicación que estás construyendo influye en gran medida en lo que debes priorizar en términos de rendimiento. Por lo tanto, el primer paso para garantizar un rendimiento óptimo es elegir la arquitectura adecuada para el tipo de aplicación que estás construyendo:

- Consulta [Formas de Usar Vue](/guide/extras/ways-of-using-vue) para ver cómo puedes aprovechar Vue de diferentes maneras.

- Jason Miller analiza los tipos de aplicaciones web y su implementación / entrega ideal respectiva en [Application Holotypes](https://jasonformat.com/application-holotypes/).

## Opciones de Perfilado {#profiling-options}

Para mejorar el rendimiento, primero necesitamos saber cómo medirlo. Hay una serie de excelentes herramientas que pueden ayudar en este sentido:

Para perfilar el rendimiento de carga de despliegues de producción:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

Para perfilar el rendimiento durante el desarrollo local:

- [Panel de Rendimiento de Chrome DevTools](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) habilita marcadores de rendimiento específicos de Vue en la línea de tiempo de rendimiento de Chrome DevTools.
- La [Extensión Vue DevTools](/guide/scaling-up/tooling#browser-devtools) también proporciona una característica de perfilado de rendimiento.

## Optimizaciones de Carga de Página {#page-load-optimizations}

Existen muchos aspectos agnósticos del framework para optimizar el rendimiento de carga de página; consulta [esta guía de web.dev](https://web.dev/fast/) para un resumen completo. Aquí, nos centraremos principalmente en técnicas específicas de Vue.

### Elegir la Arquitectura Correcta {#choosing-the-right-architecture}

Si tu caso de uso es sensible al rendimiento de carga de página, evita enviarlo como una SPA pura del lado del cliente. Quieres que tu servidor envíe directamente HTML que contenga el contenido que los usuarios desean ver. El renderizado puro del lado del cliente sufre de un tiempo de visualización lento. Esto se puede mitigar con [Server-Side Rendering (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) o [Static Site Generation (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg). Consulta la [Guía de SSR](/guide/scaling-up/ssr) para aprender a realizar SSR con Vue. Si tu aplicación no tiene requisitos de interactividad ricos, también puedes usar un servidor backend tradicional para renderizar el HTML y mejorarlo con Vue en el cliente.

Si tu aplicación principal tiene que ser una SPA, pero tiene páginas de marketing (landing, acerca de, blog), ¡envíalas por separado! Tus páginas de marketing deberían idealmente desplegarse como HTML estático con JS mínimo, utilizando SSG.

### Tamaño del Bundle y Tree-shaking {#bundle-size-and-tree-shaking}

Una de las formas más efectivas de mejorar el rendimiento de carga de página es enviar bundles de JavaScript más pequeños. Aquí hay algunas maneras de reducir el tamaño del bundle al usar Vue:

- Usa un paso de compilación si es posible.

  - Muchas de las APIs de Vue son ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) si se empaquetan mediante una herramienta de compilación moderna. Por ejemplo, si no usas el componente incorporado `<Transition>`, no se incluirá en el bundle de producción final. El `Tree-shaking` también puede eliminar otros módulos no utilizados en tu código fuente.

  - Al usar un paso de compilación, las plantillas se pre-compilan, por lo que no necesitamos enviar el compilador de Vue al navegador. Esto ahorra **14kb** de JavaScript min+gzipped y evita el costo de compilación en tiempo de ejecución.

- ¡Ten cuidado con el tamaño al introducir nuevas dependencias! En aplicaciones del mundo real, los bundles hinchados suelen ser el resultado de introducir dependencias pesadas sin darse cuenta.

  - Si usas un paso de compilación, prefiere dependencias que ofrezcan formatos de módulo ES y sean compatibles con `tree-shaking`. Por ejemplo, prefiere `lodash-es` sobre `lodash`.

  - Verifica el tamaño de una dependencia y evalúa si vale la pena la funcionalidad que proporciona. Ten en cuenta que si la dependencia es compatible con `tree-shaking`, el aumento real del tamaño dependerá de las APIs que realmente importes de ella. Herramientas como [bundlejs.com](https://bundlejs.com/) se pueden usar para comprobaciones rápidas, pero medir con tu configuración de compilación real siempre será lo más preciso.

- Si usas Vue principalmente para la mejora progresiva y prefieres evitar un paso de compilación, considera usar [petite-vue](https://github.com/vuejs/petite-vue) (solo **6kb**) en su lugar.

### División de Código {#code-splitting}

La división de código es cuando una herramienta de compilación divide el bundle de la aplicación en múltiples fragmentos más pequeños, que luego pueden cargarse bajo demanda o en paralelo. Con una división de código adecuada, las características requeridas en la carga de la página se pueden descargar inmediatamente, y los fragmentos adicionales se cargan de forma perezosa solo cuando son necesarios, mejorando así el rendimiento.

Empaquetadores como Rollup (en el que se basa Vite) o webpack pueden crear automáticamente fragmentos divididos detectando la sintaxis de importación dinámica de ESM:

```js
// lazy.js and its dependencies will be split into a separate chunk
// and only loaded when `loadLazy()` is called.
function loadLazy() {
  return import('./lazy.js')
}
```

La carga perezosa se utiliza mejor en características que no se necesitan inmediatamente después de la carga inicial de la página. En las aplicaciones Vue, esto se puede usar en combinación con la característica de [Componente Asíncrono](/guide/components/async) de Vue para crear fragmentos divididos para árboles de componentes:

```js
import { defineAsyncComponent } from 'vue'

// a separate chunk is created for Foo.vue and its dependencies.
// it is only fetched on demand when the async component is
// rendered on the page.
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

Para aplicaciones que usan Vue Router, se recomienda encarecidamente usar carga perezosa para los componentes de ruta. Vue Router tiene soporte explícito para la carga perezosa, separado de `defineAsyncComponent`. Consulta [Carga Perezosa de Rutas](https://router.vuejs.org/guide/advanced/lazy-loading.html) para más detalles.

## Optimizaciones de Actualización {#update-optimizations}

### Estabilidad de las propiedades {#props-stability}

En Vue, un componente hijo solo se actualiza cuando al menos una de sus `props` recibidas ha cambiado. Considera el siguiente ejemplo:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

Dentro del componente `<ListItem>`, utiliza sus `props` `id` y `activeId` para determinar si es el elemento actualmente activo. Si bien esto funciona, el problema es que cada vez que `activeId` cambia, ¡**cada** `<ListItem>` en la lista tiene que actualizarse!

Idealmente, solo los elementos cuyo estado activo cambió deberían actualizarse. Podemos lograr esto moviendo el cálculo del estado activo al padre y haciendo que `<ListItem>` acepte directamente una `prop` `active` en su lugar:

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

Ahora, para la mayoría de los componentes, la `prop` `active` seguirá siendo la misma cuando `activeId` cambie, por lo que ya no necesitarán actualizarse. En general, la idea es mantener las `props` pasadas a los componentes hijos tan estables como sea posible.

### `v-once` {#v-once}

`v-once` es una directiva incorporada que se puede usar para renderizar contenido que depende de datos en tiempo de ejecución pero que nunca necesita actualizarse. Todo el subárbol donde se usa será omitido para todas las futuras actualizaciones. Consulta su [referencia de API](/api/built-in-directives#v-once) para más detalles.

### `v-memo` {#v-memo}

`v-memo` es una directiva incorporada que se puede usar para omitir condicionalmente la actualización de grandes subárboles o listas `v-for`. Consulta su [referencia de API](/api/built-in-directives#v-memo) para más detalles.

### Estabilidad de las propiedades computadas {#computed-stability}

En Vue 3.4 y superior, una propiedad `computed` solo activará efectos cuando su valor computado haya cambiado respecto al anterior. Por ejemplo, la siguiente propiedad `computed` `isEven` solo activa efectos si el valor devuelto ha cambiado de `true` a `false`, o viceversa:

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// will not trigger new logs because the computed value stays `true`
count.value = 2
count.value = 4
```

Esto reduce los disparos de efectos innecesarios, pero desafortunadamente no funciona si la propiedad `computed` crea un nuevo objeto en cada cálculo:

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

Debido a que se crea un nuevo objeto cada vez, el nuevo valor es técnicamente siempre diferente del valor antiguo. Incluso si la propiedad `isEven` permanece igual, Vue no podrá saberlo a menos que realice una comparación profunda del valor antiguo y el nuevo valor. Dicha comparación podría ser costosa y probablemente no valer la pena.

En su lugar, podemos optimizar esto comparando manualmente el nuevo valor con el antiguo, y devolviendo condicionalmente el valor antiguo si sabemos que nada ha cambiado:

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[Pruébalo en el playground](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnxSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtq2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz/MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

Ten en cuenta que siempre debes realizar el cálculo completo antes de comparar y devolver el valor antiguo, para que las mismas dependencias puedan ser recolectadas en cada ejecución.

## Optimizaciones Generales {#general-optimizations}

> Los siguientes consejos afectan tanto al rendimiento de carga de página como al de actualización.

### Virtualizar Listas Grandes {#virtualize-large-lists}

Uno de los problemas de rendimiento más comunes en todas las aplicaciones frontend es la renderización de listas grandes. No importa cuán performante sea un framework, renderizar una lista con miles de elementos **será** lento debido a la gran cantidad de nodos DOM que el navegador necesita manejar.

Sin embargo, no necesariamente tenemos que renderizar todos estos nodos de antemano. En la mayoría de los casos, el tamaño de la pantalla del usuario solo puede mostrar un pequeño subconjunto de nuestra lista grande. Podemos mejorar en gran medida el rendimiento con la **virtualización de listas**, la técnica de renderizar solo los elementos que están actualmente en o cerca del viewport en una lista grande.

Implementar la virtualización de listas no es fácil; afortunadamente, existen bibliotecas comunitarias que puedes usar directamente:

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### Reducir la Sobrecarga de Reactividad para Estructuras Inmutables Grandes {#reduce-reactivity-overhead-for-large-immutable-structures}

El sistema de reactividad de Vue es profundo por defecto. Si bien esto hace que la gestión del estado sea intuitiva, crea un cierto nivel de sobrecarga cuando el tamaño de los datos es grande, porque cada acceso a una propiedad activa trampas de proxy que realizan el seguimiento de dependencias. Esto típicamente se vuelve notable al tratar con grandes arrays de objetos profundamente anidados, donde un solo render necesita acceder a más de 100,000 propiedades, por lo que solo debería afectar casos de uso muy específicos.

Vue proporciona un escape para optar por no usar la reactividad profunda utilizando [`shallowRef()`](/api/reactivity-advanced#shallowref) y [`shallowReactive()`](/api/reactivity-advanced#shallowreactive). Las APIs `shallow` crean un estado que es reactivo solo a nivel de raíz, y expone todos los objetos anidados sin tocar. Esto mantiene rápido el acceso a las propiedades anidadas, con la desventaja de que ahora debemos tratar todos los objetos anidados como inmutables, y las actualizaciones solo pueden ser activadas reemplazando el estado raíz:

```js
const shallowArray = shallowRef([
  /* big list of deep objects */
])

// this won't trigger updates...
shallowArray.value.push(newObject)
// this does:
shallowArray.value = [...shallowArray.value, newObject]

// this won't trigger updates...
shallowArray.value[0].foo = 1
// this does:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### Evitar Abstracciones de Componentes Innecesarias {#avoid-unnecessary-component-abstractions}

A veces podemos crear [componentes sin renderizado (renderless components)](/guide/components/slots#renderless-components) o componentes de orden superior (es decir, componentes que renderizan otros componentes con `props` adicionales) para una mejor abstracción u organización del código. Si bien no hay nada de malo en esto, ten en cuenta que las instancias de componentes son mucho más costosas que los nodos DOM simples, y crear demasiadas debido a patrones de abstracción incurrirá en costos de rendimiento.

Ten en cuenta que reducir solo unas pocas instancias no tendrá un efecto notable, así que no te preocupes si el componente se renderiza solo unas pocas veces en la aplicación. El mejor escenario para considerar esta optimización es, de nuevo, en listas grandes. Imagina una lista de 100 elementos donde cada componente de elemento contiene muchos componentes hijos. Eliminar una abstracción de componente innecesaria aquí podría resultar en una reducción de cientos de instancias de componentes.