const preview = document.querySelector('pre');
const preview_code = document.querySelector('pre code');
const url = new URL(window.location.href);
const properties = ['background', 'background-color', 'color', 'font-weight', 'font-style'];

const link = document.querySelector('link');
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
  const script = document.createElement('script');
  script.src = `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/languages/${language}.min.js`
  script.addEventListener('load', update);
  document.body.appendChild(script);
  url.searchParams.set('language', language);
  localStorage.setItem('language', language);
  language_selector.value = language;
  history.pushState(null, '', url);
  update();
}

function change_theme() {
  link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/${theme}.min.css`;
  link.addEventListener('load', update);
  // Chrome doesn't support fire the load event for some reason
  if (window.navigator.userAgent.includes('Chrome')) {
    window.setTimeout(update, 1000);
  }
  url.searchParams.set('theme', theme);
  theme_selector.value = theme;
  localStorage.setItem('theme', theme);
  history.pushState(null, '', url);
  update();
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
  update();
}

function inline_style(element) {
  for (let property of properties) {
    element.style[property] = '';
  }
  const styles = window.getComputedStyle(element);
  for (let key in styles) {
    // https://stackoverflow.com/questions/25097566/css-style-to-inline-style-via-javascript
    let property = key.replace(/\-([a-z])/g, v => v[1].toUpperCase());
    if (properties.indexOf(key) > -1) {
      element.style[property] = styles[property];
    }
  }
}

function inline() {
  const nodes = document.querySelectorAll('pre *');
  if (nodes) {
    Array.from(nodes).forEach(element => {
      inline_style(element);
    });
  }
}

function update() {
  hljs.highlightElement(preview_code);
  inline();
  output.value = preview.outerHTML;
}

language_selector.addEventListener('change', (e) => {
  language = e.target.value;
  change_language();
});

theme_selector.addEventListener('change', (e) => {
  theme = e.target.value;
  change_theme();
});

letter_spacing_button.addEventListener('click', () => {
  letter_spacing = !letter_spacing;
  toggle_letter_spacing();
});

input.addEventListener('input', () => {
  preview_code.textContent = input.value;
  update();
});
