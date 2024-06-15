import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(600);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        fetch('/questions.json')
            .then(response => response.json())
            .then(data => setQuestions(data));

        const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
        const savedTimeLeft = localStorage.getItem('timeLeft');

        if (savedQuestionIndex !== null) {
            setCurrentQuestionIndex(parseInt(savedQuestionIndex));
        }

        if (savedTimeLeft !== null) {
            setTimeLeft(parseInt(savedTimeLeft));
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    alert('Quiz finished!');
                    localStorage.removeItem('currentQuestionIndex');
                    localStorage.removeItem('timeLeft');
                    return 0;
                }
                localStorage.setItem('timeLeft', prevTime - 1);
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    }, [currentQuestionIndex]);

    const handleAnswerClick = answer => {
        const currentQuestion = questions[currentQuestionIndex];
        if (answer === currentQuestion.answer) {
            console.log('Correct');
        } else {
            console.log('Incorrect');
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleFullscreenChange = () => {
        if (document.fullscreenElement) {
            setIsFullscreen(true);
        } else {
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const enableFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (!isFullscreen) {
        return (
            <div className="fullscreen-message">
                <p>Please enable full screen to start the quiz.</p>
                <button onClick={enableFullscreen}>Go Full Screen</button>
            </div>
        );
    }

    if (currentQuestionIndex >= questions.length) {
        return <div className="quiz-container"><p>Quiz finished!</p></div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="quiz">
                <h2>{currentQuestion.question}</h2>
                <ul>
                    {currentQuestion.options.map(option => (
                        <li key={option}>
                            <button onClick={() => handleAnswerClick(option)}>{option}</button>
                        </li>
                    ))}
                </ul>
                <div className="timer">{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</div>
            </div>
        </div>
    );
};

export default Quiz;
