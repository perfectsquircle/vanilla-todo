/* global VT */
window.VT = window.VT || {};

VT.TodoFrameDays = el => {
  const RANGE = 14;
  const state = {
    items: [],
    at: VT.formatDateId(new Date()),
  };

  el.innerHTML = [
    '<nav class="leftcontrols">',
    '  <p><button class="app-button -circle -xl backward"><i class="app-icon" data-id="chevron-left-24"></i></button></p>',
    '  <p><button class="app-button fastbackward"><i class="app-icon -double" data-id="chevron-left-16"></i></i></button></p>',
    '  <p><button class="app-button home"><i class="app-icon" data-id="home-16"></i></button></p>',
    '</nav>',
    '<div class="container"></div>',
    '<nav class="rightcontrols">',
    '  <p><button class="app-button -circle -xl forward"><i class="app-icon" data-id="chevron-right-24"></i></button></p>',
    '  <p><button class="app-button fastforward"><i class="app-icon -double" data-id="chevron-right-16"></i></button></p>',
    '</nav>',
  ].join('\n');

  setTimeout(() => {
    el.classList.add('-animated');
  }, 200);

  el.querySelectorAll('.app-icon').forEach(VT.AppIcon);

  el.querySelector('.backward').addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('seek', { detail: -1, bubbles: true }));
  });

  el.querySelector('.forward').addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('seek', { detail: 1, bubbles: true }));
  });

  el.querySelector('.fastbackward').addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('seek', { detail: -5, bubbles: true }));
  });

  el.querySelector('.fastforward').addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('seek', { detail: 5, bubbles: true }));
  });

  el.querySelector('.home').addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('seekHome', { bubbles: true }));
  });

  el.todoFrameDays = {
    update,
  };

  function update(next) {
    Object.assign(state, next);

    const days = getDays();

    const container = el.querySelector('.container');
    const obsolete = new Set(container.children);
    const childrenByKey = new Map();

    obsolete.forEach(child => {
      childrenByKey.set(child.getAttribute('data-key'), child);
    });

    const children = days.map(day => {
      let child = childrenByKey.get(day.id);

      if (child) {
        obsolete.delete(child);
      } else {
        child = document.createElement('div');
        child.className = 'card todo-day';
        child.setAttribute('data-key', day.id);
        VT.TodoDay(child);
      }

      child.todoDay.update(day);
      child.style.transform = `translateX(${day.position * 100}%)`;

      return child;
    });

    obsolete.forEach(child => {
      container.removeChild(child);
    });

    children.forEach((child, index) => {
      if (child !== container.children[index]) {
        container.insertBefore(child, container.children[index]);
      }
    });

    updateHeight();
  }

  function updateHeight() {
    let height = 280;
    const container = el.querySelector('.container');

    for (let i = 0, l = container.children.length; i < l; ++i) {
      height = Math.max(container.children[i].offsetHeight, height);
    }

    el.style.height = `${height + 50}px`;
  }

  function getDays() {
    const days = [];

    for (let i = 0; i < 2 * RANGE; ++i) {
      const t = new Date(state.at);
      t.setDate(t.getDate() - RANGE + i);
      const id = VT.formatDateId(t);

      days.push({
        id,
        items: getItemsForDay(id),
        position: -RANGE + i,
      });
    }

    return days;
  }

  function getItemsForDay(dateId) {
    const items = state.items.filter(item => item.listId === dateId);

    items.sort((a, b) => a.index - b.index);

    return items;
  }
};
