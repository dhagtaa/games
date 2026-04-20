let currentUser=null;
let provider="";
let mode="";
let board=[];
let currentPlayer="X";
let stats={win:0,lose:0,draw:0,friend:0};

const clickSound = new Audio("click.wav");
const winSound = new Audio("winn.wav");
const beckSound = new Audio("beck.mp3");
const loginSound = new Audio("login.wav");

beckSound.loop = true;
beckSound.volume = 0.4;
winSound.volume = 0.8;
clickSound.volume = 0.7;
loginSound.volume = 0.9;

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
document.getElementById(id).classList.remove("hidden");
}

function selectProvider(p){
provider=p;
document.getElementById("providerTitle").innerText="Login "+p;
showPage("usernamePage");
}

function nextToPassword(){
currentUser=document.getElementById("usernameInput").value;
if(currentUser==="")return alert("Isi username!");
showPage("passwordPage");
}

function loginSuccess(){
showPage("homePage");
document.getElementById("profileBtn").classList.remove("hidden");
document.getElementById("profileUsername").innerText="User: "+currentUser;
document.getElementById("profileProvider").innerText="Provider: "+provider;
}

function logout(){
location.reload();
}

function chooseMode(m){
mode=m;
if(m==="computer"){
document.getElementById("singlePlayer").classList.remove("hidden");
document.getElementById("twoPlayers").classList.add("hidden");
}else{
document.getElementById("singlePlayer").classList.add("hidden");
document.getElementById("twoPlayers").classList.remove("hidden");
}
showPage("namePage");
}

function startGame(){
showPage("gamePage");
board=["","","","","","","","",""];
currentPlayer="X";
renderBoard();
}

function renderBoard(){
const boardDiv=document.getElementById("board");
boardDiv.innerHTML="";
board.forEach((cell,i)=>{
const div=document.createElement("div");
div.classList.add("cell");
div.innerText=cell;
div.onclick=()=>move(i);
boardDiv.appendChild(div);
});
}

function move(i){
if(board[i]!=="" )return;
board[i]=currentPlayer;
renderBoard();
if(checkWin()){
endGame(currentPlayer);
return;
}
if(board.every(c=>c!=="")){
endGame("draw");
return;
}
currentPlayer=currentPlayer==="X"?"O":"X";
if(mode==="computer"&&currentPlayer==="O"){
setTimeout(computerMove,500);
}
}

function computerMove(){
let empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
let rand=empty[Math.floor(Math.random()*empty.length)];
move(rand);
}

function checkWin(){
const winPatterns=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];
return winPatterns.some(pattern=>pattern.every(i=>board[i]===currentPlayer));
}

function endGame(result){
const popup=document.getElementById("resultPopup");
popup.classList.remove("hidden");
const emoji=document.getElementById("resultEmoji");
const text=document.getElementById("resultText");

if(result==="draw"){
emoji.innerText="🤝";
text.innerText="SERI!";
stats.draw++;
}else{
emoji.innerText="🏆";
text.innerText=result+" MENANG!";
if(mode==="computer"){
if(result==="X")stats.win++;else stats.lose++;
}else stats.friend++;
}
}

function resetGame(){
document.getElementById("resultPopup").classList.add("hidden");
startGame();
}

function toggleProfile(){
document.getElementById("profilePanel").classList.toggle("active");
}