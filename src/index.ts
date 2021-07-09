import { normalizeOptions, ShufflerOptions } from "./options";
import { shuffleWithOptions } from "./shuffle";
import { isString } from "./predicate";


/**
 * create Shuffler object
 * @param options
 */
function createShuffler(
	options: string | ShufflerOptions
) {
	let opts = normalizeOptions(options)
	let isStarted = false
	const callbacks = new Set<Function>()

	function shuffle(
		textOrOptions?: string | ShufflerOptions,
	) {
		if (isStarted) return
		/**
		 * New `options` should not override previous one.
		 */
		let currentOpts = normalizeOptions({ ...opts }, textOrOptions)
		if (!currentOpts.text) return

		isStarted = true
		shuffleWithOptions(
			currentOpts,
			(text) => callbacks.forEach(cb => cb(text)),
			() => isStarted = false)
	}

	function set(
		textOrOptions: string | ShufflerOptions
	) {
		opts = normalizeOptions(opts, textOrOptions)
	}

	function onChange(cb) {
		if (typeof cb === 'function') {
			callbacks.add(cb)
		}
	}

	return {
		shuffle,
		set,
		onChange
	}
}


export default createShuffler
