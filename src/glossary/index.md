# Glosario {#glossary}

Este glosario tiene como objetivo proporcionar una guía sobre el significado de los términos técnicos de uso común al hablar de Vue. Su intención es ser *descriptivo* de cómo se usan los términos comúnmente, no una especificación *prescriptiva* de cómo deben usarse. Algunos términos pueden tener significados o matices ligeramente diferentes según el contexto.

[[TOC]]

## async component {#async-component}

Un *async component* es un envoltorio alrededor de otro componente que permite que el componente envuelto se cargue de forma perezosa. Esto se usa típicamente como una forma de reducir el tamaño de los archivos `.js` construidos, permitiendo que se dividan en fragmentos más pequeños que se cargan solo cuando son necesarios.

Vue Router tiene una característica similar para la [carga perezosa de componentes de ruta](https://router.vuejs.org/guide/advanced/lazy-loading.html), aunque esta no utiliza la característica de async components de Vue.

Para más detalles, consulta:
- [Guía - Async Components](/guide/components/async.html)

## compiler macro {#compiler-macro}

Una *compiler macro* (macro de compilador) es un código especial que es procesado por un compilador y convertido en otra cosa. Son, en efecto, una forma inteligente de reemplazo de cadenas.

El compilador de [SFC](#single-file-component) de Vue soporta varias macros, como `defineProps()`, `defineEmits()` y `defineExpose()`. Estas macros están diseñadas intencionalmente para parecerse a funciones normales de JavaScript, de modo que puedan aprovechar las mismas herramientas de análisis sintáctico e inferencia de tipos alrededor de JavaScript / TypeScript. Sin embargo, no son funciones reales que se ejecutan en el navegador. Son cadenas especiales que el compilador detecta y reemplaza con el código JavaScript real que realmente se ejecutará.

Las macros tienen limitaciones en su uso que no se aplican al código JavaScript normal. Por ejemplo, podrías pensar que `const dp = defineProps` te permitiría crear un alias para `defineProps`, pero en realidad resultará en un error. También hay limitaciones sobre qué valores se pueden pasar a `defineProps()`, ya que los 'argumentos' deben ser procesados por el compilador y no en tiempo de ejecución.

Para más detalles, consulta:
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## component {#component}

El término *componente* no es exclusivo de Vue. Es común a muchos frameworks de interfaz de usuario. Describe una porción de la interfaz de usuario, como un botón o una casilla de verificación. Los componentes también se pueden combinar para formar componentes más grandes.

Los componentes son el mecanismo principal proporcionado por Vue para dividir una interfaz de usuario en piezas más pequeñas, tanto para mejorar la mantenibilidad como para permitir la reutilización de código.

Un componente de Vue es un objeto. Todas las propiedades son opcionales, pero se requiere una `template` o una `render function` para que el componente se renderice. Por ejemplo, el siguiente objeto sería un componente válido:

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

En la práctica, la mayoría de las aplicaciones de Vue se escriben utilizando [Single-File Components](#single-file-component) (archivos `.vue`). Si bien estos componentes pueden no parecer objetos a primera vista, el compilador de SFC los convertirá en un objeto, que se utiliza como exportación por defecto para el archivo. Desde una perspectiva externa, un archivo `.vue` es simplemente un módulo ES que exporta un objeto componente.

Las propiedades de un objeto componente suelen denominarse *options* (opciones). De aquí es de donde el [Options API](#options-api) toma su nombre.

Las opciones para un componente definen cómo se deben crear las instancias de ese componente. Los componentes son conceptualmente similares a las clases, aunque Vue no utiliza clases JavaScript reales para definirlos.

El término componente también puede usarse de manera más general para referirse a las instancias de los componentes.

Para más detalles, consulta:
- [Guía - Conceptos básicos de los componentes](/guide/essentials/component-basics.html)

La palabra 'componente' también aparece en varios otros términos:
- [async component](#async-component)
- [dynamic component](#dynamic-component)
- [functional component](#functional-component)
- [Web Component](#web-component)

## composable {#composable}

El término *composable* describe un patrón de uso común en Vue. No es una característica separada de Vue, es solo una forma de usar la [Composition API](#composition-api) del framework.

*   Un composable es una función.
*   Los composables se utilizan para encapsular y reutilizar la lógica con estado.
*   El nombre de la función suele comenzar con `use`, para que otros desarrolladores sepan que es un composable.
*   Normalmente se espera que la función sea llamada durante la ejecución síncrona de la función `setup()` de un componente (o, equivalentemente, durante la ejecución de un bloque `<script setup>`). Esto vincula la invocación del composable al contexto del componente actual, por ejemplo, a través de llamadas a `provide()`, `inject()` o `onMounted()`.
*   Los composables suelen devolver un objeto plano, no un objeto reactivo. Este objeto normalmente contiene `ref`s y funciones, y se espera que se desestructure dentro del código que lo llama.

Como ocurre con muchos patrones, puede haber cierto desacuerdo sobre si un código específico califica para la etiqueta. No todas las funciones de utilidad de JavaScript son composables. Si una función no utiliza la Composition API, probablemente no sea un composable. Si no espera ser llamada durante la ejecución síncrona de `setup()`, probablemente no sea un composable. Los composables se utilizan específicamente para encapsular lógica con estado, no son solo una convención de nombres para funciones.

Consulta [Guía - Composables](/guide/reusability/composables.html) para obtener más detalles sobre cómo escribir composables.

## Composition API {#composition-api}

La *Composition API* es una colección de funciones utilizadas para escribir componentes y composables en Vue.

El término también se usa para describir uno de los dos estilos principales para escribir componentes, siendo el otro la [Options API](#options-api). Los componentes escritos usando la Composition API usan `<script setup>` o una función `setup()` explícita.

Consulta las [Preguntas frecuentes sobre la Composition API](/guide/extras/composition-api-faq) para más detalles.

## custom element {#custom-element}

Un *custom element* (elemento personalizado) es una característica del estándar [Web Components](#web-component), que está implementado en los navegadores web modernos. Se refiere a la capacidad de usar un elemento HTML personalizado en tu marcado HTML para incluir un Web Component en ese punto de la página.

Vue tiene soporte incorporado para renderizar custom elements y permite que se usen directamente en las plantillas de los componentes de Vue.

Los custom elements no deben confundirse con la capacidad de incluir componentes de Vue como etiquetas dentro de la plantilla de otro componente de Vue. Los custom elements se utilizan para crear Web Components, no componentes de Vue.

Para más detalles, consulta:
- [Guía - Vue y Web Components](/guide/extras/web-components.html)

## directive {#directive}

El término *directiva* se refiere a los atributos de plantilla que comienzan con el prefijo `v-`, o sus abreviaturas equivalentes.

Las directivas incorporadas incluyen `v-if`, `v-for`, `v-bind`, `v-on` y `v-slot`.

Vue también soporta la creación de directivas personalizadas, aunque típicamente solo se usan como un 'escape hatch' (mecanismo de escape) para manipular directamente los nodos DOM. Las directivas personalizadas generalmente no pueden usarse para recrear la funcionalidad de las directivas incorporadas.

Para más detalles, consulta:
- [Guía - Sintaxis de la plantilla - Directivas](/guide/essentials/template-syntax.html#directives)
- [Guía - Directivas personalizadas](/guide/reusability/custom-directives.html)

## dynamic component {#dynamic-component}

El término *dynamic component* (componente dinámico) se utiliza para describir los casos en los que la elección del componente hijo a renderizar debe hacerse dinámicamente. Típicamente, esto se logra utilizando `<component :is="type">`.

Un dynamic component no es un tipo especial de componente. Cualquier componente puede utilizarse como dynamic component. Es la elección del componente lo que es dinámico, más que el componente en sí.

Para más detalles, consulta:
- [Guía - Conceptos básicos de los componentes - Componentes dinámicos](/guide/essentials/component-basics.html#dynamic-components)

## effect {#effect}

Ver [reactive effect](#reactive-effect) y [side effect](#side-effect).

## event {#event}

El uso de eventos para la comunicación entre diferentes partes de un programa es común a muchas áreas de la programación. Dentro de Vue, el término se aplica comúnmente tanto a los eventos nativos de elementos HTML como a los eventos de componentes de Vue. La directiva `v-on` se utiliza en las plantillas para escuchar ambos tipos de eventos.

Para más detalles, consulta:
- [Guía - Manejo de eventos](/guide/essentials/event-handling.html)
- [Guía - Eventos de componente](/guide/components/events.html)

## fragment {#fragment}

El término *fragment* (fragmento) se refiere a un tipo especial de [VNode](#vnode) que se utiliza como padre para otros VNodes, pero que no renderiza ningún elemento en sí mismo.

El nombre proviene del concepto similar de un [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) en la API nativa del DOM.

Los fragmentos se utilizan para soportar componentes con múltiples nodos raíz. Si bien tales componentes podrían parecer tener múltiples raíces, detrás de escena utilizan un nodo fragmento como una única raíz, como padre de los nodos 'raíz'.

Los fragmentos también son utilizados por el compilador de plantillas como una forma de envolver múltiples nodos dinámicos, por ejemplo, aquellos creados a través de `v-for` o `v-if`. Esto permite pasar pistas adicionales al algoritmo de parcheo de [VDOM](#virtual-dom). Gran parte de esto se maneja internamente, pero un lugar donde puedes encontrar esto directamente es usando un `key` en una etiqueta `<template>` con `v-for`. En ese escenario, el `key` se añade como una [prop](#prop) al VNode del fragmento.

Los nodos fragmento se renderizan actualmente en el DOM como nodos de texto vacíos, aunque eso es un detalle de implementación. Puedes encontrarte con esos nodos de texto si utilizas `$el` o intentas recorrer el DOM con las API de navegador incorporadas.

## functional component {#functional-component}

Una definición de componente suele ser un objeto que contiene opciones. Puede que no parezca así si estás usando `<script setup>`, pero el componente exportado desde el archivo `.vue` seguirá siendo un objeto.

Un *functional component* (componente funcional) es una forma alternativa de componente que se declara usando una función en su lugar. Esa función actúa como la [render function](#render-function) para el componente.

Un functional component no puede tener estado propio. Tampoco pasa por el ciclo de vida habitual del componente, por lo que no se pueden usar los `lifecycle hooks`. Esto los hace ligeramente más ligeros que los componentes normales con estado.

Para más detalles, consulta:
- [Guía - Render Functions & JSX - Functional Components](/guide/extras/render-function.html#functional-components)

## hoisting {#hoisting}

El término *hoisting* (elevación) se utiliza para describir la ejecución de una sección de código antes de que sea alcanzada, por delante de otro código. La ejecución es "elevada" a un punto anterior.

JavaScript utiliza hoisting para algunas construcciones, como `var`, `import` y las declaraciones de funciones.

En el contexto de Vue, el compilador aplica *hoisting* para mejorar el rendimiento. Al compilar un componente, los valores estáticos se mueven fuera del ámbito del componente. Estos valores estáticos se describen como 'elevados' porque se crean fuera del componente.

## cache static {#cache-static}

El término *cache* (caché) se utiliza para describir el almacenamiento temporal de datos a los que se accede con frecuencia para mejorar el rendimiento.

El compilador de plantillas de Vue identifica esos VNodes estáticos, los almacena en caché durante la renderización inicial y reutiliza los mismos VNodes para cada renderización posterior.

Para más detalles, consulta:
- [Guía - Mecanismo de renderizado - Cache estático](/guide/extras/rendering-mechanism.html#cache-static)

## in-DOM template {#in-dom-template}

Existen varias formas de especificar una plantilla para un componente. En la mayoría de los casos, la plantilla se proporciona como una cadena.

El término *in-DOM template* (plantilla en el DOM) se refiere al escenario en el que la plantilla se proporciona en forma de nodos DOM, en lugar de una cadena. Vue convierte los nodos DOM en una cadena de plantilla utilizando `innerHTML`.

Típicamente, una plantilla en el DOM comienza como marcado HTML escrito directamente en el HTML de la página. El navegador luego lo analiza en nodos DOM, que Vue utiliza para leer el `innerHTML`.

Para más detalles, consulta:
- [Guía - Creación de una aplicación - Plantilla de componente raíz en el DOM](/guide/essentials/application.html#in-dom-root-component-template)
- [Guía - Conceptos básicos de los componentes - Advertencias de análisis de plantillas en el DOM](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [Opciones: Renderizado - template](/api/options-rendering.html#template)

## inject {#inject}

Ver [provide / inject](#provide-inject).

## lifecycle hooks {#lifecycle-hooks}

Una instancia de un componente Vue pasa por un ciclo de vida. Por ejemplo, se crea, se monta, se actualiza y se desmonta.

Los *lifecycle hooks* (ganchos de ciclo de vida) son una forma de escuchar estos eventos del ciclo de vida.

Con la Options API, cada hook se proporciona como una opción separada, por ejemplo, `mounted`. La Composition API usa funciones en su lugar, como `onMounted()`.

Para más detalles, consulta:
- [Guía - Ganchos de ciclo de vida](/guide/essentials/lifecycle.html)

## macro {#macro}

Ver [compiler macro](#compiler-macro).

## named slot {#named-slot}

Un componente puede tener múltiples `slots`, diferenciados por nombre. Los `slots` que no son el `slot` por defecto se denominan *named slots* (slots con nombre).

Para más detalles, consulta:
- [Guía - Slots - Slots con nombre](/guide/components/slots.html#named-slots)

## Options API {#options-api}

Los componentes de Vue se definen utilizando objetos. Las propiedades de estos objetos componentes se conocen como *options* (opciones).

Los componentes se pueden escribir en dos estilos. Un estilo utiliza la [Composition API](#composition-api) junto con `setup` (ya sea a través de una opción `setup()` o `<script setup>`). El otro estilo hace muy poco uso directo de la Composition API, utilizando en su lugar varias opciones de componente para lograr un resultado similar. Las opciones de componente que se utilizan de esta manera se conocen como *Options API*.

La Options API incluye opciones como `data()`, `computed`, `methods` y `created()`.

Algunas opciones, como `props`, `emits` e `inheritAttrs`, se pueden usar al crear componentes con cualquiera de las dos API. Como son opciones de componente, podrían considerarse parte de la Options API. Sin embargo, como estas opciones también se usan junto con `setup()`, generalmente es más útil pensar en ellas como compartidas entre los dos estilos de componente.

La propia función `setup()` es una opción de componente, por lo que *podría* describirse como parte de la Options API. Sin embargo, esta no es la forma en que se usa normalmente el término 'Options API'. En cambio, la función `setup()` se considera parte de la Composition API.

## plugin {#plugin}

Si bien el término *plugin* puede usarse en una amplia variedad de contextos, Vue tiene un concepto específico de plugin como una forma de añadir funcionalidad a una aplicación.

Los plugins se añaden a una aplicación llamando a `app.use(plugin)`. El plugin en sí es una función o un objeto con una función `install`. Esa función recibirá la instancia de la aplicación y podrá hacer lo que necesite.

Para más detalles, consulta:
- [Guía - Plugins](/guide/reusability/plugins.html)

## prop {#prop}

Existen tres usos comunes del término *prop* en Vue:

*   Component props
*   VNode props
*   Slot props

Los *Component props* son lo que la mayoría de la gente entiende por `props`. Estos se definen explícitamente por un componente usando `defineProps()` o la opción `props`.

El término *VNode props* se refiere a las propiedades del objeto pasado como segundo argumento a `h()`. Estos pueden incluir `component props`, pero también pueden incluir `component events`, `DOM events`, `DOM attributes` y `DOM properties`. Normalmente solo te encontrarías con `VNode props` si estás trabajando con `render functions` para manipular `VNode`s directamente.

Los *Slot props* son las propiedades pasadas a un `scoped slot`.

En todos los casos, las `props` son propiedades que se pasan desde otro lugar.

Aunque la palabra `props` se deriva de la palabra *properties* (propiedades), el término `props` tiene un significado mucho más específico en el contexto de Vue. Debes evitar usarlo como abreviatura de *properties*.

Para más detalles, consulta:
- [Guía - Props](/guide/components/props.html)
- [Guía - Render Functions & JSX](/guide/extras/render-function.html)
- [Guía - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## provide / inject {#provide-inject}

`provide` e `inject` son una forma de comunicación entre componentes.

Cuando un componente *`provide`* un `value`, todos los descendientes de ese componente pueden elegir tomar ese `value` utilizando `inject`. A diferencia de las `props`, el componente que `provide` no sabe con precisión qué componente está recibiendo el `value`.

`provide` e `inject` a veces se utilizan para evitar el *prop drilling*. También pueden usarse como una forma implícita para que un componente se comunique con el contenido de su `slot`.

`provide` también se puede usar a nivel de aplicación, haciendo que un `value` esté disponible para todos los componentes dentro de esa aplicación.

Para más detalles, consulta:
- [Guía - provide / inject](/guide/components/provide-inject.html)

## reactive effect {#reactive-effect}

Un *reactive effect* (efecto reactivo) forma parte del sistema de reactividad de Vue. Se refiere al proceso de rastrear las dependencias de una función y volver a ejecutar esa función cuando cambian los `value`s de esas dependencias.

`watchEffect()` es la forma más directa de crear un `effect`. Varias otras partes de Vue utilizan `effects` internamente, por ejemplo, las actualizaciones de renderizado de componentes, `computed()` y `watch()`.

Vue solo puede rastrear dependencias reactivas dentro de un `reactive effect`. Si el `value` de una propiedad se lee fuera de un `reactive effect`, "perderá" la reactividad, en el sentido de que Vue no sabrá qué hacer si esa propiedad cambia posteriormente.

El término se deriva de 'side effect' (efecto secundario). Llamar a la función `effect` es un `side effect` del cambio del `value` de la propiedad.

Para más detalles, consulta:
- [Guía - Reactividad en profundidad](/guide/extras/reactivity-in-depth.html)

## reactivity {#reactivity}

En general, la *reactivity* (reactividad) se refiere a la capacidad de realizar acciones automáticamente en respuesta a cambios de datos. Por ejemplo, actualizar el DOM o realizar una solicitud de red cuando cambia un `value` de datos.

En el contexto de Vue, la `reactivity` se utiliza para describir una colección de características. Esas características se combinan para formar un *reactivity system* (sistema de reactividad), que se expone a través de la [Reactivity API](#reactivity-api).

Existen varias formas diferentes en que se podría implementar un sistema de `reactivity`. Por ejemplo, podría hacerse mediante el análisis estático del código para determinar sus dependencias. Sin embargo, Vue no emplea esa forma de sistema de `reactivity`.

En su lugar, el sistema de `reactivity` de Vue rastrea el acceso a las propiedades en tiempo de ejecución. Lo hace utilizando tanto envoltorios `Proxy` como funciones [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)/[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) para las propiedades.

Para más detalles, consulta:
- [Guía - Fundamentos de la Reactividad](/guide/essentials/reactivity-fundamentals.html)
- [Guía - Reactividad en profundidad](/guide/extras/reactivity-in-depth.html)

## Reactivity API {#reactivity-api}

La *Reactivity API* es una colección de funciones centrales de Vue relacionadas con la [reactivity](#reactivity). Estas se pueden usar independientemente de los componentes. Incluye funciones como `ref()`, `reactive()`, `computed()`, `watch()` y `watchEffect()`.

La Reactivity API es un subconjunto de la Composition API.

Para más detalles, consulta:
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utilities](/api/reactivity-utilities.html)
- [Reactivity API: Advanced](/api/reactivity-advanced.html)

## ref {#ref}

> Esta entrada trata sobre el uso de `ref` para la reactividad. Para el atributo `ref` utilizado en las plantillas, consulta [template ref](#template-ref) en su lugar.

Un `ref` forma parte del sistema de reactividad de Vue. Es un objeto con una única propiedad reactiva, llamada `value`.

Existen varios tipos diferentes de `ref`. Por ejemplo, los `ref`s se pueden crear utilizando `ref()`, `shallowRef()`, `computed()` y `customRef()`. La función `isRef()` se puede usar para verificar si un objeto es un `ref`, y `isReadonly()` se puede usar para verificar si el `ref` permite la reasignación directa de su `value`.

Para más detalles, consulta:
- [Guía - Fundamentos de la Reactividad](/guide/essentials/reactivity-fundamentals.html)
- [Reactivity API: Core](/api/reactivity-core.html)
- [Reactivity API: Utilities](/api/reactivity-utilities.html)
- [Reactivity API: Advanced](/api/reactivity-advanced.html)

## render function {#render-function}

Una *render function* (función de renderizado) es la parte de un componente que genera los VNodes utilizados durante el renderizado. Las plantillas se compilan en render functions.

Para más detalles, consulta:
- [Guía - Render Functions & JSX](/guide/extras/render-function.html)

## scheduler {#scheduler}

El *scheduler* (planificador) es la parte de los internos de Vue que controla el momento en que se ejecutan los [reactive effects](#reactive-effect).

Cuando el estado reactivo cambia, Vue no activa inmediatamente las actualizaciones de renderizado. En su lugar, las agrupa utilizando una cola. Esto asegura que un componente solo se vuelva a renderizar una vez, incluso si se realizan múltiples cambios en los datos subyacentes.

Los [Watchers](/guide/essentials/watchers.html) también se agrupan utilizando la cola del `scheduler`. Los `watchers` con `flush: 'pre'` (el valor por defecto) se ejecutarán antes del renderizado del componente, mientras que los que tienen `flush: 'post'` se ejecutarán después del renderizado del componente.

Los trabajos en el `scheduler` también se utilizan para realizar varias otras tareas internas, como activar algunos [lifecycle hooks](#lifecycle-hooks) y actualizar [template refs](#template-ref).

## scoped slot {#scoped-slot}

El término *scoped slot* (slot con ámbito) se utiliza para referirse a un [slot](#slot) que recibe [props](#prop).

Históricamente, Vue hacía una distinción mucho mayor entre `slots` con ámbito y sin ámbito. Hasta cierto punto, podrían considerarse dos características separadas, unificadas bajo una sintaxis de plantilla común.

En Vue 3, las API de `slot` se simplificaron para que todos los `slots` se comportaran como `scoped slots`. Sin embargo, los casos de uso para los `scoped slots` y los `slots` sin ámbito a menudo difieren, por lo que el término sigue siendo útil como una forma de referirse a los `slots` con `props`.

Las `props` pasadas a un `slot` solo se pueden usar dentro de una región específica de la plantilla padre, responsable de definir el contenido del `slot`. Esta región de la plantilla se comporta como un ámbito de variable para las `props`, de ahí el nombre 'scoped slot'.

Para más detalles, consulta:
- [Guía - Slots - Scoped Slots](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

Ver [Single-File Component](#single-file-component).

## side effect {#side-effect}

El término *side effect* (efecto secundario) no es específico de Vue. Se utiliza para describir operaciones o funciones que hacen algo más allá de su ámbito local.

Por ejemplo, en el contexto de establecer una propiedad como `user.name = null`, se espera que esto cambie el `value` de `user.name`. Si también hace algo más, como activar el sistema de reactividad de Vue, entonces esto se describiría como un `side effect`. Este es el origen del término [reactive effect](#reactive-effect) dentro de Vue.

Cuando se describe una función como que tiene `side effects`, significa que la función realiza algún tipo de acción observable fuera de la función, además de simplemente devolver un `value`. Esto podría significar que actualiza un `value` en el estado o que activa una solicitud de red.

El término se usa a menudo al describir el renderizado o las propiedades `computed`. Se considera una buena práctica que el renderizado no tenga `side effects`. Del mismo modo, la función `getter` para una propiedad `computed` no debe tener `side effects`.

## Single-File Component {#single-file-component}

El término *Single-File Component*, o SFC, se refiere al formato de archivo `.vue` que se utiliza comúnmente para los componentes de Vue.

Ver también:
- [Guía - Single-File Components](/guide/scaling-up/sfc.html)
- [Especificación de la Sintaxis SFC](/api/sfc-spec.html)

## slot {#slot}

Los `slots` se utilizan para pasar contenido a los componentes hijos. Mientras que las `props` se utilizan para pasar `value`s de datos, los `slots` se utilizan para pasar contenido más rico, consistente en elementos HTML y otros componentes de Vue.

Para más detalles, consulta:
- [Guía - Slots](/guide/components/slots.html)

## template ref {#template-ref}

El término *template ref* (ref de plantilla) se refiere al uso de un atributo `ref` en una etiqueta dentro de una plantilla. Después de que el componente se renderiza, este atributo se utiliza para poblar una propiedad correspondiente con el elemento HTML o la instancia del componente que corresponde a la etiqueta en la plantilla.

Si estás utilizando la Options API, entonces los `ref`s se exponen a través de las propiedades del objeto `$refs`.

Con la Composition API, los `template ref`s pueblan un [ref](#ref) reactivo con el mismo nombre.

Los `template ref`s no deben confundirse con los `ref`s reactivos que se encuentran en el sistema de reactividad de Vue.

Para más detalles, consulta:
- [Guía - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

Ver [virtual DOM](#virtual-dom).

## virtual DOM {#virtual-dom}

El término *virtual DOM* (VDOM) no es exclusivo de Vue. Es un enfoque común utilizado por varios frameworks web para gestionar las actualizaciones de la interfaz de usuario.

Los navegadores utilizan un árbol de nodos para representar el estado actual de la página. Ese árbol, y las API de JavaScript utilizadas para interactuar con él, se conocen como *document object model*, o *DOM*.

Manipular el DOM es un cuello de botella importante en el rendimiento. El virtual DOM proporciona una estrategia para gestionar eso.

En lugar de crear nodos DOM directamente, los componentes de Vue generan una descripción de los nodos DOM que desearían. Estos descriptores son objetos JavaScript planos, conocidos como VNodes (nodos DOM virtuales). Crear VNodes es relativamente económico.

Cada vez que un componente se vuelve a renderizar, el nuevo árbol de VNodes se compara con el árbol de VNodes anterior y cualquier diferencia se aplica al DOM real. Si nada ha cambiado, entonces no es necesario tocar el DOM.

Vue utiliza un enfoque híbrido que llamamos [Virtual DOM informado por el compilador](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom). El compilador de plantillas de Vue es capaz de aplicar optimizaciones de rendimiento basadas en el análisis estático de la plantilla. En lugar de realizar una comparación completa de los árboles de VNodes antiguos y nuevos de un componente en tiempo de ejecución, Vue puede usar la información extraída por el compilador para reducir la comparación solo a las partes del árbol que realmente pueden cambiar.

Para más detalles, consulta:
- [Guía - Mecanismo de renderizado](/guide/extras/rendering-mechanism.html)
- [Guía - Render Functions & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

Un *VNode* es un *virtual DOM node* (nodo DOM virtual). Se pueden crear utilizando la función [`h()`](/api/render-function.html#h).

Consulta [virtual DOM](#virtual-dom) para obtener más información.

## Web Component {#web-component}

El estándar *Web Components* es una colección de características implementadas en los navegadores web modernos.

Los componentes de Vue no son Web Components, pero `defineCustomElement()` se puede utilizar para crear un [custom element](#custom-element) a partir de un componente de Vue. Vue también soporta el uso de custom elements dentro de los componentes de Vue.

Para más detalles, consulta:
- [Guía - Vue y Web Components](/guide/extras/web-components.html)