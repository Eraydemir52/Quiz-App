// Tüm soruları ve yanıtları saklayacağımız değişkenler
let questions = [];
let currentQuestionIndex = 0;
let timer;
let timeLeft = 30;
let answers = [];

// Soruları API'den çekiyoruz
async function fetchQuestions() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  questions = shuffleArray(data.slice(0, 10)); // İlk 10 soruyu rastgele alıyoruz
  displayQuestion();
}

// Diziyi rastgele karıştırmak için Fisher-Yates algoritmasını kullanıyoruz
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Elemanları takas etme
  }
  return array;
}

// Soruyu ekrana yazdırma ve şıkları hazırlama
function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = question.title;

  // Şıkları "body" alanındaki metinden parse ederek alıyoruz
  const choices = parseChoices(question.body);
  const choiceLabels = document.querySelectorAll("#choices label");

  // Tüm radyo butonlarını temizliyoruz, yani işaretlenmiş bir şık olmayacak
  document.querySelectorAll('input[name="choice"]').forEach((input) => {
    input.checked = false; // Şıkları sıfırla, işaretli değil.
    input.disabled = true; // İlk 10 saniye şıklar pasif
  });

  choiceLabels.forEach((label, index) => {
    label.querySelector("span").textContent = choices[index];
  });

  // Buton devre dışı olsun ve 10 saniye sonra aktif hale gelsin
  const nextButton = document.getElementById("next-button");
  nextButton.disabled = true;
  nextButton.style.opacity = "0.5";

  timeLeft = 30;
  startTimer();
}

// Şıkları body alanındaki metinden parse etme
function parseChoices(body) {
  const sentences = body.split("\n"); // Satırları bölerek her bir şık için ayırıyoruz
  return [
    `A: ${sentences[0]}`, // A şıkkı
    `B: ${sentences[1]}`, // B şıkkı
    `C: ${sentences[2]}`, // C şıkkı
    `D: ${sentences[3]}`, // D şıkkı
  ];
}

// Zamanlayıcı başlatma
function startTimer() {
  clearInterval(timer);
  document.getElementById("timer").textContent = `Kalan süre: ${timeLeft}`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Kalan süre: ${timeLeft}`;

    // 10. saniyeden sonra şıkları aktif hale getiriyoruz
    if (timeLeft <= 20) {
      document.querySelectorAll('input[name="choice"]').forEach((input) => {
        input.disabled = false;
      });

      // Butonu etkin hale getiriyoruz
      const nextButton = document.getElementById("next-button");
      nextButton.disabled = false;
      nextButton.style.opacity = "1";
    }

    // 30 saniye dolunca sonraki soruya geçiyoruz
    if (timeLeft === 0) {
      saveAnswer();
      currentQuestionIndex++;
      displayQuestion();
    }
  }, 1000);
}

// Kullanıcının verdiği yanıtı kaydetme
function saveAnswer() {
  const selectedChoice = document.querySelector('input[name="choice"]:checked');
  const answer = selectedChoice ? selectedChoice.value : "Boş bırakıldı";
  answers.push({
    question: questions[currentQuestionIndex].title,
    answer: answer,
  });
}

// "Sonraki Soru" butonuna basıldığında bir sonraki soruya geçme
document.getElementById("next-button").addEventListener("click", () => {
  saveAnswer();
  currentQuestionIndex++;
  displayQuestion();
});

// Test bitince sonuçları gösterme
function showResults() {
  clearInterval(timer);
  document.getElementById("question-container").style.display = "none";
  document.getElementById("result-container").style.display = "block";

  const resultTable = document
    .getElementById("result-table")
    .querySelector("tbody");
  answers.forEach((answer) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${answer.question}</td><td>${answer.answer}</td>`;
    resultTable.appendChild(row);
  });
}

// Uygulama başladığında soruları çekiyoruz
fetchQuestions();
