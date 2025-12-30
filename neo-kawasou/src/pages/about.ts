export function renderAbout(): HTMLElement {
  const div = document.createElement('div')
  div.innerHTML = `<h2>About</h2><p>このサイトについて</p>`
  return div
}
