const clsx = require('clsx')
const isBoolean = (maybeBoolean) => typeof maybeBoolean === 'boolean'
const toStringIfBoolean = (value) => (isBoolean(value) ? String(value) : value)
const isSimpleSubset = (a, b) =>
  Object.entries(a).every(([key, value]) => b[key] === value)

function clb(schema = {}, ...rest) {
  const {
    base,
    defaultVariants = {},
    variants = {},
    compoundVariants = [],
  } = schema

  if (Object.keys(variants).length === 0 && compoundVariants.length === 0) {
    return clsx(schema, ...rest)
  }

  return function (options = {}) {
    const optionsWithUndefinedsRemoved = Object.fromEntries(
      Object.entries(options).filter(([, value]) => value !== undefined)
    )

    const currentOptions = {
      ...defaultVariants,
      ...optionsWithUndefinedsRemoved,
    }

    return clsx([
      base,
      Object.keys(variants).map((variantName) => {
        const optionKey =
          toStringIfBoolean(options[variantName]) ||
          defaultVariants[variantName]
        return variants[variantName][optionKey]
      }),
      compoundVariants
        .filter(({ classes, ...compoundVariantOptions }) =>
          isSimpleSubset(compoundVariantOptions, currentOptions)
        )
        .map(({ classes }) => classes),
    ])
  }
}

module.exports = clb
