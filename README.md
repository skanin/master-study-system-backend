# Backend for my master study system

This is a backend for [my master study system](https://github.com/skanin/master-study-system). It is an API that serves eye gaze data, checks for user authentication, stores logs and other other data from the frontend.

## How to run

Run `npm i && npm i -g nodemon && npm start` in the project's root folder. The service will then be up an runing on [http://localhost:3001](http://localhost:3001).

## Routes

### /auth

#### POST /isAuthenticated

Params:

-   `username : string`. Valid username for the system.

Example request:

```javascript
fetc('http://localhost:3001/auth/isAuthenticated', {
	method: 'POST',
	body: {
		username: 'TestUser',
	},
});
```

Example response:

Status 200 if user is authenticated, 400 if no username is provided or 403 if user is not authenticated.

### /data

#### GET /:id - gets the eye gaze data for task :id

Returns the eye gaze data for task :id.

Params:

-   `id : string`. Id of the task to which the data belongs.
-   `username : string`. Valid username for the system.

Example request:

```javascript
fetch('http://localhost:3001/data/1', {
	method: 'GET',
	params: {
		username: 'TestUser',
	},
});
```

Example response:

```javascript
[
	{
		x: 985.0,
		y: 377.0,
		count: 12,
		duration_ms: 92,
		start_ms: 0,
		end_ms: 92,
		duration_s: 0.092,
		start_s: 0.0,
		end_d: 0.092,
		type: 'fixation',
	},
    ...
];
```

### /login

#### POST /

Logs the user in.

Params:

-   `username : string`. Valid username for the system.

Example request:

```javascript
fetch('http://localhost:3001/login', {
	method: 'POST',
	body: {
		username: 'TestUser',
	},
});
```

Example response:

```javascript
{
    helpType: 2,
    subject: 1,
    username: 'TestUser',
}
```

### /logs

#### POST /

Stores logs.

Params:

-   `subject : int`. Subject id needed for authentication.
-   `username : string`. Valid username for the system.
-   `logs : [<logEvent>]`. Logs to be stored. Logs has the following optional fields:
    -   `from : int` - either "from seconds" or "from taskId"
    -   `to : int` - either "to seconds" or "to taskId"
    -   `type : string`. Type of the log. Can be:
        -   login
        -   startPretest
        -   startStudy
        -   play
        -   pause
        -   disappearValueChange
        -   playTimeValueChange
        -   pretestAnswerChange
        -   changePretest
        -   pretestFinished
        -   studyFinished
        -   changeStudy
        -   showHelp
        -   hideHelp
        -   expertProceed
        -   expertFinished
        -   backToStudyTask
        -   onFinishSummaryClick
        -   finishSummary
        -   logout
    -   `subject : int`. Subject id.
    -   `helpType : int`. Help type
    -   `username : string`. Participant's username
    -   `time : int`. Milliseconds since login
    -   `taskId : int`. Task id
    -   `pretestId : int`. Pretest id
    -   `pretestQuestion : string`. Pretest question id
    -   `pretestAnswer : int`. Participant's answer to the pretest
    -   `videoTime : int`. Time in seconds where in the video the event happend

Example request:

```javascript
fetch('http://localhost:3001/logs', {
	method: 'POST',
	body: {
		subject: {
			subject: 1,
			username: 'TestUser',
			helpType: 2,
		},
		logs: [
			{
				from: 1,
				helpType: 2,
				subject: 1,
				time: 0,
				to: 2,
				type: 'changePretest',
				username: 'TestUser',
			},
			{
				helpType: 2,
				subject: 1,
				time: 10335,
				type: 'play',
				videoTime: 0,
				taskId: 3,
				username: 'TestUser',
			},
		],
	},
});
```

Example response:

Status 200.

### /pretest

#### POST /

Stores answers to the pretest.

Params:

-   `subject : int`. Subject id needed for authentication.
-   `username : string`. Valid username for the system.
-   `questions : [<pretestQuestion>]`. Pretest questions to be stored. Questions has the following fields:
    -   `questionId : string`: Question id on the form "\<taskId\>-\<questionNo\>"
    -   `question : string`. Question text
    -   `checked : int`. Participant's answer to the question (which radiobutton was checked).
    -   `answers : [<answer>]`. Answers to the question.
    -   `correct : int`. Correct answer to the question.

Example request:

```javascript
fetch('http://localhost:3001/pretest', {
    method: 'POST',
    body: {
        subject: {
            subject: 1,
            username: 'TestUser',
            helpType: 2,
        },
        questions: [
            {
                questionId: '1-1',
                question: 'What is the capital of Finland?',
                checked: 1,
                answers: ['Helsinki','Espoo','Tampere'],
                correct: 0
            },
            {
                questionId: '2-1',
                question: 'What is the capital of Norway?',
                checked: 1,
                answers: ['Helsinki','Espoo','Oslo'],
                correct: 2
            },
            ],
        ],
    },
});
```

Example response:

Status 200

### /study

#### POST /

Stores answers to the study tasks

Params:

-   `subject : int`. Subject id needed for authentication.
-   `username : string`. Valid username for the system.
-   `answers : [<answer>]`. Answers to the study. Answers has the following fields:
    -   `studyTask\<X\> : string`. Where X is the study task number, with the respective answer.

Example request:

```javascript
fetch('http://localhost:3001/study', {
	method: 'POST',
	body: {
		subject: {
			subject: 1,
			username: 'TestUser',
			helpType: 2,
		},
		answers: [
			{
				studyTask1: 'The code does this',
				studyTask2: 'Bug on line 3',
				studyTask3: 'The code does not compile',
				studyTask4: "I don't know",
				studyTask5: '',
				studyTask6: '',
			},
		],
	},
});
```

Example response:

Status 200
