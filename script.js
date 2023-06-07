const NOTES_StorageKey = "Kola-Note";
const RECYCLE_StorageKey = "Kola-Recycle";
let notesArr = [];
let recycleArr = [];

const taskTextBox = document.getElementById("taskTextBox");
const dateInputBox = document.getElementById("dateInputBox");
const timeInputBox = document.getElementById("timeInputBox");
const form = document.getElementById("form");
const blackScreen = document.getElementById("blackScreen");
const recycleBin = document.getElementById("recycle");

loadFromLocalStorage();

function showForm(){
    form.style.display = "block";
    blackScreen.style.display = "block";
}

function createNote(){
    event.preventDefault();
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
    form.style.display = "none";
    blackScreen.style.display = "none";
}

function saveToLocalStorage(){
    const notes_str = JSON.stringify(notesArr);
    localStorage.setItem(NOTES_StorageKey, notes_str);

    const recycle_str = JSON.stringify(recycleArr);
    localStorage.setItem(RECYCLE_StorageKey, recycle_str);
}

function loadFromLocalStorage(){
    const notes_str = localStorage.getItem(NOTES_StorageKey);
    if(notes_str){
        notesArr = JSON.parse(notes_str);
    }

    const recycle_str = localStorage.getItem(RECYCLE_StorageKey);
    if(recycle_str){
        recycleArr = JSON.parse(recycle_str);
    }
    displayNotes();
}

function displayNotes(){
    const allNotesContainer = document.getElementById("allNotesContainer");
    let html = "";

    for(let i=0; i<notesArr.length; i++){
        html += `
        <div class="noteItem" style="rotate: ${notesArr[i].visual["rotate"]}deg;">
            <img class="scotch" src="assets/images/s${notesArr[i].visual["scotch"]}.png" style="margin-left:${notesArr[i].visual["scotchPos"]}px" alt="#">
            <div class="noteTools">
                <button id="delete_${i}" class="deleteBtn" onclick="deleteNote(${i})">X</button>
            </div>
            <div class="noteContent"><div>${notesArr[i].task}</div><span class="contentFade"></span></div>
            <div class="noteDateAndTime"><span>${notesArr[i].date}</span> <span>${notesArr[i].time}</span></div>
        </div>
        `;
    }
    allNotesContainer.innerHTML = html;

    if(recycleArr.length > 0){
        recycleBin.style.backgroundPosition = "0px 160px";
    } else {
        recycleBin.style.backgroundPosition = "0px 0px";
    }
}

function editNote(noteID){
    //Open popup form
}

function deleteNote(noteID){
    recycleArr.push(notesArr[noteID]);
    notesArr.splice(noteID, 1);
    saveToLocalStorage();
    displayNotes();
}

function clearForm(){
    taskTextBox.value = "";
    dateInputBox.value = "";
    timeInputBox.value = "";
}