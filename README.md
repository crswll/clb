# clb

clb (class list builder) is a small, utility function that builds a class list based on a simple api.

It's like [classnames](https://github.com/JedWatson/classnames) and [Stitches](https://stitches.dev/) made a really lazy baby. It works really well with [tailwindcss](https://tailwindcss.com/) but will work with any functional / utility / atomic css approach.

If you're looking for a very similar thing with type support check out https://github.com/joe-bell/cva.

## Install It

```bash
yarn add clb
npm install clb
```

## Annotated Examples

### Nothing Fancy

```js
const clb = require('clb')

const buttonBuilder = clb({

  /* This can be anything `classnames` accepts. */
  base: 'font-serif rounded-2xl',

  defaultVariants: {
    color: 'gray',
    size: 'medium',
    spacing: 'medium',
  },

  /*
    The value for each variant value below can be anything
    `classnames` accepts.
  */
  variants: {
    color: {
      gray: 'text-gray-800 bg-gray-800',
      red: 'text-red-800 bg-red-200',
      blue: 'text-blue-800 bg-blue-200',
      green: 'text-green-800 bg-green-200',
    },
    size: {
      small: 'text-sm',
      medium: 'text-md',
      large: 'text-lg',
    },
    spacing: {
      small: 'p-2',
      medium: 'p-4',
      large: 'p-6',
    },
  },
})

buttonBuilder()
// -> font-serif rounded-2xl text-gray-800 bg-gray-800 text-md p-4

buttonBuilder({ color: 'red' })
// -> font-serif rounded-2xl text-red-800 bg-red-800 text-md p-4

buttonBuilder({ color: 'blue', size: 'large' })
// -> font-serif rounded-2xl text-blue-800 bg-blue-800 text-lg p-6
```

### A Little More Fancy Pants

```js
const clb = require('clb')

const buttonBuilder = clb({
  base: 'font-serif rounded-2xl',
  defaultVariants: {
    color: 'gray',
    size: 'small',
  },
  variants: {
    size: {
      small: 'text-sm p-2',
    },
    disabled: {
      true: 'cursor-not-allowed',
    },
  },
  compoundVariants: [
    { color: 'gray', disabled: true, classes: 'text-gray-200 bg-gray-50' },
    { color: 'gray', disabled: false, classes: 'text-gray-800 bg-gray-200' },
    { color: 'red', disabled: true, classes: 'text-red-200 bg-red-50' },
    { color: 'red', disabled: false, classes: 'text-red-800 bg-red-200' },
    { color: 'blue', disabled: true, classes: 'text-blue-200 bg-blue-50' },
    { color: 'blue', disabled: false, classes: 'text-blue-800 bg-blue-200' },
  ],
})

buttonBuilder()
// -> font-serif rounded-2xl text-sm p-2 text-gray-800 bg-gray-800

buttonBuilder({ disabled: true })
// -> font-serif rounded-2xl text-sm p-2 text-gray-200 bg-gray-50 cursor-not-allowed

buttonBuilder({ color: 'red', disabled: true })
// -> font-serif rounded-2xl text-sm p-2 text-red-200 bg-red-50 cursor-not-allowed
```

### Usage With Vue / React / Others

None of this code is actually tested but should be *pretty* close.

**buttonClasses.js**
```js
import clb from 'clb'

const buttonBuilder = clb({
  base: 'font-serif rounded-2xl',
  defaultVariants: {
    color: 'gray',
    size: 'small',
  },
  variants: {
    size: {
      small: 'text-sm p-2',
    },
    disabled: {
      true: 'cursor-not-allowed',
    },
  },
  compoundVariants: [
    { color: 'gray', disabled: true, classes: 'text-gray-200 bg-gray-50' },
    { color: 'gray', disabled: false, classes: 'text-gray-800 bg-gray-200' },
    { color: 'red', disabled: true, classes: 'text-red-200 bg-red-50' },
    { color: 'red', disabled: false, classes: 'text-red-800 bg-red-200' },
    { color: 'blue', disabled: true, classes: 'text-blue-200 bg-blue-50' },
    { color: 'blue', disabled: false, classes: 'text-blue-800 bg-blue-200' },
  ],
})

export default buttonClasses
```

**Button.jsx**
```jsx
import buttonClasses from "./buttonClasses"

const Button = ({ color, disabled }) => (
  <button className={buttonClasses({ color, disabled })}>
    Whoa Cool Button
  </button>
)
```

**Button.vue**
```vue
<script>
  import buttonClasses from "./buttonClasses"

  export default {
    props: ['color', 'disabled'],
    methods: { buttonClasses }
  }
</script>

<template>
  <button :class="buttonClasses({ color, disabled })">
    Whoa Cool Button
  </button>
</template>
```

**Button.svelte** (thanks [JakeNavith](https://github.com/JakeNavith))
```svelte
<script>
  import buttonClasses from "./buttonClasses"
  export let color
  export let disabled
</script>

<button class={buttonClasses({ color, disabled })}>
  Whoa Cool Button
</button>
```

### Use as clsx
When `clb` doesn't have a `variant` or `compountVariant` key it passes everthing to `clsx`, which is like `classnames` if you're familiar with that.

```js
clb('foo', { bar: true })
// -> foo bar
