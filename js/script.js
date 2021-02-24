"use strict";

window.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const data = await response.json();

  prepareData(data);
}

let allStudents = [];

const settings = {
  filter: "",
  sortBy: "",
};

function prepareData(data) {
  allStudents = data.map(formatData);

  displayList(allStudents);
  buttonClicked();
}

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickname: "",
};
// here's all the students
function formatData(stu) {
  const student = Object.create(Student);

  const removeSpace = stu.fullname.trim();
  const firstSpace = removeSpace.indexOf(" ");
  const lastSpace = removeSpace.lastIndexOf(" ");

  // first name of the student
  const firstNameOnly =
    removeSpace.substring(0, firstSpace) || removeSpace.substring(0);
  student.firstName =
    firstNameOnly.substring(0, 1).toUpperCase() +
    firstNameOnly.substring(1).toLowerCase();
  // console.log(`First name _${student.firstName}_`)

  // middle name and nickname
  const middleNameOnly = removeSpace.substring(firstSpace + 1, lastSpace);
  if (removeSpace.includes('"')) {
    const removeQuotes = middleNameOnly.split('"').join("");
    student.nickname =
      removeQuotes.substring(0, 1).toUpperCase() +
      removeQuotes.substring(1).toLowerCase();
  } else if (middleNameOnly.length > 2) {
    student.middleName =
      middleNameOnly.substring(0, 1).toUpperCase() +
      middleNameOnly.substring(1).toLowerCase();
  } else {
    student.nickname = undefined;
    student.middleName = undefined;
  }

  // last name
  if (removeSpace.includes(" ")) {
    const lastNameOnly = removeSpace.substring(lastSpace + 1);
    if (lastNameOnly.includes("-")) {
      const hyphen = lastNameOnly.indexOf("-");
      student.lastName =
        lastNameOnly.substring(0, 1).toUpperCase() +
        lastNameOnly.substring(1, hyphen).toLowerCase() +
        lastNameOnly.substring(hyphen, hyphen + 2).toUpperCase() +
        lastNameOnly.substring(hyphen + 2).toLowerCase();
    } else {
      student.lastName =
        lastNameOnly.substring(0, 1).toUpperCase() +
        lastNameOnly.substring(1).toLowerCase();
    }
  } else {
    student.lastName = undefined;
  }

  // gender
  student.gender =
    stu.gender.substring(0, 1).toUpperCase() +
    stu.gender.substring(1).toLowerCase();

  // house
  const removeHouseSpace = stu.house.trim();
  student.house =
    removeHouseSpace.substring(0, 1).toUpperCase() +
    removeHouseSpace.substring(1).toLowerCase();

  return student;
}

// filter by house
function buttonClicked() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((btn) => btn.addEventListener("click", filterCategory));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((btn) => btn.addEventListener("click", sortCategory));
}

// filter by house button targeted ii
function filterCategory(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

// filter by house i
function filterList(filteredList) {
  filteredList = allStudents.filter(isHouse);

  function isHouse(student) {
    if (settings.filterBy === student.house || settings.filterBy === "all") {
      return true;
    } else {
      return false;
    }
  }
  console.log(filteredList, "filtered list");
  return filteredList;
}

// sort by name button targeted ii
function sortCategory(event) {
  const sort = event.target.dataset.sort;

  setSort(sort);
}

function setSort(sortedBy) {
  settings.sortedBy = sortedBy;
  buildList();
}

// sort by name i
function sortBy(sortedList) {
  sortedList = allStudents;

  if (settings.sortedBy === "firstname") {
    return allStudents.sort(sortByFirstName);
  } else if (settings.sortedBy === "lastname") {
    return allStudents.sort(sortByLastName);
  }
  console.log(sortedList, "sorted list");
  return sortedList;
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

function buildList() {
  const sortingList = sortBy(allStudents);
  const currentList = filterList(sortingList);

  displayList(currentList);
}

// display data
function displayList(s) {
  console.log(s);
  document.querySelector("main").innerHTML = "";
  s.forEach(divideStudents);
}

function divideStudents(student) {
  //create clone
  const clone = document
    .querySelector("template#students")
    .content.cloneNode(true);

  clone.querySelector(".fn").textContent = student.firstName;
  clone.querySelector(".sn").textContent = student.lastName;

  clone
    .querySelector("article.students-name")
    .addEventListener("click", (e) => showDetails(student));

  //append template
  document.querySelector("main").appendChild(clone);
}
//modal
function showDetails(student) {
  console.log(student);

  modal.querySelector(".modalfname").textContent = student.firstName;
  let midName = (modal.querySelector(".modalmname").textContent =
    student.middleName);
  modal.querySelector(".modallname").textContent = student.lastName;

  if (student == midName) {
    modal.querySelector(".modalfullname").textContent =
      student.firstName + " " + student.middleName + " " + student.lastName;
  } else {
    modal.querySelector(".modalfname").textContent =
      student.firstName + " " + student.lastName;
  }

  modal.querySelector(".modalhouse").textContent = student.house;
  modal.querySelector(".modalgender").textContent = student.gender;
  modal.classList.remove("hide");
}
const close = document.querySelector(".close");
const modal = document.querySelector(".modal-background");
close.addEventListener("click", () => {
  modal.classList.add("hide");
});
