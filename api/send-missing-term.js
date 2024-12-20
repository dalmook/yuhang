// api/send-missing-term.js

const axios = require('axios');

module.exports = async (req, res) => {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', 'https://dalmook.github.io'); // GitHub Pages 도메인으로 제한
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { term } = req.body;

    if (!term) {
        return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res.status(500).json({ error: '서버 설정 오류' });
    }

    const message = `새로운 유행어 요청: "${term}"`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });
        return res.status(200).json({ message: '메시지가 텔레그램으로 전송되었습니다.' });
    } catch (error) {
        console.error('텔레그램 메시지 전송 오류:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: '메시지 전송 실패' });
    }
};
