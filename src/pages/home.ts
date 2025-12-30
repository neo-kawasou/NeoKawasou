export function renderHome(): HTMLElement {
  const div = document.createElement('div')
  div.innerHTML = `<h2>Home</h2><p>ホーム画面です</p>`
  return div
}
