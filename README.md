Chunk text
===

> chunk/split a string by length without cutting/truncating words.


``` javascript
var out = chunk('hello world how are you?', 7);
/* ['hello', 'world', 'how are', 'you?'] */
```


## Installation

``` bash
$ npm install chunk-text
# yarn add chunk-text
```


## Usage

All number values are parsed according to `Number.parseInt`.

``` javascript
var chunk = require('chunk-text');
```

#### chunk(text, chunkSize);

Chunks the `text` string into an array of strings that each have a maximum length of `chunkSize`.

``` javascript
var out = chunk('hello world how are you?', 7);
/* ['hello', 'world', 'how are', 'you?'] */
```

If no space is detected before `chunkSize` is reached, then it will truncate the word to always
ensure the resulting text chunks have at maximum a length of `chunkSize`.

``` javascript
var out = chunk('hello world', 4);
/* ['hell', 'o', 'worl', 'd'] */
```

#### chunk(text, chunkSize, chunkType);

Chunks the `text` string into an array of strings that each have a maximum length of `chunkSize`, as determined by `chunkType`.

The default behavior if `chunkType` is excluded is equal to `chunkType=-1`.

For single-byte characters, `chunkType` never changes the results.

For multi-byte characters, `chunkType` allows awareness of multi-byte glyphs according to the following table:

| `chunkType` | result                                                                                                                                                                                          |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -1          | - same as default, same as `chunkType=1`<br />- each character counts as 1 towards length                                                                                                         |
| 0           | - each character counts as the number of bytes it contains                                                                                                                                      |
| >0          | - each character counts as the number of bytes it contains, up to a limit of `chunkType=N`<br />- a 7-byte ZWJ emoji such as runningPerson+ZWJ+femaleSymbol (🏃🏽‍♀️) counts as 2, when `chunkType=2` |

``` javascript
// one woman runner emoji with a colour is seven bytes, or five characters
// RUNNER(2) + COLOUR(2) + ZJW + GENDER + VS15
// (actually encodes to 17)
const runner = '🏃🏽‍♀️';
const outDefault = chunk(runner+runner+runner, 4);
/* [ '🏃🏽‍♀️🏃🏽‍♀️🏃🏽‍♀️' ] */
const outZero = chunk(runner+runner+runner, 4, 0);
/* [ '🏃🏽‍♀️', '🏃🏽‍♀️', '🏃🏽‍♀️' ] */
const outTwo = chunk(runner+runner+runner, 4, 2);
/* [ '🏃🏽‍♀️🏃🏽‍♀️', '🏃🏽‍♀️' ] */
```

## Usage in Algolia context

This library was created by [Algolia](https://www.algolia.com/) to ease
the optimizing of record payload sizes resulting in faster search responses from the API.

In general, there is always a unique large "content attribute" per record,
and this packages will allow to chunk that content into small chunks of text.

The text chunks can then be [distributed over multiple records](https://www.algolia.com/doc/faq/basics/how-do-i-reduce-the-size-of-my-records/#faq-section).

Here is an example of how to split an existing record into several ones:

``` javascript

var chunk = require('chunk-text');
var record = {
  post_id: 100,
  content: 'A large chunk of text here'
};

var chunks = chunk(record.content, 600); // Limit the chunk size to a length of 600.
var records = [];
chunks.forEach(function(content) {
  records.push(Object.assign({}, record, {content: content}));
});

```
