import { normalizeOptions, ScramblerOptions } from "./options";
import { ScramblerOnChangeCallback, scrambleWithOptions } from "./scramble";
import { isFunction, isString } from "./predicate";

// type ScrambleFn = (
// 	textOrOptions?: string | Partial<ScramblerOptions>,
// 	options?: Partial<ScramblerOptions>
// ) => void

type ScrambleFn = (text: string) => void

/**
 * create text scrambler
 */
function createTextScrambler(
	initText: string | null,
	callback: ScramblerOnChangeCallback,
	options?: Partial<ScramblerOptions>
): ScrambleFn {

	if (!isFunction(callback)){
		throw new TypeError('`callback` is required to be a function for `createTextScrambler`')
	}

	let finalText = initText
	let opts = normalizeOptions(options)
	let isStarted = false

	return function(nextText) {
		if (isStarted) return

		let text = finalText
		if (nextText && isString(nextText)){
			text = nextText
		}

		// !!! set option per scramble is redundant
/*		/!**
		 * normalize arguments
		 *!/
		if (arguments.length === 1 && !isString(textOrOptions)){
			textOrOptions = null
			onceOptions = textOrOptions as Partial<ScramblerOptions>
		}
		if (textOrOptions && isString(textOrOptions)){
			text = textOrOptions
		}*/

		/**
		 * abort, if `text` is empty
		 */
		if (!text) return

		//
		// /**
		//  * New `options` should not override previous one.
		//  */
		// let currentOpts = normalizeOptions({ ...opts }, onceOptions)

		isStarted = true
		scrambleWithOptions(
			text,
			opts,
			callback,
			() => isStarted = false)
	}
}

export default createTextScrambler
export {
	ScramblerOptions,
	ScramblerOnChangeCallback,
	ScrambleFn,
}
