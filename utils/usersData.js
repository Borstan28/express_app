const users = [
  { id: 1, username: 'Admin', password: 'adminpassword', permissions: ['counter:read', 'counter:incr', 'counter:decr']},
  { id: 2, username: 'User2', password: 'userpassword', permissions: ['counter:read'] }
];

module.exports = users;