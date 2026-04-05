function initAnswerChecker() {
  if (!window.__fipiplus_loaded) {
    window.__fipiplus_loaded = true;

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter" && event.target.tagName === "INPUT") {
          checkAnswer(event.target);
        }
      },
      true,
    );
  }

  function checkAnswer(input) {
    const id = input.closest("[id]").id.slice(9);
    const i = document.getElementById("i" + id);
    const button = i.querySelector(".answer-button");
    const statusPanel = i.querySelector(".task-status");
    if (!["ВЕРНО", "РЕШЕНО"].includes(statusPanel.textContent)) {
      checkStatus(statusPanel, input);
      button.click();
    }
  }

  function checkStatus(statusPanel, input) {
    const observer = new MutationObserver(() => {
      if (!statusPanel.querySelector(".loader")) {
        if (statusPanel.textContent === "ВЕРНО") {
          focusNext(input);
        }
        observer.disconnect();
      }
    });
    observer.observe(statusPanel, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function focusNext(current) {
    const focusable = [...document.querySelectorAll("input")];
    const index = focusable.indexOf(current);
    setTimeout(() => focusable[index + 1]?.focus(), 0);
  }
}
function changeTheme() {
  document.documentElement.classList.toggle("dark");
  const iframe = document.getElementById("questions_container");
  if (iframe?.contentDocument) {
    iframe.contentDocument.documentElement.classList.toggle("dark");
  }
  if (document.documentElement.classList.contains("dark")) {
    browser.storage.local.set({ theme: "dark" });
  } else {
    browser.storage.local.remove("theme");
  }
}
function svgFromString(svgText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  return doc.querySelector("svg");
}

function setIcon(button, isDark, sunSvg, moonSvg) {
  button.replaceChildren(svgFromString(isDark ? sunSvg : moonSvg));
}

async function initThemePicker() {
  const { theme } = await browser.storage.local.get("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }

  const button = document.createElement("button");
  button.className = "theme-picker";

  const [moonSvg, sunSvg] = await Promise.all([
    fetch(browser.runtime.getURL("icons/moon.svg")).then((r) => r.text()),
    fetch(browser.runtime.getURL("icons/sun.svg")).then((r) => r.text()),
  ]);

  setIcon(button, theme === "dark", sunSvg, moonSvg);

  button.addEventListener("click", () => {
    changeTheme();
    const isDark = document.documentElement.classList.contains("dark");
    setIcon(button, isDark, sunSvg, moonSvg);
  });

  document.querySelector(".header-container-resizable").appendChild(button);
}

initAnswerChecker();
initThemePicker();
