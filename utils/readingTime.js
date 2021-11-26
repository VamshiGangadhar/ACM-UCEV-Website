export default function readingTime(text) {
    const wordsPerMinute = 200
    let textLength = text.split(" ").length
    if (textLength > 0) {
        let value = Math.ceil(textLength / wordsPerMinute);
        return value
    }
    return 0
}