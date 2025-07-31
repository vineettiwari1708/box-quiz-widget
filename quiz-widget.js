document.addEventListener("DOMContentLoaded", function () {
  const scriptTag = document.getElementById("quiz-widget-script");
  if (!scriptTag) return;

  let quizData = [];

  try {
    quizData = JSON.parse(scriptTag.getAttribute("data-questions"));
  } catch (err) {
    console.error("❌ Invalid quiz data in script tag:", err);
    return;
  }

  if (!quizData.length) return;

  let currentIndex = 0;
  let score = 0;

  // --- Main Quiz Widget (Hidden by Default) ---
  const widget = document.createElement("div");
  widget.id = "quiz-widget";
  widget.style.position = "fixed";
  widget.style.bottom = "80px";
  widget.style.right = "20px";
  widget.style.width = "320px";
  widget.style.background = "#fff";
  widget.style.border = "1px solid #ccc";
  widget.style.borderRadius = "10px";
  widget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
  widget.style.padding = "16px";
  widget.style.fontSize = "14px";
  widget.style.zIndex = "100000";
  widget.style.display = "none";
  widget.style.flexDirection = "column";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "10px";
  header.innerHTML = `
    <strong>Quick Quiz</strong>
    <button id="quiz-close-btn" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #dc3545;">&times;</button>
  `;
  widget.appendChild(header);

  const content = document.createElement("div");
  content.id = "quiz-content";
  widget.appendChild(content);
  document.body.appendChild(widget);

  document.getElementById("quiz-close-btn").addEventListener("click", () => {
    widget.style.display = "none";
    toggleBtn.style.display = "flex";
  });

  const renderQuestion = () => {
    const question = quizData[currentIndex];
    content.innerHTML = `
      <div><strong>Q${currentIndex + 1}:</strong> ${question.question}</div>
      <div style="margin-top:10px;">
        ${question.options
          .map(
            (opt) => `
            <button class="quiz-opt-btn" data-opt="${opt}" 
              style="margin:4px 0; padding:6px 10px; width:100%; border:1px solid #007bff; background:#fff; color:#007bff; border-radius:4px; cursor:pointer;">
              ${opt}
            </button>`
          )
          .join("")}
      </div>
    `;

    document.querySelectorAll(".quiz-opt-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const selected = this.getAttribute("data-opt");
        const correct = quizData[currentIndex].answer;
        if (selected === correct) score++;

        currentIndex++;
        if (currentIndex < quizData.length) {
          renderQuestion();
        } else {
          showResult();
        }
      });
    });
  };

  const showResult = () => {
    content.innerHTML = `
      <h4>Quiz Complete!</h4>
      <p>You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong>.</p>
      <button id="restart-quiz" style="margin-top:10px; padding:6px 12px; background:#007bff; color:#fff; border:none; border-radius:4px;">Restart</button>
    `;
    document.getElementById("restart-quiz").addEventListener("click", () => {
      currentIndex = 0;
      score = 0;
      renderQuestion();
    });
  };

  // --- Floating Toggle Button ---
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "toggle-quiz-widget";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.bottom = "20px";
  toggleBtn.style.right = "20px";
  toggleBtn.style.zIndex = "100001";
  toggleBtn.style.height = "48px";
  toggleBtn.style.display = "flex";
  toggleBtn.style.alignItems = "center";
  toggleBtn.style.justifyContent = "flex-start";
  toggleBtn.style.backgroundColor = "#007bff";
  toggleBtn.style.border = "none";
  toggleBtn.style.borderRadius = "24px";
  toggleBtn.style.color = "#fff";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.padding = "0 12px";
  toggleBtn.style.overflow = "hidden";
  toggleBtn.style.transition = "width 0.3s ease";
  toggleBtn.style.width = "48px";

  // Icon
  const icon = document.createElement("i");
  icon.className = "fas fa-question-circle"; // quiz-style icon
  icon.style.fontSize = "18px";
  toggleBtn.appendChild(icon);

  // Hover text
  const textSpan = document.createElement("span");
  textSpan.textContent = "  Start Quiz";
  textSpan.style.whiteSpace = "nowrap";
  textSpan.style.marginLeft = "8px";
  textSpan.style.opacity = "0";
  textSpan.style.transition = "opacity 0.3s ease";
  toggleBtn.appendChild(textSpan);

  toggleBtn.addEventListener("mouseenter", () => {
    toggleBtn.style.width = "160px";
    textSpan.style.opacity = "1";
  });

  toggleBtn.addEventListener("mouseleave", () => {
    toggleBtn.style.width = "48px";
    textSpan.style.opacity = "0";
  });

  toggleBtn.addEventListener("click", () => {
    toggleBtn.style.display = "none";
    widget.style.display = "flex";
    renderQuestion();
  });

  document.body.appendChild(toggleBtn);
});
