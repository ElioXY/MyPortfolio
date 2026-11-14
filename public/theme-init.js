// Aplica el tema antes del primer pintado.
//
// Va en un archivo aparte y no dentro de index.html porque la CSP del sitio es
// `script-src 'self'`: un script en línea se rechaza y el tema nunca llega a
// aplicarse. Aquí, al ser del propio origen, sí se ejecuta.
;(function () {
  try {
    var stored = localStorage.getItem('theme')
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    if (dark) document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  } catch (error) {
    // Sin localStorage ni matchMedia se queda el tema claro por defecto.
  }
})()
