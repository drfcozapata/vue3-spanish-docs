# Seguridad {#security}

## Reporte de Vulnerabilidades {#reporting-vulnerabilities}

Cuando se reporta una vulnerabilidad, inmediatamente se convierte en nuestra principal preocupación, con un colaborador a tiempo completo dejando todo para trabajar en ella. Para reportar una vulnerabilidad, por favor envíe un correo electrónico a [security@vuejs.org](mailto:security@vuejs.org).

Si bien el descubrimiento de nuevas vulnerabilidades es raro, también recomendamos usar siempre las últimas versiones de Vue y sus librerías compañeras oficiales para asegurar que su aplicación permanezca lo más segura posible.

## Regla n.º 1: Nunca utilice templates no confiables {#rule-no-1-never-use-non-trusted-templates}

La regla de seguridad más fundamental al usar Vue es **nunca utilizar contenido no confiable como template de su componente**. Hacerlo es equivalente a permitir la ejecución arbitraria de JavaScript en su aplicación, y lo que es peor, podría llevar a intrusiones en el servidor si el código se ejecuta durante el renderizado del lado del servidor. Un ejemplo de tal uso:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NUNCA HAGA ESTO
}).mount('#app')
```

Los templates de Vue se compilan en JavaScript, y las expresiones dentro de los templates se ejecutarán como parte del proceso de renderizado. Aunque las expresiones se evalúan contra un contexto de renderizado específico, debido a la complejidad de los posibles entornos de ejecución globales, no es práctico para un framework como Vue protegerlo completamente de una posible ejecución de código malicioso sin incurrir en una sobrecarga de rendimiento irrealista. La forma más sencilla de evitar por completo esta categoría de problemas es asegurarse de que el contenido de sus templates de Vue sea siempre confiable y esté completamente controlado por usted.

## Lo que Vue hace para protegerle {#what-vue-does-to-protect-you}

### Contenido HTML {#html-content}

Ya sea que use templates o render functions, el contenido se escapa automáticamente. Esto significa que en este template:

```vue-html
<h1>{{ userProvidedString }}</h1>
```

si `userProvidedString` contuviera:

```js
'<script>alert("hi")</script>'
```

entonces se escaparía al siguiente HTML:

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

previniendo así la `script injection`. Este escape se realiza utilizando APIs nativas del navegador, como `textContent`, por lo que una vulnerabilidad solo puede existir si el propio navegador es vulnerable.

### Enlaces de atributos {#attribute-bindings}

De manera similar, los enlaces de atributos dinámicos también se escapan automáticamente. Esto significa que en este template:

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

si `userProvidedString` contuviera:

```js
'" onclick="alert(\'hi\')'
```

entonces se escaparía al siguiente HTML:

```vue-html
&quot; onclick=&quot;alert('hi')
```

previniendo así el cierre del atributo `title` para inyectar nuevo HTML arbitrario. Este escape se realiza utilizando APIs nativas del navegador, como `setAttribute`, por lo que una vulnerabilidad solo puede existir si el propio navegador es vulnerable.

## Peligros Potenciales {#potential-dangers}

En cualquier aplicación web, permitir que contenido no saneado y proporcionado por el usuario se ejecute como HTML, CSS o JavaScript es potencialmente peligroso, por lo que debe evitarse siempre que sea posible. Sin embargo, hay momentos en los que cierto riesgo puede ser aceptable.

Por ejemplo, servicios como CodePen y JSFiddle permiten la ejecución de contenido proporcionado por el usuario, pero esto ocurre en un contexto donde se espera y está hasta cierto punto en `iframes` aislados. En los casos en que una característica importante requiere inherentemente cierto nivel de vulnerabilidad, depende de su equipo sopesar la importancia de la característica frente a los peores escenarios que la vulnerabilidad permite.

### Inyección de HTML {#html-injection}

Como aprendió anteriormente, Vue escapa automáticamente el contenido HTML, lo que le impide inyectar accidentalmente HTML ejecutable en su aplicación. Sin embargo, **en los casos en que sepa que el HTML es seguro**, puede renderizar explícitamente contenido HTML:

-   Usando un template:

    ```vue-html
    <div v-html="userProvidedHtml"></div>
    ```

-   Usando una render function:

    ```js
    h('div', {
      innerHTML: this.userProvidedHtml
    })
    ```

-   Usando una render function con JSX:

    ```jsx
    <div innerHTML={this.userProvidedHtml}></div>
    ```

:::warning
El HTML proporcionado por el usuario nunca puede considerarse 100% seguro a menos que esté en un `iframe` aislado o en una parte de la aplicación donde solo el usuario que escribió ese HTML pueda estar expuesto a él. Además, permitir a los usuarios escribir sus propios templates de Vue conlleva peligros similares.
:::

### Inyección de URL {#url-injection}

En una URL como esta:

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

Existe un problema de seguridad potencial si la URL no ha sido "saneada" para prevenir la ejecución de JavaScript usando `javascript:`. Existen librerías como [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) para ayudar con esto, pero tenga en cuenta: si alguna vez está realizando saneamiento de URL en el frontend, ya tiene un problema de seguridad. **Las URL proporcionadas por el usuario siempre deben ser saneadas por su backend antes incluso de ser guardadas en una base de datos.** Así se evita el problema para _cada_ cliente que se conecta a su API, incluidas las aplicaciones móviles nativas. También tenga en cuenta que, incluso con URL saneadas, Vue no puede ayudarle a garantizar que conduzcan a destinos seguros.

### Inyección de Estilo {#style-injection}

Observando este ejemplo:

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

Asumamos que `sanitizedUrl` ha sido saneada, por lo que es definitivamente una URL real y no JavaScript. Con los `userProvidedStyles`, los usuarios maliciosos aún podrían proporcionar CSS para realizar un "click jack", por ejemplo, estilizando el enlace como una caja transparente sobre el botón "Log in". Entonces, si `https://user-controlled-website.com/` está construida para parecerse a la página de inicio de sesión de su aplicación, podrían haber capturado la información de inicio de sesión real de un usuario.

Puede imaginar cómo permitir contenido proporcionado por el usuario para un elemento `<style>` crearía una vulnerabilidad aún mayor, dando a ese usuario control total sobre cómo estilizar toda la página. Es por eso que Vue impide la renderización de etiquetas style dentro de los templates, como:

```vue-html
<style>{{ userProvidedStyles }}</style>
```

Para mantener a sus usuarios completamente seguros del clickjacking, recomendamos permitir el control total sobre el CSS solo dentro de un `iframe` aislado. Alternativamente, al proporcionar control al usuario a través de un `style binding`, recomendamos usar su [object syntax](/guide/essentials/class-and-style#binding-to-objects-1) y solo permitir que los usuarios proporcionen valores para propiedades específicas que sean seguras para ellos controlar, como esto:

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### Inyección de JavaScript {#javascript-injection}

Desaconsejamos encarecidamente renderizar un elemento `<script>` con Vue, ya que los templates y las render functions nunca deberían tener efectos secundarios. Sin embargo, esta no es la única forma de incluir strings que serían evaluadas como JavaScript en tiempo de ejecución.

Cada elemento HTML tiene atributos con valores que aceptan strings de JavaScript, como `onclick`, `onfocus` y `onmouseenter`. Enlazar JavaScript proporcionado por el usuario a cualquiera de estos atributos de evento es un riesgo de seguridad potencial, por lo que debe evitarse.

:::warning
El JavaScript proporcionado por el usuario nunca puede considerarse 100% seguro a menos que esté en un `iframe` aislado o en una parte de la aplicación donde solo el usuario que escribió ese JavaScript pueda estar expuesto a él.
:::

A veces recibimos reportes de vulnerabilidades sobre cómo es posible realizar cross-site scripting (XSS) en templates de Vue. En general, no consideramos que tales casos sean vulnerabilidades reales porque no hay una forma práctica de proteger a los desarrolladores de los dos escenarios que permitirían XSS:

1.  El desarrollador está pidiendo explícitamente a Vue que renderice contenido proporcionado por el usuario y no saneado como templates de Vue. Esto es inherentemente inseguro, y no hay forma de que Vue conozca el origen.

2.  El desarrollador está montando Vue en una página HTML completa que resulta contener contenido renderizado por el servidor y proporcionado por el usuario. Este es fundamentalmente el mismo problema que el n.º 1, pero a veces los desarrolladores pueden hacerlo sin darse cuenta. Esto puede llevar a posibles vulnerabilidades donde el atacante proporciona HTML que es seguro como HTML plano pero inseguro como un template de Vue. La mejor práctica es **nunca montar Vue en nodos que puedan contener contenido renderizado por el servidor y proporcionado por el usuario**.

## Mejores Prácticas {#best-practices}

La regla general es que si permite que contenido no saneado y proporcionado por el usuario se ejecute (ya sea como HTML, JavaScript o incluso CSS), podría exponerse a ataques. Este consejo es válido ya sea que use Vue, otro framework o incluso ningún framework.

Más allá de las recomendaciones hechas anteriormente para [Peligros Potenciales](#potential-dangers), también recomendamos familiarizarse con estos recursos:

-   [HTML5 Security Cheat Sheet](https://html5sec.org/)
-   [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Luego, utilice lo que aprenda para revisar también el `source code` de sus `dependencies` en busca de patrones potencialmente peligrosos, si alguno de ellos incluye `3rd-party components` o de alguna manera influye en lo que se renderiza en el DOM.

## Coordinación del Backend {#backend-coordination}

Las vulnerabilidades de seguridad HTTP, como la falsificación de solicitudes entre sitios (CSRF/XSRF) y la inclusión de scripts entre sitios (XSSI), se abordan principalmente en el backend, por lo que no son una preocupación de Vue. Sin embargo, sigue siendo una buena idea comunicarse con su equipo de backend para aprender la mejor manera de interactuar con su API, por ejemplo, enviando `CSRF tokens` con las solicitudes de formulario.

## Server-Side Rendering (SSR) {#server-side-rendering-ssr}

Existen algunas preocupaciones de seguridad adicionales al usar SSR, así que asegúrese de seguir las mejores prácticas descritas en [nuestra documentación de SSR](/guide/scaling-up/ssr) para evitar vulnerabilidades.