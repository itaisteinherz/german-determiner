import React, {useState, useCallback} from 'react';
import ky from 'ky';
import pDebounce from 'p-debounce';
import './App.css';

const determiner = gender => {
	switch(gender) {
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

function App() {
	const [word, setWord] = useState("wasser");
	const [det, setDet] = useState("das");
	const [translation, setTranslation] = useState("water");

	const getInfo = pDebounce(async word => {
		if (!word) {
			return {gender: "", translation: ""};
		}
	
		return ky(`/.netlify/functions/lookup?word=${word}`).json();
	}, 300);

	const onChange = async event => {
		const {value} = event.target;
		setWord(value);

		const info = {gender: "", translation: ""};

		try {
			Object.assign(info, await getInfo(value));
		} catch (error) {}

		const {gender, translation} = info;

		setDet(determiner(gender));
		setTranslation(translation);
	};

	return (
		<div className="App">
			<p>{det}</p>
			<input type="text" value={word} onChange={onChange}/>
			<p>{translation}</p>
		</div>
	);
}

export default App;
