System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*"
  },

  map: {
    "GTMSportswear/js-utilities": "github:GTMSportswear/js-utilities@master"
  }
});
