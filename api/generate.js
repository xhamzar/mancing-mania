// File: api/generate.js

const { GoogleGenAI } = require('@google/genai');

// *** GANTI DENGAN API KEY ANDA YANG SEBENARNYA (Akan kita pindahkan ke Environment Variables) ***
const API_KEY = process.env.GEMINI_API_KEY; 
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Handler utama untuk Vercel Serverless Function
export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Pastikan body permintaan tersedia
  if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
  }
  
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Panggil Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });
    
    // Kirim respons teks kembali ke klien
    // Set CORS headers agar frontend (index.html) bisa mengaksesnya
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: 'Failed to generate content due to server error.' });
  }
}
