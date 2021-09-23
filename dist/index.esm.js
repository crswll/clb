var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/classcat/index.cjs
var require_classcat = __commonJS({
  "node_modules/classcat/index.cjs"(exports, module) {
    module.exports = function cc(names) {
      if (typeof names === "string" || typeof names === "number")
        return "" + names;
      let out = "";
      if (Array.isArray(names)) {
        for (let i = 0, tmp; i < names.length; i++) {
          if ((tmp = cc(names[i])) !== "") {
            out += (out && " ") + tmp;
          }
        }
      } else {
        for (let k in names) {
          if (names[k])
            out += (out && " ") + k;
        }
      }
      return out;
    };
  }
});

// src/index.js
var require_src = __commonJS({
  "src/index.js"(exports, module) {
    var cc = require_classcat();
    var isBoolean = (maybeBoolean) => typeof maybeBoolean === "boolean";
    var toStringIfBoolean = (value) => isBoolean(value) ? String(value) : value;
    var isSimpleSubset = (a, b) => Object.entries(a).every(([key, value]) => b[key] === value);
    var clb = (schema = {}) => (options = {}) => {
      const {
        base,
        defaultVariants = {},
        variants = {},
        compoundVariants = []
      } = schema;
      const currentVariants = {
        ...defaultVariants,
        ...variants
      };
      const currentOptions = {
        ...defaultVariants,
        ...options
      };
      return cc([
        base,
        Object.keys(currentVariants).map((variantName) => {
          return variants[variantName] && variants[variantName][toStringIfBoolean(options[variantName]) || defaultVariants[variantName]];
        }),
        compoundVariants.reduce((list, { classes, ...compoundVariantOptions }) => {
          if (isSimpleSubset(compoundVariantOptions, currentOptions)) {
            list.push(classes);
          }
          return list;
        }, [])
      ]);
    };
    module.exports = clb;
  }
});
export default require_src();
