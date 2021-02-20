const lilo = require("./")

test('no configuration', () => {
  const builder = lilo()

  expect(builder()).toEqual('')
})

test('basic use cases', () => {
  const builder = lilo({
    base: 'foo',
    variants: {
      color: {
        red: 'text-red-200',
        blue: 'text-blue-200',
      },
      size: {
        small: 'text-sm',
        medium: 'text-md',
        large: 'text-lg',
      },
    },
  })

  const tests = [
    [ {}, 'foo'],
    [ { color: 'red' }, 'foo text-red-200' ],
    [ { color: 'blue' }, 'foo text-blue-200' ],
    [ { size: 'small' }, 'foo text-sm' ],
    [ { size: 'medium' }, 'foo text-md' ],
    [ { size: 'large' }, 'foo text-lg' ],
    [ { color: 'red', size: 'large' }, 'foo text-red-200 text-lg' ],
  ]

  tests.forEach(([input, output]) => {
    expect(builder(input)).toEqual(output)
  })
})

test('defaults are applied properly', () => {
  const builder = lilo({
    base: 'foo',
    defaults: {
      color: 'red',
      size: 'small'
    },
    variants: {
      color: {
        red: 'text-red-200',
        blue: 'text-blue-200',
      },
      size: {
        small: 'text-sm',
        medium: 'text-md',
        large: 'text-lg',
      },
    },
  })

  expect(builder()).toEqual('foo text-red-200 text-sm')
})

test('use variants with callbacks', () => {
  const builder = lilo({
    base: 'foo',
    variants: {
      color: {
        red: props => ({
          'text-red-200': !props.disabled,
          'text-gray-200': props.disabled,
        }),
      },
      disabled: {
        true: 'opacity-25'
      },
    },
  })

  expect(builder({ color: 'red', disabled: false })).toEqual('foo text-red-200')
  expect(builder({ color: 'red', disabled: true })).toEqual('foo text-gray-200 opacity-25')
})

test('use base with a callback', () => {
  const builder = lilo({
    base: props => ({
      'special base colors': props.color,
    }),
    variants: {
      color: {
        red: 'text-red-200'
      },
    },
  })

  expect(builder({ disabled: false })).toEqual('')
  expect(builder({ color: 'red', disabled: true })).toEqual('special base colors text-red-200')
})
