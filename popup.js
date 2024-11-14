document.getElementById("addKeyword").addEventListener("click", addKeyword);
document.getElementById("addName").addEventListener("click", addName);

// Initialize the blocked items lists when the popup opens
chrome.storage.local.get({ keywords: [], names: [] }, (data) => {
  displayKeywords(data.keywords);
  displayNames(data.names);
});

function addKeyword() {
  const keyword = document.getElementById("keyword").value.trim();
  if (keyword) {
    chrome.storage.local.get({ keywords: [] }, (data) => {
      const keywords = data.keywords;
      keywords.push(keyword);
      chrome.storage.local.set({ keywords: keywords }, () => {
        document.getElementById("keyword").value = "";
        displayKeywords(keywords);
        showSuccessMessage("keywordSuccessMessage", "Keyword added successfully!");
      });
    });
  }
}

function addName() {
  const name = document.getElementById("name").value.trim();
  if (name) {
    chrome.storage.local.get({ names: [] }, (data) => {
      const names = data.names;
      names.push(name);
      chrome.storage.local.set({ names: names }, () => {
        document.getElementById("name").value = "";
        displayNames(names);
        showSuccessMessage("nameSuccessMessage", "Name added successfully!");
      });
    });
  }
}

function showSuccessMessage(elementId, message) {
  const successMessage = document.getElementById(elementId);
  successMessage.textContent = message;
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 2000);
}

function displayKeywords(keywords) {
  const keywordsList = document.getElementById("keywordsList");
  keywordsList.innerHTML = "";
  keywords.forEach((keyword, index) => {
    const li = document.createElement("li");
    li.className = "keyword-item";

    const keywordText = document.createElement("span");
    keywordText.textContent = keyword;
    li.appendChild(keywordText);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";
    removeButton.addEventListener("click", () => removeKeyword(index));
    li.appendChild(removeButton);

    keywordsList.appendChild(li);
  });
}

function displayNames(names) {
  const namesList = document.getElementById("namesList");
  namesList.innerHTML = "";
  names.forEach((name, index) => {
    const li = document.createElement("li");
    li.className = "name-item";

    const nameText = document.createElement("span");
    nameText.textContent = name;
    li.appendChild(nameText);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";
    removeButton.addEventListener("click", () => removeName(index));
    li.appendChild(removeButton);

    namesList.appendChild(li);
  });
}

function removeKeyword(index) {
  chrome.storage.local.get({ keywords: [] }, (data) => {
    const keywords = data.keywords;
    keywords.splice(index, 1);
    chrome.storage.local.set({ keywords: keywords }, () => {
      displayKeywords(keywords);
    });
  });
}

function removeName(index) {
  chrome.storage.local.get({ names: [] }, (data) => {
    const names = data.names;
    names.splice(index, 1);
    chrome.storage.local.set({ names: names }, () => {
      displayNames(names);
    });
  });
}
