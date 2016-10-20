System.config({
  baseURL: '/',
  paths: {
    systemjs: 'lib/system.js/dist/system.js',
    traceur: 'lib/traceur/traceur.min.js',
    "github:*": "/github/*"
  },
  map: {
    "gtmsportswear/js-utilities": "github:gtmsportswear/js-utilities@master",
  },
  defaultJSExtensions: true,
  transpiler: 'traceur'
});