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
