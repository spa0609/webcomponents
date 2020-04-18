const template = document.createElement("template");
template.innerHTML = `
  <style>
    .counter-container {
      --default-height: var(--height, 100px);
      
      width: calc(var(--default-height) * 2);
      height: var(--default-height);
      position: relative;
    }
    .counter-container > div {
      color: white;
      font-size: 2.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 5px solid white;
      margin: 0;
      padding: 0;
    }
    .counter-container .value {
      background-color: black;
      position: absolute;
      z-index: 2;
      width: var(--default-height);
      height: 100%;
      border-radius: 50%;
      border: 5px solid white;
      left: 50%;
      margin-left: calc(var(--default-height) / -2);
    }
    .counter-container .buttons {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    .counter-container .button {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      transition-duration: 200ms;
      cursor: pointer;
      user-select: none;
    }
    .counter-container .button:hover {
      background-color: white;
      color: black;
    }
    .counter-container .button:active {
      background-color: #ff584f;
      color: white;
    }
    
    .counter-container .button.active {
      background-color: #ff584f;
      color: white;
    }
    .counter-container .decrement {
      background-color: black;
      justify-content: flex-start;
      border-bottom-left-radius: calc(var(--default-height) / 2);
      border-top-left-radius: calc(var(--default-height) / 2);
      padding-left: calc(var(--default-height) / 6);
    }
    .counter-container .increment {
      background-color: black;
      justify-content: flex-end;
      border-bottom-right-radius: calc(var(--default-height) / 2);
      border-top-right-radius: calc(var(--default-height) / 2);
      padding-right: calc(var(--default-height) / 6);
    }
  </style>
  <slot name="header">
    <h1>My Counter</h1>
  </slot>
  <div class="counter-container">
    <div class="buttons">
      <div class="button decrement">-</div>
      <div class="button increment">+</div>
    </div>
    <div class="value" part="value">
      <slot name="value-prefix"></slot>
      <span class="value-display">0</span>
      <slot name="value-postfix"></slot>
    </div>
  </div>`;
class MyComponent extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.decrementButton = this.shadow.querySelector(".decrement");
        this.incrementButton = this.shadow.querySelector(".increment");
        this.valueDisplay = this.shadow.querySelector(".value-display");

        this.decrementButton.addEventListener("click", () => this.decrement());
        this.incrementButton.addEventListener("click", () => this.increment());

        document.addEventListener("keydown", (e) => {
            const k = e.key;
            let button = {};
            if (k === "+") {
                button = this.incrementButton;
            } else if (k === "-") {
                button = this.decrementButton;
            }
            if (button && button.classList) {
                button.classList.add("active");
                button.dispatchEvent(new Event("click"));
                setTimeout(() => button.classList.remove("active"), 100);
            }
        })
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ["value"];
    }

    /**
     * @param {string} name
     * @param {any} oldVal
     * @param {number} newVal
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) {
            return;
        }
        if (name === "value") {
            this.value = newVal;
        }
    }

    get value() {
        return +this.getAttribute('value') || 0;
    }

    set value(v) {
        this.setAttribute('value', v.toString());
        this.render();
    }

    increment() {
        this.value++;
        this.dispatchEvent(new CustomEvent("valueChange", { detail: this.value }));
    }

    decrement() {
        this.value--;
        this.dispatchEvent(new CustomEvent("valueChange", { detail: this.value }));
    }

    render() {
        this.valueDisplay.textContent = this.value.toString();
    }
}

window.customElements.define("spa-counter", MyComponent);