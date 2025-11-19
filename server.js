// Anda harus menginstal express, @google/genai, dan cors terlebih dahulu (lihat package.json)

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');

const app = express();
const port = 3000;

// *** GANTI DENGAN API KEY ANDA YANG SEBENARNYA ***
// *** JANGAN PERNAH MENARUH INI DI KODE CLIENT-SIDE ***
const API_KEY = "AIzaSyDT9Q_qUrWqYNboIgj0AM6r-LeQKNOM5T8"; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Middleware
app.use(cors()); // Mengizinkan akses dari browser (penting untuk pengembangan lokal)
app.use(express.json()); // Untuk membaca body permintaan JSON

// Endpoint API buatan Anda sendiri
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log(`Received prompt: ${prompt}`);
    
    // Panggil Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });
    
    // Kirim respons teks kembali ke klien
    res.json({ text: response.text });
  } catch (error) {
    console.error("Error generating content:", error.message);
    // Kirim respons error yang aman
    res.status(500).json({ error: 'Failed to generate content due to server error.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server Proxy Gemini berjalan di http://localhost:${port}`);
  console.log(`Buka index.html di browser Anda.`);
});
