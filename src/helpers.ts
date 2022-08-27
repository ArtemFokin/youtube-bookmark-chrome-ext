export async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

export const getYTVideoId = (url: string) => {
    const queryParameters = url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    return urlParameters.get("v");
};
