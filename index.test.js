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

describe('basic use cases with defaultVariants', () => {
  const builder = clb({
    base: 'foo',
    defaultVariants: {
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

describe(`defaultVariants that aren't variants`, () => {
  test('weird and likely bad key names like null, undefined', () => {
    const builder = clb({
      base: 'foo',
      defaultVariants: {
        tone: 'neutral',
      },
      variants: {
        tone: {
          null: 'tone-null',
          undefined: 'tone-undefined',
          false: 'tone-false',
          neutral: 'tone-neutral'
        },
      },
    })

    expect(builder()).toBe('foo tone-neutral')
    expect(builder({ tone: 'neutral' })).toBe('foo tone-neutral')
    expect(builder({ tone: 'something else' })).toBe('foo')
    expect(builder({ tone: null })).toBe('foo tone-neutral')
    expect(builder({ tone: undefined })).toBe('foo tone-neutral')
    expect(builder({ tone: false })).toBe('foo tone-false')
  })
})

describe(`compound variants`, () => {
  test('basic', () => {
    const builder = clb({
      base: 'base',
      compoundVariants: [
        { color: 'red', classes: 'neat' },
      ],
    })

    expect(builder({ color: 'blue' })).toBe('base')
    expect(builder({ color: 'red' })).toBe('base neat')
  })

  test('multiple', () => {
    const builder = clb({
      base: 'base',
      compoundVariants: [
        { color: "red", size: "small", classes: "red small" },
        { color: "blue", size: "large", classes: "blue large" },
        { color: "blue", size: "large", disabled: true, classes: "blue large disabled" },
      ],
    })

    expect(builder({ color: "red", size: "small" })).toBe('base red small')
    expect(builder({ color: "blue", size: "large" })).toBe('base blue large')
    expect(builder({ color: "blue", size: "large", disabled: true })).toBe('base blue large blue large disabled')
    expect(builder({ color: "red", size: "large" })).toBe('base')
    expect(builder({ color: "blue", size: "small" })).toBe('base')
  })

  test('with the defaults', () => {
    const builder = clb({
      base: 'base',
      defaultVariants: {
        color: 'red',
      },
      compoundVariants: [
        { color: 'red', size: 'sm', classes: 'red sm' },
      ],
    })

    expect(builder({ size: "sm" })).toBe('base red sm')
  })

  test('with additional props that do not matter', () => {
    const builder = clb({
      base: 'base',
      compoundVariants: [
        { color: 'red', size: 'sm', classes: 'red sm' },
      ],
    })

    expect(builder({ color: 'red', size: "sm", random: '12345' })).toBe('base red sm')
  })

  test('false undefined null 0', () => {
    const builder = clb({
      base: 'base',
      compoundVariants: [
        { test: false, more: 5, classes: 'test false more five' },
        { test: undefined, more: 5, classes: 'test undefined more five' },
        { test: null, more: 5, classes: 'test null more five' },
        { test: 0, more: 5, classes: 'test zero more five' },
      ],
    })

    expect(builder({ test: false, more: 5 })).toBe('base test false more five')
    expect(builder({ test: undefined, more: 5 })).toBe('base test undefined more five')
    expect(builder({ test: null, more: 5 })).toBe('base test null more five')
    expect(builder({ test: 0, more: 5 })).toBe('base test zero more five')
  })
})
