
type ShuffleDirection = 'ltr' | 'rtl' | 'mid'
type TimeFunc = (index: number) => number

interface ShufflerOptions {
	readonly text: string,
	direction: ShuffleDirection,
	characters: string | string[]
	speed: number,
	interval: number,
	duration: number,
	delay: number
}

const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function createShuffler(
	text: string,
	options: ShufflerOptions
){
	let finalText = options.text || ''
	let {
		characters = alphabets,
		speed = 83,
		duration = 160,
		delay = 0
	} = options

	function getRandomChar(count = 1){
		let index = -1
		let chars = ''
		while (++index < count){
			const rand = Math.floor(Math.random() * characters.length)
			chars += characters[rand]
		}
		return chars
	}

	let isStarted = false
	function shuffle(text){
		if (isStarted) return
		if (text){
			finalText = text
		}
		const length = finalText.length
		let staticIndex = 0
		let lastText

		console.log(speed, duration)

		// set random letter
		const shuffleInterval = setInterval(() => {
			lastText = finalText.slice(0, staticIndex) + getRandomChar(length - staticIndex)
			requestAnimationFrame(() => {
				emitChange(lastText)
			})
		}, speed)

		const stepInterval = setInterval(() => {
			staticIndex++
			if (staticIndex === finalText.length){
				clearInterval(stepInterval)
				clearInterval(shuffleInterval)
				requestAnimationFrame(() => {
					emitChange(lastText = finalText)
				})
				isStarted = false
			} else {
				lastText = finalText.slice(0, staticIndex) + lastText.slice(staticIndex)
				requestAnimationFrame(() => {
					emitChange(lastText)
				})
			}
		}, duration / length)
	}

	const callbacks = new Set<Function>()
	function emitChange(newText){
		callbacks.forEach(cb => cb(newText))
	}
	function onChange(cb){
		if (typeof cb === 'function'){
			callbacks.add(cb)
		}
	}

	return {
		shuffle,
		onChange
	}
}


export default createShuffler
