import API from 'services';

export default {
  data: {},
  async getData(params) {
    this.data = await API.get(params);
  },
};
