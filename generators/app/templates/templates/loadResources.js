/* eslint-disable */
function getStyle(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}
function loadStyles(url) {
  if (!url) {
    return;
  }
  if (Array.isArray(url)) {
    url.forEach(value => {
      getStyle(value);
    });
  } else {
    getStyle(url);
  }
}

function getJS(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';

  script.onerror = function onerror(error) {
    console.error(`${url}: load error!`, error);
  };

  script.src = url;
  document.body.appendChild(script);
}
function loadScripts(url) {
  if (!url) {
    return;
  }
  if (Array.isArray(url)) {
    for (const currentValue of url) {
      if (Array.isArray(currentValue)) {
        /* eslint no-await-in-loop:0 */ /* design to wait to execute one by one */
        currentValue.map(value => getJS(value));
      } else if (currentValue) {
        getJS(currentValue);
      }
    }
  } else {
    getJS(url);
  }
}

function ajax(params) {
  params = params || {};
  params.data = params.data || {};
  // 判断是ajax请求还是jsonp请求
  var json = json(params);
  // ajax请求
  function json(params) {
    // 请求方式，默认是GET
    params.type = (params.type || 'GET').toUpperCase();
    // 避免有特殊字符，必须格式化传输数据
    params.data = formatParams(params.data);
    let xhr = null;

    // 实例化XMLHttpRequest对象
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      // IE6及其以下版本
      xhr = new ActiveXObjcet('Microsoft.XMLHTTP');
    }

    // 监听事件，只要 readyState 的值变化，就会调用 readystatechange 事件
    xhr.onreadystatechange = function () {
      // readyState属性表示请求/响应过程的当前活动阶段，4为完成，已经接收到全部响应数据
      if (xhr.readyState == 4) {
        const status = xhr.status;
        // status：响应的HTTP状态码，以2开头的都是成功
        if (status >= 200 && status < 300) {
          let response = '';
          // 判断接受数据的内容类型
          const type = xhr.getResponseHeader('Content-type');
          if (type.indexOf('xml') !== -1 && xhr.responseXML) {
            response = xhr.responseXML; //Document对象响应
          } else if (type === 'application/json') {
            response = JSON.parse(xhr.responseText); //JSON响应
          } else {
            response = xhr.responseText; //字符串响应
          }
          // 成功回调函数
          params.success && params.success(response);
        } else {
          params.error && params.error(status);
        }
      }
    };

    // 连接和传输数据
    if (params.type == 'GET') {
      // 三个参数：请求方式、请求地址(get方式时，传输数据是加在地址后的)、是否异步请求(同步请求的情况极少)；
      xhr.open(params.type, `${params.url}?${params.data}`, true);
      xhr.send(null);
    } else {
      xhr.open(params.type, params.url, true);
      //必须，设置提交时的内容类型
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // 传输数据
      xhr.send(params.data);
    }
  }
  //格式化参数
  function formatParams(data) {
    const arr = [];
    for (const name in data) {
      // encodeURIComponent() ：用于对 URI 中的某一部分进行编码
      arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
    }
    // 添加一个时间戳，防止缓存
    arr.push(`t=${Date.now()}`);
    return arr.join('&');
  }
}

function loadResources(manifest) {
  const resources = JSON.parse(manifest);
  const jsResources = [];
  const cssResources = [];
  const resourcesSequence = {
    'runtime~main': 0,
    'vendors~main': 1,
    main: 2
  };
  Object.keys(resources)
    .sort((a, b) => {
      const pre = resourcesSequence[a] || -1;
      const after = resourcesSequence[b] || -1;
      return pre - after;
    })
    .forEach((key) => {
      const value = resources[key] || {};
      if (key === 'null') {
        // lazy resources, key === 'null'
        return;
      }
      if (value.js) {
        jsResources.push(Array.isArray(value.js) && value.js.length === 1 ? value.js[0] : value.js);
      }
      if (value.css) {
        cssResources.push(
          Array.isArray(value.css) && value.css.length === 1 ? value.css[0] : value.css
        );
      }
    });

  loadStyles(cssResources);
  loadScripts(jsResources);
}

// run
ajax({
  url: window.buildManifestUrl,
  success: loadResources
});
