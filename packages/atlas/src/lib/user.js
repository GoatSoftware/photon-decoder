export function getUser() {
  const token = localStorage.getItem('jwt');
  return JSON.parse(atob(token.split('.')[1]));
}
