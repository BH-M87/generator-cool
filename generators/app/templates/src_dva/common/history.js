import { createBrowserHistory, createHashHistory } from 'history';
import { isHashHistory } from 'config/config';

const history = isHashHistory ? createHashHistory() : createBrowserHistory();

export default history;
