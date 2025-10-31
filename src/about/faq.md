# Preguntas Frecuentes {#frequently-asked-questions}

## ¿Quién mantiene Vue? {#who-maintains-vue}

Vue es un proyecto independiente, impulsado por la comunidad. Fue creado por [Evan You](https://twitter.com/youyuxi) en 2014 como un proyecto personal paralelo. Hoy en día, Vue es mantenido activamente por [un equipo de miembros tanto a tiempo completo como voluntarios de todo el mundo](/about/team), donde Evan actúa como líder del proyecto. Puedes aprender más sobre la historia de Vue en este [documental](https://www.youtube.com/watch?v=OrxmtDw4pVI).

El desarrollo de Vue se financia principalmente a través de patrocinios y hemos sido financieramente sostenibles desde 2016. Si tú o tu negocio se benefician de Vue, ¡considera [patrocinarnos](/sponsor/) para apoyar el desarrollo de Vue!

## ¿Cuál es la diferencia entre Vue 2 y Vue 3? {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 es la versión principal actual y más reciente de Vue. Contiene nuevas características que no están presentes en Vue 2, como Teleport, Suspense, y múltiples elementos raíz por `template`. También contiene cambios importantes que lo hacen incompatible con Vue 2. Los detalles completos están documentados en la [Guía de Migración de Vue 3](https://v3-migration.vuejs.org/).

A pesar de las diferencias, la mayoría de las `API` de Vue se comparten entre las dos versiones principales, por lo que la mayor parte de tus conocimientos de Vue 2 seguirán funcionando en Vue 3. Cabe destacar que la `Composition API` fue originalmente una característica exclusiva de Vue 3, pero ahora ha sido retroportada a Vue 2 y está disponible en [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01).

En general, Vue 3 proporciona tamaños de paquete más pequeños, mejor rendimiento, mejor escalabilidad y mejor soporte para TypeScript / `IDE`. Si estás comenzando un nuevo proyecto hoy, Vue 3 es la opción recomendada. Actualmente, solo hay algunas razones para considerar Vue 2:

- Necesitas soportar IE11. Vue 3 aprovecha las características modernas de JavaScript y no soporta IE11.

Si tienes la intención de migrar una aplicación existente de Vue 2 a Vue 3, consulta la [guía de migración](https://v3-migration.vuejs.org/).

## ¿Vue 2 sigue siendo compatible? {#is-vue-2-still-supported}

Vue 2.7, que se lanzó en julio de 2022, es la última versión menor de la rama de Vue 2. Vue 2 ha entrado en modo de mantenimiento: ya no se enviarán nuevas características, pero seguirá recibiendo correcciones de errores críticos y actualizaciones de seguridad durante 18 meses a partir de la fecha de lanzamiento de la 2.7. Esto significa que **Vue 2 llegó al fin de su vida útil el 31 de diciembre de 2023**.

Creemos que esto debería proporcionar tiempo suficiente para que la mayor parte del ecosistema migre a Vue 3. Sin embargo, también entendemos que podría haber equipos o proyectos que no puedan actualizarse dentro de este plazo y que aún necesiten cumplir con los requisitos de seguridad y cumplimiento. Nos hemos asociado con expertos de la industria para proporcionar soporte extendido para Vue 2 a los equipos con tales necesidades; si tu equipo espera usar Vue 2 más allá de finales de 2023, asegúrate de planificar con antelación y aprender más sobre [Vue 2 Extended LTS](https://v2.vuejs.org/lts/).

## ¿Qué licencia utiliza Vue? {#what-license-does-vue-use}

Vue es un proyecto de código abierto y gratuito lanzado bajo la [Licencia MIT](https://opensource.org/licenses/MIT).

## ¿Qué navegadores soporta Vue? {#what-browsers-does-vue-support}

La última versión de Vue (3.x) solo soporta [navegadores con soporte nativo de ES2016](https://caniuse.com/es2016). Esto excluye IE11. Vue 3.x utiliza características de ES2016 que no pueden ser `polyfilled` en navegadores antiguos, por lo que si necesitas soportar navegadores antiguos, deberás usar Vue 2.x en su lugar.

## ¿Es Vue fiable? {#is-vue-reliable}

Vue es un `framework` maduro y probado en batalla. Es uno de los `frameworks` de JavaScript más utilizados en producción hoy en día, con más de 1.5 millones de usuarios en todo el mundo, y se descarga cerca de 10 millones de veces al mes en `npm`.

Vue es utilizado en producción por organizaciones reconocidas en diversas capacidades en todo el mundo, incluyendo Wikimedia Foundation, NASA, Apple, Google, Microsoft, GitLab, Zoom, Tencent, Weibo, Bilibili, Kuaishou y muchas más.

## ¿Es Vue rápido? {#is-vue-fast}

Vue 3 es uno de los `frameworks` `frontend` principales más performantes, y maneja la mayoría de los casos de uso de aplicaciones web con facilidad, sin necesidad de optimizaciones manuales.

En escenarios de pruebas de estrés, Vue supera a `React` y `Angular` por un margen decente en el [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html). También compite codo con codo con algunos de los `frameworks` de nivel de producción más rápidos que no utilizan `Virtual-DOM` en el `benchmark`.

Ten en cuenta que los `benchmarks` sintéticos como el anterior se centran en el rendimiento de renderizado puro con optimizaciones dedicadas y pueden no ser totalmente representativos de los resultados de rendimiento en el mundo real. Si te preocupa más el rendimiento de carga de la página, te invitamos a auditar este mismo sitio web utilizando [WebPageTest](https://www.webpagetest.org/lighthouse) o [PageSpeed Insights](https://pagespeed.web.dev/). Este sitio web funciona con Vue, con pre-renderizado `SSG`, hidratación completa de la página y navegación `SPA` del lado del cliente. Obtiene una puntuación de 100 en rendimiento en un Moto G4 emulado con 4x de limitación de CPU a través de redes 4G lentas.

Puedes aprender más sobre cómo Vue optimiza automáticamente el rendimiento en tiempo de ejecución en la sección de [Mecanismo de Renderizado](/guide/extras/rendering-mechanism), y cómo optimizar una aplicación Vue en casos particularmente exigentes en la [Guía de Optimización de Rendimiento](/guide/best-practices/performance).

## ¿Es Vue ligero? {#is-vue-lightweight}

Cuando utilizas una herramienta de compilación, muchas de las `API` de Vue son ["tree-shakable"](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking). Por ejemplo, si no utilizas el componente `<Transition>` integrado, no se incluirá en el paquete de producción final.

Una aplicación "hello world" de Vue que solo utiliza las `API` mínimas tiene un tamaño base de solo alrededor de **16kb**, con minificación y compresión brotli. El tamaño real de la aplicación dependerá de cuántas características opcionales utilices del `framework`. En el improbable caso de que una aplicación utilice cada una de las características que Vue proporciona, el tamaño total en tiempo de ejecución es de alrededor de **27kb**.

Al usar Vue sin una herramienta de compilación, no solo perdemos el `tree-shaking`, sino que también tenemos que enviar el `template compiler` al navegador. Esto aumenta el tamaño a alrededor de **41kb**. Por lo tanto, si estás utilizando Vue principalmente para mejora progresiva sin un paso de compilación, considera usar [petite-vue](https://github.com/vuejs/petite-vue) (solo **6kb**) en su lugar.

Algunos `frameworks`, como `Svelte`, utilizan una estrategia de compilación que produce una salida extremadamente ligera en escenarios de un solo componente. Sin embargo, [nuestra investigación](https://github.com/yyx990803/vue-svelte-size-analysis) muestra que la diferencia de tamaño depende en gran medida del número de componentes en la aplicación. Si bien Vue tiene un tamaño base más pesado, genera menos código por componente. En escenarios del mundo real, una aplicación Vue bien podría terminar siendo más ligera.

## ¿Es Vue escalable? {#does-vue-scale}

Sí. A pesar de la concepción errónea común de que Vue solo es adecuado para casos de uso sencillos, Vue es perfectamente capaz de manejar aplicaciones a gran escala:

- Los [Componentes de Archivo Único](/guide/scaling-up/sfc) (`SFC`) proporcionan un modelo de desarrollo modularizado que permite que diferentes partes de una aplicación se desarrollen de forma aislada.

- La [Composition API](/guide/reusability/composables) proporciona una integración de primera clase con `TypeScript` y permite patrones limpios para organizar, extraer y reutilizar lógica compleja.

- El [soporte integral de herramientas](/guide/scaling-up/tooling) garantiza una experiencia de desarrollo fluida a medida que la aplicación crece.

- Una menor barrera de entrada y una excelente documentación se traducen en menores costos de incorporación y capacitación para nuevos desarrolladores.

## ¿Cómo contribuyo a Vue? {#how-do-i-contribute-to-vue}

¡Agradecemos tu interés! Por favor, consulta nuestra [Guía de la Comunidad](/about/community-guide).

## ¿Debería usar Options API o Composition API? {#should-i-use-options-api-or-composition-api}

Si eres nuevo en Vue, proporcionamos una comparación de alto nivel entre los dos estilos [aquí](/guide/introduction#which-to-choose).

Si has utilizado previamente la `Options API` y actualmente estás evaluando la `Composition API`, consulta [esta FAQ](/guide/extras/composition-api-faq).

## ¿Debería usar JavaScript o TypeScript con Vue? {#should-i-use-javascript-or-typescript-with-vue}

Si bien Vue está implementado en `TypeScript` y proporciona soporte de primera clase para `TypeScript`, no impone una opinión sobre si debes usar `TypeScript` como usuario.

El soporte de `TypeScript` es una consideración importante cuando se añaden nuevas características a Vue. Las `API` que se diseñan teniendo en cuenta `TypeScript` suelen ser más fáciles de entender para los `IDE` y los `linters`, incluso si no estás usando `TypeScript` tú mismo. Todos ganan. Las `API` de Vue también están diseñadas para funcionar de la misma manera tanto en `JavaScript` como en `TypeScript` en la medida de lo posible.

Adoptar `TypeScript` implica una compensación entre la complejidad de la incorporación y las ganancias de mantenibilidad a largo plazo. Si tal compensación se puede justificar puede variar dependiendo de la experiencia de tu equipo y la escala del proyecto, pero Vue no es realmente un factor influyente en la toma de esa decisión.

## ¿Cómo se compara Vue con los Web Components? {#how-does-vue-compare-to-web-components}

Vue fue creado antes de que los `Web Components` estuvieran disponibles de forma nativa, y algunos aspectos del diseño de Vue (por ejemplo, `slots`) se inspiraron en el modelo de `Web Components`.

Las especificaciones de los `Web Components` son de nivel relativamente bajo, ya que se centran en la definición de elementos personalizados. Como `framework`, Vue aborda preocupaciones adicionales de nivel superior como el renderizado eficiente del `DOM`, la gestión reactiva del estado, las herramientas, el enrutamiento del lado del cliente y el renderizado del lado del servidor.

Vue también soporta completamente el consumo o la exportación a elementos personalizados nativos - consulta la [Guía de Vue y Web Components](/guide/extras/web-components) para más detalles.

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->