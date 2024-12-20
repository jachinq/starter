export function isChromeExtension() {
    if (chrome && chrome.runtime) {
        return true;
    }
    return false;
}
