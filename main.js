let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let qCount = questionObject.length;
      createBullets(qCount);
      addQuestionData(questionObject[currentIndex], qCount);
      countdown(3, qCount);
      submitButton.onclick = () => {
        let theRightAnswer = questionObject[currentIndex].rightAnswer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionObject[currentIndex], qCount);
        handleBullets();
        clearInterval(countdownInterval);
        countdown(3, qCount);
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "htmlQuestions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer${i}`;
      radioInput.dataset.answer = obj[`answer${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer${i}`;
      let theLabelText = document.createTextNode(obj[`answer${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(Answer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswers;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswers = answers[i].dataset.answer;
    }
  }
  if (Answer === theChosenAnswers) {
    rightAnswers++;
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} From ${count}`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let mins, secs;
    countdownInterval = setInterval(function () {
      mins = parseInt(duration / 60);
      secs = parseInt(duration % 60);
      mins = mins < 10 ? `0${mins}` : mins;
      secs = secs < 10 ? `0${secs}` : secs;
      countdownElement.innerHTML = `${mins}:${secs}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
