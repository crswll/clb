const clb = require("./")

describe('strange edge cases', () => {
  test('no schema passed should result in no classes', () => {
    const builder = clb()
    expect(builder({ color: 'red' })).toBe('')
  })

  test('no schema and no options should result in no classes as well', () => {
    const builder = clb()

    expect(builder()).toBe('')
  })

  test('variant that does not make sense does not error', () => {
    const builder = clb({
      variants: {
        color: {
          blue: 'blue',
        },
      },
    })

    expect(builder({ color: 'GREEN' })).toBe('')
    expect(builder({ __DOES_NOT_EXIST__: 'GREEN' })).toBe('')
  })
})

describe('basic use cases without default', () => {
  const builder = clb({
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
      disabled: {
        true: 'opacity-50',
        false: 'opacity-100',
      },
    },
  })

  describe.each([
    [ undefined, 'foo'],
    [ {}, 'foo'],
    [ { color: 'red' }, 'foo text-red-200' ],
    [ { color: 'blue' }, 'foo text-blue-200' ],
    [ { size: 'small' }, 'foo text-sm' ],
    [ { size: 'medium' }, 'foo text-md' ],
    [ { size: 'large' }, 'foo text-lg' ],
    [ { color: 'red', size: 'large' }, 'foo text-red-200 text-lg' ],
    [ { disabled: true }, 'foo opacity-50' ],
    [ { disabled: 'true' }, 'foo opacity-50' ],
    [ { disabled: false }, 'foo opacity-100' ],
    [ { disabled: 'false' }, 'foo opacity-100' ],
  ])('builder(%o)', (options, expected) => {
    test(`returns ${expected}`, () => {
      expect(builder(options)).toBe(expected)
    })
  })
})

describe('basic use cases with defaults', () => {
  const builder = clb({
    base: 'foo',
    defaults: {
      color: 'red',
      size: 'medium',
      disabled: false,
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
      disabled: {
        true: 'opacity-50',
        false: 'opacity-100',
      },
    },
  })

  describe.each([
    [ {}, 'foo text-red-200 text-md opacity-100'],
    [ { color: 'blue' }, 'foo text-blue-200 text-md opacity-100'],
    [ { color: 'blue', size: 'large' }, 'foo text-blue-200 text-lg opacity-100'],
    [ { color: 'blue', disabled: true }, 'foo text-blue-200 text-md opacity-50'],
  ])('builder(%o)', (options, expected) => {
    test(`returns ${expected}`, () => {
      expect(builder(options)).toBe(expected)
    })
  })
})

describe('using callbacks', () => {
  test('base should take a callback', () => {
    const builder = clb({ base: props => `hi ${props.passThrough}` })

    expect(builder({ passThrough: 'passThrough' })).toBe('hi passThrough')
  })

  test('variant values can take a function', () => {
    const builder = clb({
      base: 'foo',
      variants: {
        color: {
          red: props => ({
            'text-red-200': !props.disabled,
            'text-gray-200': props.disabled,
          }),
        },
        disabled: {
          true: 'pointer-events-none',
        },
      },
    })

    expect(builder({ color: 'red'})).toBe('foo text-red-200')
    expect(builder({ color: 'red', disabled: true })).toBe('foo text-gray-200 pointer-events-none')
  })

  test('default values can be a callback as well', () => {
    const builder = clb({
      base: 'foo',
      defaults: {
        color: props => props.disabled ? 'gray' : 'red'
      },
      variants: {
        color: {
          red: 'text-red-200',
          gray: 'text-gray-200',
        },
        disabled: props => ({
          'pointer-events-none': props.disabled,
          'cursor-pointer': !props.disabled
        }),
      },
    })

    expect(builder({ disabled: false })).toBe('foo text-red-200 cursor-pointer')
    expect(builder({ disabled: true })).toBe('foo text-gray-200 pointer-events-none')
    expect(builder({ color: 'red', disabled: true })).toBe('foo text-red-200 pointer-events-none')
  })
})

describe('callback directly for a variant', () => {
  test('we should be able to use the variant in the callback', () => {
    const builder = clb({
      base: 'flex',
      variants: {
        collapseBelow: {
          "sm": "flex-row sm:flex-col",
          "md": "flex-row md:flex-col",
          "lg": "flex-row lg:flex-col",
        },
      },
    })

    expect(builder({ collapseBelow: "sm" })).toBe('flex flex-row sm:flex-col')
  })

  test('we should be able to use the variant in the callback', () => {
    const builder = clb({
      base: 'grid',
      variants: {
        gap: props => `gap-${props.gap} whoa cool`,
      },
    })

    expect(builder({ gap: 1 })).toBe('grid gap-1 whoa cool')
    expect(builder({ gap: 5 })).toBe('grid gap-5 whoa cool')
  })
})
