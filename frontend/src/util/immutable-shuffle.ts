/**
 MIT License

Copyright (c) 2017 Tobias Kloht

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import { List } from 'immutable';

/**
 * Fisher-Yates-shuffle(see https://bost.ocks.org/mike/shuffle) for Immutable.js Lists
 * @param  {[Immutable.List]} List [any immutable.js list]
 * @return {[Immutable.List]} Shuffled-List [the same list shuffled]
 */
function shuffled<T>(list: List<T>) {
  const shuffled = list.withMutations((mutableList) => {
    let currentItem = mutableList.size;
    let tmp: T | null | undefined = null;
    let swappedItem: number | null = null;
    while (currentItem) {
      // Pick a remaining element…
      swappedItem = Math.floor(Math.random() * currentItem--);
      // Swap with current element
      tmp = mutableList.get(currentItem);
      mutableList.set(currentItem, mutableList.get(swappedItem)!);
      mutableList.set(swappedItem, tmp!);
    }
  });

  return shuffled;
}

function randomElement<T>(list: List<T>) {
  return list.get(Math.floor(Math.random() * list.count()))!;
}

export { shuffled, randomElement };
