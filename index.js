let table = document.getElementById("table");
let thead = document.createElement("thead");
let tbody = document.createElement("tbody");
let addButton = document.getElementById("add-button");
let cancelButton = document.getElementById("cancel-button");
let saveButton = document.getElementById("save-button");
let updateButton = document.getElementById("update-button");
let filter = document.getElementById("filter");
let form = document.getElementById("form");
let errorSpan = document.getElementById("error-span");

let name1 = document.getElementById("name");
let description = document.getElementById("discription");
let status1 = document.getElementById("status");
let rate = document.getElementById("rate");
let balance = document.getElementById("balance");
let deposite = document.getElementById("deposite");

//header object
let headers = {
  id: "#",
  name: "NAME",
  description: "DESCRIPTION",
  status: "STATUS",
  rate: "RATE",
  balance: "BALANCE",
  deposite: "DEPOSITE",
};

//create Table Header
function tHead() {
  table.appendChild(thead);
  let headRow = document.createElement("tr");
  thead.appendChild(headRow);
  for (const key in headers) {
    let th = document.createElement("th");
    let thText = document.createTextNode(headers[key]);
    th.appendChild(thText);
    headRow.appendChild(th);
  }
  let action = document.createElement("th");
  let actionText = document.createTextNode("ACTION");
  action.appendChild(actionText);
  headRow.appendChild(action);
}
tHead();

//get Table for Tbody
function getTableData() {
  fetch("http://localhost:3000/employee")
    .then((response) => response.json())
    .then((data) => {
      //TBody
      createTableBody(data);
    })
    .catch((error) => console.error(error));
}

//create Tbody
function createTableBody(data) {
  tbody.innerHTML = "";
  clearInput();
  table.appendChild(tbody);
  for (const iterator of data) {
    let bodyRow = document.createElement("tr");
    tbody.appendChild(bodyRow);
    for (const key in headers) {
      let td = document.createElement("td");
      let thText = document.createTextNode(iterator[key]);

      if (key == "name" || key == "id") {
        td.classList.add("bold");
      }
      if (key == "description") {
        td.classList.add("truncet-text");
      }
      if (key === "status") {
        if (iterator[key] == "error") {
          let statusSpan = document.createElement("span");
          statusSpan.textContent = iterator[key];
          statusSpan.classList.add("red");
          td.appendChild(statusSpan);
        }
        if (iterator[key] == "success") {
          let statusSpan = document.createElement("span");
          statusSpan.textContent = iterator[key];
          statusSpan.classList.add("green");
          td.appendChild(statusSpan);
        }
        if (iterator[key] == "open") {
          let statusSpan = document.createElement("span");
          statusSpan.textContent = iterator[key];
          statusSpan.classList.add("blue");
          td.appendChild(statusSpan);
        }
        if (iterator[key] == "inactive") {
          let statusSpan = document.createElement("span");
          statusSpan.textContent = iterator[key];
          statusSpan.classList.add("gray");
          td.appendChild(statusSpan);
        }
      } else {
        td.appendChild(thText);
      }
      if (key == "rate" || key == "deposite") {
        td.textContent = "$" + iterator[key];
      }
      if (key == "balance") {
        if (Number(iterator[key]) < 0) {
          td.classList.add("negative");
          td.textContent = "-$" + Number(iterator[key]) * -1;
        } else {
          td.classList.add("positive");
          td.textContent = "$" + iterator[key];
        }
      }
      bodyRow.appendChild(td);
    }
    let td = document.createElement("td");
    let deleteButton = document.createElement("button");
    let deleteText = document.createTextNode("Delete");
    deleteButton.appendChild(deleteText);
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      deleteEmpolyee(iterator.id);
      getTableData();
    });
    td.appendChild(deleteButton);

    let editButton = document.createElement("button");
    let editText = document.createTextNode("Edit");
    editButton.appendChild(editText);
    editButton.className = "editButton";
    editButton.addEventListener("click", (event) => {
      event.preventDefault();
      editEmployee(iterator);
    });
    td.appendChild(editButton);
    bodyRow.appendChild(td);
  }
}

//send Data
async function sendData() {
  let request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name1.value,
      description: description.value,
      status: status1.value,
      rate: rate.value,
      balance: balance.value,
      deposite: deposite.value,
    }),
  };

  try {
    await fetch("http://localhost:3000/employee", request);
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

//To Delete Employee
function deleteEmpolyee(id) {
  fetch(`http://localhost:3000/employee/${id}`, { method: "DELETE" }).catch(
    (error) => console.error(error)
  );
}

//To Update Employee
function editEmployee(empData) {
  if ((form.style.display = "none")) {
    form.style.display = "flex";
  }

  name1.value = empData.name;
  description.value = empData.description;
  status1.value = empData.status;
  rate.value = empData.rate;
  balance.value = empData.balance;
  deposite.value = empData.deposite;

  updateButton.removeAttribute("disabled");
  cancelButton.setAttribute("disabled", "disabled");
  saveButton.setAttribute("disabled", "disabled");

  updateButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (
      validateName(name1.value) &&
      validateDescription(description.value) &&
      validateStatus(status1.value) &&
      validateRate(rate.value) &&
      validateBalance(balance.value) &&
      validateDeposite(deposite.value)
    ) {
      let updatedEmpData = {
        name: name1.value,
        description: description.value,
        status: status1.value,
        rate: rate.value,
        balance: balance.value,
        deposite: deposite.value,
      };

      fetch(`http://localhost:3000/employee/${empData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmpData),
      }).catch((error) => console.error(error));
      updateButton.setAttribute("disabled", "disabled");
      cancelButton.removeAttribute("disabled");
      saveButton.removeAttribute("disabled");
      errorSpan.textContent = "";
      console.log(errorSpan);
      noBorder();
      getTableData();
    } else {
      errorSpan.textContent = "Enter Valid Data";
    }
  });
}

//get Filter Options
function getFilterOptions() {
  //   fetch("http://localhost:3000/employee")
  //     .then((response) => response.json())
  //     .then((data) => {
  //         let newData = data.map((element) => element.status);
  //       // console.log(newData);
  //       let options = new Set(newData);
  //       // console.log(options);
  //       for (const iterator of options) {
  //         let option = document.createElement("option");
  //         let text = document.createTextNode(iterator);
  //         option.appendChild(text);
  //         filter.append(option);
  //       }
  //     })
  //     .catch((error) => console.error(error));

  const options = document.querySelectorAll("#status option");
  for (let i = 1; i < options.length; i++) {
    let option = document.createElement("option");
    // option.classList.add("p-20");
    let text = document.createTextNode(options[i].value);
    option.appendChild(text);
    filter.append(option);
  }
}

//romve border for input text
function noBorder() {
  name1.style.border = "";
  description.style.border = "";
  status1.style.border = "";
  rate.style.border = "";
  balance.style.border = "";
  deposite.style.border = "";
}

function clearInput() {
  name1.value = "";
  description.value = "";
  status1.value = "";
  rate.value = "";
  balance.value = "";
  deposite.value = "";
}

//data not found message
function dataNotFound() {
  tbody.innerHTML = "";
  tbody.className = "center-text";
  table.appendChild(tbody);
  let bodyRow = document.createElement("tr");
  bodyRow.style.backgroundColor = "#ebf0fa";
  bodyRow.appendChild(document.createTextNode("*No Data Found*"));
  tbody.appendChild(bodyRow);

  // tbody.innerHTML = "";
  // table.removeChild(tbody);
  // let message = document.createElement("div");
  // message.className = "center-text";
  // message.style.backgroundColor = "#ebf0fa";
  // message.appendChild(document.createTextNode("*No Data Found*"));
  // tableContainer.appendChild(message);
}

//span Error
function addErrorMessage(containerElement, errorMessage) {
  let errorSpan = document.createElement("span");
  errorSpan.innerHTML = errorMessage;
  errorSpan.style.color = "red";
  errorSpan.style.fontSize = "12px";
  errorSpan.style.paddingTop = "2px";
  containerElement.appendChild(errorSpan);
}

//remove Span
function removeSpan(div) {
  let span = div.querySelector("span");
  if (span) {
    div.removeChild(span);
  }
}

//name validation
function validateName(value) {
  let nameDiv = document.querySelector(".name-div");
  removeSpan(nameDiv);
  name1.style.border = "1px solid green";
  if (value.length <= 3) {
    name1.style.border = "1px solid red";
    addErrorMessage(nameDiv, "Name must be greater that 3 character");
  } else if (value.length >= 25) {
    name1.style.border = "1px solid red";
    addErrorMessage(nameDiv, "Name must be less that 25 character");
  } else if (!value.trim().match(/^[a-zA-Z]*$/)) {
    name1.style.border = "1px solid red";
    addErrorMessage(nameDiv, "Name must contain alphabets only");
  } else {
    return true;
  }
}

//description validation
function validateDescription(value) {
  let discriptionDiv = document.querySelector(".discription-div");
  removeSpan(discriptionDiv);
  description.style.border = "1px solid green";
  if (value.length <= 3) {
    description.style.border = "1px solid red";
    addErrorMessage(
      discriptionDiv,
      "Discription must be greater that 3 character"
    );
  } else if (value.length >= 150) {
    description.style.border = "1px solid red";
    addErrorMessage(
      discriptionDiv,
      "Discription must be less that 150 character"
    );
  } else if (!value.trim().match(/^[a-zA-Z\s]*$/)) {
    description.style.border = "1px solid red";
    addErrorMessage(discriptionDiv, "Discription must contain alphabets only");
  } else {
    return true;
  }
}

//status validation
function validateStatus(value) {
  let statusDiv = document.querySelector(".status-div");
  removeSpan(statusDiv);
  status1.style.border = "1px solid green";
  if (value.length == "") {
    addErrorMessage(statusDiv, "Select status");
    status1.style.border = "1px solid red";
  } else {
    return true;
  }
}

//Rate Validation
function validateRate(value) {
  let rateDiv = document.querySelector(".rate-div");
  removeSpan(rateDiv);
  rate.style.border = "1px solid green";
  if (value.length < 1) {
    addErrorMessage(rateDiv, "Enter rate");
    rate.style.border = "1px solid red";
  } else if (!value.trim().match(/^\d*\.?\d+$/)) {
    addErrorMessage(rateDiv, "Enter number only");
    rate.style.border = "1px solid red";
  } else {
    return true;
  }
}

//Date Validation
function validateBalance(value) {
  let balanceDiv = document.querySelector(".balance-div");
  removeSpan(balanceDiv);
  balance.style.border = "1px solid green";
  if (value.length < 1) {
    addErrorMessage(balanceDiv, "Enter balance");
    balance.style.border = "1px solid red";
  } else if (!value.trim().match(/^-?\d*\.{0,1}\d+$/)) {
    addErrorMessage(balanceDiv, "Enter number only");
    balance.style.border = "1px solid red";
  } else {
    return true;
  }
}

//Deposite Validation
function validateDeposite(value) {
  let depositeDiv = document.querySelector(".deposite-div");
  removeSpan(depositeDiv);
  deposite.style.border = "1px solid green";
  if (value.length < 1) {
    addErrorMessage(depositeDiv, "Enter balance");
    deposite.style.border = "1px solid red";
  } else if (!value.trim().match(/^\d*\.?\d+$/)) {
    addErrorMessage(depositeDiv, "Enter number only");
    deposite.style.border = "1px solid red";
  } else {
    return true;
  }
}

name1.addEventListener("keyup", (e) => {
  e.preventDefault();
  validateName(name1.value);
});

description.addEventListener("keyup", (e) => {
  e.preventDefault();
  validateDescription(description.value);
});

status1.addEventListener("change", (e) => {
  e.preventDefault();
  validateStatus(status1.value);
});

rate.addEventListener("keyup", (e) => {
  e.preventDefault();
  validateRate(rate.value);
});

balance.addEventListener("keyup", (e) => {
  e.preventDefault();
  validateBalance(balance.value);
});

deposite.addEventListener("keyup", (e) => {
  e.preventDefault();
  validateDeposite(deposite.value);
});

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  form.style.display = "flex";
  addButton.setAttribute("disabled", "disabled");
});

cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  form.style.display = "none";
  addButton.removeAttribute("disabled");
});

filter.addEventListener("change", (e) => {
  e.preventDefault();
  fetch("http://localhost:3000/employee")
    .then((response) => response.json())
    .then((data) => {
      let newData = data.filter(
        (item) => filter.value == "all" || item.status == filter.value
      );
      //   console.log(newData);
      if (newData.length == 0) {
        dataNotFound();
      } else {
        createTableBody(newData);
      }
    });
});

saveButton.addEventListener("click", (e) => {
  console.log("saveButton");
  e.preventDefault();
  if (
    validateName(name1.value) &&
    validateDescription(description.value) &&
    validateStatus(status1.value) &&
    validateRate(rate.value) &&
    validateBalance(balance.value) &&
    validateDeposite(deposite.value)
  ) {
    errorSpan.textContent = "";
    sendData();
    noBorder();
    getTableData();
  }
});

window.onload = onWinowload();
function onWinowload() {
  addButton.setAttribute("disabled", "disabled");
  getFilterOptions();
  getTableData();
}
