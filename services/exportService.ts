import { SavedStudyGuide } from '../types';

export const exportGuideToMarkdown = (guide: SavedStudyGuide): void => {
  const { title, guideData: data } = guide;
  
  let markdownContent = `# Guía de Estudio: ${title}\n\n`;

  // Helper to add sections
  const addSection = (title: string, content: string | undefined) => {
    if (content && content.trim()) {
      markdownContent += `## ${title}\n\n${content}\n\n`;
    }
  };

  // Build content section by section
  addSection('Explicado como para un niño de 5 años', `> ${data.eli5}`);
  addSection('Analogía', `> ${data.analogy}`);

  if (data.keyConcepts?.length > 0) {
    markdownContent += `## Conceptos Clave\n\n`;
    data.keyConcepts.forEach(item => {
      markdownContent += `### ${item.concept}\n`;
      markdownContent += `**Definición:** ${item.definition}\n\n`;
    });
  }
  
  if (data.examples?.length > 0) {
    markdownContent += `## Ejemplos Prácticos\n\n`;
    data.examples.forEach(item => {
      markdownContent += `### ${item.example}\n`;
      markdownContent += `${item.explanation}\n\n`;
    });
  }

  if (data.mnemonics?.length > 0) {
    markdownContent += `## Mnemotecnia\n\n`;
    data.mnemonics.forEach(item => {
      markdownContent += `- **${item.term}:** ${item.mnemonic}\n`;
    });
    markdownContent += '\n';
  }

  if (data.trueFalse?.length > 0) {
    markdownContent += `## Verdadero o Falso\n\n`;
    data.trueFalse.forEach((item, index) => {
      markdownContent += `${index + 1}. **Afirmación:** ${item.statement}\n`;
      markdownContent += `   - **Respuesta:** ${item.isTrue ? 'Verdadero' : 'Falso'}\n`;
      markdownContent += `   - **Explicación:** ${item.explanation}\n\n`;
    });
  }

  if (data.quiz?.length > 0) {
    markdownContent += `## Cuestionario\n\n`;
    data.quiz.forEach((item, index) => {
      markdownContent += `**${index + 1}. ${item.question}**\n\n`;
      item.options.forEach(option => {
        markdownContent += `- ${option}\n`;
      });
      markdownContent += `\n**Respuesta Correcta:** ${item.answer}\n`;
      markdownContent += `**Explicación:** ${item.explanation}\n\n---\n\n`;
    });
  }

  if (data.flashcards?.length > 0) {
    markdownContent += `## Tarjetas de Memoria\n\n`;
    data.flashcards.forEach((item, index) => {
      markdownContent += `**Tarjeta ${index + 1}**\n`;
      markdownContent += `- **Anverso:** ${item.front}\n`;
      markdownContent += `- **Reverso:** ${item.back}\n\n`;
    });
  }

  // Create a Blob from the markdown string
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });

  // Create a link and trigger the download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  
  // Sanitize title for filename
  const fileName = `guia-de-estudio-${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  link.download = fileName;
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};