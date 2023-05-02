interface ChipInputOption {
    label: string;
    value: string;
}

class ChipInput extends HTMLElement {
    private input: HTMLInputElement;
    private div: HTMLDivElement;
    private container: HTMLDivElement;
    private chips: HTMLElement[];
    private dropdown?: HTMLSelectElement;
    private options?: ChipInputOption[];

    constructor() {
        super();
        this.container = document.createElement("div");
        this.container.className = "container";
        this.input = document.createElement("input");
        this.div = document.createElement("div");
        this.input.type = "text";
        let style = document.createElement("style");
        style.innerHTML = `:host {
    display: block;
}

.container {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    position: relative;
}

div {
   
    display: flex;
}

input {
    flex: 1 1 auto;
    display: flex;
  border: 0;
  height: auto;
}
input:focus {
  outline: none;
}

.chip {
  display: inline-block;
  margin: 0.1rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #fff;
  background-color: #007bff;
  border-radius: 0.25rem;
}

.close {
  display: inline-block;
  margin-left: 0.5rem;
  color: #fff;
  cursor: pointer;
}
`;
        this.chips = [];
        this.attachShadow({ mode: "open" });
        this.container.appendChild(this.div);
        this.container.appendChild(this.input);
        this.shadowRoot?.appendChild(this.container);
        this.shadowRoot?.appendChild(style);

        this.setupListeners();
    }

    connectedCallback() {
        this.render();
    }

    setOptions(options: ChipInputOption[]) {
        this.options = options;
        this.dropdown = document.createElement("select");
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select a chip";
        this.dropdown.appendChild(defaultOption);
        this.options.forEach((option) => {
            const selectOption = document.createElement("option");
            selectOption.value = option.value;
            selectOption.textContent = option.label;
            this.dropdown?.appendChild(selectOption);
        });
        this.shadowRoot?.appendChild(this.dropdown);
    }

    private setupListeners() {
        this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.dropdown?.addEventListener("change", this.handleDropdownChange.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        const value = this.input.value.trim();
        if (event.key === "Enter" && value) {
            const chip = this.createChip(value);
            this.chips.push(chip);
            this.input.value = "";
            this.render();
        }
    }

    private handleDropdownChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const value = select.value.trim();
        if (value) {
            const chip = this.createChip(value);
            this.chips.push(chip);
            this.render();
        }
        select.selectedIndex = 0;
    }

    private createChip(value: string): HTMLElement {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = value;
        const closeButton = document.createElement("span");
        closeButton.className = "close";
        closeButton.textContent = "x";
        closeButton.addEventListener("click", () => this.removeChip(chip));
        chip.appendChild(closeButton);
        return chip;
    }

    private removeChip(chip: HTMLElement) {
        const index = this.chips.indexOf(chip);
        if (index !== -1) {
            this.chips.splice(index, 1);
            this.render();
        }
    }

    private render() {
        this.shadowRoot?.querySelectorAll(".chip").forEach((chip) => chip.remove());
        this.chips.forEach((chip) => this.div.appendChild(chip));
    }
}

customElements.define("chip-input", ChipInput);
