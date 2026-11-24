export type ChallengeOption = {
  id: string;
  text: string;
};

export type ChallengeQuestion = {
  id: string;
  question: string;
  evidence: string;
  options: ChallengeOption[];
  correctAnswer: string;
  explanation: string;
};

export type InvestigationChallenge = {
  id: string;
  chapterId: string;
  title: string;
  subtitle: string;
  introduction: string;
  questions: ChallengeQuestion[];
  completionMessage: string;
};
