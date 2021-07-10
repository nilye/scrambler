import createTextScrambler from '../src/index'

jest.useFakeTimers();

describe('scrambler', () => {

	test('should throw error with invalid callback argument', () => {
		// @ts-ignore
		expect(createTextScrambler()).toThrowError(TypeError)
		// @ts-ignore
		expect(createTextScrambler('text')).toThrowError(TypeError)
		// @ts-ignore
		expect(createTextScrambler('text', {})).toThrowError(TypeError)
		// @ts-ignore
		expect(createTextScrambler('text', true)).toThrowError(TypeError)
	})

	test('should return a function', () => {
		const scramble = createTextScrambler('text', () => {})
		expect(scramble).toBeInstanceOf(Function)
	})



})
