<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>
<style>
.lambdatest {
  background-color: var(--vt-c-bg-soft);
  border-radius: 8px;
  padding: 12px 16px 12px 12px;
  font-size: 13px;
  a {
    display: flex;
    color: var(--vt-c-text-2);
  }
  img {
    background-color: #fff;
    padding: 12px 16px;
    border-radius: 6px;
    margin-right: 24px;
  }
  .testing-partner {
    color: var(--vt-c-text-1);
    font-size: 15px;
    font-weight: 600;
  }
}
</style>

# Testing {#testing}

## ¿Por qué hacer tests? {#why-test}

Los tests automatizadas te ayudan a ti y a tu equipo a construir aplicaciones Vue complejas de forma rápida y con confianza, al prevenir regresiones y animarte a dividir tu aplicación en funciones, módulos, clases y componentes que pueden ser probados. Como cualquier aplicación, tu nueva aplicación Vue puede fallar de muchas maneras, y es importante que puedas detectar estos problemas y solucionarlos antes de su lanzamiento.

En esta guía, cubriremos la terminología básica y proporcionaremos nuestras recomendaciones sobre qué herramientas elegir para tu aplicación Vue 3.

Hay una sección específica de Vue que cubre los `composables`. Consulta [Pruebas de Composables](#testing-composables) a continuación para más detalles.

## Cuándo hacer tests {#when-to-test}

¡Empieza a hacer tests temprano! Te recomendamos que empieces a escribir tests tan pronto como sea posible. Cuanto más esperes para añadir tests a tu aplicación, más dependencias tendrá tu aplicación y más difícil será empezar.

## Tipos de Pruebas {#testing-types}

Al diseñar la estrategia de tests de tu aplicación Vue, debes aprovechar los siguientes tipos de tests:

- **Unidad**: Verifica que las entradas de una función, clase o `composable` dado producen la salida o los efectos secundarios esperados.
- **De Componentes**: Verifica que tu componente se monta, renderiza, puede ser interactuado y se comporta como se espera. Estas tests importan más código que los tests unitarias, son más complejas y requieren más tiempo para ejecutarse.
- **De extremo a extremo**: Verifica funcionalidades que abarcan múltiples páginas y realiza peticiones de red reales contra tu aplicación Vue construida para producción. Estas tests a menudo implican la configuración de una base de datos u otro `backend`.

Cada tipo de test desempeña un papel en la estrategia de tests de tu aplicación, y cada uno te protegerá contra diferentes tipos de problemas.

## Resumen {#overview}

Discutiremos brevemente qué es cada uno de ellos, cómo pueden implementarse para aplicaciones Vue y proporcionaremos algunas recomendaciones generales.

## Pruebas Unitarias {#unit-testing}

Los tests unitarias se escriben para verificar que pequeñas unidades de código aisladas funcionan como se espera. Una test unitaria generalmente cubre una sola función, clase, `composable` o módulo. Los tests unitarias se centran en la corrección lógica y solo se preocupan por una pequeña parte de la funcionalidad general de la aplicación. Pueden simular grandes partes del entorno de tu aplicación (por ejemplo, estado inicial, clases complejas, módulos de terceros y peticiones de red).

En general, los tests unitarias detectarán problemas con la lógica de negocio y la corrección lógica de una función.

Tomemos, por ejemplo, esta función `increment`:

```js [helpers.js]
export function increment(current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

Debido a que está muy autocontenida, será fácil invocar la función `increment` y afirmar que devuelve lo que se supone, por lo que escribiremos una Prueba Unitaria.

Si alguna de estas aserciones falla, está claro que el problema está contenido dentro de la función `increment`.

```js{3-15} [helpers.spec.js]
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

Como se mencionó anteriormente, los tests unitarias se aplican típicamente a la lógica de negocio autocontenida, componentes, clases, módulos o funciones que no implican renderizado de UI, peticiones de red u otras preocupaciones ambientales.

Estos son típicamente módulos de JavaScript / TypeScript puro no relacionados con Vue. En general, escribir tests unitarias para la lógica de negocio en aplicaciones Vue no difiere significativamente de las aplicaciones que usan otros `frameworks`.

Hay dos casos en los que SÍ se hacen tests unitarias de características específicas de Vue:

1.  Composables
2.  Componentes

### Composables {#composables}

Una categoría de funciones específicas de las aplicaciones Vue son los [Composables](/guide/reusability/composables), que pueden requerir un manejo especial durante los tests.
Consulta [Pruebas de Composables](#testing-composables) a continuación para más detalles.

### Pruebas Unitarias de Componentes {#unit-testing-components}

Un componente puede ser probado de dos maneras:

1.  Caja Blanca: Pruebas Unitarias

    Las "tests de caja blanca" son tests que conocen los detalles de implementación y las dependencias de un componente. Se centran en **aislar** el componente bajo test. Estas tests generalmente implicarán simular algunos, si no todos, los hijos de tu componente, así como configurar el estado de los `plugins` y las dependencias (por ejemplo, Pinia).

2.  Caja Negra: Pruebas de Componentes

    Las "tests de caja negra" son tests que desconocen los detalles de implementación de un componente. Estas tests simulan lo menos posible para probar la integración de tu componente y todo el sistema. Generalmente renderizan todos los componentes hijos y se consideran más una "test de integración". Consulta las [recomendaciones de Pruebas de Componentes](#component-testing) a continuación.

### Recomendación {#recommendation}

- [Vitest](https://vitest.dev/)

  Dado que la configuración oficial creada por `create-vue` se basa en [Vite](https://vitejs.dev/), recomendamos usar un `framework` de tests unitarias que pueda aprovechar la misma configuración y `pipeline` de transformación directamente desde Vite. [Vitest](https://vitest.dev/) es un `framework` de tests unitarias diseñado específicamente para este propósito, creado y mantenido por miembros del equipo de Vue / Vite. Se integra con proyectos basados en Vite con un esfuerzo mínimo y es increíblemente rápido.

### Otras Opciones {#other-options}

- [Jest](https://jestjs.io/) es un `framework` popular de tests unitarias. Sin embargo, solo recomendamos Jest si tienes un conjunto de tests Jest existente que necesita ser migrado a un proyecto basado en Vite, ya que Vitest ofrece una integración más fluida y un mejor rendimiento.

## Pruebas de Componentes {#component-testing}

En las aplicaciones Vue, los componentes son los principales bloques de construcción de la UI. Por lo tanto, los componentes son la unidad natural de aislamiento cuando se trata de validar el comportamiento de tu aplicación. Desde una perspectiva de granularidad, los tests de componentes se sitúan por encima de los tests unitarias y pueden considerarse una forma de tests de integración. Gran parte de tu aplicación Vue debería estar cubierta por una test de componentes y recomendamos que cada componente Vue tenga su propio archivo de especificación.

Los tests de componentes deben detectar problemas relacionados con las `props`, eventos, `slots` que proporciona tu componente, estilos, `classes`, `lifecycle hooks` y más.

Los tests de componentes no deben simular componentes hijos, sino que deben probar las interacciones entre tu componente y sus hijos interactuando con los componentes como lo haría un usuario. Por ejemplo, una test de componentes debe hacer clic en un elemento como lo haría un usuario en lugar de interactuar programáticamente con el componente.

Los tests de componentes deben centrarse en las interfaces públicas del componente en lugar de en los detalles de implementación internos. Para la mayoría de los componentes, la interfaz pública se limita a: eventos emitidos, `props` y `slots`. Al probar, recuerda **probar lo que hace un componente, no cómo lo hace**.

**HACER**

- Para lógica **Visual**: afirmar la salida de renderizado correcta basada en las `props` y `slots` introducidos.
- Para lógica **Comportamental**: afirmar las actualizaciones de renderizado correctas o los eventos emitidos en respuesta a los eventos de entrada del usuario.

  En el siguiente ejemplo, demostramos un componente `Stepper` que tiene un elemento DOM etiquetado como "increment" y se puede hacer clic en él. Pasamos una `prop` llamada `max` que evita que el `Stepper` se incremente más allá de `2`, por lo que si hacemos clic en el botón 3 veces, la UI aún debería mostrar `2`.

  No sabemos nada sobre la implementación de `Stepper`, solo que la "entrada" es la `prop` `max` y la "salida" es el estado del DOM tal como lo verá el usuario.

::: code-group

```js [Vue Test Utils]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

```js [Cypress]
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

mount(Stepper, {
  props: {
    max: 1
  }
})

cy.get(valueSelector)
  .should('be.visible')
  .and('contain.text', '0')
  .get(buttonSelector)
  .click()
  .get(valueSelector)
  .should('contain.text', '1')
```

```js [Testing Library]
const { getByText } = render(Stepper, {
  props: {
    max: 1
  }
})

getByText('0') // Implicit assertion that "0" is within the component

const button = getByRole('button', { name: /increment/i })

// Dispatch a click event to our increment button.
await fireEvent.click(button)

getByText('1')

await fireEvent.click(button)
```

:::

**NO HACER**

- No afirmar el estado privado de una instancia de componente ni probar los métodos privados de un componente. Probar detalles de implementación hace que los tests sean frágiles, ya que es más probable que fallen y requieran actualizaciones cuando la implementación cambia.

  El trabajo final del componente es renderizar la salida DOM correcta, por lo que los tests que se centran en la salida DOM proporcionan el mismo nivel de garantía de corrección (si no más) a la vez que son más robustas y resistentes a los cambios.

  No dependas exclusivamente de los tests de `snapshot`. Afirmar cadenas HTML no describe la corrección. Escribe tests con intencionalidad.

  Si un método necesita ser probado a fondo, considera extraerlo a una función de utilidad independiente y escribir una test unitaria dedicada para él. Si no puede extraerse limpiamente, puede probarse como parte de una test de componente, integración o de extremo a extremo que lo cubra.

### Recomendación {#recommendation-1}

- [Vitest](https://vitest.dev/) para componentes o `composables` que se renderizan sin interfaz gráfica (por ejemplo, la función [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) en VueUse). Los componentes y el DOM se pueden probar utilizando [`@vue/test-utils`](https://github.com/vuejs/test-utils).

- [Pruebas de Componentes con Cypress](https://on.cypress.io/component) para componentes cuyo comportamiento esperado depende de un renderizado correcto de estilos o de la activación de eventos DOM nativos. Puede utilizarse con Testing Library a través de [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro).

Las principales diferencias entre Vitest y los ejecutores basados en navegador son la velocidad y el contexto de ejecución. En resumen, los ejecutores basados en navegador, como Cypress, pueden detectar problemas que los ejecutores basados en Node, como Vitest, no pueden (por ejemplo, problemas de estilo, eventos DOM nativos reales, `cookies`, `local storage` y fallos de red), pero los ejecutores basados en navegador son _órdenes de magnitud más lentos que Vitest_ porque abren un navegador, compilan tus hojas de estilo y más. Cypress es un ejecutor basado en navegador que admite tests de componentes. Por favor, lee la [página de comparación de Vitest](https://vitest.dev/guide/comparisons.html#cypress) para obtener la información más reciente que compara Vitest y Cypress.

### Librerías de Montaje {#mounting-libraries}

Los tests de componentes a menudo implican montar el componente que se está probando de forma aislada, disparar eventos de entrada de usuario simulados y afirmar la salida DOM renderizada. Existen librerías de utilidad dedicadas que simplifican estas tareas.

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) es la librería oficial de bajo nivel para tests de componentes que fue escrita para proporcionar a los usuarios acceso a las API específicas de Vue. También es la librería de nivel inferior sobre la que se construye `@testing-library/vue`.

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) es una librería de tests de Vue centrada en probar componentes sin depender de los detalles de implementación. Su principio rector es que cuanto más se parezcan los tests a la forma en que se utiliza el software, mayor confianza pueden proporcionar.

Recomendamos usar `@vue/test-utils` para probar componentes en aplicaciones. `@testing-library/vue` tiene problemas al probar componentes asíncronos con `Suspense`, por lo que debe usarse con precaución.

### Otras Opciones {#other-options-1}

- [Nightwatch](https://nightwatchjs.org/) es un ejecutor de tests E2E con soporte para Pruebas de Componentes Vue. ([Proyecto de Ejemplo](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) para tests de componentes `cross-browser` que se basan en la interacción nativa del usuario basada en la automatización estandarizada. También se puede utilizar con Testing Library.

## Pruebas E2E {#e2e-testing}

Si bien los tests unitarias proporcionan a los desarrolladores cierto grado de confianza, los tests unitarias y de componentes son limitadas en su capacidad para proporcionar una cobertura holística de una aplicación cuando se despliega en producción. Como resultado, los tests de extremo a extremo (E2E) proporcionan cobertura sobre lo que es, posiblemente, el aspecto más importante de una aplicación: lo que sucede cuando los usuarios realmente utilizan tus aplicaciones.

Los tests de extremo a extremo se centran en el comportamiento de la aplicación multipágina que realiza peticiones de red contra tu aplicación Vue construida para producción. A menudo implican la configuración de una base de datos u otro `backend` e incluso pueden ejecutarse contra un entorno de `staging` en vivo.

Los tests de extremo a extremo a menudo detectarán problemas con tu `router`, librería de gestión de estado, componentes de nivel superior (por ejemplo, una `App` o `Layout`), activos públicos o cualquier manejo de peticiones. Como se indicó anteriormente, detectan problemas críticos que pueden ser imposibles de detectar con tests unitarias o de componentes.

Los tests de extremo a extremo no importan ningún código de tu aplicación Vue, sino que se basan completamente en probar tu aplicación navegando a través de páginas completas en un navegador real.

Los tests de extremo a extremo validan muchas de las capas de tu aplicación. Pueden dirigirse a tu aplicación construida localmente o incluso a un entorno de `staging` en vivo. Probar contra tu entorno de `staging` no solo incluye tu código `frontend` y servidor estático, sino todos los servicios e infraestructura de `backend` asociados.

> Cuanto más se parezcan tus tests a cómo se usa tu software, más confianza te pueden dar. - [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Autor de Testing Library

Al probar cómo las acciones del usuario impactan en tu aplicación, los tests E2E suelen ser la clave para una mayor confianza en si una aplicación funciona correctamente o no.

### Elegir una Solución de Pruebas E2E {#choosing-an-e2e-testing-solution}

Si bien los tests de extremo a extremo (E2E) en la web han ganado una reputación negativa por tests poco fiables (`flaky`) y por ralentizar los procesos de desarrollo, las herramientas E2E modernas han avanzado para crear tests más fiables, interactivas y útiles. Al elegir un `framework` de tests E2E, las siguientes secciones proporcionan algunas pautas sobre qué tener en cuenta al seleccionar un `framework` de tests para tu aplicación.

#### Pruebas `cross-browser` {#cross-browser-testing}

Uno de los principales beneficios por los que se conoce a los tests de extremo a extremo (E2E) es su capacidad para probar tu aplicación en múltiples navegadores. Si bien puede parecer deseable tener una cobertura `cross-browser` del 100%, es importante tener en cuenta que los tests `cross-browser` tienen rendimientos decrecientes en los recursos de un equipo debido al tiempo adicional y la potencia de máquina requeridos para ejecutarlas consistentemente. Como resultado, es importante ser consciente de esta compensación al elegir la cantidad de tests `cross-browser` que necesita tu aplicación.

#### Ciclos de retroalimentación más rápidos {#faster-feedback-loops}

Uno de los problemas principales con los tests de extremo a extremo (E2E) y el desarrollo es que ejecutar toda la `suite` lleva mucho tiempo. Típicamente, esto solo se hace en `pipelines` de integración y despliegue continuo (CI/CD). Los `frameworks` modernos de tests E2E han ayudado a resolver esto añadiendo características como la paralelización, lo que permite que los `pipelines` de CI/CD a menudo se ejecuten magnitudes más rápido que antes. Además, al desarrollar localmente, la capacidad de ejecutar selectivamente una sola test para la página en la que estás trabajando, al mismo tiempo que se proporciona la recarga en caliente de los tests, puede ayudar a impulsar el flujo de trabajo y la productividad de un desarrollador.

#### Experiencia de depuración de primera clase {#first-class-debugging-experience}

Si bien los desarrolladores han dependido tradicionalmente de escanear `logs` en una ventana de terminal para ayudar a determinar qué salió mal en una test, los `frameworks` modernos de tests de extremo a extremo (E2E) permiten a los desarrolladores aprovechar herramientas con las que ya están familiarizados, por ejemplo, las herramientas de desarrollador del navegador.

#### Visibilidad en modo `headless` {#visibility-in-headless-mode}

Cuando los tests de extremo a extremo (E2E) se ejecutan en `pipelines` de integración/despliegue continuo, a menudo se ejecutan en navegadores `headless` (es decir, no se abre ningún navegador visible para que el usuario lo vea). Una característica crítica de los `frameworks` modernos de tests E2E es la capacidad de ver `snapshots` y/o videos de la aplicación durante los tests, proporcionando una visión de por qué ocurren los errores. Históricamente, mantener estas integraciones era tedioso.

### Recomendación {#recommendation-2}

- [Playwright](https://playwright.dev/) es una excelente solución de tests E2E que soporta Chromium, WebKit y Firefox. Realiza tests en Windows, Linux y macOS, localmente o en CI, en modo `headless` o con interfaz gráfica, con emulación móvil nativa de Google Chrome para Android y Mobile Safari. Tiene una interfaz de usuario informativa, excelente capacidad de depuración, aserciones incorporadas, paralelización, `traces` y está diseñado para eliminar tests `flaky`. El soporte para [Pruebas de Componentes](https://playwright.dev/docs/test-components) está disponible, pero marcado como experimental. Playwright es `open source` y es mantenido por Microsoft.

- [Cypress](https://www.cypress.io/) tiene una interfaz gráfica informativa, excelente capacidad de depuración, aserciones incorporadas, `stubs`, resistencia a tests `flaky` y `snapshots`. Como se mencionó anteriormente, proporciona soporte estable para [Pruebas de Componentes](https://docs.cypress.io/guides/component-testing/introduction). Cypress soporta navegadores basados en Chromium, Firefox y Electron. El soporte para WebKit está disponible, pero marcado como experimental. Cypress tiene licencia MIT, pero algunas características como la paralelización requieren una suscripción a Cypress Cloud.

<div class="lambdatest">
  <a href="https://lambdatest.com" target="_blank">
    <img src="/images/lambdatest.svg">
    <div>
      <div class="testing-partner">Patrocinador de Pruebas</div>
      <div>¡Lambdatest es una plataforma en la nube para ejecutar tests E2E, de accesibilidad y de regresión visual en los principales navegadores y dispositivos reales, con generación de tests asistida por IA!</div>
    </div>
  </a>
</div>

### Otras Opciones {#other-options-2}

- [Nightwatch](https://nightwatchjs.org/) es una solución de tests E2E basada en [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver). Esto le otorga el rango más amplio de soporte de navegadores, incluyendo tests móviles nativas. Las soluciones basadas en Selenium serán más lentas que Playwright o Cypress.

- [WebdriverIO](https://webdriver.io/) es un `framework` de automatización de tests para tests web y móviles basado en el protocolo WebDriver.

## Recetas {#recipes}

### Añadir Vitest a un Proyecto {#adding-vitest-to-a-project}

En un proyecto Vue basado en Vite, ejecuta:

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

A continuación, actualiza la configuración de Vite para añadir el bloque de opciones `test`:

```js{5-11} [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // enable jest-like global test APIs
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
    environment: 'happy-dom'
  }
})
```

:::tip
Si usas TypeScript, añade `vitest/globals` al campo `types` en tu `tsconfig.json`.

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

Luego, crea un archivo que termine en `*.test.js` en tu proyecto. Puedes colocar todos los archivos de test en un directorio `test` en la raíz del proyecto o en directorios `test` junto a tus archivos fuente. Vitest los buscará automáticamente utilizando la convención de nombres.

```js [MyComponent.test.js]
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // assert output
  getByText('...')
})
```

Finalmente, actualiza `package.json` para añadir el `script` de test y ejecutarlo:

```json{4} [package.json]
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### Pruebas de Composables {#testing-composables}

> Esta sección asume que has leído la sección [Composables](/guide/reusability/composables).

Cuando se trata de probar `composables`, podemos dividirlos en dos categorías: `composables` que no dependen de una instancia de componente `host`, y `composables` que sí lo hacen.

Un `composable` depende de una instancia de componente `host` cuando utiliza las siguientes API:

- `Lifecycle hooks`
- `Provide` / `Inject`

Si un `composable` solo utiliza las API de `Reactivity`, entonces puede probarse invocándolo directamente y afirmando su estado/métodos devueltos:

```js [counter.js]
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js [counter.test.js]
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

Un `composable` que depende de `lifecycle hooks` o `Provide` / `Inject` necesita ser envuelto en un componente `host` para ser probado. Podemos crear un `helper` como el siguiente:

```js [test-utils.js]
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // suppress missing template warning
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // return the result and the app instance
  // for testing provide/unmount
  return [result, app]
}
```

```js [foo.test.js]
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // mock provide for testing injections
  app.provide(...)
  // run assertions
  expect(result.foo.value).toBe(1)
  // trigger onUnmounted hook if needed
  app.unmount()
})
```

Para `composables` más complejos, también podría ser más fácil probarlos escribiendo tests contra el componente `wrapper` utilizando técnicas de [Pruebas de Componentes](#component-testing).

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->
