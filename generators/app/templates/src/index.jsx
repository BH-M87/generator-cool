import ReactDOM from 'react-dom';
import * as React from 'react';
import Router from './routes';
import './styles/index.less';

const render = () => {
  ReactDOM.render(<Router />, document.getElementById('app'));
};

render();

if (module.hot) {
  module.hot.accept('./routes', () => {
    render(); // re-require is not nesseary. See https://github.com/gaearon/react-hot-loader/tree/master/docs#starter-kits
  });
}
