export const AppIcon = el => {
  if (el.children.length > 0) return;

  const id = el.getAttribute('data-id');
  let promise = AppIcon.cache[id];

  if (!promise) {
    const url = `${AppIcon.baseUrl + id}.svg`;
    promise = AppIcon.cache[id] = fetch(url).then(r => r.text());
  }

  promise.then(svg => {
    el.innerHTML = el.classList.contains('-double') ? svg + svg : svg;
  });
};

AppIcon.baseUrl =
  'https://rawcdn.githack.com/primer/octicons/ff7f6eee63fa2f2d24d02e3aa76a87db48e4b6f6/icons/';
AppIcon.cache = {};
