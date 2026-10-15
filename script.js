
const scoreBody = document.getElementById("scoreBody");
const scoreTable = document.getElementById("scoreTable");
const roundSelect = document.getElementById("roundSelect");
const playerSelect = document.getElementById("playerSelect");
const quickButtons = document.getElementById("quickButtons");
const status = document.getElementById("status");

const playerNames = document.querySelectorAll(".player-name");
const playerHeaders = scoreTable.querySelectorAll("thead th:not(:first-child)");
const totalCells = scoreTable.querySelectorAll("tfoot .total");

// Membuat 15 ronde secara otomatis
for (let round = 0; round < 15; round++) {
  const row = document.createElement("tr");

  const roundNumber = document.createElement("th");
  roundNumber.textContent = round + 1;
  row.appendChild(roundNumber);

  for (let player = 0; player < 4; player++) {
    const cell = document.createElement("td");
    const input = document.createElement("input");

    input.type = "number";
    input.step = "1";
    input.value = "";
    input.className = "score-input";

    input.dataset.round = round;
    input.dataset.player = player;

    input.setAttribute(
      "aria-label",
      `Ronde ${round + 1}, pemain ${player + 1}`
    );

    input.addEventListener("input", updateTotals);

    cell.appendChild(input);
    row.appendChild(cell);
  }

  scoreBody.appendChild(row);

  const option = document.createElement("option");
  option.value = round;
  option.textContent = `Ronde ${round + 1}`;

  roundSelect.appendChild(option);
}

// Menghitung total setiap pemain
function updateTotals() {
  for (let player = 0; player < 4; player++) {
    let total = 0;

    const inputs = scoreBody.querySelectorAll(
      `input[data-player="${player}"]`
    );

    inputs.forEach(input => {
      total += Number(input.value) || 0;
    });

    totalCells[player].textContent =
      total > 0 ? `+${total}` : total;
  }
}

// Mengubah nama pemain langsung di tabel
playerNames.forEach((input, index) => {
  function updateName() {
    const name = input.value.trim() || `Pemain ${index + 1}`;

    playerHeaders[index].textContent = name;
    playerSelect.options[index].textContent = name;
  }

  input.addEventListener("input", updateName);
  updateName();
});

// Membuat tombol poin positif dan negatif
const points = [
  5, 10, 50, 100, 250, 500,
  -5, -10, -50, -100, -250, -500
];

points.forEach(point => {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "quick-button";

  if (point < 0) {
    button.classList.add("negative");
  }

  button.textContent = point > 0 ? `+${point}` : point;

  button.addEventListener("click", () => {
    const player = playerSelect.value;
    const round = roundSelect.value;

    const input = scoreBody.querySelector(
      `input[data-player="${player}"][data-round="${round}"]`
    );

    // Tambahkan poin ke nilai yang sudah ada
    input.value = (Number(input.value) || 0) + point;

    updateTotals();

    const name =
      playerNames[player].value.trim() || `Pemain ${Number(player) + 1}`;

    status.textContent =
      `${name}: ${point > 0 ? "+" : ""}${point} ` +
      `ditambahkan ke ronde ${Number(round) + 1}.`;
  });

  quickButtons.appendChild(button);
});

// Reset seluruh poin
document.getElementById("resetButton").addEventListener("click", () => {
  const yakin = confirm("Yakin ingin menghapus semua poin?");

  if (!yakin) return;

  scoreBody.querySelectorAll("input").forEach(input => {
    input.value = "0";
  });

  updateTotals();
  status.textContent = "Semua poin berhasil direset!";
});

// Hitung total awal
updateTotals();
