# clb

clb (class list builder) is a small, utility function that builds a class list based on a simple api.

It's like [classnames](https://github.com/JedWatson/classnames) and [Stitches](https://stitches.dev/) made a really lazy baby. It works really well with [tailwindcss](https://tailwindcss.com/) but will work with any functional / utility / atomic css approach.

## Install It

```bash
yarn add clb
npm install clb
```

## Annotated Examples

### Nothing Fancy

```js
const clb = require('clb')
/*
  All `callbacks` mentioned below get the options
  you pass it when calling the builder below.
*/
const buttonBuilder = clb({

  /*
    This can be anything `classnames` accepts or a callback.
  */
  base: 'font-serif rounded-2xl',

  /*
    These values should be a string or a callback that
    returns a string.
  */
  defaults: {
    color: 'gray',
    size: 'medium',
    spacing: 'medium',
  },

  /*
    The value for each variant value below can be anything
    `classnames` accepts or a callback that returns anything
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

### A Little More Fancy

```js
const clb = require('clb')

const buttonBuilder = clb({
  base: 'font-serif rounded-2xl',
  defaults: {
    color: 'gray',
  },
  variants: {
    color: {
      gray: props => ({
        'text-gray-800 bg-gray-800': !props.disabled,
        'text-gray-400 bg-gray-200': props.disabled,
      }),
      red: props => ({
        'text-red-800 bg-red-800': !props.disabled,
        'text-red-400 bg-red-200': props.disabled,
      }),
    },
    disabled: {
      true: 'cursor-not-allowed',
    },
  },
})

buttonBuilder()
// -> font-serif rounded-2xl text-gray-800 bg-gray-800

buttonBuilder({ disabled: true })
// -> font-serif rounded-2xl text-gray-400 bg-gray-200 cursor-not-allowed

buttonBuilder({ color: 'red', disabled: true })
// -> font-serif rounded-2xl text-red-400 bg-red-200 cursor-not-allowed
```

### Usage With Vue / React / Others

None of this code is actually tested but should be *pretty* close.

**buttonClasses.js**
```js
import clb from 'clb'

const buttonClasses = clb({
  base: 'font-serif rounded-2xl',
  defaults: {
    color: 'gray',
  },
  variants: {
    color: {
      gray: props => ({
        'text-gray-800 bg-gray-800': !props.disabled,
        'text-gray-400 bg-gray-200': props.disabled,
      }),
      red: props => ({
        'text-red-800 bg-red-800': !props.disabled,
        'text-red-400 bg-red-200': props.disabled,
      }),
    },
    disabled: {
      true: 'cursor-not-allowed',
    },
  },
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
