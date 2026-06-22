const assert = require('assert');

// Simulate ExamPeak state changes

let scores = [20, 25, 40, 35, 55, 70];
const mockQuestions = [
  { id: 1, text: "Which HTTP method is idempotent?", options: ["GET", "POST", "PATCH", "CONNECT"], answer: "GET" },
  { id: 2, text: "In React, what hook is used to manage side effects?", options: ["useState", "useEffect", "useMemo", "useContext"], answer: "useEffect" },
  { id: 3, text: "What is the result of 2 + '2' in JS?", options: ["4", "22", "NaN", "Error"], answer: "22" },
];

let selectedAnswers = {
  1: "GET",
  2: "useEffect",
  3: "22"
};

let correct = 0;
mockQuestions.forEach(q => {
  if (selectedAnswers[q.id] === q.answer) correct++;
});
const finalScore = Math.round((correct / mockQuestions.length) * 100);

scores = [...scores.slice(-5), finalScore];

console.log("Scores after 1 exam:", scores);
assert.deepStrictEqual(scores, [25, 40, 35, 55, 70, 100], "Scores array slicing is correct");

// Test predictive math
const recentScores = scores.slice(-6);
const lastX = (recentScores.length - 1) * 50;
const lastY = 100 - (recentScores[recentScores.length - 1] || 0);

const predX1 = lastX + 50;
const predY1 = Math.max(10, lastY - 10);
const predX2 = lastX + 100;
const predY2 = Math.max(5, lastY - 15);
const predX3 = lastX + 150;
const predY3 = Math.max(0, lastY - 20);

const currentScore = recentScores[recentScores.length - 1] || 0;
const predictedScore = Math.min(100, currentScore + 10);

console.log("Predicted Y3 mapped to score:", 100 - predY3);
console.log("Predicted Score label:", predictedScore);
if (100 - predY3 !== predictedScore) {
    console.log("LOGICAL MISMATCH in Predictive Analytics: The chart visually predicts score " + (100 - predY3) + " while the label says " + predictedScore);
} else {
    console.log("Predictive Analytics logic matches.");
}

console.log("All simulated tests ran.");
