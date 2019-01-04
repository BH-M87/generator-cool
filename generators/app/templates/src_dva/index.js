import dva from 'dva';
import createLoading from 'dva-loading';
import models from 'models';
import history from 'common/history';
import 'styles/index.less';

// 1. Initialize
const app = dva({
  history,
});

// 2. Plugins
app.use(createLoading());

// 3. Model
models.forEach(m => {
  app.model(m);
});

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#app');
