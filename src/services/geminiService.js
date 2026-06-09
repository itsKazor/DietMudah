const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const scanFood = async (imageBase64, apiKey) => {
  if (!apiKey) throw new Error('INVALID_API_KEY');

  const prompt = `You are a nutrition expert. Analyze this food image.
Return ONLY a JSON object, no markdown, no explanation, no code blocks.

{
  "name": "nama makanan dalam Bahasa Indonesia",
  "calories": <number kcal per porsi yang terlihat>,
  "protein": <number gram>,
  "carbs": <number gram>,
  "fat": <number gram>,
  "portion": "<estimasi ukuran porsi, misal: 1 piring, 200g>",
  "confidence": <"high"|"medium"|"low">
}

If food cannot be identified clearly, still return your best guess with confidence: "low".`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 403) throw new Error('INVALID_API_KEY');
      if (response.status === 429) throw new Error('QUOTA_EXCEEDED');
      throw new Error('NETWORK_ERROR');
    }

    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
       return { name: "Tidak Dikenali", calories: 0, protein: 0, carbs: 0, fat: 0, portion: "1 porsi", confidence: "low" };
    }

    // Clean up markdown code block if gemini ignores instruction
    textResult = textResult.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(textResult);
    
    // Ensure all fields are numbers where expected
    return {
      name: result.name || "Tidak Dikenali",
      calories: Number(result.calories) || 0,
      protein: Number(result.protein) || 0,
      carbs: Number(result.carbs) || 0,
      fat: Number(result.fat) || 0,
      portion: result.portion || "1 porsi",
      confidence: result.confidence || "low"
    };

  } catch (err) {
    if (err.message === 'INVALID_API_KEY' || err.message === 'QUOTA_EXCEEDED') {
      throw err;
    }
    if (err instanceof SyntaxError) {
      throw new Error('PARSE_ERROR');
    }
    throw new Error('NETWORK_ERROR');
  }
};

export const validateApiKey = async (apiKey) => {
  if (!apiKey) return false;
  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }],
      }),
    });
    return response.ok;
  } catch (e) {
    return false;
  }
};
