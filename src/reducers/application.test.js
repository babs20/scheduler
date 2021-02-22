import reducer from 'reducers/application';

describe('Reducer', () => {
  it('throws an error with an unsupported type', () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /Tried to reduce with unsupported action type: null/i
    );
  });
});
