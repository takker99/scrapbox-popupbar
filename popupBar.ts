/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />

export type Button = {
  text: string;
  onClick?: () => void;
};

/**
 * PopupMenuから三角形を取り除いたようなものをカーソルのすぐ下に表示する
 */
export function createPopupMenuBar() {
  const { popupMenu, render } = createPopupContainer();
  const editor = document.getElementById("editor");
  editor?.append(popupMenu);
  const cursor = document.getElementsByClassName("cursor")[0] as HTMLElement;

  const observer = new MutationObserver(() =>
    popupMenu.style.top = `${parseInt(cursor.style.top) +
      parseInt(cursor.style.height) + 4}px`
  );

  observer.observe(document.getElementsByClassName("lines")[0], {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });

  return {
    render,
    visible: () => !popupMenu.hidden,
    open: () => popupMenu.hidden = false,
    close: () => popupMenu.hidden = true,
    toggle: () => popupMenu.hidden = !popupMenu.hidden,
  };
}

function createPopupContainer() {
  const popupMenu = document.createElement("div");
  const shadowRoot = popupMenu.attachShadow({ mode: "open" });
  shadowRoot.innerHTML = `
    <style>
      :host {
        position: absolute;
        left: 0px;
        width:100%;
        z-index:300;
        user-select:none;
        font-family:"Open Sans",Helvetica,Arial,"Hiragino Sans",sans-serif;
        pointer-events:none
      }
      .button-container {
        position: relative;
        display:inline-block;
        max-width:70vw;
        min-width:80px;
        text-align:center;
        background-color:#111;
        padding:0 1px;
        border-radius:4px;
        pointer-events:auto
      }
      html[data-os*='android'] .button-container {
        max-width:90vw
      }
      html[data-os*='ios'] .button-container {
        max-width:90vw
      }
      .button {
        font-size:11px;
        color:#eee;
        cursor:pointer;
        display:inline-block;
        padding:0 5px
      }
      .button:not(:first-of-type) {
        border:0;
        border-left:1px solid #eee
      }
      .button.selected {
        background-color:#222;
        text-decoration:underline
      }
      html[data-os*='android'] .button {
        font-size:13px;
        padding:6px;
        min-width:12vw
      }
      html[data-os*='ios'] .button{
        font-size:13px;
        padding:6px;
        min-width:12vw
      }
      .button div.icon {
        height:2em;
        max-width:10em;
        display:inline-block;
        overflow:hidden;
        margin-left:1px;
        vertical-align:top
      }
      .button div.icon img {
        max-height:100%;
        vertical-align:unset
      }
    </style>
    <div class="button-container"></div>
  `;
  const buttonContainer = shadowRoot.lastElementChild!;
  return {
    popupMenu,
    render(buttons: Button[]) {
      buttonContainer.textContent = "";
      buttonContainer.append(...buttons.map(({ text, onClick }) => {
        const div = document.createElement("div");
        div.classList.add("button");
        div.textContent = text;
        if (onClick) div.addEventListener("click", () => onClick());
        return div;
      }));
    },
  };
}
