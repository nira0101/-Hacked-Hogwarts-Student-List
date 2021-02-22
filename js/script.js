"use strict";

window.addEventListener("DOMContentLoaded", init);

let allStudents = [];

//prototype for all students
const Student = {
  fname: "",
  mname: "",
  lname: "",
  sHouse: "",
  gender: "",
  responsibilities: "",
};

function init() {
  fetchData();
  filterButton();
}
async function fetchData() {
  console.log(fetchData);
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();

  //when loaded prepare data object
  prepareObject(jsonData);
}

function prepareObject(jsonData) {
  jsonData.forEach((jsonObject) => {
    //Create new object with cleaned data - and store that in the allStudent array
    const studentData = Object.create(Student);
    console.log(studentData);

    //split the full details into parts
    const infoSplit = jsonObject.fullname.trim().split(" ");
    const stuFName = jsonObject.fName;
    const stuMName = jsonObject.mName;
    const stuLName = jsonObject.lName;
    const stuHouse = jsonObject.house.trim();
    const stuGender = jsonObject.gender;
    //console.log(infoSplit);
    //console.log(stuGender);
    //console.log(stuHouse);
    if (infoSplit.length == 1) {
      studentData.fName = infoSplit[0];

      //to change first name in uppercase
      studentData.fName =
        studentData.fName[0].toUpperCase() +
        studentData.fName.substring(1).toLowerCase();
    } else if (infoSplit.length == 2) {
      studentData.fName = infoSplit[0];

      //to change first name in uppercase
      studentData.fName =
        studentData.fName[0].toUpperCase() +
        studentData.fName.substring(1).toLowerCase();

      //change last name to uppercase
      studentData.lName = infoSplit[1];
      studentData.lName =
        studentData.lName[0].toUpperCase() +
        studentData.lName.substring(1).toLowerCase();
    } else if (infoSplit.length == 3) {
      studentData.fName = infoSplit[0];

      //to change first name in uppercase
      studentData.fName =
        studentData.fName[0].toUpperCase() +
        studentData.fName.substring(1).toLowerCase();

      //to change mid name to upper case
      studentData.mName = infoSplit[1];
      studentData.mName =
        studentData.mName[0].toUpperCase() +
        studentData.mName.substring(1).toLowerCase();

      //change last name to uppercase
      studentData.lName = infoSplit[2];
      studentData.lName =
        studentData.lName[0].toUpperCase() +
        studentData.lName.substring(1).toLowerCase();
    }
    //studentData.name = infoSplit[0] + " " + infoSplit[1] + " " + infoSplit[2];
    studentData.gender = stuGender;
    studentData.gender =
      studentData.gender[0].toUpperCase() +
      studentData.gender.substring(1).toLowerCase();

    studentData.house = stuHouse;
    studentData.house =
      studentData.house[0].toUpperCase() +
      studentData.house.substring(1).toLowerCase();

    studentData.fName = studentData.fName;

    studentData.mName = studentData.mName;

    studentData.lName = studentData.lName;

    //to show letters afetr hyphen and "" in uppercase
    /* if (studentData.mName.includes('"')) {
      studentData.mName =
        studentData.mName[1].toUpperCase() +
        studentData.mName
          .substring(2, studentData.mName.lastIndexOf('"'))
          .toLowerCase();
    } */

    /*     if (studentData.lName.includes("-")) {
      studentData.lName =
        studentData.lName[0].toUpperCase() +
        studentData.lName
          .substring(1, studentData.lName.indexOf("-"))
          .toLowerCase() +
        " " +
        studentData.lName[studentData.lName.indexOf("-") + 1].toUpperCase() +
        studentData.lName
          .substring(studentData.lName.indexOf("-") + 2)
          .toLowerCase();
    } */

    //show data
    allStudents.push(studentData);
    return studentData;
  });

  displayList();
}

function displayList() {
  //console.log(displayList);
  //cleat the list
  document.querySelector("main").innerHTML = "";

  //create new list
  allStudents.forEach(displayStudent);
}

function filterButton() {
  document
    .querySelectorAll("[data-action = 'filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected: ${filter}`);
  filterList(filter);
}

function filterList(stuFil) {
  let filteredList = allStudents;
  if (stuFil === "Slytherin") {
    filteredList = allStudents.filter(hSlytherin);
  } else if (stuFil === "Ravenclaw") {
    filteredList = allStudents.filter(hRavenclaw);
  }
  displayList(filteredList);
}
function hRavenclaw(studentData) {
  console.log(hRavenclaw);
  if (studentData.stuHouse === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function hSlytherin(studentData) {
  if (studentData.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function displayStudent(students) {
  //create clone
  const clone = document
    .querySelector("template#student-list")
    .content.cloneNode(true);

  clone.querySelector(".fn").innerText = students.fName;
  clone.querySelector(".sn").innerText = students.lName;

  clone
    .querySelector("article.students-name")
    .addEventListener("click", (e) => showDetails(students));

  //append template
  document.querySelector("main").appendChild(clone);
}

//modal
function showDetails(students) {
  console.log(students);
  modal.querySelector(".modalfname").textContent =
    students.fName + " " + students.mName + " " + students.lName;
  modal.querySelector(".modalhouse").textContent = students.house;
  modal.querySelector(".modalgender").textContent = students.gender;
  modal.classList.remove("hide");
}
const close = document.querySelector(".close");
close.addEventListener("click", () => {
  modal.classList.add("hide");
});
