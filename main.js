
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  let selectedGrade = "1";
  let questions = [];
  let currentQuestion = 0;
  let coins = 0;

  function renderStart() {
    app.innerHTML = \`
      <h1>Math Magic</h1>
      <label>Choose Grade:</label>
      <select id="grade">
        <option value="0">K</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select><br><br>
      <button onclick="startGame()">Start</button>
    \`;
  }

  window.startGame = function() {
    selectedGrade = document.getElementById("grade").value;
    renderMap();
  }

  function renderMap() {
    app.innerHTML = \`
      <h2>Woodland Village</h2>
      <button onclick="enterBuilding('hospital')">Hospital</button>
      <button onclick="enterBuilding('home')">Player Home</button>
       <button onclick="enterBuilding('workshop')">Workshop</button>
       <button onclick="enterBuilding('townhall')">Townhall</button>
       <button onclick="enterBuilding('store')">Convenience Store</button>
       <button onclick="enterBuilding('lab')">Science Lab</button>
      <button onclick="renderStart()">Back</button>
      <p>Coins: <span id="coinCount">\${coins}</span></p>
    \`;
  }

  function enterBuilding(type) {
    if (type === "home") {
      app.innerHTML = `<h2>Player Home</h2><p>Your cozy home base.</p><button onclick='renderMap()'>Back</button>`;
      return;
    }
    if (type === "workshop") {
      app.innerHTML = `<h2>Workshop</h2><p>Buy furniture: Wallpaper (5 coins), Table (10), Chair (5)</p><button onclick='renderMap()'>Back</button>`;
      return;
    }
    if (type === "townhall") {
      app.innerHTML = `<h2>Townhall</h2><p>You have ${coins} coins. Earn 200 to unlock the next land!</p><button onclick='renderMap()'>Back</button>`;
      return;
    }
    if (type === "store") {
      app.innerHTML = `<h2>Convenience Store</h2><p>Hats (10), Shoes (10), Outfit (20)</p><button onclick='renderMap()'>Back</button>`;
      return;
    }

    if (type === "lab") {
      const gradeFile = "grade_" + selectedGrade + "_lab.js";
      const script = document.createElement("script");
      script.src = gradeFile;
      script.onload = () => {
        questions = window["grade_" + selectedGrade + "_lab"].easy;
        currentQuestion = 0;
        renderLabQuestion();
      };
      document.body.appendChild(script);
      return;
    }

    const gradeFile = "grade_" + selectedGrade + "_hospital.js";
    const script = document.createElement("script");
    script.src = gradeFile;
    script.onload = () => {
      questions = window["grade_" + selectedGrade + "_hospital"].easy;
      currentQuestion = 0;
      renderQuestion();
    };
    document.body.appendChild(script);
  }

  function renderQuestion() {
    if (currentQuestion >= questions.length) {
      app.innerHTML = \`<h2>All Done!</h2><button onclick="renderMap()">Back</button>\`;
      return;
    }
    const q = questions[currentQuestion];
    app.innerHTML = \`<h2>Hospital</h2><p>\${q.text}</p>\`;

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => {
        if (opt === q.answer) coins += 2;
        currentQuestion++;
        renderQuestion();
        document.getElementById("coinCount").textContent = coins;
      };
      app.appendChild(btn);
    });

    const backBtn = document.createElement("button");
    backBtn.textContent = "Back";
    backBtn.onclick = renderMap;
    app.appendChild(backBtn);
  }

  renderStart();
});

  function renderLabQuestion() {
    if (currentQuestion >= questions.length) {
      app.innerHTML = `<h2>Lab Complete!</h2><button onclick="renderMap()">Back</button>`;
      return;
    }
    const q = questions[currentQuestion];
    app.innerHTML = `<h2>Science Lab</h2><p>${q.text}</p>`;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter your answer";
    app.appendChild(input);

    const submit = document.createElement("button");
    submit.textContent = "Submit";
    submit.onclick = () => {
      if (input.value === q.answer) coins += 3;
      currentQuestion++;
      renderLabQuestion();
      document.getElementById("coinCount").textContent = coins;
    };
    app.appendChild(submit);

    const backBtn = document.createElement("button");
    backBtn.textContent = "Back";
    backBtn.onclick = renderMap;
    app.appendChild(backBtn);
  }
