import { AppSortable } from './AppSortable.js';
import { TodoItemInput } from './TodoItemInput.js';
import { TodoItem } from './TodoItem.js';

export const TodoList = el => {
  const state = {
    items: [],
  };

  el.innerHTML = `
    <div class="items"></div>
    <div class="todo-item-input"></div>
  `;

  AppSortable(el.querySelector('.items'), {});
  TodoItemInput(el.querySelector('.todo-item-input'));

  el.addEventListener('sortableDrop', e => {
    el.dispatchEvent(
      new CustomEvent('moveItem', {
        detail: {
          item: e.detail.data.item,
          index: e.detail.index,
        },
        bubbles: true,
      })
    );
  });

  function update(next) {
    Object.assign(state, next);

    const container = el.querySelector('.items');
    const obsolete = new Set(container.children);
    const childrenByKey = new Map();

    obsolete.forEach(child => {
      childrenByKey.set(child.getAttribute('data-key'), child);
    });

    const children = state.items.map(item => {
      let child = childrenByKey.get(item.id);

      if (child) {
        obsolete.delete(child);
      } else {
        child = document.createElement('div');
        child.classList.add('todo-item');
        child.setAttribute('data-key', item.id);
        TodoItem(child);
      }

      child.todoItem.update({ item });

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
  }

  el.todoList = {
    update,
  };
};
