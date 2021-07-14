import createTextScrambler from '../src/index'

// time mock
jest.useFakeTimers();

// support raf
beforeEach(() => {
	jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
		const time = performance.now()
		cb(time)
		return time
	});
});

describe('scrambler', () => {

	test('should throw error with invalid callback argument', () => {
		/**
		 * https://jestjs.io/docs/expect#tothrowerror
		 * You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
		 */
		// @ts-ignore
		expect(() => createTextScrambler()).toThrow(TypeError)
		// @ts-ignore
		expect(() => createTextScrambler('text')).toThrow(TypeError)
		// @ts-ignore
		expect(() => createTextScrambler('text', {})).toThrow(TypeError)
		// @ts-ignore
		expect(() => createTextScrambler('text', true)).toThrow(TypeError)
	})

	test('should return a function', () => {
		const scramble = createTextScrambler('text', () => {})
		expect(scramble).toBeInstanceOf(Function)
	})

	test('should scramble at correct rate', () => {
		// default `rate` 40ms
		const callback1 = jest.fn()
		const defaultScramble = createTextScrambler('text', callback1)
		expect(callback1).not.toBeCalled()
		defaultScramble()
		expect(callback1).toBeCalled()
		jest.advanceTimersByTime(1)
		expect(callback1).toHaveBeenCalledTimes(1)
		jest.advanceTimersByTime(39)
		expect(callback1).toBeCalled()
		expect(callback1).toHaveBeenCalledTimes(2)
	})

})
