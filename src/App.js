import React, {useState} from 'react';
import ky from 'ky';
import pDebounce from 'p-debounce';
import './App.css';

const getDeterminer = gender => {
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

const getInfo = pDebounce(async word => {
	if (!word) {
		return {gender: "", translation: ""};
	}

	return ky(`/.netlify/functions/lookup?word=${word}`).json();
}, 300);

function App() {
	const [word, setWord] = useState("wasser");
	const [det, setDet] = useState("das");
	const [translation, setTranslation] = useState("water");

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
		<div className="App">
			<p>{det}</p>
			<input type="text" value={word} onChange={onChange}/>
			<p>{translation}</p>
		</div>
	);
}

export default App;
