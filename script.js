const storageKey = "Kola-Note";
let notesArr = [];

const taskTextBox = document.getElementById("taskTextBox");
const dateInputBox = document.getElementById("dateInputBox");
const timeInputBox = document.getElementById("timeInputBox");

loadFromLocalStorage();

function createNote(){
    const note = {
        task: taskTextBox.value,
        date: dateInputBox.value,
        time: timeInputBox.value,
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
}

function saveToLocalStorage(){
    const str = JSON.stringify(notesArr);
    localStorage.setItem(storageKey, str);
}

function loadFromLocalStorage(){
    const str = localStorage.getItem(storageKey);
    if(str){
        notesArr = JSON.parse(str);
        displayNotes();
    }
}

function displayNotes(){
    const allNotesContainer = document.getElementById("allNotesContainer");
    let html = "";

    for(let i=0; i<notesArr.length; i++){
        html += `
        <div class="noteItem" style="rotate: ${notesArr[i].visual["rotate"]}deg;">
            <img class="scotch" src="assets/images/s${notesArr[i].visual["scotch"]}.png" style="margin-left:${notesArr[i].visual["scotchPos"]}px" alt="#">
            <div class="noteTools">
                <button id="delete_${i}" class="deleteBtn" onclick="showDeleteAlert(${i})">X</button>
            </div>
            <div class="noteContent"><div>${notesArr[i].task}</div><span class="contentFade"></span></div>
            <div class="noteDateAndTime"><span>${notesArr[i].date}</span> <span>${notesArr[i].time}</span></div>
        </div>
        `;
    }
    allNotesContainer.innerHTML = html;
}

function editNote(noteID){
    //Open popup form
}

function deleteNote(booleanResult, noteID){
    const alertBoxContainer = document.getElementById("alertBox");
    alertBoxContainer.remove();

    if(booleanResult){
        notesArr.splice(noteID, 1);
        saveToLocalStorage();
        displayNotes();
    }
}

function showDeleteAlert(noteID){
    const alertBoxContainer = document.getElementById("alertBoxContainer");
    let html = `
        <div id="alertBox">
            <p>This item will be permanently deleted.
            <br>do you want to continue?</p>
            <button id="confirmBtn" onclick="deleteNote(${true}, ${noteID})">Yes</button>
            <button id="cancelBtn" onclick="deleteNote(${false}, ${noteID})">Cancel</button>
        </div>
    `
    alertBoxContainer.innerHTML = html;
}

function clearForm(){
    taskTextBox.value = "";
    dateInputBox.value = "";
    timeInputBox.value = "";
}