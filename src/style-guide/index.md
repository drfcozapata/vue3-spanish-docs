---
outline: deep
---

# Guía de Estilo {#style-guide}

::: warning Nota
Esta Guía de Estilo de Vue.js está desactualizada y necesita ser revisada. Si tienes alguna pregunta o sugerencia, por favor [abre un issue](https://github.com/vuejs/docs/issues/new).
:::

Esta es la guía de estilo oficial para código específico de Vue. Si utilizas Vue en un proyecto, es una excelente referencia para evitar errores, discusiones interminables sobre detalles triviales y anti-patrones. Sin embargo, no creemos que ninguna guía de estilo sea ideal para todos los equipos o proyectos, por lo que se fomentan las desviaciones conscientes basadas en la experiencia pasada, el stack tecnológico circundante y los valores personales.

En su mayor parte, también evitamos sugerencias sobre JavaScript o HTML en general. No nos importa si usas punto y coma o comas finales. No nos importa si tu HTML utiliza comillas simples o dobles para los valores de los atributos. Sin embargo, existirán algunas excepciones, donde hemos encontrado que un patrón particular es útil en el contexto de Vue.

Finalmente, hemos dividido las reglas en cuatro categorías:

## Categorías de Reglas {#rule-categories}

### Prioridad A: Esenciales (Prevención de Errores) {#priority-a-essential-error-prevention}

Estas reglas ayudan a prevenir errores, así que apréndelas y cúmplelas a toda costa. Pueden existir excepciones, pero deben ser muy raras y solo deben ser hechas por aquellos con conocimiento experto tanto de JavaScript como de Vue.

- [Ver todas las reglas de prioridad A](./rules-essential)

### Prioridad B: Fuertemente Recomendadas {#priority-b-strongly-recommended}

Se ha encontrado que estas reglas mejoran la legibilidad y/o la experiencia del desarrollador en la mayoría de los proyectos. Tu código seguirá funcionando si las incumples, pero las infracciones deben ser raras y bien justificadas.

- [Ver todas las reglas de prioridad B](./rules-strongly-recommended)

### Prioridad C: Recomendadas {#priority-c-recommended}

Cuando existen múltiples opciones igualmente buenas, se puede hacer una elección arbitraria para asegurar la consistencia. En estas reglas, describimos cada opción aceptable y sugerimos una elección predeterminada. Eso significa que puedes sentirte libre de hacer una elección diferente en tu propio código, siempre y cuando seas consistente y tengas una buena razón. ¡Pero por favor, ten una buena razón! Al adaptarte al estándar de la comunidad, lograrás:

1. Entrenar tu cerebro para analizar más fácilmente la mayor parte del código de la comunidad que encuentres
2. Poder copiar y pegar la mayoría de los ejemplos de código de la comunidad sin modificaciones
3. Frecuentemente, los nuevos empleados ya estarán acostumbrados a tu estilo de codificación preferido, al menos en lo que respecta a Vue

- [Ver todas las reglas de prioridad C](./rules-recommended)

### Prioridad D: Usar con Precaución {#priority-d-use-with-caution}

Algunas características de Vue existen para acomodar casos límite raros o migraciones más fluidas desde una base de código heredada. Sin embargo, cuando se usan en exceso, pueden hacer que tu código sea más difícil de mantener o incluso convertirse en una fuente de errores. Estas reglas arrojan luz sobre características potencialmente riesgosas, describiendo cuándo y por qué deben evitarse.

- [Ver todas las reglas de prioridad D](./rules-use-with-caution)