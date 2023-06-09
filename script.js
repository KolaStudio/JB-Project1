const NOTES_StorageKey = "Kola-Note";
const RECYCLE_StorageKey = "Kola-Recycle";

let notesArr = [];
let recycleArr = [];

const taskTextBox = document.getElementById("taskTextBox");
const dateInputBox = document.getElementById("dateInputBox");
const timeInputBox = document.getElementById("timeInputBox");
const allNotesContainer = document.getElementById("notesContainer");
const recycleContainer = document.getElementById("recycleContainer");
const blackScreen = document.getElementById("blackScreen");

let recycleList = document.getElementById("recycleList");
let cssVariables = document.querySelector(':root');

loadFromLocalStorage();

function showPopUp(popUp){
    const popUpBox = document.getElementById(popUp);
    popUpBox.style.display = "block";
    blackScreen.style.display = "block";
}
function closePopUp(popUp){
    const popUpBox = document.getElementById(popUp);
    popUpBox.style.display = "none";
    blackScreen.style.display = "none";
    clearForm();
}

function formValidation(){
    event.preventDefault();
    const taskText = taskTextBox.value;
    const dateInput = dateInputBox.value;
    const timeInput = timeInputBox.value;

    if(taskText===""){
        taskTextBox.style.backgroundColor = "#fd1e1e";
        return;
    }
    if(dateInput===""){
        dateInputBox.style.backgroundColor = "#fd1e1e";
        return;
    }
    if(timeInput===""){
        timeInputBox.style.backgroundColor = "#fd1e1e";
        return;
    }
    createNote();
}

function createNote(){
    const note = {
        task: taskTextBox.value,
        date: dateInputBox.value,
        time: timeInputBox.value,
        create: new Date(),
        visual: {
            rotate: (Math.random() * (5 + 5)) -5,
            scotch: Math.floor(Math.random() * 5)+1,
            scotchPos: Math.floor(Math.random() * (140 - 50)) + 50
        }
    }
    notesArr.push(note);
    saveToLocalStorage();
    displayNotes();
    clearForm();
    document.getElementById("popUpDivForm").style.display = "none";
    blackScreen.style.display = "none";
}

function saveToLocalStorage(){
    const notes_str = JSON.stringify(notesArr);
    const recycle_str = JSON.stringify(recycleArr);
    localStorage.setItem(NOTES_StorageKey, notes_str);
    localStorage.setItem(RECYCLE_StorageKey, recycle_str);
}

function loadFromLocalStorage(){
    const notes_str = localStorage.getItem(NOTES_StorageKey);
    const recycle_str = localStorage.getItem(RECYCLE_StorageKey);
    if(notes_str){ notesArr = JSON.parse(notes_str); }
    if(recycle_str){ recycleArr = JSON.parse(recycle_str); }
    displayNotes();
    createRecycleList();
}

function displayNotes(){    
    let html = "";

    for(let i=0; i<notesArr.length; i++){
        html += `
        <div class="noteItem" style="rotate: ${notesArr[i].visual["rotate"]}deg;">
            <img class="scotch" src="assets/images/s${notesArr[i].visual["scotch"]}.png" style="margin-left:${notesArr[i].visual["scotchPos"]}px" alt="#">
            <div class="noteTools">
                <button id="delete_${i}" class="deleteNoteBtn" onclick="moveNoteToRecycle(${i})">X</button>
            </div>
            <div class="noteContent"><div>${notesArr[i].task}</div><span class="contentFade"></span></div>
            <div class="noteDateAndTime"><span>${notesArr[i].date}</span> <span>${notesArr[i].time}</span></div>
        </div>`;
    }
    allNotesContainer.innerHTML = html;

    const recycleBinIcon = document.getElementById("recycleIcon");
    if(recycleArr.length > 0){ recycleBinIcon.style.backgroundPosition = "0px 50px"; }
    else { recycleBinIcon.style.backgroundPosition = "0px 0px"; }
}
function createRecycleList(){ 
    let html = "";
    for(let i=0; i<recycleArr.length; i++){
        html += `
        <tr>
        <td>${recycleArr[i].date} ${recycleArr[i].time}</td>
        <td>${recycleArr[i].task}</td>
        <td><div class="restoreBtn" onclick="restoreNote(${i})"></div</td>
        </tr>`;
    }
    recycleContainer.innerHTML = html;
}
function editNote(noteID){
    //Open popup form with note data for edit
}

function moveNoteToRecycle(noteID){
    recycleArr.push(notesArr[noteID]);
    notesArr.splice(noteID, 1);
    saveToLocalStorage();
    displayNotes();
    createRecycleList();
}
function restoreNote(noteID){
    notesArr.push(recycleArr[noteID]);
    recycleArr.splice(noteID, 1);
    saveToLocalStorage();
    displayNotes();
    createRecycleList();
}
function clearForm(){
    taskTextBox.value = "";
    dateInputBox.value = "";
    timeInputBox.value = "";
    resetInputColor();
}
function resetInputColor(){
    taskTextBox.style.backgroundColor = "";
    dateInputBox.style.backgroundColor = "";
    timeInputBox.style.backgroundColor = "";
}
function changeColor(color){
    cssVariables.style.setProperty('--main', color);
}