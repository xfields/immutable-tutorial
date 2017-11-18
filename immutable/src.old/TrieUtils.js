/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Used for setting prototype methods that IE8 chokes on.
export const DELETE = 'delete';

// Constants describing the size of trie nodes.
export const SHIFT = 5; // Resulted in best performance after ______?
export const SIZE = 1 << SHIFT;
export const MASK = SIZE - 1;

// A consistent shared value representing "not set" which equals nothing other
// than itself, and nothing that could be provided externally.
export const NOT_SET = {};

// Boolean references, Rough equivalent of `bool &`.
export const CHANGE_LENGTH = { value: false };
export const DID_ALTER = { value: false };

export function MakeRef(ref) {
  ref.value = false;
  return ref;
}

export function SetRef(ref) {
  ref && (ref.value = true);
}

// A function which returns a value representing an "owner" for transient writes
// to tries. The return value will only ever equal itself, and will not equal
// the return of any subsequent call of this function.
export function OwnerID() {}

// http://jsperf.com/copy-array-inline
export function arrCopy(arr, offset) {
  offset = offset || 0;
  const len = Math.max(0, arr.length - offset);
  const newArr = new Array(len);
  for (let ii = 0; ii < len; ii++) {
    newArr[ii] = arr[ii + offset];
  }
  return newArr;
}

export function ensureSize(iter) {
  if (iter.size === undefined) {
    iter.size = iter.__iterate(returnTrue);
  }
  return iter.size;
}

export function wrapIndex(iter, index) {
  // This implements "is array index" which the ECMAString spec defines as:
  //
  //     A String property name P is an array index if and only if
  //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
  //     to 2^32−1.
  //
  // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
  if (typeof index !== 'number') {
    const uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
    if ('' + uint32Index !== index || uint32Index === 4294967295) {
      return NaN;
    }
    index = uint32Index;
  }
  return index < 0 ? ensureSize(iter) + index : index;
}

export function returnTrue() {
  return true;
}

export function wholeSlice(begin, end, size) {
  return (begin === 0 || (size !== undefined && begin <= -size)) &&
    (end === undefined || (size !== undefined && end >= size));
}

export function resolveBegin(begin, size) {
  return resolveIndex(begin, size, 0);
}

export function resolveEnd(end, size) {
  return resolveIndex(end, size, size);
}

function resolveIndex(index, size, defaultIndex) {
  // Sanitize indices using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  return index === undefined
    ? defaultIndex
    : index < 0
        ? size === Infinity ? size : Math.max(0, size + index) | 0
        : size === undefined || size === index
            ? index
            : Math.min(size, index) | 0;
}
