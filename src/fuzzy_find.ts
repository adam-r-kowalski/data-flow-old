export interface FuzzyFind {
    haystack: string
    needle: string
}

export const fuzzyFind = ({ haystack, needle }: FuzzyFind): boolean => {
    let haystackIndex = 0
    let needleIndex = 0
    while (needleIndex < needle.length) {
        const n = needle[needleIndex].toLowerCase()
        while (haystackIndex < haystack.length && n !== haystack[haystackIndex].toLowerCase()) {
            ++haystackIndex
        }
        if (haystackIndex === haystack.length) return false
        ++needleIndex
    }
    return true
}
