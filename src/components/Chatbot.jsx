import React, { useState, useRef, useEffect } from 'react';
import { fetchOpenAIResponse } from '../api/openai';
import './chatbot.css';
import { languageMessages } from '../data/languageMessages';
import { serviceDescription } from '../data/serviceDescription';

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
	const messagesEndRef = useRef(null);

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

	// 항상 스크롤을 맨 아래로 이동하도록 설정
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = async () => {
		if (input.trim() === '') return;

		const userMessage = { role: 'user', content: input };
		setMessages([...messages, userMessage]);
		setInput('');

		try {
			let botMessageContent;
			if (input.toLowerCase() === '이 서비스에 대해서 설명해주세요') {
				botMessageContent = serviceDescription[language];
			} else {
				botMessageContent = await fetchOpenAIResponse([
					...messages,
					userMessage,
				]);
			}
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
					<div ref={messagesEndRef} />
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
