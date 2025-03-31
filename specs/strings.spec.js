import strings from '../app/strings.js';

const thank = 'Thank you';

describe('strings:', () => {
  it('get localized string by name', () => {
    expect(strings.test.thank).toBe(thank);
    expect(strings['test'].thank).toBe(thank);
    expect(strings.test['thank']).toBe(thank);
    expect(strings['test']['thank']).toBe(thank);
  });
  it('get string from default lang, if current lang has no it', () => {
    expect(Object.keys(strings.test).length).toBe(1);
    expect(strings.test.thank).toBe(thank);
    expect(strings.test.doYouAgree).toBe(strings.default.doYouAgree);
  });
  it('get string from default lang, if current lang does not exist', () => {
    expect(strings.valyrian.thank).toBe(strings.default.thank);
  });
});
