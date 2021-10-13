const clsx = require('clsx')
const isBoolean = maybeBoolean => typeof maybeBoolean === "boolean"
const toStringIfBoolean = value => isBoolean(value) ? String(value) : value
const isSimpleSubset = (a, b) => Object.entries(a).every(([key, value]) => b[key] === value)

const clb = (schema = {}) => (options = {}) => {
  const {
    base,
    defaultVariants = {},
    variants = {},
    compoundVariants = [],
  } = schema

  const optionsWithUndefinedsRemoved = Object
    .entries(options)
    .reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc
      }

      acc[key] = value
      return acc
    }, {})

  const currentOptions = {
    ...defaultVariants,
    ...optionsWithUndefinedsRemoved,
  }

  return clsx([
    base,
    Object.keys(variants).map(variantName => {
      return variants[variantName][
        toStringIfBoolean(options[variantName]) || defaultVariants[variantName]
      ]
    }),
    compoundVariants.reduce((list, { classes, ...compoundVariantOptions }) => {
      if (isSimpleSubset(compoundVariantOptions, currentOptions)) {
        list.push(classes)
      }
      return list
    }, [])
  ])
}

module.exports = clb
