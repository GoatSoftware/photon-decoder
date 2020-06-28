const notifications = [];
const defaultDuration = 3000;

export function addNotification(text) {
  const item = {text};
  showNotification(item);
  setTimeout(() => {
    removeNotification(item);
  }, defaultDuration);
}

function getPlaceholder() {
  let placeholder = document.getElementsByClassName('toast-placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.classList.add('toast-placeholder');
    document.body.appendChild(placeholder);
  }
  return placeholder;
}

function showNotification(item) {
  defaultDuration
  notifications.push(item);
}

function removeNotification(item) {
  notifications.splice(0, 1);
}