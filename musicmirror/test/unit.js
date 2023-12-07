const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { expect } = Code;
const lab = exports.lab = Lab.script();

lab.test('Smoke Test', () => {
    expect(true).to.equal(true);
});