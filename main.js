const preview = document.querySelector('pre');
const preview_code = document.querySelector('pre code');
const url = new URL(window.location.href);
const properties = ['background', 'background-color', 'color', 'font-weight', 'font-style'];

const input = document.getElementById('input');
const output = document.getElementById('output');
const language_selector = document.getElementById('language_selector');
const theme_selector = document.getElementById('theme_selector');
const letter_spacing_button = document.getElementById('letter_spacing_button');

let language = url.searchParams.get('language') || localStorage.getItem('language') || 'python';
let theme = url.searchParams.get('theme') || localStorage.getItem('theme') || 'github';
let letter_spacing = url.searchParams.get('letter_spacing') === 'true' || localStorage.getItem('letter_spacing') === 'true' || false;

change_language();
change_theme();
toggle_letter_spacing();

function change_language() {
  preview_code.classList.remove(...Array.from(preview_code.classList)
  .filter(language => language.startsWith('language-'))
  );
  preview_code.classList.add(`language-${language}`);
  url.searchParams.set('language', language);
  localStorage.setItem('language', language);
  language_selector.value = language;
  history.pushState(null, '', url);
  hljs.highlightElement(preview_code);
}

function change_theme() {
  document.querySelector('link').href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/${theme}.min.css`;
  url.searchParams.set('theme', theme);
  theme_selector.value = theme;
  localStorage.setItem('theme', theme);
  history.pushState(null, '', url);
  hljs.highlightElement(preview_code);
}

function toggle_letter_spacing() {
  if (letter_spacing) {
    preview_code.style.letterSpacing = '2px';
    url.searchParams.set('letter_spacing', true);
    localStorage.setItem('letter_spacing', true);
  } else {
    preview_code.style.letterSpacing = 'normal';
    url.searchParams.set('letter_spacing', false);
    localStorage.setItem('letter_spacing', false);
  }
  history.pushState(null, '', url);
  inline();
  output.value = preview.outerHTML;
}

function inline_style(element) {
  const styles = window.getComputedStyle(element);
  for (let key in styles) {
    // https://stackoverflow.com/questions/25097566/css-style-to-inline-style-via-javascript
    let prop = key.replace(/\-([a-z])/g, v => v[1].toUpperCase());
    if (properties.indexOf(key) > -1) {
      element.style[prop] = styles[key];
    }
  }
}

function inline() {
  const nodes = document.querySelectorAll('pre *');
  inline_style(preview);
  if (nodes) {
    Array.from(nodes).forEach(element => {
      inline_style(element);
    });
  }
}

language_selector.addEventListener('change', (e) => {
  language = e.target.value;
  change_language();
});

theme_selector.addEventListener('change', (e) => {
  theme = e.target.value;
  change_theme();
});

letter_spacing_button.addEventListener('click', (e) => {
  letter_spacing = !letter_spacing;
  toggle_letter_spacing();
});

input.addEventListener('input', () => {
  preview_code.textContent = input.value;
  hljs.highlightElement(preview_code);
  inline();
  output.value = preview.outerHTML;
});
