let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// translate input text and speak
async function translateAndSpeak() {
  const text = document.getElementById("inputText").value; 
  const lang = document.getElementById("langSelect").value; 

  // where translated text is shown
  const output = document.getElementById("outputText");     


  // check for empty input
  if (!text) { 
    output.innerText = "Please type a word!";
    return;
  }

  // Translate text using Google Translate API
  const shortLang = lang.split('-')[0]; 
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${shortLang}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();
    const translatedText = result[0][0][0]; 
    output.innerText = translatedText;

    // Speak the translated text using the selected or default voice
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = lang;
    const voice = voices.find(v => v.lang === lang) || voices[0];
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);

  } 
  catch (err) {
    output.innerText = "Translation failed. Check your internet connection.";
    console.error(err);
  }
}
