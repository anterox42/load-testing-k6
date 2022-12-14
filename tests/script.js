import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const csvData = new SharedArray('inputs', function () {
  return papaparse.parse(open('./data.csv'), { header: true }).data;
});

export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '1m',
    },
  },
};

const url = 'https://petstore.swagger.io/v2/user';

export default function () {
  const randomUser = csvData[Math.floor(Math.random() * csvData.length)];
  const updateBody = {
    lastName: randomUser.lastName + '/v2',
  };
  const checkSuccess = (res) =>
    check(res, {
      'status is 200': (r) => r.status === 200,
    });

  // CREATE
  checkSuccess(
    http.post(url, JSON.stringify(randomUser), {
      headers: { 'Content-Type': 'application/json' },
    })
  );

  // UPDATE
  checkSuccess(
    http.put(url + `/${randomUser.username}`, JSON.stringify(updateBody), {
      headers: { 'Content-Type': 'application/json' },
    })
  );

  // DELETE
  checkSuccess(http.del(url + `/${randomUser.username}`));
}
