const isBoolean = maybeBoolean => typeof maybeBoolean === "boolean"
const toStringIfBoolean = value => isBoolean(value) ? String(value) : value
const isSimpleSubset = (a, b) => Object.entries(a).every(([key, value]) => b[key] === value)

// https://github.com/jorgebucaran/classcat
function cc (names) {
  if (typeof names === "string" || typeof names === "number") return "" + names

  let out = ""

  if (Array.isArray(names)) {
    for (let i = 0, tmp; i < names.length; i++) {
      if ((tmp = cc(names[i])) !== "") {
        out += (out && " ") + tmp
      }
    }
  } else {
    for (let k in names) {
      if (names[k]) out += (out && " ") + k
    }
  }

  return out
}

const classListBuilder = (schema = {}) => (options = {}) => {
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

module.exports = classListBuilder
