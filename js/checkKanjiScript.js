const checkBtn = $("#checkBtn");
let testHistory = [];

let from;
let to;
const fromNum = $("#fromNum");
const toNum = $("#toNum");

let words;
let curScore;
let numberOfQuestion;
let wrongAnswer;

async function changeLevel(level) {
  if (level !== "Chọn cấp độ Kanji") {
    const res = await fetch(`json/${level}.json`);
    const data = await res.json();
    $("#input-field").css("display", "block");
    words = data;
  }
}
checkBtn.click(() => {
  from = fromNum.val();
  to = toNum.val();
  curScore = 0;
  wrongAnswer = [];
  //   validation
  if (from === "" || to === "") {
    errorOutput("Fill in all the fields please");
  } else if (from <= 0 || to > words.length) {
    errorOutput("Error: You must input from range of 1 to " + words.length);
  } else if (from > to) {
    tmpNum = from;
    from = to;
    to = tmpNum;
    //expected Output: from -> to ; to -> from
    errorOutput("");
    numberOfQuestion = to - from + 1;
    showScore(0);
    startTest(Number(from), Number(to));
  } else {
    errorOutput("");
    numberOfQuestion = to - from + 1;
    showScore(0);
    startTest(Number(from), Number(to));
  }
});
const errorOutput = (eMessage) => {
  $("#error-message").html(eMessage);
};
const startTest = (from, to) => {
  $("#checker-zone").css("display", "block");
  outKanji(from, to);
};

const outKanji = (from, to) => {
  curTestNum = randomInt(from, to + 1);
  testHistory.push(curTestNum);
  $("#kanji").html(words[curTestNum].kanji);
  outAnswers(curTestNum);
};

const outAnswers = (curTestNum) => {
  let ans = randomInt(1, 5); // out 1 - 4
  $(`#answer-${ans}`).html(words[curTestNum].hanViet);
  for (let i = 1; i <= 4; i++) {
    if (i !== ans) {
      $(`#answer-${i}`).html(words[randomInt(1, words.length)].hanViet);
    }
  }
};

//Check The Answer and Go To The Next Question
//Scoring
$(".answers").click(function () {
  let ansId = $(this)[0].id;
  if ($("#" + ansId).text() === words[curTestNum].hanViet) {
    curScore++;
    showScore(curScore);
    $("#" + ansId).css("background", "green");
    setTimeout(function () {
      $("#" + ansId).removeAttr("style");
      outKanji(Number(from), Number(to));
    }, 500);
  } else {
    $("#" + ansId).css("background", "red");
    wrongAnswer.push(curTestNum);
    setTimeout(function () {
      $("#" + ansId).removeAttr("style");
      outKanji(Number(from), Number(to));
    }, 500);
  }
});

const showScore = (score) => {
  $("#score").html(`${score}/${numberOfQuestion}`);
};

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
