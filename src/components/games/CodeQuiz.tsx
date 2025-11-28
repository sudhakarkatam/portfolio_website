import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface CodeQuizProps {
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const allQuizQuestions: Question[] = [
  // JavaScript Questions (10)
  {
    id: 1,
    question: "What does 'const' mean in JavaScript?",
    options: [
      "The variable can be changed later",
      "The variable cannot be reassigned",
      "The variable is only available in the current function",
      "The variable is globally accessible"
    ],
    correct: 1,
    explanation: "const creates a block-scoped constant that cannot be reassigned after declaration.",
    category: "JavaScript"
  },
  {
    id: 2,
    question: "Which method is used to add an element to the end of an array in JavaScript?",
    options: [
      "push()",
      "append()",
      "add()",
      "insert()"
    ],
    correct: 0,
    explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
    category: "JavaScript"
  },
  {
    id: 3,
    question: "What is hoisting in JavaScript?",
    options: [
      "Moving variables to the top of their scope",
      "A way to optimize code performance",
      "A method to hide variables",
      "A technique for memory management"
    ],
    correct: 0,
    explanation: "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their containing scope during compilation.",
    category: "JavaScript"
  },
  {
    id: 4,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that has access to variables in its outer scope",
      "A way to close a function",
      "A method to prevent function execution",
      "A technique to optimize performance"
    ],
    correct: 0,
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns.",
    category: "JavaScript"
  },
  {
    id: 5,
    question: "What does the 'this' keyword refer to in JavaScript?",
    options: [
      "The current function",
      "The object that owns the current code",
      "The global object",
      "The parent function"
    ],
    correct: 1,
    explanation: "The 'this' keyword refers to the object that owns the current code, which can vary depending on how a function is called.",
    category: "JavaScript"
  },
  {
    id: 6,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "No difference, they work the same",
      "== compares values, === compares values and types",
      "=== is faster than ==",
      "== is deprecated"
    ],
    correct: 1,
    explanation: "== performs type coercion and compares values, while === compares both values and types without coercion.",
    category: "JavaScript"
  },
  {
    id: 7,
    question: "What is a Promise in JavaScript?",
    options: [
      "A function that returns immediately",
      "An object representing eventual completion of an async operation",
      "A way to store data",
      "A type of variable"
    ],
    correct: 1,
    explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation.",
    category: "JavaScript"
  },
  {
    id: 8,
    question: "What does async/await do in JavaScript?",
    options: [
      "Makes code run faster",
      "Provides a cleaner way to work with Promises",
      "Replaces all functions",
      "Only works with arrays"
    ],
    correct: 1,
    explanation: "async/await provides a cleaner, more readable way to work with Promises and asynchronous code.",
    category: "JavaScript"
  },
  {
    id: 9,
    question: "What is an arrow function in JavaScript?",
    options: [
      "A function that points to something",
      "A shorter syntax for writing functions",
      "A function that only works with arrays",
      "A deprecated function type"
    ],
    correct: 1,
    explanation: "Arrow functions provide a shorter syntax for writing functions and have different behavior with the 'this' keyword.",
    category: "JavaScript"
  },
  {
    id: 10,
    question: "What is the prototype in JavaScript?",
    options: [
      "A way to create objects",
      "A mechanism for inheritance",
      "A type of variable",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "The prototype is a mechanism by which JavaScript objects inherit features from one another.",
    category: "JavaScript"
  },

  // React Questions (8)
  {
    id: 11,
    question: "What is the purpose of React's useEffect hook?",
    options: [
      "To manage component state",
      "To perform side effects in functional components",
      "To create custom hooks",
      "To handle form submissions"
    ],
    correct: 1,
    explanation: "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM.",
    category: "React"
  },
  {
    id: 12,
    question: "What is JSX in React?",
    options: [
      "A programming language",
      "A syntax extension for JavaScript",
      "A build tool",
      "A testing framework"
    ],
    correct: 1,
    explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.",
    category: "React"
  },
  {
    id: 13,
    question: "What is the virtual DOM in React?",
    options: [
      "A real DOM element",
      "A lightweight copy of the real DOM",
      "A type of component",
      "A state management tool"
    ],
    correct: 1,
    explanation: "The virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates and rendering.",
    category: "React"
  },
  {
    id: 14,
    question: "What is the difference between props and state in React?",
    options: [
      "No difference, they're the same",
      "Props are passed down, state is internal",
      "State is faster than props",
      "Props are deprecated"
    ],
    correct: 1,
    explanation: "Props are passed down from parent components and are read-only, while state is internal to a component and can be changed.",
    category: "React"
  },
  {
    id: 15,
    question: "What is a React component?",
    options: [
      "A JavaScript function",
      "A reusable piece of UI",
      "A build tool",
      "A type of variable"
    ],
    correct: 1,
    explanation: "A React component is a reusable piece of UI that can accept inputs (props) and return React elements.",
    category: "React"
  },
  {
    id: 16,
    question: "What is the useState hook used for?",
    options: [
      "To fetch data",
      "To manage component state",
      "To create components",
      "To handle events"
    ],
    correct: 1,
    explanation: "useState is a React hook that allows you to add state to functional components.",
    category: "React"
  },
  {
    id: 17,
    question: "What is the purpose of keys in React lists?",
    options: [
      "To make lists look better",
      "To help React identify which items have changed",
      "To sort the list",
      "To filter the list"
    ],
    correct: 1,
    explanation: "Keys help React identify which items have changed, are added, or are removed, improving performance.",
    category: "React"
  },
  {
    id: 18,
    question: "What is React Router used for?",
    options: [
      "To manage state",
      "To handle navigation between pages",
      "To fetch data",
      "To style components"
    ],
    correct: 1,
    explanation: "React Router is a library for handling navigation and routing in React applications.",
    category: "React"
  },

  // TypeScript Questions (6)
  {
    id: 19,
    question: "What is TypeScript?",
    options: [
      "A new programming language",
      "JavaScript with static type definitions",
      "A React framework",
      "A build tool"
    ],
    correct: 1,
    explanation: "TypeScript is a programming language that adds static type definitions to JavaScript.",
    category: "TypeScript"
  },
  {
    id: 20,
    question: "What is the difference between 'any' and 'unknown' in TypeScript?",
    options: [
      "No difference",
      "any allows any operation, unknown requires type checking",
      "unknown is deprecated",
      "any is faster"
    ],
    correct: 1,
    explanation: "any allows any operation without type checking, while unknown requires type checking before use.",
    category: "TypeScript"
  },
  {
    id: 21,
    question: "What is a TypeScript interface?",
    options: [
      "A way to create objects",
      "A contract that defines the structure of an object",
      "A type of function",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "An interface in TypeScript defines the structure and contract that an object must follow.",
    category: "TypeScript"
  },
  {
    id: 22,
    question: "What are TypeScript generics?",
    options: [
      "A way to create types",
      "A mechanism for creating reusable components",
      "A type of variable",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "Generics allow you to create reusable components that work with multiple types while maintaining type safety.",
    category: "TypeScript"
  },
  {
    id: 23,
    question: "What is type inference in TypeScript?",
    options: [
      "A way to hide types",
      "TypeScript's ability to automatically determine types",
      "A manual type checking process",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "Type inference is TypeScript's ability to automatically determine the type of a variable based on its value.",
    category: "TypeScript"
  },
  {
    id: 24,
    question: "What is a union type in TypeScript?",
    options: [
      "A type that combines multiple types",
      "A way to merge objects",
      "A type of function",
      "A deprecated feature"
    ],
    correct: 0,
    explanation: "A union type allows a variable to be one of several types, defined using the | operator.",
    category: "TypeScript"
  },

  // CSS/HTML Questions (6)
  {
    id: 25,
    question: "Which CSS property is used to change the text color?",
    options: [
      "text-color",
      "font-color",
      "color",
      "text-style"
    ],
    correct: 2,
    explanation: "The 'color' property is used to set the color of text in CSS.",
    category: "CSS"
  },
  {
    id: 26,
    question: "What is CSS Flexbox used for?",
    options: [
      "To create animations",
      "To create flexible layouts",
      "To style text",
      "To create gradients"
    ],
    correct: 1,
    explanation: "Flexbox is a CSS layout method designed for creating flexible and responsive layouts.",
    category: "CSS"
  },
  {
    id: 27,
    question: "What is CSS Grid used for?",
    options: [
      "To create animations",
      "To create two-dimensional layouts",
      "To style text",
      "To create gradients"
    ],
    correct: 1,
    explanation: "CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns.",
    category: "CSS"
  },
  {
    id: 28,
    question: "What is CSS specificity?",
    options: [
      "How fast CSS loads",
      "How browsers determine which CSS rules to apply",
      "How many CSS files you can have",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "CSS specificity is how browsers determine which CSS rules to apply when multiple rules target the same element.",
    category: "CSS"
  },
  {
    id: 29,
    question: "What is semantic HTML?",
    options: [
      "HTML that looks good",
      "HTML that uses meaningful element names",
      "HTML that loads fast",
      "HTML with animations"
    ],
    correct: 1,
    explanation: "Semantic HTML uses meaningful element names that describe their content and purpose.",
    category: "HTML"
  },
  {
    id: 30,
    question: "What is responsive design?",
    options: [
      "Design that responds to user input",
      "Design that adapts to different screen sizes",
      "Design that loads quickly",
      "Design with animations"
    ],
    correct: 1,
    explanation: "Responsive design is an approach that makes web pages render well on different devices and screen sizes.",
    category: "CSS"
  },

  // Node.js/Backend Questions (5)
  {
    id: 31,
    question: "What is Node.js?",
    options: [
      "A frontend framework",
      "A JavaScript runtime for server-side development",
      "A database",
      "A build tool"
    ],
    correct: 1,
    explanation: "Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.",
    category: "Node.js"
  },
  {
    id: 32,
    question: "What is npm?",
    options: [
      "A programming language",
      "Node Package Manager",
      "A database",
      "A testing framework"
    ],
    correct: 1,
    explanation: "npm (Node Package Manager) is a package manager for JavaScript and the default package manager for Node.js.",
    category: "Node.js"
  },
  {
    id: 33,
    question: "What is the event loop in Node.js?",
    options: [
      "A way to create events",
      "The mechanism that handles asynchronous operations",
      "A type of function",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "The event loop is the mechanism that allows Node.js to perform non-blocking I/O operations.",
    category: "Node.js"
  },
  {
    id: 34,
    question: "What is Express.js?",
    options: [
      "A database",
      "A web application framework for Node.js",
      "A frontend framework",
      "A testing tool"
    ],
    correct: 1,
    explanation: "Express.js is a minimal and flexible Node.js web application framework that provides features for web and mobile applications.",
    category: "Node.js"
  },
  {
    id: 35,
    question: "What are Node.js streams?",
    options: [
      "A way to create animations",
      "Objects that handle data flow",
      "A type of database",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "Streams are objects that let you read data from a source or write data to a destination in a continuous fashion.",
    category: "Node.js"
  },

  // Git/Version Control Questions (4)
  {
    id: 36,
    question: "What is Git?",
    options: [
      "A programming language",
      "A version control system",
      "A database",
      "A build tool"
    ],
    correct: 1,
    explanation: "Git is a distributed version control system for tracking changes in source code during software development.",
    category: "Git"
  },
  {
    id: 37,
    question: "What is a Git branch?",
    options: [
      "A way to organize files",
      "A parallel version of your repository",
      "A type of commit",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "A branch is a parallel version of your repository that allows you to work on features without affecting the main codebase.",
    category: "Git"
  },
  {
    id: 38,
    question: "What is a Git merge?",
    options: [
      "A way to delete files",
      "Combining changes from different branches",
      "A type of commit",
      "A way to backup code"
    ],
    correct: 1,
    explanation: "A merge combines changes from different branches into a single branch.",
    category: "Git"
  },
  {
    id: 39,
    question: "What is a pull request?",
    options: [
      "A way to delete code",
      "A request to merge changes into another branch",
      "A type of commit",
      "A way to backup code"
    ],
    correct: 1,
    explanation: "A pull request is a request to merge changes from one branch into another, typically used for code review.",
    category: "Git"
  },

  // General Programming Questions (5)
  {
    id: 40,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Integration",
      "Automated Program Interface",
      "Application Process Integration"
    ],
    correct: 0,
    explanation: "API stands for Application Programming Interface - a set of protocols and tools for building software applications.",
    category: "General"
  },
  {
    id: 41,
    question: "What is Object-Oriented Programming (OOP)?",
    options: [
      "A way to write faster code",
      "A programming paradigm based on objects",
      "A type of database",
      "A deprecated programming style"
    ],
    correct: 1,
    explanation: "OOP is a programming paradigm based on the concept of objects, which contain data and code to manipulate that data.",
    category: "Programming"
  },
  {
    id: 42,
    question: "What is Big O notation?",
    options: [
      "A way to write code",
      "A way to describe algorithm complexity",
      "A type of variable",
      "A deprecated concept"
    ],
    correct: 1,
    explanation: "Big O notation is used to describe the time or space complexity of an algorithm.",
    category: "Programming"
  },
  {
    id: 43,
    question: "What is a design pattern?",
    options: [
      "A way to style code",
      "A reusable solution to a common problem",
      "A type of function",
      "A deprecated concept"
    ],
    correct: 1,
    explanation: "A design pattern is a reusable solution to a commonly occurring problem in software design.",
    category: "Programming"
  },
  {
    id: 44,
    question: "What is recursion?",
    options: [
      "A way to loop through arrays",
      "A function that calls itself",
      "A type of variable",
      "A deprecated technique"
    ],
    correct: 1,
    explanation: "Recursion is a programming technique where a function calls itself to solve a problem.",
    category: "Programming"
  },

  // Database/SQL Questions (4)
  {
    id: 45,
    question: "What is SQL?",
    options: [
      "A programming language",
      "Structured Query Language for databases",
      "A frontend framework",
      "A build tool"
    ],
    correct: 1,
    explanation: "SQL (Structured Query Language) is a language used to communicate with and manipulate databases.",
    category: "Database"
  },
  {
    id: 46,
    question: "What is a database index?",
    options: [
      "A way to count records",
      "A data structure that improves query performance",
      "A type of table",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "A database index is a data structure that improves the speed of data retrieval operations on a database table.",
    category: "Database"
  },
  {
    id: 47,
    question: "What is a JOIN in SQL?",
    options: [
      "A way to create tables",
      "A way to combine rows from multiple tables",
      "A type of query",
      "A deprecated feature"
    ],
    correct: 1,
    explanation: "A JOIN is used to combine rows from two or more tables based on a related column between them.",
    category: "Database"
  },
  {
    id: 48,
    question: "What is database normalization?",
    options: [
      "A way to make databases faster",
      "The process of organizing data to reduce redundancy",
      "A type of query",
      "A deprecated technique"
    ],
    correct: 1,
    explanation: "Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.",
    category: "Database"
  },

  // Web Security Questions (3)
  {
    id: 49,
    question: "What is XSS (Cross-Site Scripting)?",
    options: [
      "A way to style websites",
      "A security vulnerability where malicious scripts are injected",
      "A type of database",
      "A deprecated security measure"
    ],
    correct: 1,
    explanation: "XSS is a security vulnerability where attackers inject malicious scripts into web pages viewed by other users.",
    category: "Security"
  },
  {
    id: 50,
    question: "What is CSRF (Cross-Site Request Forgery)?",
    options: [
      "A way to create forms",
      "An attack that tricks users into performing unwanted actions",
      "A type of authentication",
      "A deprecated security measure"
    ],
    correct: 1,
    explanation: "CSRF is an attack that tricks users into performing actions they didn't intend to perform on a web application.",
    category: "Security"
  },
  {
    id: 51,
    question: "What is HTTPS?",
    options: [
      "A faster version of HTTP",
      "HTTP with SSL/TLS encryption",
      "A type of database",
      "A deprecated protocol"
    ],
    correct: 1,
    explanation: "HTTPS is HTTP with SSL/TLS encryption, providing secure communication over a computer network.",
    category: "Security"
  }
];

export const CodeQuiz = ({ onBack }: CodeQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  // Function to get random questions
  const getRandomQuestions = (allQuestions: Question[], count: number): Question[] => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Initialize quiz with random questions
  useEffect(() => {
    const randomQuestions = getRandomQuestions(allQuizQuestions, 5);
    setQuizQuestions(randomQuestions);
    setAnsweredQuestions(new Array(5).fill(false));
  }, []);

  const currentQ = quizQuestions[currentQuestion];

  // Don't render if questions haven't loaded yet
  if (quizQuestions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="text-lg">Loading quiz...</div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    if (selectedAnswer === currentQ.correct) {
      setScore(prev => prev + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    const randomQuestions = getRandomQuestions(allQuizQuestions, 5);
    setQuizQuestions(randomQuestions);
    setAnsweredQuestions(new Array(5).fill(false));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return { message: "Excellent! 🎉", color: "text-green-500" };
    if (percentage >= 60) return { message: "Good job! 👍", color: "text-blue-500" };
    if (percentage >= 40) return { message: "Not bad! 💪", color: "text-yellow-500" };
    return { message: "Keep studying! 📚", color: "text-orange-500" };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 font-mono text-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-[#333] h-[80vh] flex flex-col"
      >
        {/* VS Code Title Bar */}
        <div className="bg-[#3c3c3c] px-4 py-2 flex items-center justify-between border-b border-[#1e1e1e] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="ml-4 text-[#cccccc] text-xs">quiz.tsx — ChattyCV — Visual Studio Code</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="h-6 text-[#cccccc] hover:text-white hover:bg-[#505050]">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-[#252526] border-r border-[#1e1e1e] hidden md:flex flex-col shrink-0">
            <div className="p-2 text-[#bbb] text-xs uppercase font-bold tracking-wider flex justify-between items-center">
              <span>Explorer</span>
              <span className="text-[10px] opacity-50">...</span>
            </div>
            <div className="mt-2 flex-1 overflow-y-auto">
              <div className="px-2 py-1 text-[#e0e0e0] font-bold text-xs flex items-center gap-1">
                <span className="text-[10px]">▼</span> CHATTY-CV
              </div>
              <div className="px-4 py-1 text-[#e0e0e0] bg-[#37373d] flex items-center gap-2 border-l-2 border-[#007acc]">
                <span className="text-[#519aba] text-xs">TSX</span>
                <span>quiz_question_{currentQuestion + 1}.tsx</span>
              </div>
              {quizQuestions.map((q, idx) => (
                idx !== currentQuestion && (
                  <div key={q.id} className="px-4 py-1 text-[#999] hover:bg-[#2a2d2e] flex items-center gap-2 cursor-pointer border-l-2 border-transparent">
                    <span className="text-[#519aba] text-xs">TSX</span>
                    <span>quiz_question_{idx + 1}.tsx</span>
                    {answeredQuestions[idx] && <CheckCircle className="w-3 h-3 ml-auto text-green-500" />}
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
            {/* Tabs */}
            <div className="flex bg-[#252526] shrink-0 overflow-x-auto">
              <div className="px-4 py-2 bg-[#1e1e1e] text-[#e0e0e0] border-t-2 border-[#007acc] flex items-center gap-2 text-xs min-w-fit">
                <span className="text-[#519aba]">TSX</span>
                <span>quiz_question_{currentQuestion + 1}.tsx</span>
                <XCircle className="w-3 h-3 ml-2 text-[#999]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
              {quizFinished ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                  <Trophy className="w-20 h-20 text-[#ffbd2e]" />
                  <h2 className="text-3xl font-bold text-[#e0e0e0]">Build Complete</h2>
                  <div className="text-xl text-[#999]">
                    Tests Passed: <span className="text-[#4ec9b0]">{score}/{quizQuestions.length}</span>
                  </div>
                  <p className={`text-lg ${getScoreMessage(score, quizQuestions.length).color}`}>
                    {getScoreMessage(score, quizQuestions.length).message}
                  </p>
                  <Button onClick={resetQuiz} className="bg-[#007acc] hover:bg-[#0062a3] text-white">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start New Build
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4 h-full">
                  <div className="text-[#858585] text-right select-none space-y-1 hidden sm:block font-mono text-xs w-8 shrink-0">
                    {Array.from({ length: 30 }, (_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <div className="flex-1 space-y-6 max-w-3xl">
                    {/* Question as Comment */}
                    <div className="text-[#6a9955] italic font-mono">
                      /**<br />
                      &nbsp;* Question {currentQuestion + 1} of {quizQuestions.length}:<br />
                      &nbsp;* {currentQ.question}<br />
                      &nbsp;*/
                    </div>

                    {/* Options as Code */}
                    <div className="space-y-2 font-mono">
                      <div>
                        <span className="text-[#c586c0]">const</span> <span className="text-[#4fc1ff]">submitAnswer</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#c586c0]">async</span> <span className="text-[#d4d4d4]">(</span><span className="text-[#9cdcfe]">selectedOption</span><span className="text-[#d4d4d4]">)</span> <span className="text-[#c586c0]">=&#62;</span> <span className="text-[#da70d6]">&#123;</span>
                      </div>

                      <div className="pl-4 space-y-3 mt-2">
                        {currentQ.options.map((option, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ x: 5 }}
                            className={`
                               p-3 rounded border cursor-pointer transition-all flex items-center gap-3 group
                               ${selectedAnswer === index
                                ? showResult
                                  ? index === currentQ.correct
                                    ? 'bg-[#1e3a1e] border-[#4ec9b0]' // Correct selected
                                    : 'bg-[#3a1e1e] border-[#f44336]' // Wrong selected
                                  : 'bg-[#264f78] border-[#007acc]' // Selected
                                : 'bg-[#252526] border-[#333] hover:bg-[#2a2d2e]'}
                             `}
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <span className="text-[#569cd6] shrink-0">await</span>
                            <span className="text-[#dcdcaa]">choose</span>
                            <span className="text-[#ffd700]">(</span>
                            <span className="text-[#ce9178] break-all">"{option}"</span>
                            <span className="text-[#ffd700]">)</span>
                            <span className="text-[#d4d4d4] shrink-0">;</span>

                            {/* Only show Red X for wrong selected answer. 
                                 Only show Green Check for correct answer IF it was selected OR if we want to reveal it. 
                                 User asked for "red not green" if wrong. 
                                 So if I pick wrong, I see Red X. 
                                 I will NOT show the green check on the correct answer if the user picked wrong, to strictly follow "red not green".
                                 But I will show green check if they picked correct.
                             */}
                            {showResult && index === currentQ.correct && selectedAnswer === index && (
                              <CheckCircle className="w-4 h-4 text-[#4ec9b0] ml-auto shrink-0" />
                            )}
                            {showResult && selectedAnswer === index && index !== currentQ.correct && (
                              <XCircle className="w-4 h-4 text-[#f44336] ml-auto shrink-0" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <div>
                        <span className="text-[#da70d6]">&#125;</span><span className="text-[#d4d4d4]">;</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="pt-6 flex gap-4">
                      {!showResult ? (
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={selectedAnswer === null}
                          className="bg-[#007acc] hover:bg-[#0062a3] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Run Code
                        </Button>
                      ) : (
                        <div className="space-y-4 w-full">
                          <div className="p-4 bg-[#252526] border-l-4 border-[#007acc] text-[#d4d4d4]">
                            <div className="text-[#569cd6] font-bold mb-1">Console Output:</div>
                            <div className="font-mono text-sm opacity-90">
                              {selectedAnswer === currentQ.correct ? (
                                <span className="text-[#4ec9b0]">&gt; Success: Correct Answer!</span>
                              ) : (
                                <span className="text-[#f44336]">&gt; Error: Incorrect Answer.</span>
                              )}
                              <div className="mt-2 text-[#cccccc]">{currentQ.explanation}</div>
                            </div>
                          </div>
                          <Button onClick={handleNextQuestion} className="bg-[#4ec9b0] hover:bg-[#3da892] text-black font-bold">
                            {currentQuestion < quizQuestions.length - 1 ? 'Next File' : 'Finish Build'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#007acc] text-white px-4 py-1 text-xs flex justify-between items-center shrink-0 overflow-hidden whitespace-nowrap">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-transparent border border-white flex items-center justify-center text-[8px]">x</div> 0</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-transparent border border-white flex items-center justify-center text-[8px]">!</div> 0</span>
          </div>
          <div className="flex gap-4">
            <span>Ln {currentQuestion + 1}, Col 1</span>
            <span>UTF-8</span>
            <span>TypeScript React</span>
            <span className="hidden sm:inline">Prettier</span>
            <span className="hidden sm:inline">Go Live</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
