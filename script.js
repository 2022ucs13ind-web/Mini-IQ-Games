const levels=[
  {gridSize:5,words:[
    {word:"CPU",row:0,col:0,clue:"Hardware part of computer",fact:"CPU is the brain of computer."},
    {word:"RAM",row:1,col:1,clue:"Temporary memory",fact:"RAM helps multitasking."}
  ]},
  {gridSize:7,words:[
    {word:"FACEBOOK",row:0,col:0,clue:"Popular social media app",fact:"Facebook launched in 2004."},
    {word:"INSTAGRAM",row:2,col:0,clue:"Photo sharing social media app",fact:"Instagram is owned by Meta."}
  ]},
  {gridSize:8,words:[
    {word:"INFOSYS",row:1,col:0,clue:"Narayana Murthy owns which company?",fact:"Infosys is an IT giant."},
    {word:"ZOHO",row:3,col:0,clue:"Sridhar Vembu owns which company?",fact:"Zoho builds business software."}
  ]}
];

let levelIndex=0, score=0, hints=3;
let completed=new Set(), timerInt;

const grid=document.getElementById("crossword-grid");
const clues=document.getElementById("clues-list");
const scoreVal=document.getElementById("score-val");
const funFact=document.getElementById("fun-fact");
const hintCount=document.getElementById("hint-count");
const timer=document.getElementById("top-timer");
const nextBox=document.getElementById("next-level-container");
const nextBtn=document.getElementById("next-level-btn");
const prevArrow=document.getElementById("prev-arrow");

document.getElementById("hint-btn").onclick=useHint;
nextBtn.onclick=nextLevel;
prevArrow.onclick=prevLevel;

loadLevel();

function loadLevel(){
  grid.innerHTML="";
  clues.innerHTML="";
  completed.clear();
  hints=3;
  hintCount.innerText=hints;
  funFact.innerText="Answer a word to see fun fact!";
  scoreVal.innerText=`SCORE: ${score}`;
  nextBox.style.display="none";

  /* ✅ Arrow rule: Level-1 la kaata vendam */
  prevArrow.style.display = levelIndex===0 ? "none" : "block";

  const lvl=levels[levelIndex];
  grid.style.gridTemplateColumns=`repeat(${lvl.gridSize},50px)`;

  for(let i=0;i<lvl.gridSize**2;i++){
    let cell=document.createElement("div");
    cell.className="cell";
    grid.appendChild(cell);
  }

  lvl.words.forEach((w,i)=>{
    let li=document.createElement("li");
    li.innerText=`${i+1}. ${w.clue}`;
    clues.appendChild(li);

    for(let j=0;j<w.word.length;j++){
      let idx=(w.row*lvl.gridSize)+(w.col+j);
      let input=document.createElement("input");
      input.maxLength=1;
      input.dataset.word=w.word;

      input.addEventListener("input",()=>{
        autoMove(input);
        autoCheck();
      });

      grid.children[idx].appendChild(input);
    }
  });

  startTimer();
}

function autoMove(input){
  let inputs=[...document.querySelectorAll(".grid input")];
  let i=inputs.indexOf(input);
  if(input.value && i<inputs.length-1) inputs[i+1].focus();
}

function autoCheck(){
  let lvl=levels[levelIndex];
  let all=true;

  lvl.words.forEach(w=>{
    let ok=true;
    for(let j=0;j<w.word.length;j++){
      let idx=(w.row*lvl.gridSize)+(w.col+j);
      let val=grid.children[idx].querySelector("input").value.toUpperCase();
      if(val!==w.word[j]) ok=false;
    }
    if(ok && !completed.has(w.word)){
      completed.add(w.word);
      score+=10;
      funFact.innerText=w.fact;
    }
    if(!ok) all=false;
  });

  scoreVal.innerText=`SCORE: ${score}`;
  if(all){
    clearInterval(timerInt);
    nextBox.style.display="block";
  }
}

function nextLevel(){
  levelIndex++;
  if(levelIndex<levels.length){
    loadLevel();
  }else{
    showGameOver();
  }
}

function prevLevel(){
  if(levelIndex>0){
    levelIndex--;
    loadLevel();
  }
}

function showGameOver(){
  grid.innerHTML="";
  clues.innerHTML="";
  nextBox.style.display="none";
  prevArrow.style.display="block"; // ✅ Arrow works in Game Over
  document.getElementById("game-container").innerHTML+=
    `<div class="game-over">🎉 GAME OVER<br><br>Final Score: ${score}</div>`;
}

function useHint(){
  if(hints<=0) return;
  hints--; score-=5;
  hintCount.innerText=hints;

  let empty=[...document.querySelectorAll(".grid input")].find(i=>!i.value);
  if(empty){
    let w=empty.dataset.word;
    let index=[...document.querySelectorAll(".grid input")]
      .filter(i=>i.dataset.word===w).indexOf(empty);
    empty.value=w[index];
  }
  scoreVal.innerText=`SCORE: ${score}`;
}

function startTimer(){
  clearInterval(timerInt);
  let t=0;
  timerInt=setInterval(()=>{
    t++;
    let m=String(Math.floor(t/60)).padStart(2,"0");
    let s=String(t%60).padStart(2,"0");
    timer.innerText=`⏱ Time: ${m}:${s}`;
  },1000);
}

function completeGame() {
  localStorage.setItem("game1Completed", "true");
  window.location.href = "../index.html"; // back to hub
}

