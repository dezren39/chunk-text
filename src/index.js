import runes from 'runes';

const assertIsValidText = text => {
  if (typeof text !== 'string') {
    throw new TypeError(
      'Text should be provided as first argument and be a string.'
    );
  }
};

const assertIsValidChunkSize = chunkSize => {
  if (Number.isNaN(chunkSize) || Number.parseInt(chunkSize, 10) <= 0) {
    throw new TypeError(
      'Size should be provided as 2nd argument and parseInt to a value greater than zero.'
    );
  }
};

const assertIsValidChunkType = (
  chunkType,
  chunkTypeParseIntNaN,
  chunkTypeInt
) => {
  if (
    typeof chunkType !== 'undefined' &&
    chunkType !== null &&
    chunkType !== '' &&
    (chunkTypeParseIntNaN || chunkTypeInt < -1)
  ) {
    throw new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= -1.'
    );
  }
};

const chunkLength = (characters, chunkType) => {
  let length;
  if (
    typeof characters === 'undefined' ||
    characters === null ||
    characters === ''
  ) {
    length = -1;
  } else {
    let charactersArray;
    if (typeof characters === 'string') {
      charactersArray = [characters];
    } else if (Array.isArray(characters) && characters.length) {
      charactersArray = characters;
    }

    if (
      !Array.isArray(charactersArray) ||
      !charactersArray.length ||
      charactersArray === null
    ) {
      length = -1;
    } else if (chunkType === 0) {
      length = charactersArray
        .map(character => new TextEncoder().encode(character).length)
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    } else if (chunkType > 0) {
      const arrayLength = charactersArray
        .map(character => new TextEncoder().encode(character).length)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue > chunkType ? chunkType : currentValue)
        );
      const maxLength = charactersArray.length * chunkType;
      length = maxLength > arrayLength ? arrayLength : maxLength;
    } else {
      length = charactersArray.length;
    }
  }
  return length;
};

const chunkIndexOf = (characters, chunkSize, chunkType) => {
  let splitAt = characters.lastIndexOf(' ', chunkSize);
  if (splitAt > -2 && splitAt < 1) {
    splitAt = chunkSize;
  }
  if (splitAt > characters.length || chunkSize >= characters.length) {
    splitAt = characters.length;
  }
  while (
    splitAt > 0 &&
    chunkSize < chunkLength(characters.slice(0, splitAt), chunkType)
  ) {
    splitAt = splitAt - 1;
  }
  if ((splitAt > -2 && splitAt < 1) || characters[splitAt] === ' ') {
    splitAt = splitAt + 1;
  }
  if (
    splitAt > characters.length ||
    splitAt < 0 ||
    (splitAt === 0 && characters.length === 1)
  ) {
    splitAt = characters.length;
  }
  return splitAt;
};

export default (text, chunkSize, chunkType) => {
  assertIsValidText(text);
  const chunkSizeInt = Number.parseInt(chunkSize, 10);
  assertIsValidChunkSize(chunkSizeInt);
  const chunkTypeParseInt = Number.parseInt(chunkType, 10);
  const chunkTypeParseIntNaN = Number.isNaN(chunkTypeParseInt);
  assertIsValidChunkType(chunkType, chunkTypeParseIntNaN, chunkTypeParseInt);
  const chunkTypeInt = chunkTypeParseIntNaN ? -1 : chunkTypeParseInt;
  const chunks = [];
  let characters = runes(text);
  while (chunkLength(characters, chunkTypeInt) > 0) {
    const splitAt = chunkIndexOf(characters, chunkSizeInt, chunkTypeInt);
    const chunk = characters
      .slice(0, splitAt)
      .join('')
      .trim();
    if (chunk !== '' && chunk !== null) {
      chunks.push(chunk);
    }
    characters = characters.slice(splitAt);
  }
  return chunks;
};
