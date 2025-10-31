# Formas de Usar Vue {#ways-of-using-vue}

Creemos que no existe una solución "única para todos" en la web. Por eso, Vue está diseñado para ser flexible y adoptarse de forma incremental. Dependiendo de tu caso de uso, Vue puede utilizarse de diferentes maneras para lograr el equilibrio óptimo entre la complejidad de la pila, la experiencia del desarrollador y el rendimiento final.

## Script Independiente {#standalone-script}

Vue puede usarse como un archivo de script independiente, ¡sin necesidad de un paso de compilación! Si ya tienes un framework de backend que renderiza la mayor parte del HTML, o tu lógica frontend no es lo suficientemente compleja como para justificar un paso de compilación, esta es la forma más fácil de integrar Vue en tu pila. Puedes pensar en Vue como un reemplazo más declarativo de jQuery en tales casos.

Anteriormente, proporcionamos una distribución alternativa llamada [petite-vue](https://github.com/vuejs/petite-vue) que estaba específicamente optimizada para mejorar progresivamente el HTML existente. Sin embargo, petite-vue ya no recibe mantenimiento activo, y la última versión se publicó en Vue 3.2.27.

## Componentes Web Incrustados {#embedded-web-components}

Puedes usar Vue para [construir Componentes Web estándar](/guide/extras/web-components) que pueden incrustarse en cualquier página HTML, independientemente de cómo se rendericen. Esta opción te permite aprovechar Vue de una manera completamente agnóstica para el consumidor: los Componentes Web resultantes pueden incrustarse en aplicaciones heredadas, HTML estático o incluso aplicaciones construidas con otros frameworks.

## Aplicación de Una Sola Página (SPA) {#single-page-application-spa}

Algunas aplicaciones requieren una rica interactividad, una gran profundidad de sesión y una lógica de estado no trivial en el frontend. La mejor manera de construir dichas aplicaciones es usar una arquitectura donde Vue no solo controle toda la página, sino que también maneje las actualizaciones de datos y la navegación sin tener que recargar la página. Este tipo de aplicación se conoce típicamente como Aplicación de Una Sola Página (SPA).

Vue proporciona bibliotecas principales y [un soporte de herramientas completo](/guide/scaling-up/tooling) con una increíble experiencia de desarrollador para construir SPAs modernas, incluyendo:

- Enrutador del lado del cliente
- Cadena de herramientas de compilación extremadamente rápida
- Soporte de IDE
- Herramientas de desarrollo del navegador
- Integraciones de TypeScript
- Utilidades de prueba

Las SPAs típicamente requieren que el backend exponga endpoints de API, pero también puedes emparejar Vue con soluciones como [Inertia.js](https://inertia.com) para obtener los beneficios de SPA manteniendo un modelo de desarrollo centrado en el servidor.

## Fullstack / SSR {#fullstack-ssr}

Las SPAs puramente del lado del cliente son problemáticas cuando la aplicación es sensible al SEO y al tiempo de carga del contenido. Esto se debe a que el navegador recibirá una página HTML en gran parte vacía y tendrá que esperar hasta que se cargue el JavaScript antes de renderizar cualquier cosa.

Vue proporciona APIs de primera clase para "renderizar" una aplicación Vue en cadenas de HTML en el servidor. Esto permite que el servidor envíe HTML ya renderizado, permitiendo a los usuarios finales ver el contenido inmediatamente mientras el JavaScript se descarga. Vue luego "hidratará" la aplicación en el lado del cliente para hacerla interactiva. Esto se llama [Renderizado del Lado del Servidor (SSR)](/guide/scaling-up/ssr) y mejora enormemente las métricas de Core Web Vital como [Largest Contentful Paint (LCP)](https://web.dev/lcp/).

Existen frameworks de Vue de nivel superior construidos sobre este paradigma, como [Nuxt](https://nuxt.com/), que te permiten desarrollar una aplicación fullstack usando Vue y JavaScript.

## JAMStack / SSG {#jamstack-ssg}

El renderizado del lado del servidor se puede realizar con antelación si los datos requeridos son estáticos. Esto significa que podemos pre-renderizar una aplicación completa en HTML y servirlos como archivos estáticos. Esto mejora el rendimiento del sitio y simplifica mucho la implementación, ya que ya no necesitamos renderizar páginas dinámicamente en cada solicitud. Vue aún puede hidratar tales aplicaciones para proporcionar una rica interactividad en el cliente. Esta técnica se conoce comúnmente como Generación de Sitios Estáticos (SSG), también conocida como [JAMStack](https://jamstack.org/what-is-jamstack/).

Existen dos variantes de SSG: monopágina y multipágina. Ambas variantes pre-renderizan el sitio en HTML estático; la diferencia es que:

- Después de la carga inicial de la página, una SSG monopágina "hidrata" la página en una SPA. Esto requiere una mayor carga inicial de JS y un costo de hidratación, pero las navegaciones posteriores serán más rápidas, ya que solo necesita actualizar parcialmente el contenido de la página en lugar de recargar la página completa.

- Una SSG multipágina carga una nueva página en cada navegación. La ventaja es que puede enviar un JS mínimo, ¡o ningún JS en absoluto si la página no requiere interacción! Algunos frameworks de SSG multipágina, como [Astro](https://astro.build/), también admiten la "hidratación parcial", lo que te permite usar componentes de Vue para crear "islas" interactivas dentro de HTML estático.

Las SSG monopágina son más adecuadas si esperas una interactividad no trivial, sesiones de larga duración o elementos/estados persistentes entre navegaciones. De lo contrario, la SSG multipágina sería la mejor opción.

El equipo de Vue también mantiene un generador de sitios estáticos llamado [VitePress](https://vitepress.dev/), ¡que potencia este sitio web que estás leyendo ahora mismo! VitePress soporta ambas variantes de SSG. [Nuxt](https://nuxt.com/) también soporta SSG. Incluso puedes mezclar SSR y SSG para diferentes rutas en la misma aplicación de Nuxt.

## Más Allá de la Web {#beyond-the-web}

Aunque Vue está diseñado principalmente para construir aplicaciones web, de ninguna manera se limita solo al navegador. Puedes:

- Crear aplicaciones de escritorio con [Electron](https://www.electronjs.org/) o [Wails](https://wails.io)
- Crear aplicaciones móviles con [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- Crear aplicaciones de escritorio y móviles desde el mismo código base con [Quasar](https://quasar.dev/) o [Tauri](https://tauri.app)
- Crear experiencias WebGL 3D con [TresJS](https://tresjs.org/)
- Usar la [API de Custom Renderer](/api/custom-renderer) de Vue para construir renderizadores personalizados, ¡como los para [la terminal](https://github.com/vue-terminal/vue-termui)!