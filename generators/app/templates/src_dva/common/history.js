import { createBrowserHistory, createHashHistory } from 'history';

export const isHashHistory = true; // true or false

const browserHistory = createBrowserHistory();
const hashHistory = createHashHistory();

const history = isHashHistory ? hashHistory : browserHistory;

export default history;
