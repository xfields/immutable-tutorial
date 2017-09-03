/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { SetCollection, KeyedCollection } from './Collection';
import { IS_ORDERED_SENTINEL, isOrdered } from './Predicates';
import { IndexedCollectionPrototype } from './CollectionImpl';
import { Set, isSet } from './Set';
import { emptyOrderedMap } from './OrderedMap';
import assertNotInfinite from './utils/assertNotInfinite';

export class OrderedSet extends Set {
  // @pragma Construction

  constructor(value) {
    return value === null || value === undefined
      ? emptyOrderedSet()
      : isOrderedSet(value)
          ? value
          : emptyOrderedSet().withMutations(set => {
              const iter = SetCollection(value);
              assertNotInfinite(iter.size);
              iter.forEach(v => set.add(v));
            });
  }

  static of(/*...values*/) {
    return this(arguments);
  }

  static fromKeys(value) {
    return this(KeyedCollection(value).keySeq());
  }

  toString() {
    return this.__toString('OrderedSet {', '}');
  }
}

function isOrderedSet(maybeOrderedSet) {
  return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
}

OrderedSet.isOrderedSet = isOrderedSet;

const OrderedSetPrototype = OrderedSet.prototype;
OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;

OrderedSetPrototype.__empty = emptyOrderedSet;
OrderedSetPrototype.__make = makeOrderedSet;

function makeOrderedSet(map, ownerID) {
  const set = Object.create(OrderedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

let EMPTY_ORDERED_SET;
function emptyOrderedSet() {
  return EMPTY_ORDERED_SET ||
    (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
}
