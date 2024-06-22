import React, { useState } from 'react';
import { fetchOpenAIResponse } from '../api/openai';
import './chatbot.css';

const languageMessages = {
	English: 'You have selected English. How can I help you today?',
	Español: 'Has seleccionado Español. ¿Cómo puedo ayudarte hoy?',
	Français:
		"Vous avez sélectionné Français. Comment puis-je vous aider aujourd'hui?",
	Deutsch: 'Sie haben Deutsch gewählt. Wie kann ich Ihnen heute helfen?',
	中文: '您已选择中文。今天我能帮您什么?',
	한국어: '한국어를 선택하셨습니다. 무엇을 도와드릴까요?',
	日本: '日本語を選択しました。今日はどのようにお手伝いできますか？',
	Русский: 'Вы выбрали русский язык. Чем я могу помочь вам сегодня?',
	Português: 'Você selecionou Português. Como posso ajudá-lo hoje?',
	Italiano: 'Hai selezionato Italiano. Come posso aiutarti oggi?',
	বাংলা: 'আপনি বাংলা নির্বাচন করেছেন। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
	العربية: 'لقد اخترت العربية. كيف يمكنني مساعدتك اليوم؟',
	हिंदी: 'आपने हिंदी चुनी है। मैं आज आपकी कैसे मदद कर सकता हूँ?',
};

const Chatbot = () => {
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content:
				'Please choose your language: English, Español, Français, Deutsch, 中文, 한국어, 日本, Русский, Português, Italiano, বাংলা, العربية, हिंदी.',
		},
	]);
	const [input, setInput] = useState('');
	const [language, setLanguage] = useState('');
	const [isLanguageSelected, setIsLanguageSelected] = useState(false);

	const handleLanguageSelect = e => {
		const selectedLanguage = e.target.value;
		setLanguage(selectedLanguage);
		setIsLanguageSelected(true);
		setMessages([
			...messages,
			{ role: 'user', content: selectedLanguage },
			{ role: 'assistant', content: languageMessages[selectedLanguage] },
		]);
	};

	const handleSend = async () => {
		if (input.trim() === '') return;

		const userMessage = { role: 'user', content: input };
		setMessages([...messages, userMessage]);
		setInput('');

		try {
			const botMessageContent = await fetchOpenAIResponse([
				...messages,
				userMessage,
			]);
			const botMessage = { role: 'assistant', content: botMessageContent };
			setMessages([...messages, userMessage, botMessage]);
		} catch (error) {
			console.error('Error fetching response from OpenAI:', error);
		}
	};

	return (
		<div className="container">
			<div className="nav">결혼이주여성 서비스 '이주나래'</div>
			<div className="chatbot">
				<div className="messages">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`message ${msg.role}`}
							style={{ margin: '10px 0' }}
						>
							{msg.content}
						</div>
					))}
				</div>
				{!isLanguageSelected ? (
					<div className="language-select" style={{ marginTop: '10px' }}>
						<select onChange={handleLanguageSelect}>
							<option value="">Select a language</option>
							<option value="English">English</option>
							<option value="Español">Español</option>
							<option value="Français">Français</option>
							<option value="Deutsch">Deutsch</option>
							<option value="中文">中文</option>
							<option value="한국어">한국어</option>
							<option value="日本">日本</option>
							<option value="Русский">Русский</option>
							<option value="Português">Português</option>
							<option value="Italiano">Italiano</option>
							<option value="বাংলা">বাংলা</option>
							<option value="العربية">العربية</option>
							<option value="हिंदी">हिंदी</option>
						</select>
					</div>
				) : (
					<div className="input" style={{ marginTop: '10px' }}>
						<input
							type="text"
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyPress={e => e.key === 'Enter' && handleSend()}
							style={{ padding: '10px', width: '80%' }}
						/>
						<button onClick={handleSend} style={{ padding: '10px' }}>
							Send
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Chatbot;
