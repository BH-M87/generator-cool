const mockData = {};

/* *********************************** */
/* wrap the mock data in data attibute */
const wrappedMockData = {};

for (const key in mockData) {
  wrappedMockData[key] = {};
  wrappedMockData[key].success = true;
  wrappedMockData[key].errCode = 0;
  wrappedMockData[key].data = mockData[key];
}

module.exports = wrappedMockData;
// module.exports = {};
