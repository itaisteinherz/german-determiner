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

const lookup = async word => {
	if (!word) {
		return "";
	}

	const res = await ky(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20190531T143403Z.ac28ff8b168763ef.b572c482ad697ee771956ca98ba4d15f00e8dd22&lang=de-en&text=${word}`).json();

	let gender = "";
	let translation = "";
	
	try {
		gender = res.def[0].gen;
		translation = res.def[0].tr[0].text;
	} catch (error) {}

	return {gender, translation};
};


function App() {
	const [word, setWord] = useState("wasser");
	const [det, setDet] = useState("das");
	const [translation, setTranslation] = useState("water");

	const getInfo = useCallback(pDebounce(lookup, 300), [])

	const onChange = async event => {
		const {value} = event.target;
		setWord(value);
		
		const {gender, translation} = await getInfo(value);
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
