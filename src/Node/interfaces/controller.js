import path from "path";

export function checkHash(hash, content) {
    return hash === hashString(JSON.stringify(content));
}

export function hashString(string) { //custom hash func 
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = ((hash << 5) - hash) + string.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}