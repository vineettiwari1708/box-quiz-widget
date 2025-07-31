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

  const widget = document.createElement("div");
  widget.id = "quiz-widget";
  widget.style.position = "fixed";
  widget.style.bottom = "20px";
  widget.style.right = "20px";
  widget.style.width = "320px";
  widget.style.background = "#fff";
  widget.style.border = "1px solid #ccc";
  widget.style.borderRadius = "10px";
  widget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
  widget.style.padding = "16px";
  widget.style.fontSize = "14px";
  widget.style.zIndex = "100000";
  widget.style.transition = "opacity 0.3s ease";

  const content = document.createElement("div");
  content.id = "quiz-content";
  widget.appendChild(content);
  document.body.appendChild(widget);

  const renderQuestion = () => {
    const question = quizData[currentIndex];
    content.innerHTML = `
      <div><strong>Q${currentIndex + 1}:</strong> ${question.question}</div>
      <div style="margin-top:10px;">
        ${question.options
          .map(
            (opt, i) => `
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

  renderQuestion();
});
