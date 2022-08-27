const getYTVideoId = (url:string)=>{
  const queryParameters = url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  return urlParameters.get('v')
}

chrome.tabs.onUpdated.addListener(async (tabId) => {
  const tab = await chrome.tabs.get(tabId);
  console.log("on updated", tabId, tab.url)
  if (tab?.url?.includes("youtube.com/watch")) {
    console.log("install", new Date())
    const videoId = getYTVideoId(tab.url)

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId,
    });
  }
});

export {}