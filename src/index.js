import runes from 'runes';

const assertIsValidText = text => {
  if (typeof text !== 'string') {
    throw new TypeError(
      'Text should be provided as first argument and be a string.'
    );
  }
};

const assertIsValidChunkSize = chunkSizeInt => {
  if (Number.isNaN(chunkSizeInt) || Number.parseInt(chunkSizeInt, 10) <= 0) {
    throw new TypeError(
      'Size should be provided as 2nd argument and parseInt to a value greater than zero.'
    );
  }
};

const assertIsValidChunkType = (chunkType, chunkTypeInt) => {
  if (
    typeof chunkType !== 'undefined' &&
    chunkType !== null &&
    chunkType !== '' &&
    (Number.isNaN(chunkTypeInt) || Number.parseInt(chunkTypeInt, 10) < 0)
  ) {
    throw new TypeError(
      'Type should be provided as 3rd (optional) argument and parseInt to a value >= zero.'
    );
  }
};

const chunkLength = (characters, chunkTypeInt) => {
  let charactersArray;
  if (
    typeof characters === 'undefined' ||
    characters === null ||
    characters === ''
  ) {
    return -1;
  }
  if (typeof characters === 'string') {
    charactersArray = [characters];
  } else if (Array.isArray(characters) && characters.length) {
    charactersArray = characters;
  } else {
    return -1;
  }
  if (chunkTypeInt === 0) {
    return charactersArray
      .map(character => new TextEncoder().encode(character).length)
      .reduce((accumulator, currentValue) => accumulator + currentValue);
  } else if (chunkTypeInt > 1) {
    return charactersArray
      .map(character => new TextEncoder().encode(character).length)
      .reduce(
        (accumulator, currentValue) =>
          accumulator +
          (currentValue > chunkTypeInt ? chunkTypeInt : currentValue)
      );
  } else {
    return charactersArray.length;
  }
};

const chunkSplit = (characters, chunkSizeInt, chunkTypeInt) => {
  let splitAtInt = characters.lastIndexOf(' ', chunkSizeInt);
  if (splitAtInt === -1) {
    if (chunkSizeInt > characters.length) {
      splitAtInt = characters.length - 1;
    } else {
      splitAtInt = chunkSizeInt - 1;
    }
  }
  while (
    chunkSizeInt < chunkLength(characters.slice(0, splitAtInt), chunkTypeInt)
  ) {
    splitAtInt = splitAtInt - 1;
  }

  const splitAtLastSpace = characters.lastIndexOf(' ', splitAtInt);
  if (splitAtLastSpace !== -1) {
    splitAtInt = splitAtLastSpace;
  }

  if (splitAtInt === characters.length) {
    splitAtInt = -1;
  }

  if (splitAtInt === -1) {
    splitAtInt = chunkSizeInt;
  } else {
    splitAtInt = splitAtInt + 1;
  }
  return splitAtInt;
};

export default (text, chunkSize, chunkType) => {
  assertIsValidText(text);
  const chunkSizeInt = Number.parseInt(chunkSize, 10);
  assertIsValidChunkSize(chunkSizeInt);
  const chunkTypeParseInt = Number.parseInt(chunkType, 10);
  assertIsValidChunkType(chunkType, chunkTypeParseInt);
  const chunkTypeInt = Number.isNaN(chunkTypeParseInt) ? 1 : chunkTypeParseInt;
  const chunks = [];
  let characters = runes(text);
  while (chunkLength(characters, chunkTypeInt) > chunkSizeInt) {
    const splitAt = chunkSplit(characters, chunkSizeInt, chunkTypeInt);
    const chunk = characters
      .slice(0, splitAt)
      .join('')
      .trim();
    if (chunk !== '' && chunk !== null) {
      chunks.push(chunk);
    }
    characters = characters.slice(splitAt);
  }
  const chunk = characters.join('').trim();
  if (chunk !== '' && chunk !== null) {
    chunks.push(chunk);
  }
  return chunks;
};
