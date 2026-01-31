import { GoogleGenAI } from "@google/genai";

// Initialize AI only if key exists to prevent crash on load
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
  }
}

export const generateEventDescription = async (title: string, division: string, location: string): Promise<string> => {
  if (!ai) {
    console.warn("Google GenAI API key is missing or invalid.");
    return "Mari bergabung dengan acara menarik ini! (Fitur AI belum dikonfigurasi)";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Anda adalah penyelenggara acara ahli untuk 'Rumah Amal Salman Garut'. 
      Tuliskan deskripsi 2 kalimat yang menarik, profesional, namun mengasyikkan untuk sebuah acara dalam Bahasa Indonesia.
      
      Detail Acara:
      - Judul: ${title}
      - Divisi: ${division}
      - Lokasi: ${location}
      
      Deskripsi harus mendorong anggota untuk bergabung.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Mari bergabung dengan acara menarik ini!";
  } catch (error) {
    console.error("Error generating event description:", error);
    return "Mari bergabung dengan acara luar biasa ini! (Pembuatan AI Gagal)";
  }
};