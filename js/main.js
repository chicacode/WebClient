
const uri = 'https://localhost:44376/api/employees';
let todos = [];

function getItems() {
  fetch(uri)
    .then(response => response.json())
    .then(data => JSON.stringify(data))
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
  const addNameTextbox = document.getElementById('add-name');
  const addLastNameTextbox = document.getElementById('add-lastname');
  const addJobTextbox = document.getElementById('add-positionJob');
  const addSalaryTextbox = document.getElementById('add-salary');
/* Fix this shit */

  const item = {
    isComplete: false,
    name: addNameTextbox.value.trim(),
    lastName: addLastNameTextbox.value.trim(),
    positionJob: addJobTextbox.value.trim(),
    salary: parseFloat(addSalaryTextbox.value)
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response =>response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = '';
      addLastNameTextbox.value = '';
      addJobTextbox.value = '';
      addSalaryTextbox.value = '';
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
  console.log("En delete: "+ id);
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getItems())
  .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
 console.log("El id es: " + id);
  let form = document.getElementById('editForm');
  
  if (form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }

  const item = todos.find(item => item.employeeId === id);

  document.getElementById('edit-id').value = item.employeeId;
  console.log(item.employeeId);
  document.getElementById('edit-name').value = item.name;
  document.getElementById('edit-lastname').value = item.lastName;
  document.getElementById('edit-job').value = item.positionJob;
  document.getElementById('edit-salary').value = item.salary;
  document.getElementById('edit-isComplete').checked = item.isComplete;
}

function updateItem() {
  const itemId = parseInt(document.getElementById('edit-id').value);

  const item = {
    employeeId: parseInt(itemId, 10),
    name: document.getElementById('edit-name').value.trim(),
    lastName: document.getElementById('edit-lastname').value.trim(),
    positionJob: document.getElementById('edit-job').value.trim(),
    salary:  parseFloat(document.getElementById('edit-salary').value)
  };

  fetch(`${uri}/${item.employeeId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  .then(response =>response.json())
  .then(() => getItems())
  .catch(error => console.error('Unable to update item.', error));

  closeInput();

  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
  const name = (itemCount === 1) ? 'to-do' : 'to-dos';

  document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';

  const button = document.createElement('button');
  data = JSON.parse(data);
  data.forEach(item => {
    let isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.disabled = true;
    isCompleteCheckbox.checked = item.isComplete;

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${item.employeeId})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${item.employeeId})`);

    let tr = tBody.insertRow();
    
    let td1 = tr.insertCell(0);
    td1.appendChild(isCompleteCheckbox);

    let td2 = tr.insertCell(1);
    let textNode = document.createTextNode(item.employeeId);
    td2.appendChild(textNode);

    let td3 = tr.insertCell(2);
    let textNode1 = document.createTextNode(item.name);
    td3.appendChild(textNode1);

    let td4 = tr.insertCell(3);
    let textNode2 = document.createTextNode(item.lastName);
    td4.appendChild(textNode2);

    let td5 = tr.insertCell(4);
    let textNode3 = document.createTextNode(item.positionJob);
    td5.appendChild(textNode3);

    let td6 = tr.insertCell(5);
    let textNode4 = document.createTextNode(item.salary);
    td6.appendChild(textNode4);

    let td7 = tr.insertCell(6);
    td7.appendChild(editButton);

    let td8 = tr.insertCell(7);
    td8.appendChild(deleteButton);
  });

  todos = data;
}