import API from "services";

export default {
  data: {},
  getData(params) {
    this.data = API.get(params);
  }
};
