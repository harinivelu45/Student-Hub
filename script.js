let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let alarmSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
let chart;

/* TASKS */
function showTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, i) => {
        let li = document.createElement("li");

        li.innerHTML = `
        <span onclick="toggleComplete(${i})">${task.text}</span>
        <button onclick="deleteTask(${i})">❌</button>`;

        if (task.completed) li.style.textDecoration="line-through";

        if (task.due && task.due < today)
            li.style.background="#ffcccc";

        list.appendChild(li);
    });

    updateProgress();
    renderChart();
}

function addTask() {
    let t = document.getElementById("taskInput").value;
    let d = document.getElementById("dueDate").value;

    if (!t) return;

    tasks.push({text:t,completed:false,due:d});
    localStorage.setItem("tasks", JSON.stringify(tasks));

    showTasks();
    showToast("Added");
}

function deleteTask(i) {
    tasks.splice(i,1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
}

function toggleComplete(i) {
    tasks[i].completed = !tasks[i].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e=>{
    let v = e.target.value.toLowerCase();
    document.querySelectorAll("li").forEach(li=>{
        li.style.display = li.innerText.toLowerCase().includes(v) ? "flex":"none";
    });
});

/* PROGRESS */
function updateProgress(){
    let c = tasks.filter(t=>t.completed).length;
    let t = tasks.length;
    document.getElementById("progressFill").style.width = (t?c/t*100:0)+"%";
}

/* CHART */
function renderChart(){
    let c = tasks.filter(t=>t.completed).length;
    let p = tasks.length-c;

    let ctx = document.getElementById("progressChart").getContext("2d");
    if(chart) chart.destroy();

    chart = new Chart(ctx,{
        type:"doughnut",
        data:{labels:["Done","Pending"],
        datasets:[{data:[c,p]}]}
    });
}

/* TOAST */
function showToast(msg){
    let t=document.getElementById("toast");
    t.innerText=msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2000);
}

/* TIMER */
let time=1500, int;

function updateDisplay(){
    let m=Math.floor(time/60);
    let s=time%60;
    document.getElementById("timer").innerText=`${m}:${s<10?"0":""}${s}`;
}

function startTimer(){
    if(int) return;
    int=setInterval(()=>{
        if(time>0){time--;updateDisplay();}
        else{
            clearInterval(int);
            alarmSound.play();
        }
    },1000);
}

function resetTimer(){
    clearInterval(int);
    int=null;
    time=1500;
    updateDisplay();
}

startBtn.onclick=startTimer;
resetBtn.onclick=resetTimer;

/* GPA (UNLIMITED) */
function addSubject(){
    let c=document.getElementById("subjects");
    let i=document.createElement("input");
    i.type="number";
    i.className="mark";
    i.placeholder="Subject "+(c.children.length+1);
    c.appendChild(i);
}

function removeSubject(){
    let c=document.getElementById("subjects");
    if(c.children.length>1) c.removeChild(c.lastChild);
}

function calculateGPA(){
    let marks=document.querySelectorAll(".mark");
    let total=0,count=0;

    marks.forEach(m=>{
        let v=parseFloat(m.value);
        if(!isNaN(v)){total+=v;count++;}
    });

    let avg=total/count;
    let gpa=avg>=90?10:avg>=80?9:avg>=70?8:avg>=60?7:avg>=50?6:5;

    document.getElementById("gpaResult").innerText=`GPA: ${gpa}`;
}

calcBtn.onclick=calculateGPA;

/* DARK */
darkModeToggle.onclick=()=>{
    document.body.classList.toggle("dark");
}

/* INIT */
updateDisplay();
showTasks();