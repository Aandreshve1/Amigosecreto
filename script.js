// Inicializar EmailJS con tu Public Key
emailjs.init("Gs0UE7dxgfZXAQdr5");

const participants = []; // Lista de participantes
const participantNameInput = document.getElementById('participantName');
const participantEmailInput = document.getElementById('participantEmail');
const addButton = document.getElementById('addParticipant');
const participantsList = document.getElementById('participants');
const startDrawButton = document.getElementById('startDraw');

// Agregar participante
addButton.addEventListener('click', () => {
    const name = participantNameInput.value.trim();
    const email = participantEmailInput.value.trim();

    if (name && email && validateEmail(email)) {
        if (!participants.some(p => p.name === name || p.email === email)) {
            participants.push({ name, email }); // Agregar el participante a la lista
            participantNameInput.value = ''; // Limpiar el campo de nombre
            participantEmailInput.value = ''; // Limpiar el campo de correo
            updateParticipantsList(); // Actualizar la lista visual
        } else {
            alert("Ese nombre o correo ya está en la lista.");
        }
    } else {
        alert("Introduce un nombre y correo válidos.");
    }
});

// Validar correo electrónico
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Actualizar la lista de participantes visualmente
function updateParticipantsList() {
    participantsList.innerHTML = ''; // Limpiar la lista actual
    participants.forEach(({ name, email }) => {
        const li = document.createElement('li');
        li.textContent = `${name} (${email})`; // Mostrar nombre y correo
        participantsList.appendChild(li); // Agregar a la lista visual
    });
}

// Realizar el sorteo
startDrawButton.addEventListener('click', () => {
    if (participants.length < 2) {
        alert("Necesitas al menos 2 participantes para el sorteo.");
        return;
    }

    const shuffled = [...participants];
    shuffled.sort(() => Math.random() - 0.5); // Mezclar participantes

    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length]; // Circular
        sendNotification(giver, receiver); // Enviar notificación por correo
    }

    alert("¡Sorteo completado! Las notificaciones han sido enviadas.");
});

// Enviar correo real con EmailJS
function sendNotification(giver, receiver) {
    const templateParams = {
        to_name: giver.name,          // Nombre de quien regala (destinatario del correo)
        to_email: giver.email,        // Correo de quien regala
        to_gift_name: receiver.name,  // Nombre de la persona a quien debe regalar
    };

    emailjs
        .send("service_pjpafq4", "template_vldtwyv", templateParams)
        .then(
            (response) => {
                console.log(`Correo enviado a ${giver.email}: ${response.status}`);
            },
            (error) => {
                console.error("Error al enviar el correo:", error);
            }
        );
}


