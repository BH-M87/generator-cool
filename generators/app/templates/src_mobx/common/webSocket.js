const getAbsoluteUrl = lPath => {
  let url = '';
  let path = lPath;
  if (path.startsWith('ws')) {
    url = path;
  } else {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    const {
      location: { protocol, host },
    } = window;
    url = `ws${protocol === 'https:' ? 's' : ''}://${host}${path}`;
  }
  return url;
};
/* eslint import/prefer-default-export:0 */
export const initWebSocket = path => new WebSocket(getAbsoluteUrl(path));

// class MySocket {
//   constructor(path) {
//     this.socketInstance = new WebSocket(getAbsoluteUrl(path));
//     this.socketInstance.onmessage = message => {
//       try {
//         const { event, data } = JSON.parse(message);
//         if (this.events[event]) {
//           for (const func of this.events[event]) {
//             func(null, data);
//           }
//         }
//       } catch (error) {
//         this.handleError(error);
//       }
//     };
//   }
//   //创建 websocket 的缓存对象
//   socketInstance;
//   events = {};
//   on(event, callback) {
//     if (typeof event !== 'string') throw new Error('event must be string');
//     if (typeof callback !== 'function') {
//       throw new Error('callback must be function');
//     }
//     if (!event || !callback) return this;
//     if (!this.events[event]) {
//       this.events[event] = [callback];
//     } else {
//       this.events[event].push(callback);
//     }
//     if (
//       this.socketInstance &&
//       (event === 'open' || event === 'close' || event === 'error')
//     ) {
//       this.socketInstance[`on${event}`] = (...args) => {
//         for (const func of this.events[event]) {
//           func(...args);
//         }
//       };
//     }
//     return this;
//   }
//   emit(event, data) {
//     if (this.socketInstance) {
//       try {
//         this.socketInstance.send(JSON.stringify({ event, data }));
//       } catch (error) {
//         this.handleError(error);
//       }
//     }
//   }
//   close() {
//     if (this.socketInstance) {
//       this.socketInstance.close();
//       this.socketInstance = null;
//     }
//   }
//   handleError(error) {
//     if (this.events.error) {
//       this.events.error(error);
//     }
//   }
// }

// export default new MySocket('/websocket').on('error', () => console.log(123));
