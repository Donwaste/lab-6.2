const apiBase = 'http://test3.is.op.edu.ua/api/Pet';

async function fetchPets() {
  try {
    const response = await fetch(apiBase);
    if (!response.ok) throw new Error(`Помилка завантаження: ${response.status}`);
    const pets = await response.json();
    displayPets(pets);
  } catch (error) {
    console.error('Помилка при отриманні списка петів:', error);
  }
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
  const typeWrapper = document.getElementById('pet-type-wrapper');

  if (pet) {
    nameInput.value = pet.name;
    ageInput.value = pet.age;

    if (typeWrapper) typeWrapper.remove();

    petForm.onsubmit = (e) => {
      e.preventDefault();
      updatePet(pet.id, nameInput.value.trim(), parseInt(ageInput.value, 10));
    };
  } else {
    nameInput.value = '';
    ageInput.value = '';

    if (!typeWrapper) {
      const newTypeWrapper = document.createElement('div');
      newTypeWrapper.id = 'pet-type-wrapper';
      newTypeWrapper.innerHTML = `
        <label for="pet-type">Type:</label>
        <input type="text" id="pet-type" required>
      `;
      petForm.insertBefore(newTypeWrapper, petForm.querySelector('button[type="submit"]'));
    }

    petForm.onsubmit = (e) => {
      e.preventDefault();
      const typeInput = document.getElementById('pet-type');
      createPet(nameInput.value.trim(), parseInt(ageInput.value, 10), typeInput.value.trim());
    };
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

async function createPet(name, age, type) {
  try {
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, type }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.errors) {
        handleErrors(errorData.errors);
      }
      throw new Error(`Помилка створення: ${response.status}`);
    }

    console.log('Пета додано');
    closeModal();
    fetchPets();
  } catch (error) {
    console.error('Помилка при додаванні пета:', error);
  }
}

async function updatePet(id, name, age) {
  try {
    const response = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.errors) {
        handleErrors(errorData.errors); 
      }
      throw new Error(`Помилка оновлення: ${response.status}`);
    }

    console.log('Пет оновлений');
    closeModal();
    fetchPets();
  } catch (error) {
    console.error('Помилка при оновленні пета:', error);
  }
}

function handleErrors(errors) {
  const errorMessages = [];
  for (const [field, messages] of Object.entries(errors)) {
    messages.forEach((msg) => errorMessages.push(`${field}: ${msg}`));
  }
  alert(`Помилки: \n${errorMessages.join('\n')}`);
}
async function deletePet(id) {
  try {
    const response = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Помилка видалення: ${response.status}`);
    console.log('Пет видалений');
    fetchPets();
  } catch (error) {
    console.error('помилка при видаленні пета:', error);
    alert('Не вдалося видалити пета');
  }
}


document.getElementById('add-pet-btn').onclick = () => openModal();
document.getElementById('close-modal').onclick = closeModal;

fetchPets();
