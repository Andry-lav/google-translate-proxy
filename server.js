require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.post('/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    const response = await axios.get(
      `https://translation.googleapis.com/language/translate/v2`,
      {
        params: {
          q: text,
          source: sourceLang || 'auto',
          target: targetLang,
          format: 'text',
          key: API_KEY
        }
      }
    );

    res.json({
      translatedText: response.data.data.translations[0].translatedText
    });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
