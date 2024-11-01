chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "togglePromotedPosts") {
    handlePromotedPosts(message.state);
  }
});

chrome.storage.local.get(["promotedPostsBlocked", "keywords", "names"], (data) => {
  if (data.promotedPostsBlocked) hidePromotedPosts();
  if (data.keywords) hidePostsByKeywords(data.keywords);
  if (data.names) hidePostsByNames(data.names);
});

function handlePromotedPosts(blockPromoted) {
  const posts = document.querySelectorAll("div:contains('Promoted')");
  posts.forEach((post) => {
    post.style.display = blockPromoted ? "none" : "block";
  });
}

function hidePromotedPosts() {
  const posts = document.querySelectorAll("div:contains('Promoted')");
  posts.forEach((post) => post.style.display = "none");
}

function hidePostsByKeywords(keywords) {
  const posts = document.querySelectorAll("div.feed-shared-update-v2");
  posts.forEach((post) => {
    const text = post.innerText.toLowerCase();
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
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

const observer = new MutationObserver(() => {
  chrome.storage.local.get(["promotedPostsBlocked", "keywords", "names"], (data) => {
    if (data.promotedPostsBlocked) hidePromotedPosts();
    if (data.keywords) hidePostsByKeywords(data.keywords);
    if (data.names) hidePostsByNames(data.names);
  });
});

observer.observe(document.body, { childList: true, subtree: true });
