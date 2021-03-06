import { ScramblerTimeFunc, ScramblerOptions } from "./options";
import { isFunction } from "./predicate";

export type ScramblerOnChangeCallback = (
	text: string,
	index: number | number[],
	isFinished: boolean
) => void

export function scrambleWithOptions(
	finalText: string,
	options: ScramblerOptions,
	onChange: ScramblerOnChangeCallback,
	onEnd: () => void
){

	const {
		from,
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
			return (rate as ScramblerTimeFunc)(finishedIndex, length)
		}
		return rate
	}

	let _rate = computeRate()
	/**
	 * scramble with random characters
	 */
	function scrambleImpl(){
		const text = finalText.slice(0, finishedIndex) + genRandomChar(length - finishedIndex, characters)
		requestAnimationFrame(() => {
			onChange(text, finishedIndex - 1, false)
			_rate = computeRate()
		})
	}

	/**
	 * implement the leading scramble
	 * It's important, because for whatever options, the first `onChange` should always be a random string
 	 */
	scrambleImpl()
	const scrambleInterval = setInterval(scrambleImpl, _rate)


	function computeInterval(){
		// TODO: support interval function
		return duration / length
	}
	let _interval = computeInterval()

	/**
	 * finish the scrambling character by character
	 */
	function finishChar(){
		const stepInterval = setInterval(() => {
			finishedIndex++
			if (finishedIndex === finalText.length){
				/**
				 * Usually, the `duration` is not perfectly divisible by `rate`(without a remainder left).
				 * In order to let the scramble effect to end exactly (or as much precise as possible) at the duration time, the time interval (rate) of the very last frame would have to be shortened.
				 */
				clearInterval(stepInterval)
				clearInterval(scrambleInterval)
				requestAnimationFrame(() => {
					onChange(finalText, finishedIndex - 1, true)
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
