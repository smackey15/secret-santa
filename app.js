const form = document.querySelector("#lookup-form");
const codeInput = document.querySelector("#code");
const errorEl = document.querySelector("#error");
const resultEl = document.querySelector("#result");
const yourNameEl = document.querySelector("#your-name");
const drewNameEl = document.querySelector("#drew-name");
const submitBtn = form.querySelector("button");

function normalizeCode(value) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function hideMessages() {
  errorEl.hidden = true;
  errorEl.textContent = "";
  resultEl.hidden = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideMessages();

  const code = normalizeCode(codeInput.value);
  if (!code) {
    errorEl.textContent = "Enter the code you were sent.";
    errorEl.hidden = false;
    return;
  }

  submitBtn.disabled = true;

  try {
    const response = await fetch(`draws/${encodeURIComponent(code)}.json`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("not-found");
    }

    const data = await response.json();
    if (!data?.name || !data?.drew) {
      throw new Error("bad-data");
    }

    yourNameEl.textContent = data.name;
    drewNameEl.textContent = data.drew;
    resultEl.hidden = false;
  } catch {
    errorEl.textContent = "That code didn’t match anyone. Check the message you were sent and try again.";
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});
