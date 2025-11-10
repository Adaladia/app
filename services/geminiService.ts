import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StudyGuideData } from '../types';

// Schema for the text-only part of the guide
const textContentSchema = {
  type: Type.OBJECT,
  properties: {
    keyConcepts: {
      type: Type.ARRAY,
      description: "Una lista de los 3-5 conceptos más importantes. Cada concepto debe tener una definición clara y concisa.",
      items: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING, description: "El concepto o término clave." },
          definition: { type: Type.STRING, description: "Una breve definición del concepto." },
        },
        required: ['concept', 'definition']
      }
    },
    eli5: {
      type: Type.STRING,
      description: "Una explicación detallada pero muy simple del tema, como si se lo explicaras a un niño de 5 años. Desglosa las ideas complejas."
    },
    analogy: {
      type: Type.STRING,
      description: "Una analogía creativa, vívida y memorable para explicar la idea central del tema."
    },
    examples: {
      type: Type.ARRAY,
      description: "Una lista de 2-3 ejemplos prácticos o casos de uso que demuestren el tema en el mundo real.",
      items: {
        type: Type.OBJECT,
        properties: {
          example: { type: Type.STRING, description: "El ejemplo práctico." },
          explanation: { type: Type.STRING, description: "Una breve explicación de cómo el ejemplo se relaciona con el tema." }
        },
        required: ['example', 'explanation']
      }
    },
    mnemonics: {
      type: Type.ARRAY,
      description: "Una lista de 1 a 3 reglas mnemotécnicas creativas para recordar información clave.",
      items: {
          type: Type.OBJECT,
          properties: {
              term: { type: Type.STRING, description: "El término o idea a recordar." },
              mnemonic: { type: Type.STRING, description: "La regla mnemotécnica." }
          },
          required: ['term', 'mnemonic']
      }
    },
    trueFalse: {
      type: Type.ARRAY,
      description: "Una lista de 3-5 afirmaciones de verdadero o falso para comprobar la comprensión.",
      items: {
          type: Type.OBJECT,
          properties: {
              statement: { type: Type.STRING, description: "La afirmación." },
              isTrue: { type: Type.BOOLEAN, description: "Si la afirmación es verdadera." },
              explanation: { type: Type.STRING, description: "Una explicación clara de por qué es verdadera o falsa." }
          },
          required: ['statement', 'isTrue', 'explanation']
      }
    },
     matchingConcepts: {
      type: Type.ARRAY,
      description: "Una lista de 4-6 pares de conceptos y definiciones para un ejercicio de relacionar. Proporciona el par correcto.",
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "El concepto o término." },
          definition: { type: Type.STRING, description: "La definición que corresponde al término." }
        },
        required: ['term', 'definition']
      }
    },
    quiz: {
      type: Type.ARRAY,
      description: "Un cuestionario de 3-5 preguntas de opción múltiple con una sola respuesta correcta.",
      items: {
          type: Type.OBJECT,
          properties: {
              question: { type: Type.STRING, description: "La pregunta." },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Una lista de 4 opciones." },
              answer: { type: Type.STRING, description: "La respuesta correcta (debe ser una de las opciones)." },
              explanation: { type: Type.STRING, description: "Una explicación detallada de por qué la respuesta es correcta." }
          },
          required: ['question', 'options', 'answer', 'explanation']
      }
    },
    flashcards: {
      type: Type.ARRAY,
      description: "Una lista de 5-8 tarjetas de memoria (flashcards) con un anverso (pregunta/término) y un reverso (respuesta/definición).",
      items: {
          type: Type.OBJECT,
          properties: {
              front: { type: Type.STRING, description: "El anverso de la tarjeta." },
              back: { type: Type.STRING, description: "El reverso de la tarjeta." }
          },
          required: ['front', 'back']
      }
    },
    takeaways: {
      type: Type.ARRAY,
      description: "Una lista de 3-4 puntos clave o conclusiones para recordar.",
      items: { type: Type.STRING }
    }
  },
  required: [
    'keyConcepts', 'eli5', 'analogy', 'examples', 'mnemonics', 'trueFalse', 'matchingConcepts', 'quiz', 'flashcards', 'takeaways'
  ]
};

const getPrompt = (topic: string, isExpertMode: boolean) => `
  Genera una guía de estudio completa y creativa sobre el tema: "${topic}".
  La guía debe ser fácil de entender, visualmente atractiva y pedagógica.
  
  ${isExpertMode 
    ? "MODO EXPERTO ACTIVADO: Proporciona explicaciones mucho más profundas, detalladas y técnicas. Usa un lenguaje preciso pero mantén la claridad. Los ejemplos deben ser más complejos y el cuestionario más desafiante." 
    : "MODO NORMAL: Enfócate en la claridad y la simplicidad. Usa analogías y ejemplos fáciles de entender para un principiante."
  }
  
  Usa un lenguaje natural y coherente, con conectores textuales para que suene como un tutor experto explicando el tema.
  Devuelve la respuesta estrictamente en formato JSON basado en el esquema proporcionado.
`;

export const generateStudyGuide = async (topic: string, isExpertMode: boolean): Promise<StudyGuideData> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // --- 1. Generate Text Content ---
    const textModel = 'gemini-2.5-pro';
    const textResponse = await ai.models.generateContent({
      model: textModel,
      contents: getPrompt(topic, isExpertMode),
      config: {
        responseMimeType: "application/json",
        responseSchema: textContentSchema,
      },
    });
    
    if (!textResponse.text) {
      throw new Error("La IA no pudo generar el contenido de la guía. Inténtalo con un tema diferente.");
    }
    
    let parsedData: StudyGuideData;
    try {
        parsedData = JSON.parse(textResponse.text) as StudyGuideData;
    } catch (e) {
        console.error("Failed to parse JSON from AI:", textResponse.text);
        throw new Error("Hubo un problema al procesar la respuesta de la IA. Inténtalo de nuevo.");
    }

    // --- 2. Generate Images ---
    const imageModel = 'gemini-2.5-flash-image';

    const generateImage = async (prompt: string): Promise<string> => {
      try {
        const response = await ai.models.generateContent({
          model: imageModel,
          contents: { parts: [{ text: prompt }] },
          config: { responseModalities: [Modality.IMAGE] },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      } catch (e) {
        console.warn(`Image generation failed for prompt: "${prompt}"`, e);
      }
      return ''; // Return empty string on failure
    };

    // Generate main image and concept images in parallel
    const mainImagePrompt = `Una imagen artística y conceptual que represente visualmente el tema de '${topic}'. Estilo abstracto y minimalista.`;
    const conceptImagePrompts = parsedData.keyConcepts.map(c => `Una ilustración simple y clara que represente el concepto de '${c.concept}' en el contexto de '${topic}'.`);
    
    const [mainImageUrl, ...conceptImageUrls] = await Promise.all([
        generateImage(mainImagePrompt),
        ...conceptImagePrompts.map(p => generateImage(p))
    ]);

    // --- 3. Combine Text and Images ---
    parsedData.imageUrl = mainImageUrl;
    parsedData.keyConcepts.forEach((concept, index) => {
        concept.imageUrl = conceptImageUrls[index];
    });

    return parsedData;

  } catch (err: any) {
    console.error("Error al generar la guía de estudio:", err);

    let userFriendlyMessage = "Ocurrió un error inesperado al contactar con la IA. Por favor, inténtalo más tarde.";

    if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes('api key not valid') || message.includes('api_key') || message.includes('permission denied')) {
            userFriendlyMessage = "Hay un problema con la configuración de la API. La aplicación no puede conectarse con la inteligencia artificial en este momento.";
        } else if (message.includes('429')) {
            userFriendlyMessage = "Se ha alcanzado el límite de solicitudes. Por favor, espera un momento y vuelve a intentarlo.";
        } else if (message.includes('block') || message.includes('safety')) {
            userFriendlyMessage = "El tema solicitado no se puede procesar debido a las políticas de seguridad de la IA.";
        } else if (message.includes('json')) {
             userFriendlyMessage = "La IA devolvió una respuesta con un formato inesperado. Intenta reformular tu tema o inténtalo de nuevo.";
        }
    }
    
    throw new Error(userFriendlyMessage);
  }
};