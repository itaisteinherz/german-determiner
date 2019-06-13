import React, {useState} from "react";
import AutosizeInput from "react-input-autosize";
import ky from "ky";
import pDebounce from "p-debounce";
import "./App.css"; // eslint-disable-line import/no-unassigned-import

const getDeterminer = gender => {
	switch (gender) {
		case "n":
			return "das";
		case "f":
			return "die";
		case "m":
			return "der";
		default:
			return "";
	}
};

const getInfo = pDebounce(async word => {
	if (!word) {
		return {gender: "", translation: ""};
	}

	return ky(`/.netlify/functions/lookup?word=${word}`).json();
}, 300);

function App() {
	const placeholderWord = "wasser";
	const placeholderDet = "das";
	const placeholderTranslation = "water";

	const [word, setWord] = useState("");
	const [det, setDet] = useState("");
	const [translation, setTranslation] = useState("");

	const onChange = async event => {
		const {value} = event.target;
		setWord(value);

		let info = {gender: "", translation: ""};

		try {
			info = await getInfo(value);
		} catch (error) {}

		const {gender, translation} = info;

		setDet(getDeterminer(gender));
		setTranslation(translation);
	};

	return (
		<div className="app">
			<div className="input-row">
				<p className="determiner" placeholder={placeholderDet}>{det}</p>
				<AutosizeInput className="word" placeholder={placeholderWord} value={word} onChange={onChange}/>
			</div>
			<p className="translation" placeholder={placeholderTranslation}>{translation}</p>
		</div>
	);
}

export default App;
