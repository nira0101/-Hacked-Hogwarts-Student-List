"use strict";

window.addEventListener("DOMContentLoaded", init);

let allStudents = [];

//prototype for all students

function init() {
  fetchData();
  /*   filterButton(); */
}
async function fetchData() {
  console.log(fetchData);
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();

  //when loaded prepare data object
  prepareData(jsonData);
}

function prepareData(jsonData) {
  allStudents = jsonData.map(prepareObject);
  displayList(allStudents);
  buttonClicked();
}

function prepareObject(stu) {
  console.log(stu);
  const Student = {
    fname: "",
    mname: "",
    lname: "",
    house: "",
    gender: "",
  };

  const studentData = Object.create(Student);
  console.log(studentData);

  //split the full details into parts
  const infoSplit = stu.fullname.trim().split(" ");
  const stuFName = stu.fName;
  const stuMName = stu.mName;
  const stuLName = stu.lName;
  const stuHouse = stu.house.trim();
  const stuGender = stu.gender;
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

  return studentData;
}

function displayList(st) {
  //console.log(displayList);
  //cleat the list
  document.querySelector("main").innerHTML = "";

  //create new list
  st.forEach(displayStudent);
}

function buttonClicked() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((btn) => btn.addEventListener("click", filterCategory));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((btn) => btn.addEventListener("click", sortCategory));
}

function sortCategory(event) {
  const sort = event.target.dataset.sort;
  console.log(sort, "?");

  sortBy(sort);
}

function filterCategory(event) {
  const filter = event.target.dataset.filter;
  console.log(filter, "?");

  filteredList(filter);
}

function filteredList(filteredBy) {
  let filteredCategory = allStudents;
  if (filteredBy === "Ravenclaw") {
    filteredCategory = allStudents.filter(isRavenclaw);
  } else if (filteredBy === "Gryffindor") {
    filteredCategory = allStudents.filter(isGryffindor);
  } else if (filteredBy === "Slytherin") {
    filteredCategory = allStudents.filter(isSlytherin);
  } else if (filteredBy === "Hufflepuff") {
    filteredCategory = allStudents.filter(isHufflepuff);
  } else {
    console.log("bye");
  }

  displayList(filteredCategory);
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

// sort by name
function sortBy(sortedBy) {
  let sorted = allStudents;

  if (sortedBy === "firstname") {
    sorted = allStudents.sort(sortByFirstName);
  } else if (sortedBy === "lastname") {
    sorted = allStudents.sort(sortByLastName);
  }

  displayList(sorted);
}

function sortByFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}

function sortByLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

function displayStudent(students) {
  //create clone
  const clone = document
    .querySelector("template#students")
    .content.cloneNode(true);

  clone.querySelector(".fn").textContent = students.fName;
  clone.querySelector(".sn").textContent = students.lName;

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
const modal = document.querySelector(".modal-background");
close.addEventListener("click", () => {
  modal.classList.add("hide");
});
