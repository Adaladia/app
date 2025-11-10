export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface MnemonicItem {
  term: string;
  mnemonic: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

export interface KeyConceptItem {
  concept: string;
  definition: string;
  imageUrl?: string;
}

export interface ExampleItem {
  example: string;
  explanation: string;
}

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface MatchingPair {
  term: string;
  definition: string;
}

export interface StudyGuideData {
  keyConcepts: KeyConceptItem[];
  eli5: string;
  analogy: string;
  mnemonics: MnemonicItem[];
  quiz: QuizItem[];
  flashcards: FlashcardItem[];
  examples: ExampleItem[];
  trueFalse: TrueFalseItem[];
  matchingConcepts: MatchingPair[];
  takeaways: string[];
  imageUrl?: string; // Main conceptual image
}

export interface SavedStudyGuide {
  id: string;
  title: string;
  savedAt: string;
  guideData: StudyGuideData;
}
