const classnames = require('classnames')

const isFunction = maybeFunction => typeof maybeFunction === "function"
const cif = (value, ...optionalArguments) => isFunction(value) ? value(...optionalArguments) : value

const classListBuilder = (schema = {}) => (options = {}) => {
  const {
    base,
    defaults: unprocessedDefaults = {},
    variants = {},
  } = schema

  const defaults = Object
    .entries(unprocessedDefaults)
    .reduce((out, [key, value]) => ({
      ...out, [key]: cif(value, options)
    }), {})

  return classnames([
    isFunction(base) ? base(options) : base,
    Object.keys({ ...defaults, ...variants }).map(variantName => {
      const classes = variants[variantName][
        options[variantName] || defaults[variantName]
      ]

      return cif(classes, options)
    }),
  ])
}

module.exports = classListBuilder
