import { isFunction, isNumber, isString } from "./predicate";

export type ShuffleDirection = 'ltr' | 'rtl' | 'mid'
export type IndividualTimeFunc = (index: number, length: number) => number
export interface ShufflerOptions {
	text: string,
	direction: ShuffleDirection,
	characters: string | string[]
	rate: number | IndividualTimeFunc,
	interval?: number | IndividualTimeFunc,
	duration: number,
	delay: number
}

const ALPHABETS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Update rate of browser cannot be faster than 60 fps.
 * 1s / 60 fps = 16ms
 */
const MIN_SPEED = 16.6

export const defaultOptions: ShufflerOptions = {
	text: '',
	direction: 'ltr',
	characters: ALPHABETS,
	rate: 40, // 25fps
	duration: 800,
	delay: 0
}

/**
 * Normalize the option to `ShuffleOptions` interface
 *  - if only one arg is parsed, merge `opts` to the `defaultOptions`
 *  - both args are parsed, merge `newOpts` to the `opts`
 */
export function normalizeOptions(
	opts: string | ShufflerOptions,
	newOpts?: string | ShufflerOptions
){
	/**
	 * If only one arg is parsed, merge it with defaultOptions.
	 */
	if (arguments.length === 1){
		newOpts = opts
		opts = new Object(defaultOptions) as ShufflerOptions
	} else if (isString(opts)){
		opts = new Object(defaultOptions) as ShufflerOptions
	}

	/**
	 * Specify `text` with string.
	 */
	if (isString(newOpts)){
		newOpts = { text: String(newOpts) } as ShufflerOptions
	}

	/**
	 * Return `opts` if `newOpts` is not an object
	 */
	if (typeof newOpts != "object"){
		return opts
	}

	// destructure `newOpts`
	const {
		text,
		direction,
		characters,
		rate,
		duration,
		delay
	} = newOpts

	// text
	if (text){
		opts.text = text
	}

	// direction
	if (direction && direction.match(/ltr|rtl|mid/)){
		opts.direction = direction
	}

	// characters
	if (Array.isArray(characters) && characters.length > 0){
		opts.characters = characters.map(String)
	} else if (characters) {
		opts.characters = String(characters)
	}

	/**
	 * rate: rate of shuffling.
	 */
	if (rate){
		opts.rate = isFunction(rate) ? rate : Math.max(Number(rate), MIN_SPEED)
	}

	/**
	 * duration: duration of shuffling (from first to last letter)
	 * `duration` cannot be smaller than `speed`, otherwise shuffling won't occur.
	 */
	if (duration){
		opts.duration = Number(duration)
		if (isNumber(opts.rate)){
			opts.duration = Math.max(duration, opts.rate)
		}
	}

	/**
	 * delay: specify how long the shuffling of random letters will last, before the first letter (of final letter) appears.
	 * `delay` time adds ahead of `duration`, so that the actual effect total time is longer.
	 */
	if (delay){
		opts.delay = Number(delay)
	}

	return opts
}
