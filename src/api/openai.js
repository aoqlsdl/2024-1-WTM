const API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY;

export const fetchOpenAIResponse = async messages => {
	let retryCount = 0;
	const maxRetries = 3;
	const retryDelay = 1000; // milliseconds

	while (retryCount < maxRetries) {
		try {
			const response = await fetch(
				'https://api.openai.com/v1/chat/completions',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${API_KEY}`,
					},
					body: JSON.stringify({
						model: 'gpt-3.5-turbo',
						messages: messages,
					}),
				}
			);

			const data = await response.json();
			return data.choices[0].message.content;
		} catch (error) {
			if (retryCount >= maxRetries) {
				throw error;
			}
			retryCount++;
			await new Promise(resolve => setTimeout(resolve, retryDelay));
		}
	}
};
