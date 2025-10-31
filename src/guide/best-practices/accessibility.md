# Accesibilidad {#accessibility}

La accesibilidad web (también conocida como a11y) se refiere a la práctica de crear sitios web que puedan ser utilizados por cualquier persona, ya sea una persona con una discapacidad, una conexión lenta, hardware obsoleto o defectuoso o simplemente alguien en un entorno desfavorable. Por ejemplo, añadir subtítulos a un video ayudaría tanto a los usuarios sordos o con problemas de audición como a los usuarios que se encuentran en un ambiente ruidoso y no pueden escuchar su teléfono. De manera similar, asegurarse de que el texto no tenga un contraste demasiado bajo ayudará tanto a los usuarios con baja visión como a los usuarios que intentan usar su teléfono bajo la luz brillante del sol.

¿Listo para empezar pero no sabes por dónde?

Consulta la [guía de planificación y gestión de la accesibilidad web](https://www.w3.org/WAI/planning-and-managing/) proporcionada por el [World Wide Web Consortium (W3C)](https://www.w3.org/).

## Enlace para omitir {#skip-link}

Debes añadir un enlace en la parte superior de cada página que vaya directamente al área de contenido principal para que los usuarios puedan omitir el contenido que se repite en varias páginas web.

Normalmente, esto se hace en la parte superior de `App.vue`, ya que será el primer elemento enfocable en todas tus páginas:

```vue-html
<span ref="backToTop" tabindex="-1" />
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Skip to main content</a>
  </li>
</ul>
```

Para ocultar el enlace a menos que esté enfocado, puedes añadir el siguiente estilo:

```css
.skip-links {
  list-style: none;
}
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

Una vez que un usuario cambia de ruta, devuelve el enfoque al principio de la página, justo antes del enlace para omitir. Esto se puede lograr llamando al método `focus` en la `ref` de plantilla `backToTop` (asumiendo el uso de `vue-router`):

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.backToTop.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => {
    backToTop.value.focus()
  }
)
</script>
```

</div>

[Leer documentación sobre enlaces para omitir al contenido principal](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Estructura del Contenido {#content-structure}

Uno de los aspectos más importantes de la accesibilidad es asegurarse de que el diseño pueda soportar una implementación accesible. El diseño debe considerar no solo el contraste de color, la selección de fuentes, el tamaño del texto y el idioma, sino también cómo se estructura el contenido en la aplicación.

### Encabezados {#headings}

Los usuarios pueden navegar por una aplicación a través de los encabezados. Tener encabezados descriptivos para cada sección de tu aplicación facilita a los usuarios predecir el contenido de cada sección. En cuanto a los encabezados, hay un par de prácticas de accesibilidad recomendadas:

- Anidar los encabezados en su orden de clasificación: `<h1>` - `<h6>`
- No saltar encabezados dentro de una sección
- Usar etiquetas de encabezado reales en lugar de dar estilo al texto para dar la apariencia visual de encabezados

[Leer más sobre encabezados](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
</main>
```

### Puntos de referencia {#landmarks}

Los [puntos de referencia (landmarks)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) proporcionan acceso programático a secciones dentro de una aplicación. Los usuarios que dependen de tecnología de asistencia pueden navegar a cada sección de la aplicación y omitir contenido. Puedes usar [roles ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) para ayudarte a lograr esto.

| HTML            | Rol ARIA             | Propósito del Punto de Referencia                                                                                |
| --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `header`          | `role="banner"`        | Encabezado principal: título de la página                                                                        |
| `nav`             | `role="navigation"`    | Colección de enlaces adecuados para usar al navegar por el documento o documentos relacionados                   |
| `main`            | `role="main"`          | El contenido principal o central del documento.                                                                  |
| `footer`          | `role="contentinfo"`   | Información sobre el documento padre: notas al pie/derechos de autor/enlaces a la declaración de privacidad      |
| `aside`           | `role="complementary"` | Soporta el contenido principal, pero está separado y tiene significado por sí mismo.                             |
| `search`          | `role="search"`        | Esta sección contiene la funcionalidad de búsqueda para la aplicación                                            |
| `form`            | `role="form"`          | Colección de elementos asociados a formularios                                                                   |
| `section`         | `role="region"`        | Contenido relevante al que los usuarios probablemente querrán navegar. Se debe proporcionar una etiqueta para este elemento |

[Leer más sobre puntos de referencia](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Formularios Semánticos {#semantic-forms}

Al crear un formulario, puedes usar los siguientes elementos: `<form>`, `<label>`, `<input>`, `<textarea>` y `<button>`.

Las etiquetas suelen colocarse encima o a la izquierda de los campos del formulario:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

Observa cómo puedes incluir `autocomplete='on'` en el elemento `form` y se aplicará a todas las entradas de tu formulario. También puedes establecer diferentes [valores para el atributo autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) para cada entrada.

### Etiquetas {#labels}

Proporciona etiquetas para describir el propósito de todos los controles de formulario; vinculando `for` con `id`:

```vue-html
<label for="name">Name: </label>
<input type="text" name="name" id="name" v-model="name" />
```

Si inspeccionas este elemento en tus Herramientas de desarrollo de Chrome (Chrome DevTools) y abres la pestaña de Accesibilidad dentro de la pestaña de Elementos, verás cómo la entrada obtiene su nombre de la etiqueta:

![Herramientas de desarrollo de Chrome mostrando el nombre accesible de la entrada desde la etiqueta](./images/AccessibleLabelChromeDevTools.png)

:::warning Advertencia:
Aunque es posible que hayas visto etiquetas envolviendo los campos de entrada así:

```vue-html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

Establecer explícitamente las etiquetas con un `id` coincidente está mejor soportado por la tecnología de asistencia.
:::

#### `aria-label` {#aria-label}

También puedes dar a la entrada un nombre accesible con [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).

```vue-html
<label for="name">Name: </label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

No dudes en inspeccionar este elemento en las Herramientas de desarrollo de Chrome para ver cómo ha cambiado el nombre accesible:

![Herramientas de desarrollo de Chrome mostrando el nombre accesible de la entrada desde aria-label](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

Usar [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) es similar a `aria-label` excepto que se usa si el texto de la etiqueta es visible en pantalla. Se empareja con otros elementos por su `id` y puedes vincular múltiples `id`s:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

![Herramientas de desarrollo de Chrome mostrando el nombre accesible de la entrada desde aria-labelledby](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) se usa de la misma manera que `aria-labelledby`, excepto que proporciona una descripción con información adicional que el usuario podría necesitar. Esto se puede usar para describir los criterios de cualquier entrada:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

Puedes ver la descripción inspeccionando las Herramientas de desarrollo de Chrome:

![Herramientas de desarrollo de Chrome mostrando el nombre accesible de la entrada desde aria-labelledby y la descripción con aria-describedby](./images/AccessibleARIAdescribedby.png)

### Marcador de posición {#placeholder}

Evita usar marcadores de posición, ya que pueden confundir a muchos usuarios.

Uno de los problemas con los marcadores de posición es que no cumplen con los [criterios de contraste de color](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) por defecto; al corregir el contraste de color, el marcador de posición parece datos precargados en los campos de entrada. Observando el siguiente ejemplo, puedes ver que el marcador de posición "Last Name" (Apellido), que cumple los criterios de contraste de color, parece datos precargados:

![Marcador de posición accesible](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

Es mejor proporcionar toda la información que el usuario necesita para rellenar los formularios fuera de cualquier entrada.

### Instrucciones {#instructions}

Al añadir instrucciones para tus campos de entrada, asegúrate de vincularlas correctamente a la entrada.
Puedes proporcionar instrucciones adicionales y vincular múltiples `id`s dentro de un [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby). Esto permite un diseño más flexible.

```vue-html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date: </label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

Alternativamente, puedes adjuntar las instrucciones a la entrada con [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

```vue-html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth: </label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

### Ocultar Contenido {#hiding-content}

Normalmente no se recomienda ocultar visualmente las etiquetas, incluso si la entrada tiene un nombre accesible. Sin embargo, si la funcionalidad de la entrada se puede entender con el contenido circundante, entonces podemos ocultar la etiqueta visual.

Veamos este campo de búsqueda:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

Podemos hacer esto porque el botón de búsqueda ayudará a los usuarios visuales a identificar el propósito del campo de entrada.

Podemos usar CSS para ocultar visualmente elementos pero mantenerlos disponibles para la tecnología de asistencia:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

Añadir `aria-hidden="true"` ocultará el elemento de la tecnología de asistencia pero lo dejará visualmente disponible para otros usuarios. No lo uses en elementos enfocables, solo en contenido decorativo, duplicado o fuera de pantalla.

```vue-html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### Botones {#buttons}

Al usar botones dentro de un formulario, debes establecer el `type` para evitar el envío del formulario.
También puedes usar un `input` para crear botones:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Buttons -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Input buttons -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

### Imágenes Funcionales {#functional-images}

Puedes usar esta técnica para crear imágenes funcionales.

- Campos de entrada

  - Estas imágenes actuarán como un botón de tipo `submit` en formularios

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- Iconos

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

## Estándares {#standards}

La Iniciativa de Accesibilidad Web (WAI) del World Wide Web Consortium (W3C) desarrolla estándares de accesibilidad web para los diferentes componentes:

- [Guías de Accesibilidad para Agentes de Usuario (UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - navegadores web y reproductores multimedia, incluyendo algunos aspectos de las tecnologías de asistencia
- [Guías de Accesibilidad para Herramientas de Autoría (ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - herramientas de autoría
- [Guías de Accesibilidad al Contenido Web (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - contenido web - utilizado por desarrolladores, herramientas de autoría y herramientas de evaluación de accesibilidad

### Guías de Accesibilidad al Contenido Web (WCAG) {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) extiende a [WCAG 2.0](https://www.w3.org/TR/WCAG20/) y permite la implementación de nuevas tecnologías abordando los cambios en la web. El W3C anima a utilizar la versión más reciente de WCAG al desarrollar o actualizar políticas de accesibilidad web.

#### Cuatro Principios Rectores Principales de WCAG 2.1 (abreviado como POUR): {#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [Perceptible](https://www.w3.org/TR/WCAG21/#perceivable)
  - Los usuarios deben poder percibir la información que se presenta
- [Operable](https://www.w3.org/TR/WCAG21/#operable)
  - Las formas de la interfaz, los controles y la navegación son operables
- [Comprensible](https://www.w3.org/TR/WCAG21/#understandable)
  - La información y el funcionamiento de la interfaz de usuario deben ser comprensibles para todos los usuarios
- [Robusto](https://www.w3.org/TR/WCAG21/#robust)
  - Los usuarios deben poder acceder al contenido a medida que avanzan las tecnologías

#### Iniciativa de Accesibilidad Web – Aplicaciones de Internet Ricas Accesibles (WAI-ARIA) {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

WAI-ARIA del W3C proporciona orientación sobre cómo construir contenido dinámico y controles de interfaz de usuario avanzados.

- [Aplicaciones de Internet Ricas Accesibles (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Prácticas de Autoría WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## Recursos {#resources}

### Documentación {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Aplicaciones de Internet Ricas Accesibles (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Prácticas de Autoría WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### Tecnologías de Asistencia {#assistive-technologies}

- Lectores de pantalla
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- Herramientas de Zoom
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### Pruebas {#testing}

- Herramientas Automatizadas
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- Herramientas de Color
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- Otras Herramientas Útiles
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### Usuarios {#users}

La Organización Mundial de la Salud estima que el 15% de la población mundial tiene alguna forma de discapacidad, y entre el 2% y el 4% de ellos son severas. Esto representa un estimado de 1 billón de personas en todo el mundo, lo que convierte a las personas con discapacidad en el grupo minoritario más grande del mundo.

Existe una amplia gama de discapacidades, que pueden dividirse aproximadamente en cuatro categorías:

- _[Visual](https://webaim.org/articles/visual/)_ - Estos usuarios pueden beneficiarse del uso de lectores de pantalla, aumento de pantalla, control del contraste de la pantalla o pantallas braille.
- _[Auditiva](https://webaim.org/articles/auditory/)_ - Estos usuarios pueden beneficiarse de subtítulos, transcripciones o videos en lenguaje de señas.
- _[Motora](https://webaim.org/articles/motor/)_ - Estos usuarios pueden beneficiarse de una gama de [tecnologías de asistencia para discapacidades motoras](https://webaim.org/articles/motor/assistive): software de reconocimiento de voz, seguimiento ocular, acceso con un solo interruptor, puntero de cabeza, interruptor de sorber y soplar, ratón `trackball` de gran tamaño, teclado adaptado u otras tecnologías de asistencia.
- _[Cognitiva](https://webaim.org/articles/cognitive/)_ - Estos usuarios pueden beneficiarse de medios complementarios, organización estructural del contenido, escritura clara y sencilla.

Consulta los siguientes enlaces de WebAim para comprender a los usuarios:

- [Perspectivas de la accesibilidad web: Explora el impacto y los beneficios para todos](https://www.w3.org/WAI/perspective-videos/)
- [Historias de usuarios de la web](https://www.w3.org/WAI/people-use-web/user-stories/)