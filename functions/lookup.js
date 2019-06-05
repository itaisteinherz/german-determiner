const got = require("got");

exports.handler = async (event, context, callback) => {
	const {word} = event.queryStringParameters;

	if (!word) {
		return "";
	}

	let res = {};
	let fetchError = null;

	try {
		const {body} = await got(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.YANDEX_API_KEY}&lang=de-en&text=${word}`, {json: true});

		if (body.def[0].pos !== "noun") {
			throw new Error("Given word should be a noun");
		}

		const gender = body.def[0].gen;
		const translation = body.def[0].tr[0].text;

		res = {gender, translation};
	} catch (error) {
		fetchError = error;
	}

	console.log({
		statusCode: fetchError ? 500 : 200,
		body: fetchError ? fetchError.message : JSON.stringify(res)
	});

	return {
		statusCode: fetchError ? 500 : 200,
		body: fetchError ? fetchError.message : JSON.stringify(res)
	};	
};
