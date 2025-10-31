---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'

onMounted(load)
</script>

# Conviértete en un patrocinador de Vue.js {#become-a-vue-js-sponsor}

Vue.js es un proyecto de código abierto con licencia MIT y completamente gratuito de usar.
La enorme cantidad de esfuerzo necesaria para mantener un ecosistema tan grande y desarrollar nuevas características para el proyecto solo es sostenible gracias al generoso apoyo financiero de nuestros patrocinadores.

## Cómo patrocinar {#how-to-sponsor}

Los patrocinios se pueden realizar a través de [GitHub Sponsors](https://github.com/sponsors/yyx990803) o [OpenCollective](https://opencollective.com/vuejs). Las facturas se pueden obtener a través del sistema de pago de GitHub. Se aceptan tanto patrocinios mensuales recurrentes como donaciones únicas. Los patrocinios recurrentes dan derecho a la colocación del logo según lo especificado en [Beneficios de los niveles de patrocinio](#tier-benefits).

Si tiene preguntas sobre los niveles, la logística de pago o los datos de exposición del patrocinador, por favor, póngase en contacto con [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry).

## Patrocinar Vue como empresa {#sponsoring-vue-as-a-business}

Patrocinar Vue le da una gran exposición a más de **2 millones** de desarrolladores Vue en todo el mundo a través de nuestro sitio web y los READMEs de proyectos de GitHub. Esto no solo genera leads directamente, sino que también mejora el reconocimiento de su marca como una empresa que se preocupa por el Código Abierto. Este es un activo intangible pero extremadamente importante para las empresas que desarrollan productos para desarrolladores, ya que mejora su tasa de conversión.

Si está utilizando Vue para construir un producto que genera ingresos, tiene sentido comercial patrocinar el desarrollo de Vue: **garantiza que el proyecto en el que se basa su producto se mantenga saludable y activamente mantenido.** La exposición y la imagen de marca positiva en la comunidad Vue también facilitan la atracción y el reclutamiento de desarrolladores Vue.

Si está construyendo un producto donde sus clientes objetivo son desarrolladores, obtendrá tráfico de alta calidad a través de la exposición del patrocinio, ya que todos nuestros visitantes son desarrolladores. El patrocinio también construye el reconocimiento de la marca y mejora la conversión.

## Patrocinar Vue como individuo {#sponsoring-vue-as-an-individual}

Si es un usuario individual y ha disfrutado de la productividad de usar Vue, considere donar como una señal de agradecimiento, como invitarnos a un café de vez en cuando. Muchos de nuestros miembros del equipo aceptan patrocinios y donaciones a través de GitHub Sponsors. Busque el botón "Sponsor" en el perfil de cada miembro del equipo en nuestra [página del equipo](/about/team).

También puede intentar convencer a su empleador de que patrocine Vue como empresa. Esto puede no ser fácil, pero los patrocinios empresariales suelen tener un impacto mucho mayor en la sostenibilidad de los proyectos OSS que las donaciones individuales, por lo que nos ayudará mucho más si lo consigue.

## Beneficios de los niveles {#tier-benefits}

- **Patrocinador Especial Global**:
  - Limitado a **un** patrocinador a nivel global. <span v-if="!data?.special">Actualmente vacante. ¡[Póngase en contacto](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)!</span><span v-else>(Actualmente ocupado)</span>
  - (Exclusivo) Colocación del logo **en la parte superior visible** de la página principal de [vuejs.org](/).
  - (Exclusivo) Mención especial y retweets regulares de lanzamientos de productos importantes a través de la [cuenta oficial de X de Vue](https://twitter.com/vuejs) (320k seguidores).
  - Colocación del logo más prominente en todas las ubicaciones de los niveles inferiores.
- **Platino (USD$2,000/mes)**:
  - Colocación prominente del logo en la página principal de [vuejs.org](/).
  - Colocación prominente del logo en la barra lateral de todas las páginas de contenido.
  - Colocación prominente del logo en el README de [`vuejs/core`](https://github.com/vuejs/core) y [`vuejs/vue`](https://github.com/vuejs/core).
- **Oro (USD$500/mes)**:
  - Colocación de logo grande en la página principal de [vuejs.org](/).
  - Colocación de logo grande en el README de `vuejs/core` y `vuejs/vue`.
- **Plata (USD$250/mes)**:
  - Colocación de logo mediano en el archivo `BACKERS.md` de `vuejs/core` y `vuejs/vue`.
- **Bronce (USD$100/mes)**:
  - Colocación de logo pequeño en el archivo `BACKERS.md` de `vuejs/core` y `vuejs/vue`.
- **Patrocinador Generoso (USD$50/mes)**:
  - Nombre listado en el archivo `BACKERS.md` de `vuejs/core` y `vuejs/vue`, por encima de otros patrocinadores individuales.
- **Patrocinador Individual (USD$5/mes)**:
  - Nombre listado en el archivo `BACKERS.md` de `vuejs/core` y `vuejs/vue`.

## Patrocinadores actuales {#current-sponsors}

### Patrocinador Especial Global {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### Platino {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### Platino (China) {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### Oro {#gold}

<SponsorsGroup tier="gold" placement="page" />

### Plata {#silver}

<SponsorsGroup tier="silver" placement="page" />
