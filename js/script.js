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
  filterBy: "all",
  sortBy: "",
};

function prepareData(data) {
  allStudents = data.map(formatData);

  /*   displayList(allStudents); */
  buildList();
  buttonClicked();
}

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickname: "",
  photo: "",
  prefect: false,
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
function displayList(s) {
  /* console.log(s); */
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

  /*   modal.querySelector("[data-field=expel]").dataset.expel =
    student.expelStudent;
  modal
    .querySelector("[data-field=expel]")
    .addEventListener("click", expelStudentNow);

  function expelStudentNow(event) {
    if (student.expelStudent === true) {
      student.expelStudent = false;
      event.target.textContent = "Expel student";
    } else {
      student.expelStudent = true;
      event.target.textContent = "Student expelled";
      event.target.classList.add(".active");
    }
  } */

  /* modal.querySelector(".prefect").addEventListener("click", decidePrefect);

  function decidePrefect(event) {
    if (student.nonPrefect === true) {
      student.nonPrefect = false;
      event.target.textContent = "Prefect";
    } else {
      student.nonPrefect = true;
      event.target.textContent = "Non-Prefect";
    }
  }
 */
  /*  modal.querySelector(".add").addEventListener("click", decideMember); */

  /* function decideMember(event) {
    if (student.nonSquad === true) {
      student.nonSquad = false;
      event.target.textContent = "Inquisitorial Squad Member";
    } else {
      student.nonSquad = true;
      event.target.textContent = "Non-Inquisitorial Squad Member";
    }
  } */

  modal.querySelector(".modalhouse").textContent = student.house;
  modal.querySelector(".modalgender").textContent = student.gender;
  modal.classList.remove("hide");
}

const close = document.querySelector(".close");
const modal = document.querySelector(".modal-background");
close.addEventListener("click", () => {
  modal.classList.add("hide");
});
