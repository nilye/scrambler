import { IndividualTimeFunc, ShufflerOptions } from "./options";
import { isFunction } from "./predicate";

export function shuffleWithOptions(
	options: ShufflerOptions,
	onChange: (text: string) => void,
	onEnd: () => void
){

	const {
		text: finalText,
		direction,
		rate,
		characters,
		duration,
		delay
	} = options
	const length = finalText.length
	let finishedIndex = 0

	/**
	 * compute `rate` (if `rate` is a function)
	 */
	function computeRate(){
		if (isFunction(rate)){
			return (rate as IndividualTimeFunc)(finishedIndex, length)
		}
		return rate
	}

	let _rate = computeRate()
	/**
	 * shuffle with random characters
	 */
	function shuffleImpl(){
		const text = finalText.slice(0, finishedIndex) + genRandomChar(length - finishedIndex, characters)
		requestAnimationFrame(() => {
			onChange(text)
			_rate = computeRate()
		})
	}

	/**
	 * implement the leading shuffle
	 * It's important, because for whatever options, the first `onChange` should always be a random string
 	 */
	shuffleImpl()
	const shuffleInterval = setInterval(shuffleImpl, _rate)


	function computeInterval(){
		// TODO: support interval function
		return duration / length
	}
	let _interval = computeInterval()

	/**
	 * finish the shuffling character by character
	 */
	function finishChar(){
		const stepInterval = setInterval(() => {
			finishedIndex++
			if (finishedIndex === finalText.length){
				/**
				 * Usually, the `duration` is not perfectly divisible by `rate`(without a remainder left).
				 * In order to let the shuffle effect to end exactly (or as much precise as possible) at the duration time, the time interval (rate) of the very last frame would have to be shortened.
				 */
				clearInterval(stepInterval)
				clearInterval(shuffleInterval)
				requestAnimationFrame(() => {
					onChange(finalText)
					onEnd()
				})
			}
			_interval = computeInterval()
		}, _interval)
	}

	if (delay) {
		setTimeout(finishChar, delay)
	} else {
		finishChar()
	}
}

/**
 * generate string with length of random characters
 * @param length
 * @param characters
 */
function genRandomChar(
	length = 1,
	characters: string | string[]
): string {
	let index = -1
	let chars = ''
	while (++index < length){
		const rand = Math.floor(Math.random() * characters.length)
		chars += characters[rand]
	}
	return chars
}
