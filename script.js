const NOTES_StorageKey = "Kola-Note";
const RECYCLE_StorageKey = "Kola-Recycle";
const SETTINGS_StorageKey = "Kola-Settings";

let notesArr = [];
let recycleArr = [];
let settingsObj = {
    background: "#4b1c00",
    sortByDueDate: false
};

const taskTextBox = document.getElementById("taskTextBox");
const dateInputBox = document.getElementById("dateInputBox");
const timeInputBox = document.getElementById("timeInputBox");
const allNotesContainer = document.getElementById("notesContainer");
const recycleContainer = document.getElementById("recycleContainer");
const blackScreen = document.getElementById("blackScreen");

// let recycleList = document.getElementById("recycleList");
let cssVariables = document.querySelector(':root');

onLoadPage()

// =========================== On Load =========================== //
function onLoadPage(){
    const settings_str = localStorage.getItem(SETTINGS_StorageKey);
    const notes_str = localStorage.getItem(NOTES_StorageKey);
    const recycle_str = localStorage.getItem(RECYCLE_StorageKey);  
    
    notes_str? notesArr = JSON.parse(notes_str) : showPopUp("welcome");
    if(recycle_str){ recycleArr = JSON.parse(recycle_str); }
    if(settings_str){ settingsObj = JSON.parse(settings_str); }

    cssVariables.style.setProperty('--main', settingsObj.background);
    document.getElementById("colorInput").value = settingsObj.background;
    
    displayNotes();
    displayRecycleList();
}

// ========================== Draw Elements =========================== //
function displayNotes(){ 
    if(settingsObj.sortByDueDate){
        notesArr.sort(function(a, b){return new Date(a.date) - new Date(b.date)});
    }else{
        notesArr.sort(function(a, b){return new Date(a.create) - new Date(b.create)});
    }
    
    const currentDate = new Date(); 
    let html = "";
    let dateStatusClass = "";  

    for(let i=0; i<notesArr.length; i++){
        let givenDate = new Date(notesArr[i].date);
        givenDate.getTime() < currentDate.getTime() ? dateStatusClass="dateAlert" : dateStatusClass="";
        
        html += `
        <div class="noteItem" style="rotate: ${notesArr[i].visual["rotate"]}deg;">
            <img class="scotch" src="assets/images/s${notesArr[i].visual["scotch"]}.png" style="margin-left:${notesArr[i].visual["scotchPos"]}px" alt="#">
            <div class="noteTools">
                <button id="delete_${i}" class="deleteNoteBtn" onclick="moveNoteToRecycle(${i})">X</button>
            </div>
            <div class="noteContent"><div>${notesArr[i].task}</div><span class="contentFade"></span></div>
            <div class="noteDateAndTime ${dateStatusClass}"><span>${formatDate(notesArr[i].date)}</span> <span>${notesArr[i].time}</span></div>
        </div>`;
    }

    allNotesContainer.innerHTML = html;
}

function displayRecycleList(){ 
    if(recycleArr.length>0){
        document.getElementById("recycleItems").style.display = "block";
        document.getElementById("recycleBinIsEmpty").style.display = "none";
    }else{
        document.getElementById("recycleItems").style.display = "none";
        document.getElementById("recycleBinIsEmpty").style.display = "block";
    }

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

    const recycleBinIcon = document.getElementById("recycleIcon");
    if(recycleArr.length > 0){ 
        recycleBinIcon.style.backgroundImage = "url('assets/images/recycleFull_icon.png')"; 
    }else { 
        recycleBinIcon.style.backgroundImage = "url('assets/images/recycleEmpty_icon.png')";
    }
}

// ========================= New Task Creation ========================== //
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

// ===================== Save Tasks to Local Storage ====================== //
function saveToLocalStorage(){
    const notes_str = JSON.stringify(notesArr);
    const recycle_str = JSON.stringify(recycleArr);
    localStorage.setItem(NOTES_StorageKey, notes_str);
    localStorage.setItem(RECYCLE_StorageKey, recycle_str);
}

// ===================== Recycle Bin ====================== //
function moveNoteToRecycle(noteID){
    recycleArr.push(notesArr[noteID]);
    notesArr.splice(noteID, 1);
    saveToLocalStorage();
    displayNotes();
    displayRecycleList();
}
function restoreNote(noteID){
    notesArr.push(recycleArr[noteID]);
    recycleArr.splice(noteID, 1);
    saveToLocalStorage();
    displayNotes();
    displayRecycleList();
}
function emptyBin(){
    recycleArr.splice(0, recycleArr.length);
    saveToLocalStorage();
    displayRecycleList();
}

// ===================== PopUp Boxes (show/hide) ====================== //
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

// ===================== Visual and Settings ====================== //
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
    settingsObj.background = color;
    localStorage.setItem(SETTINGS_StorageKey, JSON.stringify(settingsObj));
}
function sortNotes(){
    const sortIcon = document.getElementById("sortIcon");
    if(settingsObj.sortByDueDate){
        settingsObj.sortByDueDate = false;
        sortIcon.style.backgroundImage = "url(assets/images/sort_icon.png)";
    }else{
        settingsObj.sortByDueDate = true;
        sortIcon.style.backgroundImage = "url(assets/images/sortDue_icon.png)";
    }
    localStorage.setItem(SETTINGS_StorageKey, JSON.stringify(settingsObj));
    displayNotes();
}
function formatDate(d){
    const date = new Date(d);
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return(`${day}-${month+1}-${year}`);
}