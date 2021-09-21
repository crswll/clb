const cc = require('classcat')
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

  const currentVariants = {
    ...defaultVariants,
    ...variants
  }

  const currentOptions = {
    ...defaultVariants,
    ...options,
  }

  return cc([
    base,
    Object.keys(currentVariants).map(variantName => {
      return variants[variantName] && variants[variantName][
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
