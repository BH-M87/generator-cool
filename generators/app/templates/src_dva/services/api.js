// config all the api here, and retrive the data with APIFunction.api();
// PS: import APIFunction from 'services';
export default {
  defaultGet: '/get',
  get: 'GET /get',
  post: 'POST /post',
  form: 'FORM /form',
  // For restful api, put 'type' and 'id' in data.
  // For example: { type: 'type', id: 1 }, it will be replaced.
  restfulGet: '/get/:type/:id',
  restfulPost: 'POST /post/:type/:id',
  restfulForm: 'FORM /post/:type/:id',
};
