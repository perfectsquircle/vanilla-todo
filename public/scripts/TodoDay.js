/* global VT */
window.VT = window.VT || {};

VT.TodoDay = el => {
  const state = {
    dateId: el.getAttribute('data-key'),
    items: [],
  };

  el.innerHTML = [
    '<div class="header">',
    '  <h3 class="dayofweek"></h3>',
    '  <h6 class="date"></h6>',
    '</div>',
    '<div class="todo-list"></div>',
  ].join('\n');

  VT.TodoList(el.querySelector('.todo-list'));

  el.addEventListener('addItem', e => {
    e.detail.listId = state.dateId;
  });

  el.addEventListener('moveItem', e => {
    e.detail.listId = state.dateId;
    e.detail.index = e.detail.index || 0;
  });

  el.todoDay = {
    update,
  };

  function update(next) {
    Object.assign(state, next);

    const date = new Date(state.dateId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    el.classList.toggle('-past', date < today);
    el.classList.toggle('-today', date >= today && date < tomorrow);

    el.querySelector('.header > .dayofweek').innerText = VT.formatDayOfWeek(
      date
    );
    el.querySelector('.header > .date').innerText = VT.formatDate(date);
    el.querySelector('.todo-list').todoList.update({ items: state.items });
  }
};
