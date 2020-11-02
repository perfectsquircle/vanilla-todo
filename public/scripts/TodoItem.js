import { AppDraggable } from './AppDraggable.js';
import { AppIcon } from './AppIcon.js';

export const TodoItem = el => {
  const state = {
    item: null,
    editing: false,
  };
  let startEditing = false;
  let saveOnBlur = true;

  el.innerHTML = `
    <div class="checkbox">
      <input type="checkbox">
    </div>
    <p class="label"></p>
    <p class="form">
      <input type="text" class="input use-focus-other">
      <button class="app-button save"><i class="app-icon" data-id="check-16"></i></button>
    </p>
  `;

  const checkboxEl = el.querySelector('.checkbox');
  const labelEl = el.querySelector('.label');
  const inputEl = el.querySelector('.input');
  const saveEl = el.querySelector('.save');

  AppDraggable(el, {
    dropSelector: '.todo-list > .items',
  });

  el.querySelectorAll('.app-icon').forEach(AppIcon);

  checkboxEl.addEventListener('touchstart', () => (saveOnBlur = false));

  checkboxEl.addEventListener('mousedown', () => (saveOnBlur = false));

  checkboxEl.addEventListener('click', () => {
    if (state.editing) save();

    el.dispatchEvent(
      new CustomEvent('checkItem', {
        detail: {
          item: state.item,
          done: !state.item.done,
        },
        bubbles: true,
      })
    );
  });

  labelEl.addEventListener('click', () => {
    startEditing = true;
    update({ editing: true });
  });

  inputEl.addEventListener('keyup', e => {
    switch (e.keyCode) {
      case 13: // enter
        save();
        break;
      case 27: // escape
        cancelEdit();
        break;
    }
  });

  inputEl.addEventListener('blur', () => {
    if (saveOnBlur) save();
    saveOnBlur = true;
  });

  inputEl.addEventListener('focusOther', () => {
    if (state.editing) save();
  });

  saveEl.addEventListener('mousedown', () => (saveOnBlur = false));

  saveEl.addEventListener('click', save);

  el.addEventListener('draggableStart', e => {
    e.detail.data.item = state.item;
    e.detail.data.key = state.item.id;
  });

  el.todoItem = {
    update,
  };

  function save() {
    const label = inputEl.value.trim();

    if (label === '') {
      // deferred deletion prevents a bug at reconciliation in TodoList:
      //   Failed to execute 'removeChild' on 'Node': The node to be removed is
      //   no longer a child of this node. Perhaps it was moved in a 'blur'
      //   event handler?
      requestAnimationFrame(() => {
        el.dispatchEvent(
          new CustomEvent('deleteItem', {
            detail: state.item,
            bubbles: true,
          })
        );
      });

      return;
    }

    el.dispatchEvent(
      new CustomEvent('saveItem', {
        detail: {
          item: state.item,
          label,
        },
        bubbles: true,
      })
    );

    update({ editing: false });
  }

  function cancelEdit() {
    saveOnBlur = false;
    update({ editing: false });
  }

  function update(next) {
    // TODO optimize
    Object.assign(state, next);

    el.classList.toggle('-done', state.item.done);
    checkboxEl.querySelector('input').checked = state.item.done;
    labelEl.innerText = state.item.label;

    el.classList.toggle('-editing', state.editing);
    el.classList.toggle('_nodrag', state.editing);

    if (state.editing && startEditing) {
      inputEl.value = state.item.label;
      inputEl.focus();
      inputEl.select();
      startEditing = false;
    }
  }
};
