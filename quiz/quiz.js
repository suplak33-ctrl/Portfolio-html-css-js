const questions = [
  {
    question: "Which is the largest animal in the world", 
    answers: [
      { text: "Shark", correct:false},
      { text: "Blue whale", correct:true},
      { text: "Elephant", correct:false},
      { text: "Giraffe", correct:false},

    ]
  },
  {
    question: "which language is used for backend", 
    answers: [
      { text: "Js", correct:true},
      { text: "Html", correct:false},
      { text: "Css", correct:false},
      { text: "Nepali", correct:false},

    ]
  },
  {
    question: "which is the biggest sport in the world", 
    answers: [
      { text: "Basketball", correct:false},
      { text: "Cricket", correct:false},
      { text: "Football", correct:true},
      { text: "Tennis", correct:false},

    ]
  },
  {
    question: "which is the most popular language for web development", 
    answers: [
      { text: "Python", correct:false},
      { text: "Js", correct:true},
      { text: "C", correct:false},
      { text: "C++", correct:false},

    ]
  }


];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
  currentQuestionIndex= 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();

}



function showQuestion(){
  resetState();
  let currentQuestion= questions[currentQuestionIndex];
  let questionNo= currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + "." + currentQuestion.question;


  currentQuestion.answers.forEach(answer => {
  const button = document.createElement("button");
  button.innerHTML = answer.text;
  button.classList.add("btn");
  answerButtons.appendChild(button);
  if(answer.correct){
    button.dataset.correct = answer.correct;
  }
  button.addEventListener("click", selectAnswer);
  });
}




//removes all the previous answers

function resetState(){
  nextButton.style.display = "none";
  while(answerButtons.firstChild)
  {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

//defining button answer click 
function selectAnswer(e){
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if(isCorrect){
    selectedBtn.classList.add("correct");
    score++;
  }else{
    selectedBtn.classList.add("incorrect");

  }
  // cannot click buttons after choosing an option 
  Array.from(answerButtons.children).forEach(button =>{
    if(button.dataset.correct === "true"){
      button.classList.add("correct");
    }
    button.disabled = true;
  })
  nextButton.style.display = "block";
}

function showScore(){
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML ="play again "
  nextButton.style.display = "block";
}

// score box
function handleNextButton(){
  currentQuestionIndex++;
  if(currentQuestionIndex< questions.length){
    showQuestion();
  }else{
    showScore();
  }
}

nextButton.addEventListener("click", ()=>{
  if(currentQuestionIndex < questions.length){
    handleNextButton();
  }else{
    startQuiz();
  }
})


startQuiz();



