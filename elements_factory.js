class ElementOptions {
  /**
   * @type {string}
   */
  id = "";

  /**
   * @type {string}
   */
  className = "";

  /**
   * @type {[[string, string]]} Key-value pairs
   */
  attrs = [];
}

class InputOptions extends ElementOptions {
  /**
   * @type {string}
   */
  value = "";

  /**
   * @type {string}
   */
  placeholder = "";
}

class RadioOptions extends InputOptions {
  /**
   * @type {string}
   */
  checked = false;
}

/**
 *
 * @param {string} type type of element
 * @param {ElementOptions} options type of element
 * @returns {HtmlElement}
 */
function CreateElement(type, options = undefined) {
  const x = document.createElement(type);
  if (!options) return x;

  if (options.className) {
    x.className = options.className;
  }
  if (options.id) {
    x.id = options.id;
  }
  if (options.attrs) {
    options.attrs.forEach(([key, value]) => {
      x.setAttribute(key, value);
    });
  }
  return x;
}

/**
 * @param {string} type
 * @param {ElementOptions} options
 * @param {HtmlElement}
 */
function CreateIcon(icon, options = undefined) {
  if (!options) {
    options = { className: "" };
  }
  options.className += ` ${icon}`;
  return CreateElement("i", options);
}

/**
 * Create a div
 *
 * @param {[HTMLElement]} children appended to div
 * @param {ElementOptions} options
 * @returns {HTMLDivElement} a div with children appended
 */
function CreateDiv(children, options = undefined) {
  const div = CreateElement("div", options);
  children.forEach((x) => div.appendChild(x));
  return div;
}

/**
 * @param {string} text string inside the span
 * @param {ElementOptions} options
 * @returns {HTMLSpanElement} a span
 */
function CreateSpan(text, options = undefined) {
  const span = CreateElement("span", options);
  span.innerText = text;
  return span;
}

/**
 *
 * @param {string} text text inside button
 * @param {ElementOptions} options
 * @returns {HTMLButtonElement}
 */
function CreateButton(text, options = undefined) {
  const button = CreateElement("button", options);
  button.innerText = text;
  return button;
}

/**
 * @param {'text' | 'radio'} type
 * @param {ElementOptions} options
 * @returns {HTMLInputElement}
 */
function CreateInput(type, name, value = "", options = {}) {
  const input = CreateElement("input", options);
  input.type = type;
  input.name = name;
  input.value = value;
  return input;
}

/**
 *
 * @param {string} name input name
 * @param {string?} value initial value
 * @param {string?} placeholder
 * @param {ElementOptions} options
 * @returns {HTMLInputElement}
 */
function CreateTextInput(name, value = "", placeholder = "", options = {}) {
  if (!options.className) {
    options.className = "";
  }
  options.className += " form-control";
  const input = CreateInput("text", name, value, options);
  if (placeholder) {
    input.placeholder = placeholder;
  }
  return input;
}

/**
 *
 * @param {string} text innerHtml
 * @param {string} labelFor id of element for
 * @param {string} className css
 * @param {ElementOptions} options
 * @returns {HTMLLabelElement}
 */
function CreateLabel(text, labelFor = "", options = {}) {
  const label = CreateElement("label", options);
  label.htmlFor = labelFor;
  label.innerText = text;
  return label;
}

/**
 *
 * @param {string} name
 * @param {RadioOptions} options
 */
function CreateRadioButton(name, value, options = {}) {
  const input = CreateInput("radio", name, value, options);
  input.checked = options.checked;
  return input;
}

/**
 *
 * @param {string} name
 * @param {string} text
 * @param {string} value
 * @param {RadioOptions} inputOptions
 * @param {ElementOptions} labelOptions
 * @param {ElementOptions} containerOptions
 * @returns
 */
function CreateRadioGroup(
  name,
  text,
  value,
  inputOptions = {},
  labelOptions = {},
  containerOptions = {}
) {
  if (!inputOptions.className) {
    inputOptions.className = "";
  }
  inputOptions.className += " form-check-input";
  const input = CreateRadioButton(name, value, inputOptions);

  if (!labelOptions.className) {
    labelOptions.className = "";
  }
  labelOptions.className += " form-check-label";
  const label = CreateLabel(text, input.id, labelOptions);

  if (!containerOptions.className) {
    containerOptions.className = "";
  }
  containerOptions.className += " form-check";
  return CreateDiv([input, label], containerOptions);
}

/**
 *
 * @param {string} href
 * @param {string} text
 * @param {string} target
 * @returns {HtmlElement}
 */
function CreateLink(href, text, target = "_blank") {
  const a = document.createElement("a");
  a.innerText = text;
  a.href = href;
  a.target = target;
  return a;
}
