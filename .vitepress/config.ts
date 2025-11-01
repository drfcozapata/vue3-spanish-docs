import fs from 'fs'
import path from 'path'
import {
  defineConfigWithTheme,
  type HeadConfig,
  type Plugin
} from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import llmstxt from 'vitepress-plugin-llms'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Docs',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Guía', link: '/guide/introduction' },
      { text: 'Tutorial', link: '/tutorial/' },
      { text: 'Ejemplos', link: '/examples/' },
      { text: 'Inicio Rápido', link: '/guide/quick-start' },
      // { text: 'Guía de Estilo', link: '/style-guide/' },
      { text: 'Glosario', link: '/glossary/' },
      { text: 'Referencia de Errores', link: '/error-reference/' },
      {
        text: 'Documentación de Vue 2',
        link: 'https://v2.vuejs.org'
      },
      {
        text: 'Migración desde Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Playground',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Ecosistema',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Recursos',
        items: [
          { text: 'Socios', link: '/partners/' },
          { text: 'Temas', link: '/ecosystem/themes' },
          {
            text: 'Componentes de IU',
            link: 'https://ui-libs.vercel.app/'
          },
          {
            text: 'Colección de Plugins',
            link: 'https://www.vue-plugins.org/'
          },
          {
            text: 'Certificación',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: 'Empleos', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'T-Shirt Shop', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Librerías Oficiales',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          {
            text: 'Guía de Herramientas',
            link: '/guide/scaling-up/tooling.html'
          }
        ]
      },
      {
        text: 'Cursos en Video',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Ayuda',
        items: [
          {
            text: 'Chat de Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Discusiones en GitHub',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Comunidad en DEV', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Noticias',
        items: [
          { text: 'Blog', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://x.com/vuejs' },
          { text: 'Eventos', link: 'https://events.vuejs.org/' },
          { text: 'Newsletters', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'Acerca',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'Equipo', link: '/about/team' },
      { text: 'Lanzamientos', link: '/about/releases' },
      {
        text: 'Guía de la Comunidad',
        link: '/about/community-guide'
      },
      { text: 'Código de Conducta', link: '/about/coc' },
      { text: 'Política de Privacidad', link: '/about/privacy' },
      {
        text: 'El Documental',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Patrocinador',
    link: '/sponsor/'
  },
  {
    text: 'Socios',
    activeMatch: `^/partners/`,
    link: '/partners/'
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Primeros Pasos',
      items: [
        { text: 'Introducción', link: '/guide/introduction' },
        {
          text: 'Inicio Rápido',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Esenciales',
      items: [
        {
          text: 'Creando una Aplicación',
          link: '/guide/essentials/application'
        },
        {
          text: 'Sintaxis de Template',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Fundamentos de Reactividad',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Propiedades Computadas',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Enlaces de Clases y Estilos',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Renderizado Condicional',
          link: '/guide/essentials/conditional'
        },
        { text: 'Renderizado de Listas', link: '/guide/essentials/list' },
        {
          text: 'Manejo de Eventos',
          link: '/guide/essentials/event-handling'
        },
        {
          text: 'Enlaces de Entrada de Formulario',
          link: '/guide/essentials/forms'
        },
        { text: 'Watchers', link: '/guide/essentials/watchers' },
        { text: 'Template Refs', link: '/guide/essentials/template-refs' },
        {
          text: 'Fundamentos de Componentes',
          link: '/guide/essentials/component-basics'
        },
        {
          text: 'Hooks del Ciclo de Vida',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: 'Componentes en Profundidad',
      items: [
        {
          text: 'Registro',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: 'Eventos', link: '/guide/components/events' },
        { text: 'Componente v-model', link: '/guide/components/v-model' },
        {
          text: 'Atributos de Fallthrough',
          link: '/guide/components/attrs'
        },
        { text: 'Slots', link: '/guide/components/slots' },
        {
          text: 'Provide / Inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Componentes Asíncronos',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Reusabilidad',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Directivas Personalizadas',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Plugins', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Componentes Integrados',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Escalando',
      items: [
        {
          text: 'Componentes de Archivo Único (SFC)',
          link: '/guide/scaling-up/sfc'
        },
        { text: 'Herramientas', link: '/guide/scaling-up/tooling' },
        { text: 'Enrutamiento', link: '/guide/scaling-up/routing' },
        {
          text: 'Gestión del Estado',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testing', link: '/guide/scaling-up/testing' },
        {
          text: 'Renderizado en el Lado del Servidor (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Mejores Prácticas',
      items: [
        {
          text: 'Despliegue en Producción',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Rendimiento',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Accesibilidad',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Securidad',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Introducción', link: '/guide/typescript/overview' },
        {
          text: 'TS con Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS con Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Tópicos Extra',
      items: [
        {
          text: 'Formas de Usar Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Preguntas Frecuentes de la Composition API',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Reactividad en Profundidad',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Mecanismo de Renderizado',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Funciones de Renderizado & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue y Componentes Web',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Técnicas de Animación',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'API Global',
      items: [
        { text: 'Applicación', link: '/api/application' },
        {
          text: 'General',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Reactividad:  Núcleo',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reactividad: Utilidades',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reactividad: Avanzado',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Hooks del Ciclo de Vida',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Inyección de Dependencias',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'Helpers',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options: Estado', link: '/api/options-state' },
        { text: 'Options: Renderizado', link: '/api/options-rendering' },
        {
          text: 'Options: Ciclo de Vida',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options: Composición',
          link: '/api/options-composition'
        },
        { text: 'Opciones: Miscelánea', link: '/api/options-misc' },
        {
          text: 'Instancia de Componente',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Integrados',
      items: [
        { text: 'Directivas', link: '/api/built-in-directives' },
        { text: 'Componentes', link: '/api/built-in-components' },
        {
          text: 'Elementos Especiales',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Atributos Especiales',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Componente de Archivo Único (SFC)',
      items: [
        { text: 'Especificación de la Sintaxis', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Características de CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'API Avanzadas',
      items: [
        { text: 'Elementos Personalizados', link: '/api/custom-elements' },
        { text: 'Función de Renderizado', link: '/api/render-function' },
        { text: 'Renderizado en el Lado del Servidor', link: '/api/ssr' },
        {
          text: 'Tipos de Utilidad de TypeScript',
          link: '/api/utility-types'
        },
        {
          text: 'Renderizador Personalizado',
          link: '/api/custom-renderer'
        },
        {
          text: 'Indicadores de Tiempo de Compilación',
          link: '/api/compile-time-flags'
        }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Básico',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Manejo de Entradas del Usuario',
          link: '/examples/#handling-input'
        },
        {
          text: 'Enlaces de Atributos',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Condicionales y Bucles',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Enlaces de Formularios',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Componente Simple',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Práctico',
      items: [
        {
          text: 'Editor Markdown',
          link: '/examples/#markdown'
        },
        {
          text: 'Obtención de Datos',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Cuadrícula con Clasificación y Filtro',
          link: '/examples/#grid'
        },
        {
          text: 'Vista en Árbol',
          link: '/examples/#tree'
        },
        {
          text: 'Gráfico SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Modal con Transiciones',
          link: '/examples/#modal'
        },
        {
          text: 'Lista con Transiciones',
          link: '/examples/#list-transition'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 Interface Gráficas de Usuario',
      items: [
        {
          text: 'Contador',
          link: '/examples/#counter'
        },
        {
          text: 'Convertidor de Temperatura',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Reservador de Vuelos',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Temporizador',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Dibujador de Círculos',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Celdas',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Guía de Estilo',
      items: [
        {
          text: 'Introducción',
          link: '/style-guide/'
        },
        {
          text: 'A - Esencial',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Muy Recomendado',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recomendado',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Use con Precaución',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// Placeholder of the i18n config for @vuejs-translations.
const i18n: ThemeConfig['i18n'] = {
  search: 'Buscar',
  menu: 'Menú',
  toc: 'En esta página',
  returnToTop: 'Volver arriba',
  appearance: 'Apariencia',
  previous: 'Anterior',
  next: 'Siguiente',
  pageNotFound: 'Página no encontrada',
  locales: 'Idiomas',
  joinTranslation: '¡Ayúdanos a Traducir!',
  deadLink: {
    before: 'Has encontrado un enlace roto: ',
    after: '.'
  },
  deadLinkReport: {
    before: 'Por favor, ',
    link: 'repórtanos',
    after: ' para que podamos corregirlo.'
  },
  footerLicense: {
    before: 'Publicado bajo ',
    after: ''
  },
  ariaAnnouncer: {
    before: '',
    link: 'Anunciador',
    after: ''
  },
  ariaDarkMode: 'Cambiar a modo oscuro',
  ariaSkipToContent: 'Saltar al contenido',
  ariaToC: 'Tabla de contenidos de la página actual',
  ariaMainNav: 'Navegación principal',
  ariaMobileNav: 'Navegación móvil',
  ariaSidebarNav: 'Navegación de barra lateral',
  ariaLanguage: 'Cambiar idioma',
  ariaRepo: {
    before: 'Ver ',
    link: 'repositorio',
    after: ''
  }
}

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://vuejs.org'
  },

  lang: 'es-ES',
  title: 'Vue.js',
  description: 'Vue.js - El Framework Progresivo de JavaScript',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - El Framework Progresivo de JavaScript'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://media.bitterbrains.com/main.js?from=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    // Placeholder of the i18n config for @vuejs-translations.
    i18n,

    localeLinks: [
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl'
      },
      {
        link: 'https://vue3-spanish.netlify.app/',
        text: 'Español',
        repo: 'https://github.com/drfcozapata/vue3-spanish-docs'
      },
      {
        link: '/translations/',
        text: '¡Ayúdanos a Traducir!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: '21cf9df0734770a2448a9da64a700c22',
      searchParameters: {
        facetFilters: ['version:v3']
      },
      placeholder: 'Buscar documentos...',
      translations: {
        button: {
          buttonText: 'Buscar',
          buttonAriaLabel: 'Buscar'
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Limpiar búsqueda',
            resetButtonAriaLabel: 'Limpiar búsqueda',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Cancelar'
          },
          startScreen: {
            recentSearchesTitle: 'Búsquedas recientes',
            noRecentSearchesText: 'No hay búsquedas recientes',
            saveRecentSearchButtonTitle: 'Guardar búsqueda',
            removeRecentSearchButtonTitle: 'Eliminar búsqueda'
          },
          errorScreen: {
            titleText: 'Error al buscar',
            helpText: 'Verifica tu conexión o intenta nuevamente'
          },
          footer: {
            selectText: 'Seleccionar',
            navigateText: 'Navegar',
            closeText: 'Cerrar',
            searchByText: 'Buscar por'
          }
        }
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://x.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs/docs',
      text: 'Edita esta página en GitHub'
    },

    footer: {
      license: {
        text: 'Licencia MIT',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin).use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      llmstxt({
        ignoreFiles: [
          'about/team/**/*',
          'about/team.md',
          'about/privacy.md',
          'about/coc.md',
          'developers/**/*',
          'ecosystem/themes.md',
          'examples/**/*',
          'partners/**/*',
          'sponsor/**/*',
          'index.md'
        ],
        customLLMsTxtTemplate: `\
# Vue.js

Vue.js - El Framework Progresivo de JavaScript

## Tabla de Contenidos

{toc}`
      }) as Plugin,
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})
