const cc = require('classcat')

const isFunction = maybeFunction => typeof maybeFunction === "function"

const variantClassBuilding = (schema = {}) => (options = {}) => {
  const {
    base,
    defaults: unprocessedDefaults = {},
    variants = {},
  } = schema

  const defaults = Object
    .entries(unprocessedDefaults)
    .reduce((out, [key, value]) => ({
      ...out, [key]: isFunction(value) ? value(options) : value,
    }), {})

  return cc([
    isFunction(base) ? base(options) : base,
    Object.keys({ ...defaults, ...variants }).map(variantName => {
      const classes = variants[variantName][
        options[variantName] || defaults[variantName]
      ]

      return isFunction(classes) ? classes(options) : classes
    }),
  ])
}

module.exports = variantClassBuilding
