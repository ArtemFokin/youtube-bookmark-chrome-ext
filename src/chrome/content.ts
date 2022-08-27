import { Bookmark } from "../types";

(() => {
    let youtubeLeftControls: HTMLElement | null,
        youtubePlayer: HTMLVideoElement | null;
    let currentVideo = "";
    let currentVideoBookmarks = [];
    console.log("INIT");
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, videoId } = obj;
        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }
    });
    const fetchBookmarks = async () => {
        if (!currentVideo) return [];
        const result = await chrome.storage.sync.get([currentVideo]);
        return JSON.parse(result[currentVideo] || "[]");
    };
    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.querySelector(".bookmark-btn");
        console.log("new video loaded", bookmarkBtnExists);
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.querySelector(".ytp-left-controls");
            youtubePlayer = document.querySelector(".video-stream");

            youtubeLeftControls?.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };
    const addNewBookmarkEventHandler = async () => {
        if (!youtubePlayer) return;
        const currentTime = youtubePlayer.currentTime;
        const newBookmark: Bookmark = {
            time: currentTime,
            desc: `Bookmark at ${getTime(currentTime)}`,
        };

        currentVideoBookmarks = await fetchBookmarks();
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify(
                [...currentVideoBookmarks, newBookmark].sort(
                    (a, b) => a.time - b.time
                )
            ),
        });
    };
    const getTime = (t: number) => {
        var date = new Date(0);
        date.setSeconds(t);

        return date.toISOString().substr(11, 8);
    };
})();

export {};
