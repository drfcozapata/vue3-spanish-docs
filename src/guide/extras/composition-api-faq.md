---
outline: deep
---

# Preguntas Frecuentes de la Composition API {#composition-api-faq}

:::tip
Este FAQ asume experiencia previa con Vue - en particular, experiencia con Vue 2 usando principalmente la Options API.
:::

## ¿Qué es la Composition API? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Lección Gratuita de Composition API"/>

La Composition API es un conjunto de APIs que nos permite crear componentes Vue usando funciones importadas en lugar de declarar opciones. Es un término paraguas que cubre las siguientes APIs:

- [Reactivity API](/api/reactivity-core), por ejemplo, `ref()` y `reactive()`, que nos permite crear directamente estado reactivo, estado computado y observadores.

- [Hooks de Ciclo de Vida](/api/composition-api-lifecycle), por ejemplo, `onMounted()` y `onUnmounted()`, que nos permiten conectarnos programáticamente al ciclo de vida del componente.

- [Inyección de Dependencias](/api/composition-api-dependency-injection), es decir, `provide()` y `inject()`, que nos permiten aprovechar el sistema de inyección de dependencias de Vue mientras usamos las Reactivity APIs.

La Composition API es una característica incorporada de Vue 3 y [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). Para versiones anteriores de Vue 2, usa el plugin [`@vue/composition-api`](https://github.com/vuejs/composition-api) mantenido oficialmente. En Vue 3, también se utiliza principalmente junto con la sintaxis [`<script setup>`](/api/sfc-script-setup) en Componentes de Archivo Único (Single-File Components). Aquí tienes un ejemplo básico de un componente usando la Composition API:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

A pesar de un estilo de API basado en la composición de funciones, **la Composition API NO es programación funcional**. La Composition API se basa en el paradigma de reactividad mutable y de grano fino de Vue, mientras que la programación funcional enfatiza la inmutabilidad.

Si estás interesado en aprender a usar Vue con la Composition API, puedes establecer la preferencia de API de todo el sitio a Composition API usando el interruptor en la parte superior de la barra lateral izquierda, y luego revisar la guía desde el principio.

## ¿Por qué la Composition API? {#why-composition-api}

### Mejor Reutilización de Lógica {#better-logic-reuse}

La ventaja principal de la Composition API es que permite una reutilización de lógica limpia y eficiente en forma de [funciones Composable](/guide/reusability/composables). Resuelve [todos los inconvenientes de los mixins](/guide/reusability/composables#vs-mixins), el mecanismo principal de reutilización de lógica para la Options API.

La capacidad de reutilización de lógica de la Composition API ha dado lugar a impresionantes proyectos comunitarios como [VueUse](https://vueuse.org/), una colección cada vez mayor de utilidades composable. También sirve como un mecanismo limpio para integrar fácilmente servicios o librerías de terceros con estado en el sistema de reactividad de Vue, por ejemplo [datos inmutables](/guide/extras/reactivity-in-depth#immutable-data), [máquinas de estado](/guide/extras/reactivity-in-depth#state-machines), y [RxJS](/guide/extras/reactivity-in-depth#rxjs).

### Organización de Código Más Flexible {#more-flexible-code-organization}

A muchos usuarios les encanta que escribamos código organizado por defecto con la Options API: todo tiene su lugar según la opción a la que pertenece. Sin embargo, la Options API plantea serias limitaciones cuando la lógica de un solo componente crece más allá de un cierto umbral de complejidad. Esta limitación es particularmente prominente en componentes que necesitan lidiar con múltiples **preocupaciones lógicas**, lo que hemos presenciado de primera mano en muchas aplicaciones de Vue 2 en producción.

Tomemos como ejemplo el componente explorador de carpetas de la GUI de Vue CLI: este componente es responsable de las siguientes preocupaciones lógicas:

- Seguimiento del estado de la carpeta actual y visualización de su contenido
- Gestión de la navegación por carpetas (abrir, cerrar, actualizar...)
- Gestión de la creación de nuevas carpetas
- Alternar mostrar solo carpetas favoritas
- Alternar mostrar carpetas ocultas
- Gestión de los cambios en el directorio de trabajo actual

La [versión original](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) del componente fue escrita en Options API. Si damos a cada línea de código un color basado en la preocupación lógica que aborda, así es como se ve:

<img alt="componente de carpeta antes" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

Observa cómo el código que trata la misma preocupación lógica se ve forzado a dividirse bajo diferentes opciones, ubicado en distintas partes del archivo. En un componente de varios cientos de líneas, comprender y navegar por una única preocupación lógica requiere desplazarse constantemente hacia arriba y hacia abajo por el archivo, lo que lo hace mucho más difícil de lo que debería ser. Además, si alguna vez tenemos la intención de extraer una preocupación lógica en una utilidad reutilizable, requiere bastante trabajo encontrar y extraer las piezas de código correctas de diferentes partes del archivo.

Aquí está el mismo componente, antes y después del [refactor a Composition API](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e):

![componente de carpeta después](./images/composition-api-after.png)

Observa cómo el código relacionado con la misma preocupación lógica ahora puede agruparse: ya no necesitamos saltar entre diferentes bloques de opciones mientras trabajamos en una preocupación lógica específica. Además, ahora podemos mover un grupo de código a un archivo externo con un esfuerzo mínimo, ya que ya no necesitamos reorganizar el código para extraerlo. Esta reducción de la fricción para la refactorización es clave para la mantenibilidad a largo plazo en grandes bases de código.

### Mejor Inferencia de Tipos {#better-type-inference}

En los últimos años, cada vez más desarrolladores frontend están adoptando [TypeScript](https://www.typescriptlang.org/) ya que nos ayuda a escribir código más robusto, realizar cambios con mayor confianza y proporciona una excelente experiencia de desarrollo con soporte IDE. Sin embargo, la Options API, concebida originalmente en 2013, fue diseñada sin tener en cuenta la inferencia de tipos. Tuvimos que implementar algunas [gimnasias de tipos absurdamente complejas](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165) para hacer que la inferencia de tipos funcionara con la Options API. Incluso con todo este esfuerzo, la inferencia de tipos para la Options API aún puede fallar para mixins y la inyección de dependencias.

Esto había llevado a muchos desarrolladores que querían usar Vue con TS a inclinarse hacia la Class API impulsada por `vue-class-component`. Sin embargo, una API basada en clases depende en gran medida de los decoradores ES, una característica del lenguaje que era solo una propuesta en etapa 2 cuando Vue 3 se estaba desarrollando en 2019. Sentimos que era demasiado arriesgado basar una API oficial en una propuesta inestable. Desde entonces, la propuesta de decoradores ha pasado por otra revisión completa, y finalmente alcanzó la etapa 3 en 2022. Además, la API basada en clases sufre limitaciones de reutilización de lógica y organización similares a la Options API.

En comparación, la Composition API utiliza principalmente variables y funciones simples, que son naturalmente amigables con los tipos. El código escrito en Composition API puede disfrutar de una inferencia de tipos completa con poca necesidad de sugerencias de tipos manuales. La mayoría de las veces, el código de la Composition API se verá en gran medida idéntico en TypeScript y JavaScript plano. Esto también hace posible que los usuarios de JavaScript plano se beneficien de la inferencia de tipos parcial.

### Paquete de Producción Más Pequeño y Menos Sobrecarga {#smaller-production-bundle-and-less-overhead}

El código escrito en Composition API y `<script setup>` también es más eficiente y amigable con la minificación que su equivalente en Options API. Esto se debe a que la plantilla en un componente `<script setup>` se compila como una función en línea en el mismo alcance del código `<script setup>`. A diferencia del acceso a propiedades desde `this`, el código de plantilla compilado puede acceder directamente a las variables declaradas dentro de `<script setup>`, sin un proxy de instancia intermedio. Esto también conduce a una mejor minificación porque todos los nombres de las variables pueden acortarse de forma segura.

## Relación con la Options API {#relationship-with-options-api}

### Compromisos {#trade-offs}

Algunos usuarios que pasaron de la Options API encontraron su código de Composition API menos organizado, y concluyeron que la Composition API es "peor" en términos de organización del código. Recomendamos a los usuarios con tales opiniones que vean ese problema desde una perspectiva diferente.

Es cierto que la Composition API ya no proporciona las "barandillas de seguridad" que te guían para colocar tu código en sus respectivos cubos. A cambio, puedes escribir código de componente como lo harías al escribir JavaScript normal. Esto significa que **puedes y debes aplicar cualquier buena práctica de organización de código a tu código de Composition API como lo harías al escribir JavaScript normal**. Si puedes escribir JavaScript bien organizado, también deberías poder escribir código de Composition API bien organizado.

La Options API te permite "pensar menos" al escribir código de componente, por eso muchos usuarios la adoran. Sin embargo, al reducir la sobrecarga mental, también te encierra en el patrón de organización de código preestablecido sin una vía de escape, lo que puede dificultar la refactorización o la mejora de la calidad del código en proyectos de mayor escala. En este sentido, la Composition API proporciona una mejor escalabilidad a largo plazo.

### ¿Cubre la Composition API todos los casos de uso? {#does-composition-api-cover-all-use-cases}

Sí, en términos de lógica con estado. Al usar la Composition API, solo hay algunas opciones que aún pueden ser necesarias: `props`, `emits`, `name`, y `inheritAttrs`.

:::tip

Desde 3.3 puedes usar directamente `defineOptions` en `<script setup>` para establecer el nombre del componente o la propiedad `inheritAttrs`

:::

Si tienes la intención de usar exclusivamente la Composition API (junto con las opciones mencionadas anteriormente), puedes reducir unos pocos kbs de tu paquete de producción mediante una [bandera de tiempo de compilación](/api/compile-time-flags) que elimina el código relacionado con la Options API de Vue. Ten en cuenta que esto también afecta a los componentes Vue en tus dependencias.

### ¿Puedo usar ambas APIs en el mismo componente? {#can-i-use-both-apis-in-the-same-component}

Sí. Puedes usar la Composition API a través de la opción [`setup()`](/api/composition-api-setup) en un componente Options API.

Sin embargo, solo recomendamos hacerlo si tienes una base de código Options API existente que necesita integrarse con nuevas características / librerías externas escritas con Composition API.

### ¿Se deprecará la Options API? {#will-options-api-be-deprecated}

No, no tenemos ningún plan de hacerlo. La Options API es una parte integral de Vue y la razón por la que muchos desarrolladores la adoran. También nos damos cuenta de que muchos de los beneficios de la Composition API solo se manifiestan en proyectos de mayor escala, y la Options API sigue siendo una opción sólida para muchos escenarios de complejidad baja a media.

## Relación con la Class API {#relationship-with-class-api}

Ya no recomendamos usar la Class API con Vue 3, dado que la Composition API proporciona una excelente integración con TypeScript y beneficios adicionales de reutilización de lógica y organización del código.

## Comparación con React Hooks {#comparison-with-react-hooks}

La Composition API proporciona el mismo nivel de capacidades de composición de lógica que React Hooks, pero con algunas diferencias importantes.

React Hooks se invocan repetidamente cada vez que un componente se actualiza. Esto crea una serie de advertencias que pueden confundir incluso a desarrolladores React experimentados. También conduce a problemas de optimización del rendimiento que pueden afectar gravemente la experiencia de desarrollo. Aquí tienes algunos ejemplos:

- Los Hooks son sensibles al orden de llamada y no pueden ser condicionales.

- Las variables declaradas en un componente React pueden ser capturadas por un cierre de hook y volverse "obsoletas" si el desarrollador no pasa el array de dependencias correcto. Esto lleva a los desarrolladores React a depender de las reglas de ESLint para asegurar que las dependencias correctas sean pasadas. Sin embargo, la regla a menudo no es lo suficientemente inteligente y sobrecompensa la corrección, lo que lleva a invalidaciones innecesarias y dolores de cabeza cuando se encuentran casos límite.

- Los cálculos costosos requieren el uso de `useMemo`, lo que nuevamente requiere pasar manualmente el array de dependencias correcto.

- Los manejadores de eventos pasados a componentes hijos causan actualizaciones de hijos innecesarias por defecto, y requieren `useCallback` explícito como optimización. Esto casi siempre es necesario, y nuevamente requiere un array de dependencias correcto. Descuidar esto lleva a un sobredibujado de aplicaciones por defecto y puede causar problemas de rendimiento sin darse cuenta.

- El problema del cierre obsoleto, combinado con las características Concurrent, hace difícil razonar cuándo se ejecuta una parte del código de hooks, y hace que trabajar con estado mutable que debería persistir entre renders (a través de `useRef`) sea engorroso.

> Nota: algunos de los problemas anteriores relacionados con la memorización pueden resolverse con el próximo [React Compiler](https://react.dev/learn/react-compiler).

En comparación, la Composition API de Vue:

- Invoca el código de `setup()` o `<script setup>` solo una vez. Esto hace que el código se alinee mejor con las intuiciones del uso idiomático de JavaScript ya que no hay cierres obsoletos de los que preocuparse. Las llamadas a la Composition API tampoco son sensibles al orden de llamada y pueden ser condicionales.

- El sistema de reactividad en tiempo de ejecución de Vue recopila automáticamente las dependencias reactivas utilizadas en propiedades computadas y observadores, por lo que no hay necesidad de declarar dependencias manualmente.

- No es necesario almacenar en caché manualmente las funciones de callback para evitar actualizaciones innecesarias de los hijos. En general, el sistema de reactividad de grano fino de Vue asegura que los componentes hijos solo se actualicen cuando sea necesario. Las optimizaciones manuales de actualización de hijos rara vez son una preocupación para los desarrolladores de Vue.

Reconocemos la creatividad de React Hooks, y es una fuente importante de inspiración para la Composition API. Sin embargo, los problemas mencionados anteriormente existen en su diseño y notamos que el modelo de reactividad de Vue ofrece una forma de evitarlos.
