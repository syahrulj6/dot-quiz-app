# Quiz App

A modern quiz application built with React, TypeScript, and Tailwind CSS. Users can log in with a username, answer trivia questions within a time limit, and review their results after completing the quiz.

## Features

* User login with username validation
* Random trivia questions from Open Trivia DB
* Multiple-choice questions
* Countdown timer
* Automatic quiz submission when time expires
* Session persistence using Local Storage
* Quiz progress recovery after page refresh
* Detailed result summary
* Answer review page
* Responsive design for desktop and mobile

## Tech Stack

### Frontend

* React
* TypeScript
* React Router DOM
* Tailwind CSS
* Axios

### API

* Open Trivia Database (OpenTDB)

## Project Structure

```text
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ProgressBar.tsx
│   ├── QuestionCard.tsx
│   └── Timer.tsx
├── hooks/
│   └── useQuizStorage.ts
├── lib/
│   └── quiz.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── QuizPage.tsx
│   └── ResultPage.tsx
├── types/
│   └── quiz.ts
├── utils/
│   └── quizText.ts
├── App.tsx
├── index.css
├── main.tsx
└── routes.tsx
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd quiz-app
```

### Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

## Start Development Server

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

The application will be available at:

```text
http://localhost:5173
```

## Application Flow

### 1. Login

The user enters a username to start a quiz session.

### 2. Fetch Questions

The application requests trivia questions from Open Trivia DB.

### 3. Answer Questions

Users select answers while the timer counts down.

### 4. Session Persistence

Quiz progress is automatically stored in Local Storage, allowing users to continue after refreshing the page.

### 5. Quiz Submission

The quiz can end in two ways:

* User submits manually
* Timer expires automatically

### 6. Results

The application displays:

* Total questions
* Answered questions
* Correct answers
* Wrong answers
* Unanswered questions
* Accuracy percentage

### 7. Answer Review

Users can review:

* Their selected answer
* Correct answer
* Question status (Correct, Wrong, Unanswered)

## Local Storage

The application stores quiz progress locally using Local Storage.

### Example Session Structure

```json
{
  "username": "John",
  "status": "completed",
  "selectedAnswers": {},
  "startedAt": 1234567890,
  "questions": []
}
```

### Possible Statuses

```text
in-progress
completed
expired
```

## API Reference

### Open Trivia DB

**Endpoint**

```http
GET https://opentdb.com/api.php?amount=10&type=multiple
```

**Documentation**

https://opentdb.com/api_config.php

## Screens

### Login Page

* Enter username
* Start quiz

### Quiz Page

* Question navigation
* Timer
* Answer selection
* Submit quiz

### Result Page

* Quiz statistics
* Accuracy calculation
* Answer review
* Play again option
