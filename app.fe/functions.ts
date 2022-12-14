export function textwrap (text: string): string {
    const maxLineLength = 120;
    let words = text.split(' ');

    let currentLineLength = 0;
    let outputString = '';

    for (let i = 0; i < words.length; i++) {
        const wordToAdd = words[i];

        if (wordToAdd.indexOf("\n") !== -1)
            currentLineLength = 0;

        if (currentLineLength + wordToAdd.length > maxLineLength) {
            outputString += '\n';
            currentLineLength = 0;
        }

        outputString += `${wordToAdd} ` ;      // Fügt das aktuelle Wort zum Ausgabestring hinzu
        currentLineLength += wordToAdd.length + 1 ;
    } return outputString;
}




export class KaLocalStorage {
    private data = null;
    constructor() {
    }

    get<T>(key : string, defaultValue : T) : T {
        try {
            this.data = JSON.parse(localStorage.getItem("KaLocS"));
        } catch (e) {
            console.log("creating local storage key");
            this.data = {}
        }
        if ( ! (this.data instanceof Object))
            this.data = {};
        if (typeof this.data[key] === "undefined") {
            this.data[key] = defaultValue;
        }
        return this.data[key];
    }

    autosave() {
        localStorage.setItem("KaLocS", JSON.stringify(this.data))
    }
}

window.addEventListener("unload", () => {
    console.log("saving local Storage")
    kaLocalStorage.autosave();
})
export const kaLocalStorage = new KaLocalStorage()
