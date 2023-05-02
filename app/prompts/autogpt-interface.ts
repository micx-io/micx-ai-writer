/**
 * Write typescript program using exclusively to fulfil your goals defined below this interface.
 * Do not implement this interface! Use the methods to write your program.
 */
export interface AutogptInterface {
    /**
     * Search Google for a query and return the first 10 results
     * @param query
     */
    search_google(query: string): [{ url: string, title: string, description: string }];

    /**
     * Load a website and return its content (without HTML Tags)
     * @param url
     */
    load_url(url: string): string;

    write_file (filename: string, content: string) : void;

    read_file (filename: string) : string;

    list_files (path: string) : string[];

    exec(command: string) : string;

    /**
     * Send a subquery to the GPT-3 API to compress or export crutical information from data
     * @param prompt    What to ask GPT to do with the data
     * @param data      Input data to pass to GPT (e.g. a Website Content)
     */
    gpt_subquery(prompt: string, data: string) : string;

    /**
     * Text to send to the user terminal
     * @param text
     */
    echo(text: string) : void;

    /**
     * Ask the user for Input
     * @param text
     */
    aks(text: string) : string;
}
let p : AutogptInterface;
/**
Write a program using p to fulfil your goals. You can use loops, if statements, etc.
Be creative and have fun! And try to be ahead of the competition.
 Write only the code! Do not implement the interface! Do not comment!
 Your goal:
