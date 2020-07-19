import chunk from '../index.js';

it("should throw if 'text' is missing or type or value is invalid.", () => {
  expect(() => {
    chunk();
  }).toThrow(
    new TypeError('Text should be provided as first argument and be a string.')
  );
});

it("should throw if 'size' is missing or type or value is invalid.", () => {
  expect(() => {
    chunk('hello world');
  }).toThrow(
    new TypeError(
      'Size should be provided as 2nd argument and parseInt to a value greater than zero.'
    )
  );
  expect(() => {
    chunk('hello world', 0);
  }).toThrow(
    new TypeError(
      'Size should be provided as 2nd argument and parseInt to a value greater than zero.'
    )
  );
});

it("should throw if 'type' type or value is invalid.", () => {
  expect(() => {
    chunk('hello world', 1, 'one');
  }).toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -1.001);
  }).toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -1);
  }).toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 3);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, '3');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
});
it("should not throw if 'type' type and value are missing or valid.", () => {
  expect(() => {
    chunk('hello world', 1, '');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, null);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, undefined);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -0.001);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 0.0);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 1.0);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, new Number.BigInt(2.0));
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 2.999);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, '2.99999 years');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
  expect(() => {
    chunk('hello world', 1, '2');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    )
  );
});

it('should return an array of strings.', () => {
  const pieces = chunk('hello world', 5);
  expect(pieces).toEqual(['hello', 'world']);
});

it('should not cut in the middle of words', () => {
  const pieces = chunk('hello world how are you?', 7);
  expect(pieces).toEqual(['hello', 'world', 'how are', 'you?']);
});

it('should truncate a word if longer than size', () => {
  const pieces = chunk('hello you', 4);
  expect(pieces).toEqual(['hell', 'o', 'you']);
});

it('should count double width characters as single characters', () => {
  // each of these characters is two bytes
  const chineseText = '𤻪𬜬𬜯';
  const camembert = '🧀🧀🧀🧀 🧀🧀🧀🧀';

  expect(chunk(chineseText, 2)).toEqual(['𤻪𬜬', '𬜯']);
  expect(chunk(chineseText, 1)).toEqual(['𤻪', '𬜬', '𬜯']);
  expect(chunk(camembert, 4)).toEqual(['🧀🧀🧀🧀', '🧀🧀🧀🧀']);
});

it('should not cut combined characters', () => {
  // one woman runner emoji with a colour is seven bytes, or five characters
  // RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
  const runners = '🏃🏽‍♀️🏃🏽‍♀️🏃🏽‍♀️';
  // FLAG + RAINBOW
  const flags = '🏳️‍🌈🏳️‍🌈';

  expect(chunk(runners, 3)).toEqual(['🏃🏽‍♀️🏃🏽‍♀️🏃🏽‍♀️']);
  expect(chunk(runners, 1)).toEqual(['🏃🏽‍♀️', '🏃🏽‍♀️', '🏃🏽‍♀️']);
  expect(chunk(flags, 1)).toEqual(['🏳️‍🌈', '🏳️‍🌈']);
});
