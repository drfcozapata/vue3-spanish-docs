# Glosario {#glossary}

Este glosario tiene como objetivo proporcionar una guía sobre el significado de los términos técnicos de uso común al hablar de Vue. Su intención es ser _descriptivo_ de cómo se usan los términos comúnmente, no una especificación _prescriptiva_ de cómo deben usarse. Algunos términos pueden tener significados o matices ligeramente diferentes según el contexto.

[[TOC]]

## componente asíncrono {#async-component}

Un _componente asíncrono_ es un envoltorio alrededor de otro componente que permite que el componente envuelto se cargue de forma perezosa. Esto se usa típicamente como una forma de reducir el tamaño de los archivos `.js` construidos, permitiendo que se dividan en fragmentos más pequeños que se cargan solo cuando son necesarios.

Vue Router tiene una característica similar para la [carga perezosa de componentes de ruta](https://router.vuejs.org/guide/advanced/lazy-loading.html), aunque esta no utiliza la característica de componentes asíncronos de Vue.

Para más detalles, consulta:

- [Guía - Componentes Asíncronos](/guide/components/async.html)

## compiler macro {#compiler-macro}

Una _compiler macro_ (macro de compilador) es un código especial que es procesado por un compilador y convertido en otra cosa. Son, en efecto, una forma inteligente de reemplazo de cadenas.

El compilador de [SFC](#single-file-component) de Vue soporta varias macros, como `defineProps()`, `defineEmits()` y `defineExpose()`. Estas macros están diseñadas intencionalmente para parecerse a funciones normales de JavaScript, de modo que puedan aprovechar las mismas herramientas de análisis sintáctico e inferencia de tipos alrededor de JavaScript / TypeScript. Sin embargo, no son funciones reales que se ejecutan en el navegador. Son cadenas especiales que el compilador detecta y reemplaza con el código JavaScript que realmente se ejecutará.

Las macros tienen limitaciones en su uso que no se aplican al código JavaScript normal. Por ejemplo, podrías pensar que `const dp = defineProps` te permitiría crear un alias para `defineProps`, pero en realidad resultará en un error. También hay limitaciones sobre qué valores se pueden pasar a `defineProps()`, ya que los 'argumentos' deben ser procesados por el compilador y no en tiempo de ejecución.

Para más detalles, consulta:

- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## componente {#component}

El término _componente_ no es exclusivo de Vue. Es común a muchos frameworks de interfaz de usuario. Describe una porción de la interfaz de usuario, como un botón o una casilla de verificación. Los componentes también se pueden combinar para formar componentes más grandes.

Los componentes son el mecanismo principal proporcionado por Vue para dividir una interfaz de usuario en piezas más pequeñas, tanto para mejorar la mantenibilidad como para permitir la reutilización de código.

Un componente de Vue es un objeto. Todas las propiedades son opcionales, pero se requiere una template o una función de renderizado para que el componente se renderice. Por ejemplo, el siguiente objeto sería un componente válido:

```js
const HelloWorldComponent = {
  render() {
    return '¡Hola Mundo!'
  }
}
```

En la práctica, la mayoría de las aplicaciones de Vue se escriben utilizando [Componentes de Archivo Único (SFC)](#single-file-component) (archivos `.vue`). Si bien estos componentes pueden no parecer objetos a primera vista, el compilador de SFC los convertirá en un objeto, que se utiliza como exportación por defecto para el archivo. Desde una perspectiva externa, un archivo `.vue` es simplemente un módulo ES que exporta un objeto componente.

Las propiedades de un objeto componente suelen denominarse _options_ (opciones). De aquí es de donde el [Options API](#options-api) toma su nombre.

Las opciones para un componente definen cómo se deben crear las instancias de ese componente. Los componentes son conceptualmente similares a las clases, aunque Vue no utiliza clases JavaScript reales para definirlos.

El término componente también puede usarse de manera más general para referirse a las instancias de los componentes.

Para más detalles, consulta:

- [Guía - Fundamentos de Componentes](/guide/essentials/component-basics.html)

La palabra 'componente' también aparece en varios otros términos:

- [componente asíncrono](#async-component)
- [componente dinámico](#dynamic-component)
- [componente funcional](#functional-component)
- [Componente Web](#web-component)

## composable {#composable}

El término _composable_ describe un patrón de uso común en Vue. No es una característica separada de Vue, es solo una forma de usar la [Composition API](#composition-api) del framework.

- Un composable es una función.
- Los composables se utilizan para encapsular y reutilizar la lógica con estado.
- El nombre de la función suele comenzar con `use`, para que otros desarrolladores sepan que es un composable.
- Normalmente se espera que la función sea llamada durante la ejecución síncrona de la función `setup()` de un componente (o, equivalentemente, durante la ejecución de un bloque `<script setup>`). Esto vincula la invocación del composable al contexto del componente actual, por ejemplo, a través de llamadas a `provide()`, `inject()` o `onMounted()`.
- Los composables suelen devolver un objeto plano, no un objeto reactivo. Este objeto normalmente contiene refs y funciones, y se espera que se desestructure dentro del código que lo llama.

Como ocurre con muchos patrones, puede haber cierto desacuerdo sobre si un código específico califica para la etiqueta. No todas las funciones de utilidad de JavaScript son composables. Si una función no utiliza la Composition API, probablemente no sea un composable. Si no espera ser llamada durante la ejecución síncrona de `setup()`, probablemente no sea un composable. Los composables se utilizan específicamente para encapsular lógica con estado, no son solo una convención de nombres para funciones.

Consulta [Guía - Composables](/guide/reusability/composables.html) para obtener más detalles sobre cómo escribir composables.

## Composition API {#composition-api}

La _Composition API_ es una colección de funciones utilizadas para escribir componentes y composables en Vue.

El término también se usa para describir uno de los dos estilos principales para escribir componentes, siendo el otro la [Options API](#options-api). Los componentes escritos usando la Composition API usan `<script setup>` o una función `setup()` explícita.

Consulta las [Preguntas Frecuentes de la Composition API](/guide/extras/composition-api-faq) para más detalles.

## custom element {#custom-element}

Un _custom element_ (elemento personalizado) es una característica del estándar [Componentes Web](#web-component), que está implementado en los navegadores web modernos. Se refiere a la capacidad de usar un elemento HTML personalizado en tu marcado HTML para incluir un Componente Web en ese punto de la página.

Vue tiene soporte incorporado para renderizar custom elements y permite que se usen directamente en los templates de los componentes de Vue.

Los custom elements no deben confundirse con la capacidad de incluir componentes de Vue como etiquetas dentro del template de otro componente de Vue. Los custom elements se utilizan para crear Componentes Web, no componentes de Vue.

Para más detalles, consulta:

- [Guía - Vue y Componentes Web](/guide/extras/web-components.html)

## directiva {#directive}

El término _directiva_ se refiere a los atributos del template que comienzan con el prefijo `v-`, o sus abreviaturas equivalentes.

Las directivas integradas incluyen `v-if`, `v-for`, `v-bind`, `v-on` y `v-slot`.

Vue también soporta la creación de directivas personalizadas, aunque típicamente solo se usan como un 'escape hatch' (mecanismo de escape) para manipular directamente los nodos del DOM. Las directivas personalizadas generalmente no pueden usarse para recrear la funcionalidad de las directivas integradas.

Para más detalles, consulta:

- [Guía - Sintaxis de Template - Directivas](/guide/essentials/template-syntax.html#directives)
- [Guía - Directivas Personalizadas](/guide/reusability/custom-directives.html)

## componente dinámico {#dynamic-component}

El término _componente dinámico_ se utiliza para describir los casos en los que la elección del componente hijo a renderizar debe hacerse dinámicamente. Típicamente, esto se logra utilizando `<component :is="type">`.

Un componente dinámico no es un tipo especial de componente. Cualquier componente puede utilizarse como componente dinámico. Es la elección del componente lo que es dinámico, más que el componente en sí.

Para más detalles, consulta:

- [Guía - Fundamentos de Componentes - Componentes Dinámicos](/guide/essentials/component-basics.html#dynamic-components)

## effect {#effect}

Ver [reactive effect](#reactive-effect) y [side effect](#side-effect).

## evento {#event}

El uso de eventos para la comunicación entre diferentes partes de un programa es común a muchas áreas de la programación. Dentro de Vue, el término se aplica comúnmente tanto a los eventos nativos de elementos HTML como a los eventos de componentes de Vue. La directiva `v-on` se utiliza en los templates para escuchar ambos tipos de eventos.

Para más detalles, consulta:

- [Guía - Manejo de Eventos](/guide/essentials/event-handling.html)
- [Guía - Eventos](/guide/components/events.html)

## fragment {#fragment}

El término _fragment_ (fragmento) se refiere a un tipo especial de [VNode](#vnode) que se utiliza como padre para otros VNodes, pero que no renderiza ningún elemento en sí mismo.

El nombre proviene del concepto similar de un [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) en la API nativa del DOM.

Los fragmentos se utilizan para soportar componentes con múltiples nodos raíz. Si bien tales componentes podrían parecer tener múltiples raíces, detrás de escena utilizan un nodo fragmento como una única raíz, como padre de los nodos 'raíz'.

Los fragmentos también son utilizados por el compilador de templates como una forma de envolver múltiples nodos dinámicos, por ejemplo, aquellos creados a través de `v-for` o `v-if`. Esto permite pasar pistas adicionales al algoritmo de parcheo de [VDOM](#virtual-dom). Gran parte de esto se maneja internamente, pero un lugar donde puedes encontrar esto directamente es usando un `key` en una etiqueta `<template>` con `v-for`. En ese escenario, el `key` se añade como una [prop](#prop) al VNode del fragmento.

Los nodos fragmento se renderizan actualmente en el DOM como nodos de texto vacíos, aunque eso es un detalle de implementación. Puedes encontrarte con esos nodos de texto si utilizas `$el` o intentas recorrer el DOM con las API integradas del navegador.

## componente funcional {#functional-component}

Una definición de componente suele ser un objeto que contiene opciones. Puede que no parezca así si estás usando `<script setup>`, pero el componente exportado desde el archivo `.vue` seguirá siendo un objeto.

Un _componente funcional_ es una forma alternativa de componente que se declara usando una función en su lugar. Esa función actúa como la [función de renderizado](#render-function) para el componente.

Un componente funcional no puede tener estado propio. Tampoco pasa por el ciclo de vida habitual del componente, por lo que no se pueden usar los hooks del ciclo de vida. Esto los hace un poco más ligeros que los componentes normales con estado.

Para más detalles, consulta:

- [Guía - Funciones de Renderizado & JSX - Componentes Funcionales](/guide/extras/render-function.html#functional-components)

## hoisting {#hoisting}

El término _hoisting_ se utiliza para describir la ejecución de una sección de código antes de que sea alcanzada, por delante de otro código. La ejecución es "elevada" a un punto anterior.

JavaScript utiliza hoisting para algunas construcciones, como `var`, `import` y las declaraciones de funciones.

En el contexto de Vue, el compilador aplica _hoisting_ para mejorar el rendimiento. Al compilar un componente, los valores estáticos se mueven fuera del ámbito del componente. Estos valores estáticos se describen como 'elevados' porque se crean fuera del componente.

## caché estática {#cache-static}

El término _caché_ se utiliza para describir el almacenamiento temporal de datos a los que se accede con frecuencia para mejorar el rendimiento.

El compilador de templates de Vue identifica esos VNodes estáticos, los almacena en caché durante la renderización inicial y reutiliza los mismos VNodes para cada renderización posterior.

Para más detalles, consulta:

- [Guía - Mecanismo de Renderizado - Cache Estática](/guide/extras/rendering-mechanism.html#cache-static)

## in-DOM template {#in-dom-template}

Existen varias formas de especificar un template para un componente. En la mayoría de los casos, el template se proporciona como una cadena.

El término _in-DOM template_ (template en el DOM) se refiere al escenario en el que el template se proporciona en forma de nodos del DOM, en lugar de una cadena. Vue convierte los nodos del DOM en un template de cadena utilizando `innerHTML`.

Típicamente, un template en el DOM comienza como marcado HTML escrito directamente en el HTML de la página. El navegador luego lo analiza en nodos del DOM, que Vue utiliza para leer el `innerHTML`.

Para más detalles, consulta:

- [Guía - Creando una Aplicación Vue - Template de Componente Raíz en el DOM](/guide/essentials/application.html#in-dom-root-component-template)
- [Guía - Fundamentos de Componentes - Consideraciones sobre el Análisis de Templates en el DOM](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [Options: Renderizado - template](/api/options-rendering.html#template)

## inject {#inject}

Ver [provide / inject](#provide-inject).

## hooks del ciclo de vida {#lifecycle-hooks}

Una instancia de un componente Vue pasa por un ciclo de vida. Por ejemplo, se crea, se monta, se actualiza y se desmonta.

Los _lifecycle hooks_ (hooks del ciclo de vida) son una forma de escuchar estos eventos del ciclo de vida.

Con la Options API, cada hook se proporciona como una opción separada, por ejemplo, `mounted`. La Composition API usa funciones en su lugar, como `onMounted()`.

Para más detalles, consulta:

- [Guía - Hooks del Ciclo de Vida](/guide/essentials/lifecycle.html)

## macro {#macro}

Ver [compiler macro](#compiler-macro).

## named slot {#named-slot}

Un componente puede tener múltiples slots, diferenciados por nombre. Los slots que no son el slot por defecto se denominan _named slots_ (slots con nombre).

Para más detalles, consulta:

- [Guía - Slots - Slots con Nombre](/guide/components/slots.html#named-slots)

## Options API {#options-api}

Los componentes de Vue se definen utilizando objetos. Las propiedades de estos objetos componentes se conocen como _options_ (opciones).

Los componentes se pueden escribir en dos estilos. Un estilo utiliza la [Composition API](#composition-api) junto con `setup` (ya sea a través de una opción `setup()` o `<script setup>`). El otro estilo hace muy poco uso directo de la Composition API, utilizando en su lugar varias opciones de componente para lograr un resultado similar. Las opciones de componente que se utilizan de esta manera se conocen como _Options API_.

La Options API incluye opciones como `data()`, `computed`, `methods` y `created()`.

Algunas opciones, como `props`, `emits` e `inheritAttrs`, se pueden usar al crear componentes con cualquiera de las dos API. Como son opciones de componente, podrían considerarse parte de la Options API. Sin embargo, como estas opciones también se usan junto con `setup()`, generalmente es más útil pensar en ellas como compartidas entre los dos estilos de componente.

La propia función `setup()` es una opción de componente, por lo que _podría_ describirse como parte de la Options API. Sin embargo, esta no es la forma en que se usa normalmente el término 'Options API'. En cambio, la función `setup()` se considera parte de la Composition API.

## plugin {#plugin}

Si bien el término _plugin_ puede usarse en una amplia variedad de contextos, Vue tiene un concepto específico de plugin como una forma de añadir funcionalidad a una aplicación.

Los plugins se añaden a una aplicación llamando a `app.use(plugin)`. El plugin en sí es una función o un objeto con una función `install`. Esa función recibirá la instancia de la aplicación y podrá hacer lo que necesite.

Para más detalles, consulta:

- [Guía - Plugins](/guide/reusability/plugins.html)

## prop {#prop}

Existen tres usos comunes del término _prop_ en Vue:

- Component props
- VNode props
- Slot props

Los _Component props_ son lo que la mayoría de la gente entiende por props. Estos se definen explícitamente por un componente usando `defineProps()` o la opción `props`.

El término _VNode props_ se refiere a las propiedades del objeto pasado como segundo argumento a `h()`. Estos pueden incluir component props, pero también pueden incluir eventos del componente, eventos del DOM, atributos del DOM y propiedades del DOM. Normalmente solo te encontrarías con VNode props si estás trabajando con funciones de renderizado para manipular VNodes directamente.

Los _Slot props_ son las propiedades pasadas a un slot con ámbito.

En todos los casos, las props son propiedades que se pasan desde otro lugar.

Aunque la palabra props se deriva de la palabra _properties_ (propiedades), el término props tiene un significado mucho más específico en el contexto de Vue. Debes evitar usarlo como abreviatura de _properties_.

Para más detalles, consulta:

- [Guía - Props](/guide/components/props.html)
- [Guía - Funciones de Renderizado & JSX](/guide/extras/render-function.html)
- [Guía - Slots - Slots con Ámbito](/guide/components/slots.html#scoped-slots)

## provide / inject {#provide-inject}

`provide` e `inject` son una forma de comunicación entre componentes.

Cuando un componente _provee_ un valor, todos los descendientes de ese componente pueden elegir tomar ese valor utilizando `inject`. A diferencia de las props, el componente que provee no sabe con precisión qué componente está recibiendo el valor.

`provide` e `inject` a veces se utilizan para evitar el _prop drilling_ (propagación de props). También pueden usarse como una forma implícita para que un componente se comunique con el contenido de su slot.

`provide` también se puede usar a nivel de aplicación, haciendo que un valor esté disponible para todos los componentes dentro de esa aplicación.

Para más detalles, consulta:

- [Guía - Provide / Inject](/guide/components/provide-inject.html)

## reactive effect {#reactive-effect}

Un _reactive effect_ (efecto reactivo) forma parte del sistema de reactividad de Vue. Se refiere al proceso de rastrear las dependencias de una función y volver a ejecutar esa función cuando cambian los valores de esas dependencias.

`watchEffect()` es la forma más directa de crear un effect. Varias otras partes de Vue utilizan effects internamente, por ejemplo, las actualizaciones de renderizado de componentes, `computed()` y `watch()`.

Vue solo puede rastrear dependencias reactivas dentro de un reactive effect. Si el valor de una propiedad se lee fuera de un reactive effect, "perderá" la reactividad, en el sentido de que Vue no sabrá qué hacer si esa propiedad cambia posteriormente.

El término se deriva de 'side effect' (efecto secundario). Llamar a la función effect es un side effect del cambio del valor de la propiedad.

Para más detalles, consulta:

- [Guía - Reactividad en Profundidad](/guide/extras/reactivity-in-depth.html)

## reactividad {#reactivity}

En general, la _reactividad_ se refiere a la capacidad de realizar acciones automáticamente en respuesta a cambios de datos. Por ejemplo, actualizar el DOM o realizar una solicitud de red cuando cambia un valor de datos.

En el contexto de Vue, la reactividad se utiliza para describir una colección de características. Esas características se combinan para formar un _sistema de reactividad_, que se expone a través de la [API de Reactividad](#reactivity-api).

Existen varias formas diferentes en que se podría implementar un sistema de reactividad. Por ejemplo, podría hacerse mediante el análisis estático del código para determinar sus dependencias. Sin embargo, Vue no emplea esa forma de sistema de reactividad.

En su lugar, el sistema de reactividad de Vue rastrea el acceso a las propiedades en tiempo de ejecución. Lo hace utilizando tanto envoltorios Proxy como funciones [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)/[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) para las propiedades.

Para más detalles, consulta:

- [Guía - Fundamentos de Reactividad](/guide/essentials/reactivity-fundamentals.html)
- [Guía - Reactividad en Profundidad](/guide/extras/reactivity-in-depth.html)

## API de Reactividad {#reactivity-api}

La _API de Reactividad_ es una colección de funciones centrales de Vue relacionadas con la [reactividad](#reactivity). Estas se pueden usar independientemente de los componentes. Incluye funciones como `ref()`, `reactive()`, `computed()`, `watch()` y `watchEffect()`.

La API de Reactividad es un subconjunto de la Composition API.

Para más detalles, consulta:

- [API de Reactividad: Núcleo](/api/reactivity-core.html)
- [API de Reactividad: Utilidades](/api/reactivity-utilities.html)
- [API de Reactividad: Avanzado](/api/reactivity-advanced.html)

## ref {#ref}

> Esta entrada trata sobre el uso de `ref` para la reactividad. Para el atributo `ref` utilizado en los templates, consulta [template ref](#template-ref) en su lugar.

Una `ref` (referencia) forma parte del sistema de reactividad de Vue. Es un objeto con una única propiedad reactiva, llamada `value`.

Existen varios tipos diferentes de referencias. Por ejemplo, las refs se pueden crear utilizando `ref()`, `shallowRef()`, `computed()` y `customRef()`. La función `isRef()` se puede usar para verificar si un objeto es una ref, y `isReadonly()` se puede usar para verificar si la ref permite la reasignación directa de su valor.

Para más detalles, consulta:

- [Guía - Fundamentos de Reactividad](/guide/essentials/reactivity-fundamentals.html)
- [API de Reactividad: Núcleo](/api/reactivity-core.html)
- [API de Reactividad: Utilidades](/api/reactivity-utilities.html)
- [API de Reactividad: Avanzado](/api/reactivity-advanced.html)

## función de renderizado {#render-function}

Una _función de renderizado_ es la parte de un componente que genera los VNodes utilizados durante el renderizado. Los templates se compilan en funciones de renderizado.

Para más detalles, consulta:

- [Guía - Funciones de Renderizado & JSX](/guide/extras/render-function.html)

## scheduler {#scheduler}

El _scheduler_ (planificador) es la parte de los internos de Vue que controla el momento en que se ejecutan los [reactive effects](#reactive-effect).

Cuando el estado reactivo cambia, Vue no activa inmediatamente las actualizaciones de renderizado. En su lugar, las agrupa utilizando una cola. Esto asegura que un componente solo se vuelva a renderizar una vez, incluso si se realizan múltiples cambios en los datos subyacentes.

Los [Watchers](/guide/essentials/watchers.html) también se agrupan utilizando la cola del planificador. Los watchers con `flush: 'pre'` (el valor por defecto) se ejecutarán antes del renderizado del componente, mientras que los que tienen `flush: 'post'` se ejecutarán después del renderizado del componente.

Los trabajos en el planificador también se utilizan para realizar varias otras tareas internas, como activar algunos [hooks del ciclo de vida](#lifecycle-hooks) y actualizar [template refs](#template-ref).

## slot con ámbito {#scoped-slot}

El término _slot con ámbito_ se utiliza para referirse a un [slot](#slot) que recibe [props](#prop).

Históricamente, Vue hacía una distinción mucho mayor entre slots con ámbito y sin ámbito. Hasta cierto punto, podrían considerarse dos características separadas, unificadas bajo una sintaxis de template común.

En Vue 3, las API de slot se simplificaron para que todos los slots se comportaran como slots con ámbito. Sin embargo, los casos de uso para los slots con ámbito y los slots sin ámbito a menudo difieren, por lo que el término sigue siendo útil como una forma de referirse a los slots con props.

Las props pasadas a un slot solo se pueden usar dentro de una región específica del template padre, responsable de definir el contenido del slot. Esta región del template se comporta como un ámbito de variable para las props, de ahí el nombre 'slot con ámbito'.

Para más detalles, consulta:

- [Guía - Slots - Slot con Ámbito](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

Ver [Componente de Archivo Único](#single-file-component).

## side effect {#side-effect}

El término _side effect_ (efecto secundario) no es específico de Vue. Se utiliza para describir operaciones o funciones que hacen algo más allá de su ámbito local.

Por ejemplo, en el contexto de establecer una propiedad como `user.name = null`, se espera que esto cambie el valor de `user.name`. Si también hace algo más, como activar el sistema de reactividad de Vue, entonces esto se describiría como un side effect. Este es el origen del término [reactive effect](#reactive-effect) dentro de Vue.

Cuando se describe una función como que tiene side effects, significa que la función realiza algún tipo de acción observable fuera de la función, además de simplemente devolver un valor. Esto podría significar que actualiza un valor en el estado o que activa una solicitud de red.

El término se usa a menudo al describir el renderizado o las propiedades computed. Se considera una buena práctica que el renderizado no tenga side effects. Del mismo modo, la función getter para una propiedad computada no debe tener side effects.

## Componente de Archivo Único {#single-file-component}

El término _Componente de Archivo Único_, o SFC, se refiere al formato de archivo `.vue` que se utiliza comúnmente para los componentes de Vue.

Ver también:

- [Guía - Componentes de Archivo Único (SFC)](/guide/scaling-up/sfc.html)
- [Especificación de la Sintaxis SFC](/api/sfc-spec.html)

## slot {#slot}

Los slots se utilizan para pasar contenido a los componentes hijos. Mientras que las props se utilizan para pasar valors de datos, los slots se utilizan para pasar contenido más rico, consistente en elementos HTML y otros componentes de Vue.

Para más detalles, consulta:

- [Guía - Slots](/guide/components/slots.html)

## template ref {#template-ref}

El término _template ref_ (ref de template) se refiere al uso de un atributo `ref` en una etiqueta dentro de un template. Después de que el componente se renderiza, este atributo se utiliza para poblar una propiedad correspondiente con el elemento HTML o la instancia del componente que corresponde a la etiqueta en el template.

Si estás utilizando la Options API, entonces los refs se exponen a través de las propiedades del objeto `$refs`.

Con la Composition API, los template refs pueblan un [ref](#ref) reactivo con el mismo nombre.

Los template refs no deben confundirse con los refs reactivos que se encuentran en el sistema de reactividad de Vue.

Para más detalles, consulta:

- [Guía - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

Ver [virtual DOM](#virtual-dom).

## virtual DOM {#virtual-dom}

El término _virtual DOM_ (VDOM) no es exclusivo de Vue. Es un enfoque común utilizado por varios frameworks web para gestionar las actualizaciones de la interfaz de usuario.

Los navegadores utilizan un árbol de nodos para representar el estado actual de la página. Ese árbol, y las API de JavaScript utilizadas para interactuar con él, se conocen como _document object model_, o _DOM_.

Manipular el DOM es un cuello de botella importante en el rendimiento. El virtual DOM proporciona una estrategia para gestionar eso.

En lugar de crear nodos del DOM directamente, los componentes de Vue generan una descripción de los nodos del DOM que desearían. Estos descriptores son objetos JavaScript planos, conocidos como VNodes (nodos del virtual DOM). Crear VNodes es relativamente económico.

Cada vez que un componente se vuelve a renderizar, el nuevo árbol de VNodes se compara con el árbol de VNodes anterior y cualquier diferencia se aplica al DOM real. Si nada ha cambiado, entonces no es necesario tocar el DOM.

Vue utiliza un enfoque híbrido que llamamos [Virtual DOM informado por el compilador](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom). El compilador de templates de Vue es capaz de aplicar optimizaciones de rendimiento basadas en el análisis estático del template. En lugar de realizar una comparación completa de los árboles de VNodes antiguos y nuevos de un componente en tiempo de ejecución, Vue puede usar la información extraída por el compilador para reducir la comparación solo a las partes del árbol que realmente pueden cambiar.

Para más detalles, consulta:

- [Guía - Mecanismo de Renderizado](/guide/extras/rendering-mechanism.html)
- [Guía - Funciones de Renderizado & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

Un _VNode_ es un _virtual DOM node_ (nodo del virtual DOM). Se pueden crear utilizando la función [`h()`](/api/render-function.html#h).

Consulta [virtual DOM](#virtual-dom) para obtener más información.

## Componente Web {#web-component}

El estándar _Componentes Web_ es una colección de características implementadas en los navegadores web modernos.

Los componentes de Vue no son Componentes Web, pero `defineCustomElement()` se puede utilizar para crear un [custom element](#custom-element) a partir de un componente de Vue. Vue también soporta el uso de custom elements dentro de los componentes de Vue.

Para más detalles, consulta:

- [Guía - Vue y Componentes Web](/guide/extras/web-components.html)
