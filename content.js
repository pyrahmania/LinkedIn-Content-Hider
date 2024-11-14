chrome.storage.local.get(["keywords", "names"], (data) => {
  if (data.keywords) hidePostsByKeywords(data.keywords);
  if (data.names) hidePostsByNames(data.names);
});

function hidePostsByKeywords(keywords) {
  const posts = document.querySelectorAll("div.feed-shared-update-v2");
  posts.forEach((post) => {
    const text = post.innerText.toLowerCase();
    if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      post.style.display = "none";
    }
  });
}

function hidePostsByNames(names) {
  const posts = document.querySelectorAll("div.feed-shared-update-v2");
  posts.forEach((post) => {
    const author = post.querySelector("span.feed-shared-actor__name");
    if (author && names.includes(author.innerText.trim())) {
      post.style.display = "none";
    }
  });
}

// Mutation observer to detect new posts in the feed and apply hiding logic
const observer = new MutationObserver(() => {
  chrome.storage.local.get(["keywords", "names"], (data) => {
    if (data.keywords) hidePostsByKeywords(data.keywords);
    if (data.names) hidePostsByNames(data.names);
  });
});

observer.observe(document.body, { childList: true, subtree: true });
