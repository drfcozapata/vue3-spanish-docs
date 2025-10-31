# vuejs.org

## Contribuyendo

Este sitio está construido con [VitePress](https://github.com/vuejs/vitepress) y depende de [@vue/theme](https://github.com/vuejs/vue-theme). El contenido del sitio está escrito en formato Markdown y se encuentra en `src`. Para ediciones sencillas, puedes editar directamente el archivo en GitHub y generar una Pull Request.

Para el desarrollo local, se prefiere [pnpm](https://pnpm.io/) como gestor de paquetes:

```bash
pnpm i
pnpm run dev
```

Este proyecto requiere que Node.js sea `v18` o superior. Y se recomienda habilitar corepack:

```bash
corepack enable
```

## Trabajando en el contenido

- Consulta la documentación de VitePress sobre las [Extensiones de Markdown](https://vitepress.dev/guide/markdown) compatibles y la capacidad de [usar sintaxis de Vue dentro de Markdown](https://vitepress.dev/guide/using-vue).

- Consulta la [Guía de Redacción](https://github.com/vuejs/docs/blob/main/.github/contributing/writing-guide.md) para nuestras reglas y recomendaciones sobre la redacción y el mantenimiento del contenido de la documentación.

## Trabajando en el tema

Si es necesario realizar cambios en el tema, consulta las [instrucciones para desarrollar el tema junto con la documentación](https://github.com/vuejs/vue-theme#developing-with-real-content).