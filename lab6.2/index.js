const apiBase = 'http://test3.is.op.edu.ua/api/Pet';

async function fetchPets() {
  const pets = await (await fetch(apiBase)).json();
  displayPets(pets);
}

function displayPets(pets) {
  const petList = document.getElementById('pet-list');
  petList.innerHTML = '';
  pets.forEach((pet) => {
    const petRow = document.createElement('div');
    petRow.className = 'pet-row';

    const nameElement = document.createElement('div');
    nameElement.textContent = pet.name;

    const typeElement = document.createElement('div');
    typeElement.textContent = pet.type;

    const ageElement = document.createElement('div');
    ageElement.textContent = `${pet.age} years`;

    const actionElement = document.createElement('div');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => openModal(pet);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deletePet(pet.id);

    actionElement.appendChild(editButton);
    actionElement.appendChild(deleteButton);

    petRow.appendChild(nameElement);
    petRow.appendChild(typeElement);
    petRow.appendChild(ageElement);
    petRow.appendChild(actionElement);

    petList.appendChild(petRow);
  });
}

function openModal(pet = null) {
  const modal = document.getElementById('modal');
  const petForm = document.getElementById('pet-form');
  const nameInput = document.getElementById('pet-name');
  const ageInput = document.getElementById('pet-age');

  nameInput.value = pet ? pet.name : '';
  ageInput.value = pet ? pet.age : '';

  const typeWrapper = document.getElementById('pet-type-wrapper');
  if (!pet && !typeWrapper) {
    const newTypeWrapper = document.createElement('div');
    newTypeWrapper.id = 'pet-type-wrapper';
    newTypeWrapper.innerHTML = `
      <label for="pet-type">Type:</label>
      <input type="text" id="pet-type">
    `;
    petForm.insertBefore(newTypeWrapper, petForm.querySelector('button[type="submit"]'));
  }

  if (typeWrapper && pet) typeWrapper.remove();

  petForm.onsubmit = (e) => {
    e.preventDefault();
    const typeInput = document.getElementById('pet-type')?.value.trim();
    pet
      ? updatePet(pet.id, nameInput.value.trim(), parseInt(ageInput.value, 10))
      : createPet(nameInput.value.trim(), parseInt(ageInput.value, 10), typeInput);
  };

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

async function createPet(name, age, type) {
  await fetch(apiBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age, type }),
  });
  closeModal();
  fetchPets();
}

async function updatePet(id, name, age) {
  await fetch(`${apiBase}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age }),
  });
  closeModal();
  fetchPets();
}

async function deletePet(id) {
  await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  fetchPets();
}

document.getElementById('add-pet-btn').onclick = () => openModal();
document.getElementById('close-modal').onclick = closeModal;

fetchPets();
