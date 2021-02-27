"use strict";

window.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const data = await response.json();

  const respons1 = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  bloodstatus = await respons1.json();

  document.querySelector("#hack").addEventListener("click", hackTheSystem);

  prepareData(data);
}

let allStudents = [];
let expelledList = [];
let selectedStudent;
let studentsOnDisplay;
let bloodstatus;
let systemHacked = false;

const settings = {
  filterBy: "all",
  sortBy: "",
};

const search = document.querySelector(".search-txt");
search.addEventListener("input", searchStudent);

function prepareData(data) {
  allStudents = data.map(prepareObj);

  /*   displayList(allStudents); */
  buildList();
  buttonClicked();
  totalNumberOfStudents();
}

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickname: "",
  photo: "",
  prefect: false,
  expelled: false,
  squad: false,
  bloodstatus: "",
};

function searchStudent(event) {
  let searchList = allStudents.filter((student) => {
    let searchname = "";
    if (student.lastName === null) {
      searchname = student.firstName;
    } else {
      searchname = student.firstName + " " + student.lastName;
    }
    return searchname.toLowerCase().includes(event.target.value);
  });

  displayList(searchList);
}
// here's all the students
function prepareObj(stu) {
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

  student.bloodstatus = bloodStatusStudent(student);

  return student;
}
function bloodStatusStudent(student) {
  if (bloodstatus.half.indexOf(student.lastName) != -1) {
    return "Half-blood";
  } else if (bloodstatus.pure.indexOf(student.lastName) != -1) {
    return "Pure-blood";
  } else {
    return "Muggle-born";
  }
}
// filter by house
function buttonClicked() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((btn) => btn.addEventListener("click", filterCategory));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((btn) => btn.addEventListener("click", sortCategory));

  document
    .querySelector("[data-filter='expelled']")
    .addEventListener("click", showExpelled);
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
function filterList(inputList) {
  const filteredList = inputList.filter(isHouse);

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
  /*  console.log(sortedList, "sorted list"); */
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
function displayList(listData) {
  /* console.log(s); */
  document.querySelector("main").innerHTML = "";
  listData.forEach(divideStudents);

  //add expellbutton

  listOfStudentsDisplayed(listData);
}

function divideStudents(student) {
  //create clone
  const clone = document
    .querySelector("template#students")
    .content.cloneNode(true);

  numberOfStudentsPerHouse(student);

  clone.querySelector(".fn").textContent = student.firstName;
  clone.querySelector(".sn").textContent = student.lastName;

  //winner
  if (student.prefect === true) {
    clone.querySelector(".fn").classList.add("prefectsymbol");
  } else if (student.prefect === false) {
    clone.querySelector(".fn").classList.remove("prefectsymbol");
  }

  //prefect
  clone.querySelector(".prefect").dataset.prefect = student.prefect;
  clone.querySelector(".prefect").addEventListener("click", appointPrefect);
  function appointPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else if (student.expelled === true) {
      alert("something is wrong");
    } else {
      tryToAppointPrefect(student);
    }
    buildList();
  }

  clone
    .querySelector("article.students-name")
    .addEventListener("click", (e) => showDetails(student));

  //append template
  document.querySelector("main").appendChild(clone);
}

//appoint prefect if allowed
function tryToAppointPrefect(selectedStudent) {
  //already selected prefects
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;
  const prefectsSameHouse = prefects.filter(prefectInHouse);

  function prefectInHouse(student) {
    if (student.house === selectedStudent.house && student.prefect) {
      return true;
    } else {
      return false;
    }
  }

  //check if there're already two prefect from selected students house
  if (prefectsSameHouse.length == 2) {
    stopOrRemoveAPrefect(prefectsSameHouse[0], prefectsSameHouse[1]);
  } else {
    appointPrefect(selectedStudent);
  }

  function stopOrRemoveAPrefect(prefectA, prefectB) {
    document.querySelector("#removeprefect").classList.remove("hide");
    document
      .querySelector("#removeprefect .closebutton")
      .addEventListener("click", closeWarning);
    document.querySelector("#removeprefect #prefectA").textContent =
      prefectA.firstName;
    document.querySelector("#removeprefect #prefectB").textContent =
      prefectB.firstName;
    document
      .querySelector("#removeprefect #prefectA")
      .addEventListener("click", removePrefectA);
    document
      .querySelector("#removeprefect #prefectB")
      .addEventListener("click", removePrefectB);

    function closeWarning() {
      document.querySelector("#removeprefect").classList.add("hide");
      document
        .querySelector("#removeprefect .closebutton")
        .removeEventListener("click", closeWarning);

      document
        .querySelector("#removeprefect #prefectA")
        .removeEventListener("click", removePrefectA);
      document
        .querySelector("#removeprefect #prefectB")
        .removeEventListener("click", removePrefectB);
    }
    function removePrefectA() {
      removePrefect(prefectA);
      appointPrefect(selectedStudent);
      buildList();
      closeWarning();
    }

    function removePrefectB() {
      removePrefect(prefectB);
      appointPrefect(selectedStudent);
      buildList();
      closeWarning();
    }
  }

  function removePrefect(student) {
    student.prefect = false;
  }
  function appointPrefect(student) {
    student.prefect = true;
  }
}

//modal
function showDetails(student) {
  console.log(student);

  modal.querySelector(".modalfname").textContent =
    student.firstName + student.lastName;
  modal.querySelector(".modalblood").textContent = student.bloodstatus;

  modal.querySelector(".btn").addEventListener("click", clickExpel);

  function clickExpel() {
    if (student.expelled === true) {
      student.expelled = false;
    } else {
      tryToExpelStudent(student);
    }
    //buildList();
  }

  let banner_img = document.querySelector(".banner img");
  if (student.house === "Ravenclaw") {
    banner_img.src = "../images/banner_ravenclaw.jpg";
  } else if (student.house === "Gryffindor") {
    banner_img.src = "../images/banner_gryffindor.jpg";
  } else if (student.house === "Slytherin") {
    banner_img.src = "../images/banner_slytherin.jpg";
  } else if (student.house === "Hufflepuff") {
    banner_img.src = "../images/banner_hufflepuff.jpg";
  }

  /*  modal.querySelector(".modalfname").textContent =
    student.firstName + " " + student.middleName + " " + student.lastName;
 */
  // our data
  const images = "../images/" + student.lastName;
  const img_path =
    "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";

  // images
  if (
    student.firstName === "Justin" ||
    student.firstName === "Padma" ||
    student.firstName === "Parvati" ||
    student.firstName === "Leanne" ||
    student.lastName === "d"
  ) {
    modal.querySelector(".modal-img").classList.add("empty");
    modal.querySelector("img").remove();
  } else {
    modal.querySelector("img").src = images + img_path;
  }

  //insquad
  if (student.squad != true) {
    document.querySelector("#insquad").classList.remove("clickedbutton");
  } else {
    document.querySelector("#insquad").classList.add("clickedbutton");
  }
  document.querySelector("#insquad").addEventListener("click", toggleSquad);

  modal.querySelector(".modalhouse").textContent = student.house;
  modal.querySelector(".modalgender").textContent = student.gender;
  modal.classList.remove("hide");
  selectedStudent = student;
}

//expelled
function tryToExpelStudent(student) {
  let dialog = document.querySelector("#askExpell");

  dialog.classList.remove("hide");
  dialog.querySelector("#expell").addEventListener("click", clickExpelStudent);
  dialog.querySelector("#close").addEventListener("click", closeExpellDialog);

  function clickExpelStudent() {
    dialog.classList.add("hide");
    dialog
      .querySelector("#expell")
      .removeEventListener("click", clickExpelStudent);
    dialog
      .querySelector("#close")
      .removeEventListener("click", closeExpellDialog);

    student.expelled = true;
    expelledList.push(student);
    console.log(allStudents.filter((student) => student.expelled === false));
    allStudents = allStudents.filter((student) => student.expelled === false);
    document.querySelector(".expelled_students p").textContent =
      expelledList.length;

    displayList(allStudents);
    closeExpellDialog();
  }

  function closeExpellDialog() {
    dialog.classList.add("hide");
    dialog
      .querySelector("#expell")
      .removeEventListener("click", clickExpelStudent);
    dialog
      .querySelector("#close")
      .removeEventListener("click", closeExpellDialog);
  }
}

function showExpelled() {
  console.log(expelledList);
  console.log(allStudents);
  displayList(expelledList);
}

/* function expell() {
  if (selectedStudent.lastname != "Grøn") {
    //removes expelled student form allStudents list
    if (selectedStudent.expelled === false) {
      allStudents.splice(allStudents.indexOf(selectedStudent), 1);
      selectedStudent.expelled = true;
      selectedStudent.prefect = false;
      selectedStudent.squad = false;
      expelledStudents.push(selectedStudent);
      document.querySelector("#expellbtn").classList.add(".clickedbutton");
         document.querySelector("#prefectbtn").classList.remove(".clickedbutton");
      document.querySelector("#isbtn").classList.remove("clickedbutton");
      console.log("expell");
    } else {
      alert("This student is allready expelled!");
      console.log("This student is allready expelled");
    }
  } else {
    alert(
      `Sorry bro! Can't expell ${selectedStudent.firstname} "${selectedStudent.nickname}" ${selectedStudent.lastname}! 😝`
    );
  }

  buildList();
} */

//insquad
function toggleSquad() {
  console.log("toggle squad");
  const index = allStudents.indexOf(selectedStudent);
  if (selectedStudent.expelled === false) {
    if (selectedStudent.squad === false) {
      houseSquadCheck();
    } else {
      removeSquad();
    }
  } else {
    alert(
      "This student is expelled! An expelled students can't be a part of the Inquisitorial Squad!"
    );
  }

  function houseSquadCheck() {
    console.log("chekking for house squads");
    if (
      selectedStudent.bloodstatus === "Pure-blood" &&
      selectedStudent.house === "Slytherin"
    ) {
      makeSquad();
    } else {
      alert(
        "Only pure-blooded students from Slytherin can join the Inquisitorial Squad! 🐍"
      );
    }
  }

  function makeSquad() {
    if (systemHacked === true) {
      setTimeout(function () {
        toggleSquad();
      }, 1000);
    }
    allStudents[index].squad = true;
    document.querySelector("#insquad").classList.add("clickedbutton");
  }

  function removeSquad() {
    console.log(removeSquad);
    document.querySelector("#insquad").classList.remove("clickedbutton");
    if (systemHacked === true) {
      setTimeout(function () {
        alert("This System Has been ha-ha-Ha-C-K_ED");
      }, 100);
      alert("This System Has been ha-ha-Ha-C-K_ED");
    }
    allStudents[index].squad = false;
  }
}

const close = document.querySelector(".close");
const modal = document.querySelector(".modal-background");
close.addEventListener("click", () => {
  modal.classList.add("hide");
});

//number od students and housed

function totalNumberOfStudents() {
  document.querySelector(".students_total p").textContent = allStudents.length;
}

function listOfStudentsDisplayed(Student) {
  // data
  document.querySelector(".total-list-number p").textContent = Student.length;
}

function expelledStudentsNumber(Student) {
  document.querySelector(".expelled_students p").textContent = expelled.length;
}

function numberOfStudentsPerHouse(student) {
  const resultS = allStudents.filter(isSlytherin);
  const resultG = allStudents.filter(isGryffindor);
  const resultR = allStudents.filter(isRavenclaw);
  const resultH = allStudents.filter(isHufflepuff);

  let finalResultS = [];
  let finalResultGryffindor = [];
  let finalResultRavenclaw = [];
  let finalResultHufflepuff = [];

  function isSlytherin(student) {
    if (student.house === "Slytherin") {
      return true;
    } else {
      return false;
    }
  }

  function isGryffindor(student) {
    if (student.house === "Gryffindor") {
      return true;
    } else {
      return false;
    }
  }

  function isRavenclaw(student) {
    if (student.house === "Ravenclaw") {
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

  finalResultS.push(resultS);
  finalResultGryffindor.push(resultG);
  finalResultRavenclaw.push(resultR);
  finalResultHufflepuff.push(resultH);

  for (let i = 0; i < finalResultS.length; i++) {
    let text = finalResultS[i];
    console.log(text.length);
    document.querySelector(".slytherin_tl p").textContent = text.length;
  }

  for (let i = 0; i < finalResultGryffindor.length; i++) {
    let text = finalResultGryffindor[i];
    console.log(text.length);
    document.querySelector(".gryffindor_tl p").textContent = text.length;
  }

  for (let i = 0; i < finalResultRavenclaw.length; i++) {
    let text = finalResultRavenclaw[i];
    console.log(text.length);
    document.querySelector(".ravenclaw_tl p").textContent = text.length;
  }

  for (let i = 0; i < finalResultHufflepuff.length; i++) {
    let text = finalResultHufflepuff[i];
    console.log(text.length);
    document.querySelector(".hufflepuff_tl p").textContent = text.length;
  }
}

//hacked
function hackTheSystem() {
  if (systemHacked === false) {
    //add me to studentlist
    console.log("You have been hacked!");
    const hacked = Object.create(Student);
    hacked.firstName = "Nirajan";
    hacked.lastName = "Shrestha";
    hacked.middleName = null;
    hacked.nickname = "The Hacker";
    hacked.photo = "thomas_d.png";
    hacked.house = "Hufflepuff";
    hacked.gender = "boy";
    hacked.prefect = false;
    hacked.expelled = false;
    hacked.bloodstatus = "Pure-blood";
    hacked.squad = false;
    hackedBloodstatus();
    allStudents.unshift(hacked);
    console.log(Student);

    //fuck up blood-status
    systemHacked = true;

    buildList();
    setTimeout(function () {
      alert("The Dark Lord is back, you have been hacked!!! ☠ ☠ ☠");
    }, 100);
  } else {
    alert("Wuups.. System's allready been hacked!");
  }
}

function hackedBloodstatus() {
  allStudents.forEach((student) => {
    if (student.bloodstatus === "Muggle-born") {
      student.bloodstatus = "Pure-blood";
    } else if (student.bloodstatus === "Half-blood") {
      student.bloodstatus = "Pure-blood";
    } else {
      let bloodNumber = Math.floor(Math.random() * 3);
      if (bloodNumber === 0) {
        student.bloodstatus = "Muggle-born";
      } else if (bloodNumber === 1) {
        student.bloodstatus = "Half-blood";
      } else {
        student.bloodstatus = "Pure-blood";
      }
    }
  });
}
