const isFunction = maybeFunction => typeof maybeFunction === "function"
const isBoolean = maybeFunction => typeof maybeFunction === "boolean"
const cif = (value, ...optionalArguments) => isFunction(value) ? value(...optionalArguments) : value
const toStringIfBoolean = value => isBoolean(value) ? String(value) : value

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
    defaults: unprocessedDefaults = {},
    variants = {},
  } = schema

  const defaults = Object
    .entries(unprocessedDefaults)
    .reduce((out, [key, value]) => ({
      ...out, [key]: cif(value, options)
    }), {})

  return cc([
    isFunction(base) ? base(options) : base,
    Object.keys({ ...defaults, ...variants }).map(variantName => {
      if (isFunction(variants[variantName])) {
        return variants[variantName](options)
      }

      return cif(
        variants[variantName][
          toStringIfBoolean(options[variantName]) ||
          defaults[variantName]
        ],
        options
      )
    }),
  ])
}

module.exports = classListBuilder
