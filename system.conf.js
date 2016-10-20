System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "traceur",
  paths: {
    "systemjs": "lib/system.js/dist/system.js",
    "traceur": "lib/traceur/traceur.min.js",
    "github:*": "/github/*"
  },

  map: {
    "gtmsportswear/js-utilities": "github:gtmsportswear/js-utilities@1.0.0"
  }
});
