document.getElementById("addKeyword").addEventListener("click", addKeyword);
document.getElementById("addName").addEventListener("click", addName);
document.getElementById("promotedToggle").addEventListener("change", togglePromotedPosts);

// Check if chrome.storage is available
if (typeof chrome.storage !== "undefined" && chrome.storage.local) {
  chrome.storage.local.get({ promotedPostsBlocked: false, keywords: [], names: [] }, (data) => {
    document.getElementById("promotedToggle").checked = data.promotedPostsBlocked;
    displayKeywords(data.keywords);
    displayNames(data.names);
  });
} else {
  console.error("chrome.storage is undefined. Make sure the 'storage' permission is set in the manifest.");
}

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

function togglePromotedPosts() {
  const isChecked = document.getElementById("promotedToggle").checked;
  chrome.storage.local.set({ promotedPostsBlocked: isChecked }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "togglePromotedPosts", state: isChecked });
    });
  });
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
