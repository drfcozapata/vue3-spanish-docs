# Guía de Escritura de Documentación de Vue

Escribir documentación es un ejercicio de empatía. No estamos describiendo una realidad objetiva; el código fuente ya lo hace. Nuestro trabajo es ayudar a moldear la relación entre los usuarios y el ecosistema de Vue. Esta guía en constante evolución proporciona algunas reglas y recomendaciones sobre cómo lograrlo de manera consistente dentro del ecosistema de Vue.

## Principios

- **Una característica no existe hasta que está bien documentada.**
- **Respeta la capacidad cognitiva de los usuarios (es decir, el poder cerebral).** Cuando un usuario empieza a leer, comienza con una cantidad limitada de poder cerebral y, cuando se agota, deja de aprender.
  - La capacidad cognitiva se **agota más rápido** con oraciones complejas, al tener que aprender más de un concepto a la vez y con ejemplos abstractos que no se relacionan directamente con el trabajo del usuario.
  - La capacidad cognitiva se **agota más lentamente** cuando les ayudamos a sentirse consistentemente inteligentes, poderosos y curiosos. Desglosar las cosas en piezas digeribles y cuidar el flujo del documento puede ayudar a mantenerlos en este estado.
- **Intenta siempre ver desde la perspectiva del usuario.** Cuando entendemos algo a fondo, se vuelve obvio para nosotros. Esto se llama _la maldición del conocimiento_. Para escribir buena documentación, intenta recordar qué necesitabas saber la primera vez que aprendiste este concepto. ¿Qué jerga necesitaste aprender? ¿Qué malinterpretaste? ¿Qué te llevó mucho tiempo comprender realmente? Una buena documentación se encuentra con los usuarios donde están. Puede ser útil practicar la explicación del concepto a personas en persona antes.
- **Describe el _problema_ primero, luego la solución.** Antes de mostrar cómo funciona una característica, es importante explicar por qué existe. De lo contrario, los usuarios no tendrán el contexto para saber si esta información es importante para ellos (¿es un problema que experimentan?) o a qué conocimiento/experiencia previa conectarla.
- **Al escribir, no temas hacer preguntas**, _especialmente_ si temes que tus preguntas puedan ser "tontas". Ser vulnerable es difícil, pero es la única forma de comprender más a fondo lo que necesitamos explicar.
- **Participa en las discusiones sobre las características.** Las mejores APIs surgen del desarrollo impulsado por la documentación, donde construimos características que son fáciles de explicar, en lugar de intentar descubrir cómo explicarlas más tarde. Hacer preguntas (especialmente preguntas "tontas") antes a menudo ayuda a revelar confusiones, inconsistencias y comportamientos problemáticos antes de que se requiera un cambio importante para solucionarlos.

## Organización

- **Instalación/Integración**: Proporciona una descripción completa de cómo integrar el software en tantos tipos diferentes de proyectos como sea necesario.
- **Introducción/Primeros Pasos**:
  - Proporciona una descripción general de menos de 10 minutos sobre los problemas que resuelve el proyecto y por qué existe.
  - Proporciona una descripción general de menos de 30 minutos sobre los problemas que resuelve el proyecto y cómo, incluyendo cuándo y por qué usar el proyecto y algunos ejemplos de código simples. Al final, enlaza tanto a la página de Instalación como al inicio de la Guía de Esenciales.
- **Guía**: Haz que los usuarios se sientan inteligentes, poderosos y curiosos, luego mantén este estado para que los usuarios conserven la motivación y la capacidad cognitiva para seguir aprendiendo más. Las páginas de la guía están diseñadas para leerse secuencialmente, por lo que generalmente deben ordenarse de la relación poder/esfuerzo más alta a la más baja.
  - **Esenciales**: No debería tomar más de 5 horas leer los Esenciales, aunque más corto es mejor. Su objetivo es proporcionar el 20% del conocimiento que ayudará a los usuarios a manejar el 80% de los casos de uso. Los Esenciales pueden enlazar a guías más avanzadas y a la API, aunque, en la mayoría de los casos, debes evitar tales enlaces. Cuando se proporcionen, también debes proporcionar un contexto para que los usuarios sepan si deben seguir este enlace en su primera lectura. De lo contrario, muchos usuarios terminan agotando su capacidad cognitiva saltando de enlace en enlace, tratando de aprender completamente cada aspecto de una característica antes de continuar, y como resultado, nunca terminan esa primera lectura de los Esenciales. Recuerda que una lectura fluida es más importante que ser exhaustivo. Queremos dar a las personas la información que necesitan para evitar una experiencia frustrante, pero siempre pueden volver y leer más, o buscar en Google un problema menos común cuando lo encuentren.
  - **Avanzada**: Si bien los Esenciales ayudan a las personas a manejar aproximadamente el 80% de los casos de uso, las guías posteriores ayudan a los usuarios a llegar al 95% de los casos de uso, además de información más detallada sobre características no esenciales (por ejemplo, transiciones, animaciones), características de conveniencia más complejas (por ejemplo, `mixins`, `custom directives`) y mejoras en la experiencia del desarrollador (por ejemplo, `JSX`, `plugins`). El 5% final de los casos de uso que son más específicos, complejos y/o propensos a abusos se dejarán para el recetario y la referencia de la API, a los que se puede enlazar desde estas guías avanzadas.
- **Referencia/API**: Proporciona una lista completa de características, incluyendo información de tipos, descripciones del problema que resuelve cada una, ejemplos de cada combinación de opciones y enlaces a guías, recetas del recetario y otros recursos internos que proporcionan más detalles. A diferencia de otras páginas, esta no está destinada a leerse de arriba abajo, por lo que se pueden proporcionar muchos detalles. Estas referencias también deben ser más fáciles de escanear que las guías, por lo que el formato debe ser más parecido a entradas de diccionario que al formato narrativo de las guías.
- **Migraciones**:
  - **Versiones**: Cuando se realizan cambios importantes, es útil incluir una lista completa de cambios, incluyendo una explicación detallada de por qué se hizo el cambio y cómo migrar sus proyectos.
  - **Desde otros proyectos**: ¿Cómo se compara este software con un software similar? Esto es importante para ayudar a los usuarios a comprender qué problemas adicionales podríamos resolver o crear para ellos, y en qué medida pueden transferir el conocimiento que ya tienen.
- **Guía de Estilo**: Necesariamente hay algunas piezas clave en el desarrollo que necesitan una decisión, pero que no son fundamentales para la API. La guía de estilo proporciona recomendaciones fundamentadas y con opinión para ayudar a guiar estas decisiones. No deben seguirse a ciegas, pero pueden ayudar a los equipos a ahorrar tiempo al estar alineados en detalles menores.
- **Recetario**: Las recetas del recetario se escriben asumiendo cierta familiaridad con Vue y su ecosistema. Cada una es un documento altamente estructurado que detalla algunos aspectos de implementación comunes que un desarrollador de Vue podría encontrar.

## Escritura y Gramática

### Estilo

- **Los encabezados deben describir problemas**, no soluciones. Por ejemplo, un encabezado menos efectivo podría ser "Usando `props`", porque describe una solución. Un encabezado mejor podría ser "Pasando datos a componentes hijos con `props`", porque proporciona el contexto del problema que las `props` resuelven. Los usuarios no comenzarán a prestar atención a la explicación de una característica hasta que tengan alguna idea de por qué/cuándo la usarían.
- **Cuando asumas conocimientos, decláralo** al principio y enlaza a recursos para el conocimiento menos común que esperas.
- **Introduce solo un concepto nuevo a la vez siempre que sea posible** (incluyendo tanto texto como ejemplos de código). Incluso si muchas personas son capaces de entender cuando introduces más de uno, también hay muchas que se perderán, e incluso aquellos que no se pierdan habrán agotado más de su capacidad cognitiva.
- **Evita los bloques de contenido especiales para consejos y advertencias cuando sea posible.** Generalmente es preferible integrar estos de forma más natural en el contenido principal, por ejemplo, construyendo sobre ejemplos para demostrar un caso límite.
- **No incluyas más de dos consejos y advertencias entrelazados por página.** Si encuentras que se necesitan más de dos consejos en una página, considera agregar una sección de advertencias para abordar estos problemas. La guía está destinada a leerse de principio a fin, y los consejos y advertencias pueden ser abrumadores o distractores para alguien que intenta comprender los conceptos básicos.
- **Evita apelar a la autoridad** (por ejemplo, "debes hacer X, porque es una buena práctica" o "X es lo mejor porque te da una separación total de preocupaciones"). En su lugar, demuestra con ejemplos los problemas humanos específicos causados y/o resueltos por un patrón.
- **Al decidir qué enseñar primero, piensa en qué conocimiento proporcionará la mejor relación poder/esfuerzo.** Eso significa enseñar aquello que ayudará a los usuarios a resolver los mayores problemas o la mayor cantidad de problemas, con el menor esfuerzo relativo para aprender. Esto ayuda a los estudiantes a sentirse inteligentes, poderosos y curiosos, por lo que su capacidad cognitiva se agotará más lentamente.
- **A menos que el contexto asuma una plantilla de cadena o un sistema de construcción, escribe solo código que funcione en cualquier entorno del software (por ejemplo, `Vue`, `Vuex`, etc.).**
- **Muestra, no cuentes.** Por ejemplo, "Para usar Vue en una página, puedes agregar esto a tu HTML" (luego muestra el `script tag`), en lugar de "Para usar Vue en una página, puedes agregar un elemento `script` con un atributo `src`, cuyo valor debe ser un enlace al código fuente compilado de Vue".
- **Casi siempre evita el humor (para documentación en inglés)**, especialmente el sarcasmo y las referencias a la cultura pop, ya que no se traduce bien entre culturas.
- **Nunca asumas un contexto más avanzado de lo necesario.**
- **En la mayoría de los casos, prefiere enlaces entre secciones de la documentación en lugar de repetir el mismo contenido en varias secciones.** Cierta repetición en el contenido es inevitable e incluso esencial para el aprendizaje. Sin embargo, demasiada repetición también hace que la documentación sea más difícil de mantener, porque un cambio en la API requerirá cambios en muchos lugares y es fácil pasar por alto algo. Este es un equilibrio difícil de lograr.
- **Lo específico es mejor que lo genérico.** Por ejemplo, un ejemplo de componente `<BlogPost>` es mejor que `<ComponentA>`.
- **Lo relacionado es mejor que lo oscuro.** Por ejemplo, un ejemplo de componente `<BlogPost>` es mejor que `<CurrencyExchangeSettings>`.
- **Sé emocionalmente relevante.** Las explicaciones y ejemplos que se relacionan con algo con lo que las personas tienen experiencia y les importa siempre serán más efectivos.
- **Siempre prefiere un lenguaje más simple y llano a un lenguaje complejo o técnico.** Por ejemplo:
  - "puedes usar Vue con un elemento `script`" en lugar de "para iniciar el uso de Vue, una opción posible es inyectarlo a través de un elemento HTML `script`"
  - "función que devuelve una función" en lugar de "función de orden superior"
- **Evita el lenguaje que invalida el esfuerzo**, como "fácil", "solo", "obviamente", etc. Para referencia, consulta [Words To Avoid in Educational Writing](https://css- tricks.com/words-avoid-educational-writing/).

### Gramática

- **Evita las abreviaturas** en la escritura y en los ejemplos de código (por ejemplo, `attribute` es mejor que `attr`, `message` es mejor que `msg`), a menos que estés haciendo referencia específicamente a una abreviatura en una API (por ejemplo, `$attrs`). Los símbolos de abreviatura incluidos en los teclados estándar (por ejemplo, `@`, `#`, `&`) están bien.
- **Al referenciar un ejemplo que sigue directamente, usa dos puntos (`:`) para terminar una oración**, en lugar de un punto (`.`).
- **Usa la coma de Oxford** (por ejemplo, "a, b, y c" en lugar de "a, b y c"). ![Por qué es importante la coma de Oxford](./oxford-comma.jpg)
  - Fuente: [The Serial (Oxford) Comma: When and Why To Use It](https://www.inkonhand.com/2015/10/the-serial-oxford-comma-when-and-why-to-use-it/)
- **Al referenciar el nombre de un proyecto, usa el nombre con el que el proyecto se refiere a sí mismo.** Por ejemplo, "`webpack`" y "`npm`" deben usar minúsculas, ya que así es como su documentación se refiere a ellos.
- **Usa mayúsculas en los títulos para los encabezados** (Title Case) – al menos por ahora, ya que es lo que usamos en el resto de la documentación. Hay investigaciones que sugieren que el formato de oración (solo la primera palabra del encabezado comienza con mayúscula) es en realidad superior para la legibilidad y también reduce la carga cognitiva para los escritores de documentación, ya que no tienen que intentar recordar si deben capitalizar palabras como "and", "with" y "about".
- **No uses emojis (excepto en discusiones).** Los emojis son lindos y amigables, pero pueden ser una distracción en la documentación y algunos emojis incluso transmiten diferentes significados en diferentes culturas.

## Iteración y Comunicación

- **La excelencia proviene de la iteración.** Los primeros borradores siempre son malos, pero escribirlos es una parte vital del proceso. Es extremadamente difícil evitar la progresión lenta de Malo -> Aceptable -> Bueno -> Genial -> Inspirador -> Trascendente.
- **Espera solo hasta que algo sea "Bueno" antes de publicar.** La comunidad te ayudará a llevarlo más lejos en la cadena.
- **Intenta no ponerte a la defensiva al recibir retroalimentación.** Nuestra escritura puede ser muy personal para nosotros, pero si nos enfadamos con las personas que nos ayudan a mejorarla, dejarán de dar retroalimentación o comenzarán a limitar el tipo de retroalimentación que dan.
- **Revisa tu propio trabajo antes de mostrárselo a otros.** Si le muestras a alguien un trabajo con muchos errores de ortografía/gramática, recibirás retroalimentación sobre errores de ortografía/gramática en lugar de notas más valiosas sobre si la escritura está logrando tus objetivos.
- **Cuando pidas retroalimentación a las personas, diles a los revisores qué:**
  - **estás intentando hacer**
  - **tus miedos son**
  - **equilibrios que intentas lograr**
- **Cuando alguien reporta un problema, casi siempre hay un problema**, incluso si la solución que propuso no es del todo correcta. Sigue haciendo preguntas de seguimiento para aprender más.
- Las personas necesitan sentirse seguras haciendo preguntas al contribuir/revisar contenido. Aquí te explicamos cómo puedes lograrlo:
  - **Agradece a las personas por sus contribuciones/revisiones, incluso si te sientes de mal humor.** Por ejemplo:
    - "¡Gran pregunta!"
    - "Gracias por tomarte el tiempo de explicar. 🙂"
    - "Esto es realmente intencional, pero gracias por tomarte el tiempo de contribuir. 😊"
  - **Escucha lo que la gente dice y refléjalo si no estás seguro de estar entendiendo correctamente.** Esto puede ayudar a validar los sentimientos y experiencias de las personas, mientras también comprendes si _tú_ los estás entendiendo _a ellos_ correctamente.
  - **Usa muchos emojis positivos y empáticos.** Siempre es mejor parecer un poco extraño que malvado o impaciente.
  - **Comunica amablemente las reglas/límites.** Si alguien se comporta de manera abusiva/inapropiada, responde solo con amabilidad y madurez, pero también deja claro que este comportamiento no es aceptable y qué sucederá (según el código de conducta) si continúan comportándose mal.

### Consejos, Llamadas de Atención, Alertas y Resaltados de Líneas

Tenemos algunos estilos dedicados para denotar algo que vale la pena resaltar de una manera particular. Estos se encuentran [en esta página](https://vitepress.dev/guide/markdown#custom-containers). **Deben usarse con moderación.**

Existe cierta tentación de abusar de estos estilos, ya que uno puede simplemente añadir un cambio dentro de una llamada de atención. Sin embargo, esto interrumpe el flujo de lectura para el usuario y solo debe usarse en circunstancias especiales. Siempre que sea posible, debemos intentar crear una narrativa y un flujo dentro de la página para respetar la carga cognitiva del lector.

Bajo ninguna circunstancia deben usarse dos alertas una al lado de la otra; es una señal de que no somos capaces de explicar el contexto lo suficientemente bien.

### Contribuyendo

Apreciamos los PRs pequeños y enfocados. Si deseas realizar un cambio extremadamente grande, por favor comunícate con los miembros del equipo antes de una `pull request`. Aquí hay un [escrito que detalla por qué esto es tan crítico](https://www.netlify.com/blog/2020/03/31/how-to-scope-down-prs/) para que trabajemos bien en este equipo. Por favor, comprende que, aunque siempre apreciamos las contribuciones, en última instancia, tenemos que priorizar lo que funciona mejor para el proyecto en su conjunto.

## Recursos

### Software

- [Grammarly](https://www.grammarly.com/): Aplicación de escritorio y extensión de navegador para revisar la ortografía y la gramática (aunque la revisión gramatical no detecta todo y ocasionalmente muestra un falso positivo).
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker): Una extensión para VS Code para ayudarte a revisar la ortografía dentro de `markdown` y ejemplos de código.

### Libros

- [On Writing Well](https://www.amazon.com/Writing-Well-30th-Anniversary-Nonfiction-ebook/dp/B0090RVGW0) (ver [citas populares](https://www.goodreads.com/work/quotes/1139032-on-writing-well-the-classic-guide-to-writing-nonfiction))
- [Bird by Bird](https://www.amazon.com/Bird-Some-Instructions-Writing-Life/dp/0385480016) (ver [citas populares](https://www.goodreads.com/work/quotes/841198-bird-by-bird-some-instructions-on-writing-and-life))
- [Cognitive Load Theory](https://www.amazon.com/Cognitive-Explorations-Instructional-Performance-Technologies/dp/144198125X/)