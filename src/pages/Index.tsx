import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Play } from "lucide-react";

interface Answer {
  text: string;
  correct: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
}

const questionSets: Question[][] = [
  [
    {
      question: "What is the capital of France?",
      answers: [
        { text: "Berlin", correct: false },
        { text: "Paris", correct: true },
        { text: "Madrid", correct: false },
        { text: "Lisbon", correct: false }
      ]
    },
    {
      question: "Which language runs in a web browser?",
      answers: [
        { text: "Python", correct: false },
        { text: "Java", correct: false },
        { text: "C", correct: false },
        { text: "JavaScript", correct: true }
      ]
    },
    {
      question: "What is 2 + 2?",
      answers: [
        { text: "3", correct: false },
        { text: "4", correct: true },
        { text: "5", correct: false },
        { text: "6", correct: false }
      ]
    }
  ],
  [
    {
      question: "What is the largest planet in our solar system?",
      answers: [
        { text: "Earth", correct: false },
        { text: "Mars", correct: false },
        { text: "Jupiter", correct: true },
        { text: "Saturn", correct: false }
      ]
    },
    {
      question: "Who painted the Mona Lisa?",
      answers: [
        { text: "Vincent van Gogh", correct: false },
        { text: "Pablo Picasso", correct: false },
        { text: "Leonardo da Vinci", correct: true },
        { text: "Michelangelo", correct: false }
      ]
    },
    {
      question: "What is the chemical symbol for gold?",
      answers: [
        { text: "Go", correct: false },
        { text: "Au", correct: true },
        { text: "Ag", correct: false },
        { text: "Gd", correct: false }
      ]
    }
  ],
  [
    {
      question: "Which ocean is the largest?",
      answers: [
        { text: "Atlantic", correct: false },
        { text: "Indian", correct: false },
        { text: "Arctic", correct: false },
        { text: "Pacific", correct: true }
      ]
    },
    {
      question: "What year did World War II end?",
      answers: [
        { text: "1944", correct: false },
        { text: "1945", correct: true },
        { text: "1946", correct: false },
        { text: "1947", correct: false }
      ]
    },
    {
      question: "Which programming language is known for its snake logo?",
      answers: [
        { text: "Java", correct: false },
        { text: "Python", correct: true },
        { text: "Ruby", correct: false },
        { text: "PHP", correct: false }
      ]
    }
  ]
];

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"start" | "playing" | "finished">("start");
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionSetIndex, setQuestionSetIndex] = useState(0);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = () => {
    const currentSet = questionSets[questionSetIndex % questionSets.length];
    const shuffledQuestions = shuffleArray(currentSet);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameState("playing");
    setShowFeedback(false);
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (questions[currentQuestionIndex].answers[answerIndex].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameState("finished");
    }
  };

  const playAgain = () => {
    setQuestionSetIndex(questionSetIndex + 1);
    startQuiz();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
        {gameState === "start" && (
          <CardContent className="text-center p-12">
            <div className="mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Quiz Master
              </h1>
              <p className="text-xl text-muted-foreground">
                Test your knowledge with our interactive quiz!
              </p>
            </div>
            <Button 
              onClick={startQuiz} 
              size="lg" 
              className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </CardContent>
        )}

        {gameState === "playing" && currentQuestion && (
          <>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary" className="px-3 py-1">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Score: {score}
                </Badge>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <CardTitle className="text-2xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => {
                  let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 hover:shadow-md";
                  
                  if (showFeedback) {
                    if (answer.correct) {
                      buttonClass += " bg-green-50 border-green-500 text-green-700 shadow-green-200 shadow-lg";
                    } else if (selectedAnswer === index) {
                      buttonClass += " bg-red-50 border-red-500 text-red-700 shadow-red-200 shadow-lg";
                    } else {
                      buttonClass += " bg-muted/50 border-muted text-muted-foreground";
                    }
                  } else {
                    buttonClass += " bg-background border-border hover:border-primary hover:scale-[1.02] hover:bg-primary/5";
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showFeedback}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{answer.text}</span>
                        {showFeedback && answer.correct && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {showFeedback && selectedAnswer === index && !answer.correct && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={nextQuestion}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        )}

        {gameState === "finished" && (
          <CardContent className="text-center p-12">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                {score}/{questions.length}
              </div>
              <p className="text-xl text-muted-foreground">
                {score === questions.length 
                  ? "Perfect! You're a quiz master! 🏆"
                  : score >= questions.length * 0.7
                  ? "Great job! Well done! 👏"
                  : "Good effort! Try again to improve! 💪"
                }
              </p>
            </div>
            <Button 
              onClick={playAgain}
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again with New Questions
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Index;
