import { isFunction, isNumber, isString } from "./predicate";

export type ScramblerTimeFunc = (index: number, length: number) => number
export interface ScramblerOptions {
	from: 'left' | 'right' | 'middle' | 'random',
	characters: string | string[]
	rate: number | ScramblerTimeFunc,
	interval?: number | ScramblerTimeFunc,
	duration: number,
	delay: number
}

const ALPHABETS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Update rate of browser cannot be faster than 60 fps.
 * 1s / 60 fps = 16ms
 */
const MIN_SPEED = 16.6

export const defaultOptions: ScramblerOptions = {
	from: 'left',
	characters: ALPHABETS,
	rate: 40, // 25fps
	duration: 800,
	delay: 0
}

/**
 * Normalize the option to `scrambleOptions` interface
 *  - if only one arg is parsed, merge `opts` to the `defaultOptions`
 *  - both args are parsed, merge `newOpts` to the `opts`
 */
export function normalizeOptions(
	opts: Partial<ScramblerOptions>
): ScramblerOptions

export function normalizeOptions(
	opts: ScramblerOptions,
	newOpts: Partial<ScramblerOptions>
): ScramblerOptions

export function normalizeOptions(
	opts: ScramblerOptions,
	newOpts?: Partial<ScramblerOptions>
): ScramblerOptions {

	/**
	 * If only one arg is parsed, merge it with defaultOptions.
	 */
	if (arguments.length === 1){
		newOpts = opts
		opts = new Object(defaultOptions) as ScramblerOptions
	}

	/**
	 * Return `opts` if `newOpts` is not an object
	 */
	if (!newOpts || typeof newOpts != "object"){
		return opts
	}

	// destructure `newOpts`
	const {
		from,
		characters,
		rate,
		duration,
		delay
	} = newOpts

	// from
	if (from && from.match(/left|right|middle/)){
		opts.from = from
	}

	// characters
	if (Array.isArray(characters) && characters.length > 0){
		opts.characters = characters.map(String)
	} else if (characters) {
		opts.characters = String(characters)
	}

	/**
	 * rate: rate of scrambling.
	 */
	if (rate){
		opts.rate = isFunction(rate) ? rate : Math.max(Number(rate), MIN_SPEED)
	}

	/**
	 * duration: duration of scrambling (from first to last letter)
	 * `duration` cannot be smaller than `speed`, otherwise scrambling won't occur.
	 */
	if (duration){
		opts.duration = Number(duration)
		if (isNumber(opts.rate)){
			opts.duration = Math.max(duration, opts.rate)
		}
	}

	/**
	 * delay: specify how long the scrambling of random letters will last, before the first letter (of final letter) appears.
	 * `delay` time adds ahead of `duration`, so that the actual effect total time is longer.
	 */
	if (delay){
		opts.delay = Number(delay)
	}

	return opts
}
