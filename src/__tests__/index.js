import chunk from '../index';
import 'fast-text-encoding'; // Required for TextEncoder support in jest.

it('should throw an error if no text is provided or invalid type.', () => {
  expect(() => {
    chunk();
  }).toThrow(
    new TypeError('Text should be provided as first argument and be a string.')
  );
});

it('should throw an error if no size is provided or invalid type.', () => {
  expect(() => {
    chunk('hello world');
  }).toThrow(
    new TypeError(
      'Size should be provided as 2nd argument and be a number greater than zero.'
    )
  );
  expect(() => {
    chunk('hello world', 0);
  }).toThrow(
    new TypeError(
      'Size should be provided as 2nd argument and be a number greater than zero.'
    )
  );
});

it("should throw if 'type' argument's type or value is invalid.", () => {
  expect(() => {
    chunk('hello world', 1, 'one');
  }).toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -2.001);
  }).toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -2);
  }).toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 3);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, '3');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
});

it("should not throw if 'type' type and value are missing or valid.", () => {
  expect(() => {
    chunk('hello world', 1, '');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, null);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, undefined);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -1.999);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, -0.001);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 0.0);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 1.0);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, new Number.BigInt(2.0));
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, 2.999);
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, '2.99999 years');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    )
  );
  expect(() => {
    chunk('hello world', 1, '2');
  }).not.toThrow(
    new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
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

it('should count multi-byte characters as single characters by default', () => {
  // each of these characters is two bytes
  const chineseTextA = '𤻪';
  const chineseTextB = '𬜬';
  const chineseTextC = '𬜯';
  const chineseText = chineseTextA + chineseTextB + chineseTextC;
  expect(chunk(chineseText, 2)).toEqual([
    chineseTextA + chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 1)).toEqual([
    chineseTextA,
    chineseTextB,
    chineseTextC,
  ]);

  // each of these characters is two bytes
  const fourCheese = '🧀🧀🧀🧀';
  const camembert = `${fourCheese} ${fourCheese}`;
  expect(chunk(camembert, 4)).toEqual([fourCheese, fourCheese]);

  // one woman runner emoji with a colour is seven bytes, or five characters
  // RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
  const runner = '🏃🏽‍♀️';
  expect(
    chunk(runner + runner + runner + runner + runner + runner + runner, 3)
  ).toEqual([runner + runner + runner, runner + runner + runner, runner]);
});

it('should count all characters as single characters using chunkType -1 or 1 values', () => {
  // each of these characters is two bytes
  const chineseTextA = '𤻪';
  const chineseTextB = '𬜬';
  const chineseTextC = '𬜯';
  const chineseText = chineseTextA + chineseTextB + chineseTextC;
  expect(chunk(chineseText, 2, -1)).toEqual([
    chineseTextA + chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 1, -1)).toEqual([
    chineseTextA,
    chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 2, 1)).toEqual([
    chineseTextA + chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 1, 1)).toEqual([
    chineseTextA,
    chineseTextB,
    chineseTextC,
  ]);

  // each of these characters is two bytes
  const fourCheese = '🧀🧀🧀🧀';
  const camembert = `${fourCheese} ${fourCheese}`;
  expect(chunk(camembert, 4, -1)).toEqual([fourCheese, fourCheese]);
  expect(chunk(camembert, 4, 1)).toEqual([fourCheese, fourCheese]);

  // The Woman Running emoji is a ZWJ sequence combining 🏃 Person Running, ‍ Zero Width Joiner and ♀ Female Sign.
  // each of these characters is five bytes
  // (actually encodes to 13)
  const womanRunningZWJ = '🏃‍♀️';
  const womenRunningZWJ = `${womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ} ${womanRunningZWJ + womanRunningZWJ}`;
  expect(chunk(womenRunningZWJ, 2, -1)).toEqual([
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
  ]);
  expect(chunk(womenRunningZWJ, 2, 1)).toEqual([
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
  ]);
});

it('should count characters as bytes using chunkType value 0', () => {
  // each of these characters is two bytes (actually encodes to 4)
  const chineseTextA = '𤻪';
  const chineseTextB = '𬜬';
  const chineseTextC = '𬜯';
  const chineseText = chineseTextA + chineseTextB + chineseTextC;
  expect(chunk(chineseText, 2, 0)).toEqual([
    chineseTextA,
    chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 1, 0)).toEqual([
    chineseTextA,
    chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 11, 0)).toEqual([
    chineseTextA + chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 12, 0)).toEqual([
    chineseTextA + chineseTextB + chineseTextC,
  ]);

  // each of these characters is two bytes (actually encodes to 4)
  const twoCheese = '🧀🧀';
  const camembert = `${twoCheese + twoCheese} ${twoCheese + twoCheese}`;
  expect(chunk(camembert, 8, 0)).toEqual([
    twoCheese,
    twoCheese,
    twoCheese,
    twoCheese,
  ]);

  // The Woman Running emoji is a ZWJ sequence combining 🏃 Person Running, ‍ Zero Width Joiner and ♀ Female Sign.
  // each of these characters is five bytes
  // (actually encodes to 13)
  const womanRunningZWJ = '🏃‍♀️';
  const womenRunningZWJ = `${womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ} ${womanRunningZWJ + womanRunningZWJ}`;
  expect(chunk(womenRunningZWJ, 26, 0)).toEqual([
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
  ]);
  expect(
    chunk(
      `12123123 1231231 312312312 123 12 ${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ} ${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}`,
      52,
      0
    )
  ).toEqual([
    `12123123 1231231 312312312 123 12 ${womanRunningZWJ}`,
    `${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}`,
    `${womanRunningZWJ} ${womanRunningZWJ}${womanRunningZWJ}`,
    `${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}`,
    `${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}`,
  ]);

  // one woman runner emoji with a colour is seven bytes, or five characters
  // RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
  // (actually encodes to 17)
  const runner = '🏃🏽‍♀️';
  expect(chunk(runner + runner + runner, 17, 0)).toEqual([
    runner,
    runner,
    runner,
  ]);
  expect(
    chunk(
      `12123123 1231231 312312312 123 12 ${runner}${runner}${runner}${runner}${runner}${runner} ${runner}${runner}${runner}${runner} ${runner} ${runner}${runner} ${runner}`,
      68,
      0
    )
  ).toEqual([
    `12123123 1231231 312312312 123 12 ${runner}${runner}`,
    `${runner}${runner}${runner}${runner}`,
    `${runner}${runner}${runner}${runner}`,
    `${runner} ${runner}${runner}`,
    `${runner}`,
  ]);
});

it('should count single width characters the same with all chunkType values', () => {
  for (let i = 0; i < 100; i++) {
    expect(chunk('hello you', 4, i)).toEqual(['hell', 'o', 'you']);
  }
});

it('should count characters as bytes up to maximum N chunkType value > 0', () => {
  // each of these characters is two bytes (actually encodes to 4)
  const chineseTextA = '𤻪';
  const chineseTextB = '𬜬';
  const chineseTextC = '𬜯';
  const chineseText = chineseTextA + chineseTextB + chineseTextC;
  expect(chunk(chineseText, 2, 2)).toEqual([
    chineseTextA,
    chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 4, 2)).toEqual([
    chineseTextA + chineseTextB,
    chineseTextC,
  ]);
  expect(chunk(chineseText, 2, 1)).toEqual([
    chineseTextA + chineseTextB,
    chineseTextC,
  ]);

  // each of these characters is two bytes (actually encodes to 4)
  const cheese = '🧀';
  const twoCheese = cheese + cheese;
  const camembert = `${twoCheese + twoCheese} ${twoCheese + twoCheese}`;
  expect(chunk(camembert, 4, 2)).toEqual([
    twoCheese,
    twoCheese,
    twoCheese,
    twoCheese,
  ]);
  expect(chunk(camembert, 4, 4)).toEqual([
    cheese,
    cheese,
    cheese,
    cheese,
    cheese,
    cheese,
    cheese,
    cheese,
  ]);

  // The Woman Running emoji is a ZWJ sequence combining 🏃 Person Running, ‍ Zero Width Joiner and ♀ Female Sign.
  // each of these characters is five bytes
  // (actually encodes to 13)
  const womanRunningZWJ = '🏃‍♀️';
  const womenRunningZWJ = `${womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ} ${womanRunningZWJ + womanRunningZWJ}`;
  expect(chunk(womenRunningZWJ, 2, 0)).toEqual([
    womanRunningZWJ,
    womanRunningZWJ,
    womanRunningZWJ,
    womanRunningZWJ,
    womanRunningZWJ,
    womanRunningZWJ,
  ]);
  for (let i = 2; i < 100; i++) {
    expect(chunk(womenRunningZWJ, 2, i)).toEqual([
      womanRunningZWJ,
      womanRunningZWJ,
      womanRunningZWJ,
      womanRunningZWJ,
      womanRunningZWJ,
      womanRunningZWJ,
    ]);
  }
  expect(chunk(womenRunningZWJ, 4, 1)).toEqual([
    womanRunningZWJ + womanRunningZWJ + womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
  ]);
  expect(chunk(womenRunningZWJ, 4, 2)).toEqual([
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
  ]);
  expect(chunk(womenRunningZWJ, 8, 4)).toEqual([
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
    womanRunningZWJ + womanRunningZWJ,
  ]);
  for (let i = 9; i < 100; i++) {
    expect(chunk(womenRunningZWJ, 26, i)).toEqual([
      womanRunningZWJ + womanRunningZWJ,
      womanRunningZWJ + womanRunningZWJ,
      womanRunningZWJ + womanRunningZWJ,
    ]);
  }
  expect(
    chunk(
      `12123123 1231231 312312312 123 12 ${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ} ${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}`,
      12,
      2
    )
  ).toEqual([
    '12123123',
    '1231231',
    '312312312',
    '123 12',
    `${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}`,
    `${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}`,
    `${womanRunningZWJ}${womanRunningZWJ} ${womanRunningZWJ}`,
  ]);

  // one woman runner emoji with a colour is seven bytes, or five characters
  // RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
  // (actually encodes to 17)
  const runner = '🏃🏽‍♀️';
  expect(chunk(runner + runner + runner, 4, 2)).toEqual([
    runner + runner,
    runner,
  ]);
  expect(
    chunk(
      `12123123 1231231 312312312 123 12 ${runner}${runner}${runner}${runner}${runner}${runner} ${runner}${runner}${runner}${runner} ${runner} ${runner}${runner} ${runner}`,
      12,
      2
    )
  ).toEqual([
    '12123123',
    '1231231',
    '312312312',
    '123 12',
    `${runner}${runner}${runner}${runner}${runner}${runner}`,
    `${runner}${runner}${runner}${runner} ${runner}`,
    `${runner}${runner} ${runner}`,
  ]);
});

it('should count N-byte characters with chunkType value 0 the same as chunkType value N', () => {
  // each of these characters is two bytes (actually encodes to 4)
  const camembert = '🧀🧀🧀🧀 🧀🧀🧀🧀';
  expect(chunk(camembert, 4, 2)).toEqual(chunk(camembert, 8, 0));

  // The Woman Running emoji is a ZWJ sequence combining 🏃 Person Running, ‍ Zero Width Joiner and ♀ Female Sign.
  // each of these characters is five bytes
  const womanRunningZWJ = '🏃‍♀️';
  const womenRunningZWJ = `${womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ} ${womanRunningZWJ + womanRunningZWJ}`;
  expect(chunk(womenRunningZWJ, 2, 0)).toEqual(chunk(womenRunningZWJ, 2, 5));

  // one woman runner emoji with a colour is seven bytes, or five characters
  // RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
  const runner = '🏃🏽‍♀️';
  const runners = runner + runner + runner;
  expect(chunk(runners, 2, 0)).toEqual(chunk(runners, 2, 7));
});

it('should count default chunkType the same as chunkType value -1', () => {
  // each of these characters is two bytes
  const chineseText = '𤻪𬜬𬜯';
  expect(chunk(chineseText, 2)).toEqual(chunk(chineseText, 2, -1));
  expect(chunk(chineseText, 1)).toEqual(chunk(chineseText, 1, -1));

  // each of these characters is two bytes
  const camembert = '🧀🧀🧀🧀 🧀🧀🧀🧀';
  expect(chunk(camembert, 4)).toEqual(chunk(camembert, 4, -1));

  // The Woman Running emoji is a ZWJ sequence combining 🏃 Person Running, ‍ Zero Width Joiner and ♀ Female Sign.
  // each of these characters is five bytes
  const womanRunningZWJ = '🏃‍♀️';
  const womenRunningZWJ = `${womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ +
    womanRunningZWJ} ${womanRunningZWJ + womanRunningZWJ}`;
  expect(chunk(womenRunningZWJ, 2)).toEqual(chunk(womenRunningZWJ, 2, -1));

  // one woman runner emoji with a colour is seven bytes, or five characters
  // RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
  const runner = '🏃🏽‍♀️';
  const runners = runner + runner + runner;
  expect(chunk(runners, 2)).toEqual(chunk(runners, 2, -1));
});

// this test does not pass yet
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
