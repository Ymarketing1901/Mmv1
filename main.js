
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const grades = ["K", "1", "2", "3", "4", "5", "6"];
  let selectedGrade = "1";
  let selectedAvatar = "cat-yellow";
  let questions = [];
  let currentQuestion = 0;
  let coins = 0;

  function startGame() {
    selectedGrade = document.getElementById("gradeSelect").value;
    selectedAvatar = document.getElementById("avatarSelect").value;
    renderMap();
  }

  function renderStartScreen() {
    app.innerHTML = \`
      <h1>🎩 Math Magic</h1>
      <h2>Select Your Grade</h2>
      <select id="gradeSelect">
        <option value="K">Kindergarten</option>
        <option value="1">Grade 1</option>
        <option value="2">Grade 2</option>
        <option value="3">Grade 3</option>
        <option value="4">Grade 4</option>
        <option value="5">Grade 5</option>
        <option value="6">Grade 6</option>
      </select>

      <h2>Select Your Avatar</h2>
      <select id="avatarSelect">
        <option value="cat-yellow">Cat - Yellow</option>
        <option value="dog-blue">Dog - Blue</option>
        <option value="mouse-pink">Mouse - Pink</option>
      </select>
      <br><br>
      <button onclick="startGame()">Start Adventure</button>
    \`;
  }

  function renderMap() {
    app.innerHTML = \`
      <h2>Woodland Village</h2>
      <img src="world1_map_final.png" alt="World 1 Map" style="width: 90%; max-width: 800px;">
      <div style="margin-top: 20px;">
        
    <button onclick="enterBuilding('home')">Go to Player Home</button>
    <button onclick="enterBuilding('workshop')">Go to Workshop</button>
    <button onclick="enterBuilding('townhall')">Go to Townhall</button>
    <button onclick="enterBuilding('store')">Go to Convenience Store</button>
    <button onclick="enterBuilding('hospital')">Go to Hospital</button>
    <button onclick="enterBuilding('lab')">Go to Science Lab</button>
    
        <button onclick="enterBuilding('lab')">Go to Science Lab</button>
        <button onclick="renderStartScreen()">Back</button>
      </div>
      <p>Coins: <span id="coinCount">\${coins}</span></p>
    \`;
  }

  function enterBuilding(type) {
    if (type === "home") {
      app.innerHTML = `
        <h2>Player Home</h2>
        <p>Your cozy space. Progress auto-saved!</p>
        <button onclick="renderMap()">Return to Map</button>
      `;
      return;
    }
    if (type === "workshop") {
      app.innerHTML = `
        <h2>Workshop</h2>
        <p>Buy furniture for your home:</p>
        <ul>
          <li>Wallpaper – 5 coins</li>
          <li>Table – 10 coins</li>
          <li>Chair – 5 coins</li>
        </ul>
        <button onclick="renderMap()">Return to Map</button>
      `;
      return;
    }
    if (type === "townhall") {
      app.innerHTML = `
        <h2>Townhall</h2>
        <p>Total coins collected: ${coins}</p>
        <p>Earn 200 coins in this land to unlock the next!</p>
        <button onclick="renderMap()">Return to Map</button>
      `;
      return;
    }
    if (type === "store") {
      app.innerHTML = `
        <h2>Convenience Store</h2>
        <p>Outfits and Accessories:</p>
        <ul>
          <li>Hat – 10 coins</li>
          <li>Shoes – 10 coins</li>
          <li>Outfit – 20 coins</li>
        </ul>
        <button onclick="renderMap()">Return to Map</button>
      `;
      return;
    }

    const gradeFile = selectedGrade === "K" ? "grade_0" : "grade_" + selectedGrade;
    const scriptName = type === "hospital" ? gradeFile + "_hospital.js" : gradeFile + "_lab.js";

    const script = document.createElement("script");
    script.src = scriptName;
    script.onload = () => {
      questions = type === "hospital" ? window[gradeFile + "_hospital"].easy : window[gradeFile + "_lab"].easy;
      currentQuestion = 0;
      renderQuestion(type);
    };
    document.body.appendChild(script);
  }

  function renderQuestion(type) {
    if (currentQuestion >= questions.length) {
      app.innerHTML = \`
        <h2>All Questions Answered!</h2>
        <button onclick="renderMap()">Return to Map</button>
      \`;
      return;
    }

    const q = questions[currentQuestion];
    app.innerHTML = \`
      <h2>\${type === "hospital" ? "Hospital" : "Science Lab"}</h2>
      <p>\${q.text}</p>
    \`;

    if (type === "hospital") {
      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === q.answer) coins += 2;
          currentQuestion++;
          renderQuestion(type);
          document.getElementById("coinCount").textContent = coins;
        };
        app.appendChild(btn);
      });
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type your answer";
      app.appendChild(input);

      const btn = document.createElement("button");
      btn.textContent = "Submit";
      btn.onclick = () => {
        if (input.value === q.answer) coins += 3;
        currentQuestion++;
        renderQuestion(type);
        document.getElementById("coinCount").textContent = coins;
      };
      app.appendChild(btn);
    }

    const backBtn = document.createElement("button");
    backBtn.textContent = "Return to Map";
    backBtn.onclick = renderMap;
    app.appendChild(backBtn);
  }

  renderStartScreen();
});
