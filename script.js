const roster = [
  { id: "host", name: "You (Host)", status: "ready" },
];

const requests = [
  { id: "req-1", name: "Jetstream" },
  { id: "req-2", name: "AeroNova" },
];

const lobbyCodeEl = document.getElementById("lobbyCode");
const rosterEl = document.getElementById("roster");
const requestListEl = document.getElementById("requestList");
const playerCountEl = document.getElementById("playerCount");

const createLobbyButton = document.getElementById("createLobby");
const randomJoinButton = document.getElementById("randomJoin");
const joinForm = document.getElementById("joinForm");
const codeInput = document.getElementById("codeInput");
const nicknameInput = document.getElementById("nicknameInput");

const maxPlayers = 5;

const generateCode = () => String(Math.floor(10000 + Math.random() * 90000));

const updateLobbyCode = (code = generateCode()) => {
  lobbyCodeEl.textContent = code;
};

const updatePlayerCount = () => {
  playerCountEl.textContent = `${roster.length} / ${maxPlayers}`;
};

const renderRoster = () => {
  rosterEl.innerHTML = "";
  roster.forEach((pilot) => {
    const li = document.createElement("li");
    li.className = "roster-card";
    li.innerHTML = `
      <span>${pilot.name}</span>
      <span class="label">${pilot.status}</span>
    `;
    rosterEl.appendChild(li);
  });
  updatePlayerCount();
};

const renderRequests = () => {
  requestListEl.innerHTML = "";
  if (requests.length === 0) {
    const empty = document.createElement("li");
    empty.className = "roster-card";
    empty.textContent = "No pending requests.";
    requestListEl.appendChild(empty);
    return;
  }

  requests.forEach((request) => {
    const li = document.createElement("li");
    li.className = "request-card";
    li.innerHTML = `
      <span>${request.name}</span>
      <div class="actions">
        <button class="approve" data-action="approve" data-id="${request.id}">Accept</button>
        <button class="decline" data-action="decline" data-id="${request.id}">Decline</button>
      </div>
    `;
    requestListEl.appendChild(li);
  });
};

const removeRequest = (id) => {
  const index = requests.findIndex((request) => request.id === id);
  if (index !== -1) {
    requests.splice(index, 1);
  }
};

const approveRequest = (id) => {
  const request = requests.find((entry) => entry.id === id);
  if (!request) return;

  if (roster.length >= maxPlayers) {
    alert("Lobby is full. Increase the max players or remove someone.");
    return;
  }

  roster.push({ id: request.id, name: request.name, status: "ready" });
  removeRequest(id);
  renderRequests();
  renderRoster();
};

const declineRequest = (id) => {
  removeRequest(id);
  renderRequests();
};

requestListEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === "approve") {
    approveRequest(id);
  }

  if (action === "decline") {
    declineRequest(id);
  }
});

createLobbyButton.addEventListener("click", () => {
  updateLobbyCode();
});

randomJoinButton.addEventListener("click", () => {
  codeInput.value = generateCode();
  nicknameInput.focus();
});

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickname = nicknameInput.value.trim();
  const code = codeInput.value.trim();

  if (code.length !== 5 || Number.isNaN(Number(code))) {
    alert("Enter a valid 5-digit lobby code.");
    return;
  }

  if (!nickname) {
    alert("Choose a nickname before sending a request.");
    return;
  }

  requests.push({ id: `req-${Date.now()}`, name: nickname });
  renderRequests();
  joinForm.reset();
});

updateLobbyCode("12904");
renderRoster();
renderRequests();
