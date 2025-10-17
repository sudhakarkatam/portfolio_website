import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Clock, Target, Zap } from 'lucide-react';

interface TypingSpeedProps {
  onBack: () => void;
}

const sampleTexts = [
  // Short texts for quick tests (15-30 seconds)
  "The quick brown fox jumps over the lazy dog. This is a classic typing test sentence that contains every letter of the alphabet.",
  "Programming is the art of telling another human what one wants the computer to do. Clean code always looks like it was written by someone who cares.",
  "Technology is best when it brings people together. The future belongs to those who understand how to work with artificial intelligence and machine learning.",
  "Innovation distinguishes between a leader and a follower. The way to get started is to quit talking and begin doing something meaningful.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle for anything less than excellence.",
  
  // Medium texts for standard tests (60 seconds)
  "Software development is a complex field that requires continuous learning and adaptation. Modern applications are built using a variety of technologies including frontend frameworks like React and Vue, backend technologies like Node.js and Python, and databases ranging from SQL to NoSQL solutions. The key to success in this field is understanding not just how to write code, but how to write maintainable, scalable, and efficient code that solves real-world problems.",
  
  "The evolution of web development has been remarkable over the past two decades. From simple static HTML pages to dynamic single-page applications, the web has become a platform for complex software systems. Today's developers work with sophisticated tools and frameworks that abstract away much of the complexity while providing powerful features for building modern user experiences. Understanding both the fundamentals and the latest trends is crucial for staying relevant in this rapidly changing industry.",
  
  "Artificial intelligence and machine learning are transforming how we approach problem-solving in software development. These technologies enable us to build systems that can learn, adapt, and make decisions autonomously. From recommendation engines to natural language processing, AI is becoming an integral part of many applications. However, with great power comes great responsibility, and developers must consider the ethical implications of the systems they build.",
  
  "The importance of user experience in software development cannot be overstated. A well-designed application not only functions correctly but also provides an intuitive and enjoyable experience for its users. This involves understanding user behavior, conducting usability testing, and iterating on designs based on feedback. The best developers are those who can balance technical excellence with user-centered design principles.",
  
  // Long texts for extended tests (120 seconds)
  "The landscape of software development continues to evolve at an unprecedented pace, driven by technological innovation and changing user expectations. Modern development practices emphasize collaboration, continuous integration, and deployment, enabling teams to deliver high-quality software more efficiently than ever before. Agile methodologies have revolutionized how projects are managed, focusing on iterative development and rapid feedback cycles. This approach allows teams to respond quickly to changing requirements and market conditions.",
  
  "Cloud computing has fundamentally changed how applications are built, deployed, and scaled. Services like AWS, Azure, and Google Cloud provide developers with powerful tools and infrastructure that can be provisioned and managed programmatically. This shift has enabled the rise of microservices architectures, where applications are broken down into smaller, independently deployable services. This approach offers benefits in terms of scalability, maintainability, and team autonomy, but also introduces new challenges around service communication, data consistency, and system complexity.",
  
  "The rise of mobile computing has created new opportunities and challenges for software developers. Mobile applications require different design considerations, from touch interfaces to battery optimization and offline functionality. Cross-platform development frameworks like React Native and Flutter have emerged to help developers build applications that work across multiple platforms while sharing code and development resources. However, native development still offers advantages in terms of performance and platform-specific features.",
  
  "Cybersecurity has become a critical concern in software development as applications handle increasingly sensitive data and perform more critical functions. Developers must be aware of common vulnerabilities like SQL injection, cross-site scripting, and insecure authentication mechanisms. Security should be considered throughout the development lifecycle, from initial design through deployment and maintenance. This includes implementing proper authentication and authorization, encrypting sensitive data, and following secure coding practices.",
  
  "The future of software development looks promising with emerging technologies like quantum computing, edge computing, and the Internet of Things creating new possibilities. Quantum computing promises to solve problems that are currently intractable for classical computers, while edge computing brings processing power closer to where data is generated. The Internet of Things connects everyday objects to the internet, creating new opportunities for automation and data collection. As these technologies mature, they will create new challenges and opportunities for developers to explore.",
  
  // Additional variety texts
  "Open source software has revolutionized the way we develop and distribute applications. Communities of developers collaborate across the globe to create powerful tools and frameworks that benefit everyone. From operating systems like Linux to web frameworks like React, open source projects demonstrate the power of collective intelligence and shared knowledge. Contributing to open source projects not only helps the community but also provides valuable learning opportunities and professional networking.",
  
  "The role of data in modern applications cannot be underestimated. From user analytics to machine learning models, data drives decision-making and enables personalized experiences. Developers must understand how to collect, store, process, and analyze data effectively. This includes working with various database systems, implementing data pipelines, and ensuring data privacy and security. The ability to work with data is becoming increasingly important as applications become more sophisticated and data-driven.",
  
  "Testing is a crucial aspect of software development that ensures code quality and reliability. Different types of testing, from unit tests to integration tests and end-to-end tests, serve different purposes in the development lifecycle. Automated testing enables continuous integration and deployment practices, allowing teams to catch bugs early and deploy with confidence. Test-driven development and behavior-driven development are methodologies that emphasize writing tests before or alongside the code they validate.",
  
  "Performance optimization is an ongoing concern in software development. As applications grow in complexity and user base, ensuring they remain fast and responsive becomes increasingly challenging. This involves profiling applications to identify bottlenecks, optimizing database queries, implementing caching strategies, and using content delivery networks. Understanding performance metrics and monitoring tools is essential for maintaining high-quality user experiences.",
  
  "The importance of documentation in software development cannot be overstated. Well-written documentation helps team members understand code, APIs, and system architecture. It also serves as a valuable resource for onboarding new developers and maintaining systems over time. Documentation should be clear, comprehensive, and kept up-to-date with code changes. This includes code comments, API documentation, architectural decision records, and user guides.",
  
  "Version control systems like Git have become fundamental tools in software development. They enable teams to track changes, collaborate effectively, and maintain different versions of their code. Understanding branching strategies, merge conflicts, and collaborative workflows is essential for modern development. Platforms like GitHub and GitLab provide additional features like issue tracking, code review, and continuous integration that enhance the development process.",
  
  "The concept of DevOps bridges the gap between development and operations, emphasizing collaboration and automation throughout the software development lifecycle. This includes practices like continuous integration, continuous deployment, infrastructure as code, and monitoring. DevOps culture promotes faster delivery, higher quality, and better collaboration between teams. Understanding DevOps principles and tools is becoming increasingly important for modern software developers.",
  
  // Additional variety paragraphs for more randomness
  "The rise of containerization with Docker and Kubernetes has revolutionized how applications are deployed and managed. Containers provide a consistent environment across development, testing, and production, eliminating the 'it works on my machine' problem. Kubernetes orchestrates these containers at scale, providing features like auto-scaling, load balancing, and self-healing capabilities. Understanding containerization and orchestration is essential for modern cloud-native development.",
  
  "API design and development have become fundamental skills in modern software development. RESTful APIs provide a standardized way for applications to communicate, while GraphQL offers more flexible data querying capabilities. Good API design considers factors like versioning, authentication, rate limiting, and comprehensive documentation. Developers must understand how to design APIs that are both powerful and easy to use for other developers.",
  
  "The importance of code review in software development cannot be overstated. Code reviews help catch bugs early, share knowledge among team members, and maintain consistent coding standards. They also serve as a learning opportunity for junior developers and help ensure that code follows best practices. Effective code reviews focus on both the technical aspects and the maintainability of the code.",
  
  "Database design and optimization are crucial skills for backend developers. Understanding normalization, indexing, and query optimization can significantly impact application performance. Different types of databases, from relational to document-based and graph databases, serve different use cases. Developers must understand when to use each type and how to design schemas that support their application's requirements.",
  
  "The role of frontend frameworks in modern web development has evolved significantly. React, Vue, and Angular each offer different approaches to building user interfaces, from component-based architectures to reactive programming patterns. Understanding state management, routing, and performance optimization in these frameworks is essential for building scalable frontend applications.",
  
  "Mobile app development presents unique challenges and opportunities. Native development offers the best performance and platform integration, while cross-platform solutions like React Native and Flutter provide code reuse benefits. Progressive Web Apps (PWAs) offer a middle ground, providing app-like experiences through web technologies. Understanding the trade-offs between these approaches is crucial for mobile development decisions.",
  
  "The importance of accessibility in software development is gaining recognition. Building applications that work for users with disabilities is not only a legal requirement in many jurisdictions but also a moral imperative. This includes proper semantic HTML, keyboard navigation support, screen reader compatibility, and color contrast considerations. Accessible design benefits all users, not just those with disabilities.",
  
  "The concept of microservices architecture has gained popularity as applications grow in complexity. Breaking applications into smaller, independently deployable services offers benefits in terms of scalability, team autonomy, and technology diversity. However, this approach also introduces challenges around service communication, data consistency, and system complexity. Understanding when and how to implement microservices is crucial for modern architecture decisions.",
  
  "The role of artificial intelligence in software development is expanding rapidly. From code generation tools to automated testing and deployment, AI is helping developers work more efficiently. Machine learning models can analyze code patterns, predict bugs, and suggest optimizations. Understanding how to leverage AI tools while maintaining code quality and security is becoming increasingly important.",
  
  "The importance of monitoring and observability in production systems cannot be underestimated. Applications need comprehensive logging, metrics collection, and distributed tracing to understand their behavior in production. Tools like Prometheus, Grafana, and Jaeger help teams monitor system health and troubleshoot issues quickly. Building observable systems from the start is much easier than retrofitting monitoring later.",
  
  "The concept of serverless computing has changed how developers think about application deployment. Functions as a Service (FaaS) platforms like AWS Lambda and Azure Functions allow developers to focus on business logic without managing servers. This approach offers benefits in terms of cost, scalability, and operational overhead, but also introduces new challenges around cold starts, vendor lock-in, and debugging.",
  
  "The importance of security in software development has never been greater. With increasing cyber threats and data breaches, developers must understand security best practices from the beginning of the development process. This includes secure coding practices, vulnerability assessment, penetration testing, and incident response planning. Security should be considered at every stage of the software development lifecycle.",
  
  "The role of design systems in frontend development has become increasingly important. Design systems provide a consistent set of components, patterns, and guidelines that help teams build cohesive user experiences. They include not just visual elements but also interaction patterns, accessibility guidelines, and coding standards. Implementing and maintaining design systems requires collaboration between designers and developers.",
  
  "The importance of performance optimization in web applications cannot be overstated. Users expect fast, responsive applications, and performance directly impacts user experience and business metrics. This includes optimizing bundle sizes, implementing lazy loading, using CDNs, and optimizing images. Understanding performance metrics and monitoring tools is essential for maintaining high-quality user experiences.",
  
  "The concept of edge computing is changing how we think about application architecture. By moving computation closer to users, edge computing reduces latency and improves performance. This is particularly important for applications that require real-time processing or serve global audiences. Understanding edge computing concepts and platforms is becoming increasingly relevant for modern application development."
];

interface CharacterStatus {
  char: string;
  status: 'correct' | 'incorrect' | 'current' | 'pending';
}

export const TypingSpeed = ({ onBack }: TypingSpeedProps) => {
  const [currentText, setCurrentText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, errors: 0 });
  const [characterStatuses, setCharacterStatuses] = useState<CharacterStatus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [testMode, setTestMode] = useState<'time' | 'words' | 'quote'>('time');
  const [wordCount, setWordCount] = useState(25);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateText = () => {
    let text;
    
    // Select appropriate text based on duration - always random
    if (selectedDuration <= 30) {
      // Short texts for quick tests (15-30 seconds)
      const shortTexts = sampleTexts.slice(0, 5);
      text = shortTexts[Math.floor(Math.random() * shortTexts.length)];
    } else if (selectedDuration <= 60) {
      // Medium texts for standard tests (60 seconds)
      const mediumTexts = sampleTexts.slice(5, 9);
      text = mediumTexts[Math.floor(Math.random() * mediumTexts.length)];
    } else {
      // Long texts for extended tests (120 seconds) - now includes all remaining texts
      const longTexts = sampleTexts.slice(9);
      text = longTexts[Math.floor(Math.random() * longTexts.length)];
    }
    
    if (testMode === 'words') {
      const words = text.split(' ');
      text = words.slice(0, wordCount).join(' ');
    }
    
    if (!includePunctuation) {
      text = text.replace(/[^\w\s]/g, '');
    }
    
    if (!includeNumbers) {
      text = text.replace(/[0-9]/g, '');
    }
    
    return text;
  };

  useEffect(() => {
    const text = generateText();
    setCurrentText(text);
    setCharacterStatuses(text.split('').map(char => ({ char, status: 'pending' as const })));
    setTimeLeft(selectedDuration);
  }, [testMode, wordCount, includePunctuation, includeNumbers, selectedDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTest = () => {
    setTestStarted(true);
    setIsActive(true);
    setStartTime(Date.now());
    setCurrentIndex(0);
    setTotalErrors(0);
    setStats({ wpm: 0, accuracy: 0, errors: 0 });
  };

  // Real-time stats calculation
  useEffect(() => {
    if (isActive && startTime && currentIndex > 0) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60; // minutes
      const wordsTyped = currentIndex / 5; // average word length is 5 characters
      const wpm = Math.round(wordsTyped / elapsedTime);
      const accuracy = Math.round(((currentIndex - totalErrors) / currentIndex) * 100);
      
      setStats({ wpm, accuracy, errors: totalErrors });
    }
  }, [currentIndex, isActive, startTime, totalErrors]);

  const handleKeyPress = (e: KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.key === 'Escape') {
      resetTest();
      return;
    }
    
    if (!testStarted || isFinished) return;
    
    const key = e.key;
    const expectedChar = currentText[currentIndex];
    
    if (key === 'Backspace') {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setCharacterStatuses(prev => {
          const newStatuses = [...prev];
          newStatuses[currentIndex - 1] = { char: newStatuses[currentIndex - 1].char, status: 'pending' };
          if (currentIndex < newStatuses.length) {
            newStatuses[currentIndex] = { char: newStatuses[currentIndex].char, status: 'current' };
          }
          return newStatuses;
        });
      }
      return;
    }
    
    if (key.length === 1) { // Only handle printable characters
      const isCorrect = key === expectedChar;
      
      setCharacterStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[currentIndex] = { char: key, status: isCorrect ? 'correct' : 'incorrect' };
        if (currentIndex + 1 < newStatuses.length) {
          newStatuses[currentIndex + 1] = { char: newStatuses[currentIndex + 1].char, status: 'current' };
        }
        return newStatuses;
      });
      
      if (!isCorrect) {
        setTotalErrors(prev => prev + 1);
      }
      
      setCurrentIndex(currentIndex + 1);
      
      // Check if test is complete
      if (currentIndex + 1 >= currentText.length) {
        finishTest();
      }
    }
  };

  // Handle Tab + Enter for restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.shiftKey === false) {
        e.preventDefault();
        // Wait for Enter key
        const handleEnter = (enterEvent: KeyboardEvent) => {
          if (enterEvent.key === 'Enter') {
            resetTest();
            document.removeEventListener('keydown', handleEnter);
          }
        };
        document.addEventListener('keydown', handleEnter);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add document-level key event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [testStarted, isFinished, currentIndex, currentText]);

  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60;
      const wordsTyped = currentIndex / 5;
      const wpm = Math.round(wordsTyped / elapsedTime);
      const accuracy = Math.round(((currentIndex - totalErrors) / currentIndex) * 100);
      setStats({ wpm, accuracy, errors: totalErrors });
    }
  };

  const resetTest = () => {
    const text = generateText();
    setCurrentText(text);
    setCharacterStatuses(text.split('').map(char => ({ char, status: 'pending' as const })));
    setTimeLeft(selectedDuration);
    setIsActive(false);
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 0, errors: 0 });
    setCurrentIndex(0);
    setStartTime(null);
    setTotalErrors(0);
    setTestStarted(false);
  };

  const getPerformanceMessage = (wpm: number) => {
    if (wpm >= 60) return { message: "Excellent! 🚀", color: "text-green-500" };
    if (wpm >= 40) return { message: "Good job! 👍", color: "text-blue-500" };
    if (wpm >= 25) return { message: "Not bad! 💪", color: "text-yellow-500" };
    return { message: "Keep practicing! 📚", color: "text-orange-500" };
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <Button variant="outline" onClick={resetTest} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            New Test
          </Button>
        </div>

        {/* Monkeytype-style Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button
            variant={includePunctuation ? "default" : "outline"}
            size="sm"
            onClick={() => setIncludePunctuation(!includePunctuation)}
            className="text-xs"
          >
            @ punctuation
          </Button>
          <Button
            variant={includeNumbers ? "default" : "outline"}
            size="sm"
            onClick={() => setIncludeNumbers(!includeNumbers)}
            className="text-xs"
          >
            # numbers
          </Button>
          <Button
            variant={testMode === 'time' ? "default" : "outline"}
            size="sm"
            onClick={() => setTestMode('time')}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            time
          </Button>
          <Button
            variant={testMode === 'words' ? "default" : "outline"}
            size="sm"
            onClick={() => setTestMode('words')}
            className="text-xs"
          >
            A words
          </Button>
          <Button
            variant={testMode === 'quote' ? "default" : "outline"}
            size="sm"
            onClick={() => setTestMode('quote')}
            className="text-xs"
          >
            " quote
          </Button>
        </div>

        {/* Duration/Word Count Selector */}
        {testMode === 'time' && (
          <div className="flex justify-center gap-2 mb-6">
            {[15, 30, 60, 120].map((duration) => (
              <Button
                key={duration}
                variant={selectedDuration === duration ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDuration(duration)}
                className="text-xs"
              >
                {duration}
              </Button>
            ))}
          </div>
        )}

        {testMode === 'words' && (
          <div className="flex justify-center gap-2 mb-6">
            {[10, 25, 50, 100].map((count) => (
              <Button
                key={count}
                variant={wordCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => setWordCount(count)}
                className="text-xs"
              >
                {count}
              </Button>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Typing Speed Test</CardTitle>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {testMode === 'time' ? `Time: ${timeLeft}s` : `Words: ${wordCount}`}
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                WPM: {stats.wpm}
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                Accuracy: {stats.accuracy}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isFinished ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Test Complete!</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent">{stats.wpm}</div>
                    <div className="text-sm text-muted-foreground">Words Per Minute</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent">{stats.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent">{stats.errors}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                </div>
                <p className={`text-lg font-semibold ${getPerformanceMessage(stats.wpm).color}`}>
                  {getPerformanceMessage(stats.wpm).message}
                </p>
              </motion.div>
            ) : !testStarted ? (
              <div className="text-center py-8">
                <div className="bg-muted/50 rounded-lg p-6 text-lg leading-relaxed font-mono mb-6">
                  {characterStatuses.map((charStatus, index) => (
                    <span
                      key={index}
                      className="text-muted-foreground"
                    >
                      {charStatus.char}
                    </span>
                  ))}
                </div>
                <Button
                  onClick={startTest}
                  className="bg-accent hover:bg-accent/90 text-lg px-8 py-3"
                >
                  Start Test
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Press any key to start typing
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div 
                  ref={containerRef}
                  className="bg-muted/50 rounded-lg p-6 text-lg leading-relaxed font-mono cursor-text"
                  tabIndex={0}
                >
                  {characterStatuses.map((charStatus, index) => (
                    <span
                      key={index}
                      className={`${
                        charStatus.status === 'correct' 
                          ? 'text-green-500 bg-green-100 dark:bg-green-900' 
                          : charStatus.status === 'incorrect'
                          ? 'text-red-500 bg-red-100 dark:bg-red-900'
                          : charStatus.status === 'current'
                          ? 'bg-accent/20 border-b-2 border-accent'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {charStatus.char}
                    </span>
                  ))}
                </div>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Type the text above as quickly and accurately as possible
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <div className="text-center text-xs text-muted-foreground mt-6">
          <div className="space-y-1">
            <div>tab + enter - restart test</div>
            <div>esc - reset test</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
