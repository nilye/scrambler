import createTextScrambler, { ScramblerOptions } from "@nilify/text-scrambler";
import { useRef, useState } from "react"

export function useTextScrambler(
	initText: string,
	options: ScramblerOptions
){

	const [text, setText] = useState(initText)
	const scrambler = useRef(createTextScrambler(initText, (nextText) => {
		setText(nextText)
	}, options))

	return [text, scrambler.current]
}
