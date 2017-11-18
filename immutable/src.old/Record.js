/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { KeyedCollection } from './Collection';
import { keyedSeqFromValue } from './Seq';
import { MapPrototype } from './Map';
import { List } from './List';
import { ITERATOR_SYMBOL } from './Iterator';
import { isRecord, IS_RECORD_SENTINEL } from './Predicates';
import { CollectionPrototype } from './CollectionImpl';
import { DELETE } from './TrieUtils';

import invariant from './utils/invariant';
import quoteString from './utils/quoteString';

export class Record {
  constructor(defaultValues, name) {
    let hasInitialized;

    const RecordType = function Record(values) {
      if (values instanceof RecordType) {
        return values;
      }
      if (!(this instanceof RecordType)) {
        return new RecordType(values);
      }
      if (!hasInitialized) {
        hasInitialized = true;
        const keys = Object.keys(defaultValues);
        const indices = (RecordTypePrototype._indices = {});
        RecordTypePrototype._name = name;
        RecordTypePrototype._keys = keys;
        RecordTypePrototype._defaultValues = defaultValues;
        for (let i = 0; i < keys.length; i++) {
          const propName = keys[i];
          indices[propName] = i;
          if (RecordTypePrototype[propName]) {
            /* eslint-disable no-console */
            typeof console === 'object' &&
              console.warn &&
              console.warn(
                'Cannot define ' +
                  recordName(this) +
                  ' with property "' +
                  propName +
                  '" since that property name is part of the Record API.'
              );
            /* eslint-enable no-console */
          } else {
            setProp(RecordTypePrototype, propName);
          }
        }
      }
      this.__ownerID = undefined;
      this._values = List().withMutations(l => {
        l.setSize(this._keys.length);
        KeyedCollection(values).forEach((v, k) => {
          l.set(this._indices[k], v === this._defaultValues[k] ? undefined : v);
        });
      });
    };

    const RecordTypePrototype = (RecordType.prototype = Object.create(
      RecordPrototype
    ));
    RecordTypePrototype.constructor = RecordType;

    return RecordType;
  }

  toString() {
    let str = recordName(this) + ' { ';
    const keys = this._keys;
    let k;
    for (let i = 0, l = keys.length; i !== l; i++) {
      k = keys[i];
      str += (i ? ', ' : '') + k + ': ' + quoteString(this.get(k));
    }
    return str + ' }';
  }

  equals(other) {
    return this === other ||
      (this._keys === other._keys && recordSeq(this).equals(recordSeq(other)));
  }

  hashCode() {
    return recordSeq(this).hashCode();
  }

  // @pragma Access

  has(k) {
    return this._indices.hasOwnProperty(k);
  }

  get(k, notSetValue) {
    if (!this.has(k)) {
      return notSetValue;
    }
    const index = this._indices[k];
    const value = this._values.get(index);
    return value === undefined ? this._defaultValues[k] : value;
  }

  // @pragma Modification

  set(k, v) {
    if (this.has(k)) {
      const newValues = this._values.set(
        this._indices[k],
        v === this._defaultValues[k] ? undefined : v
      );
      if (newValues !== this._values && !this.__ownerID) {
        return makeRecord(this, newValues);
      }
    }
    return this;
  }

  remove(k) {
    return this.set(k);
  }

  clear() {
    const newValues = this._values.clear().setSize(this._keys.length);
    return this.__ownerID ? this : makeRecord(this, newValues);
  }

  wasAltered() {
    return this._values.wasAltered();
  }

  toSeq() {
    return recordSeq(this);
  }

  toJS() {
    return recordSeq(this).toJS();
  }

  __iterator(type, reverse) {
    return recordSeq(this).__iterator(type, reverse);
  }

  __iterate(fn, reverse) {
    return recordSeq(this).__iterate(fn, reverse);
  }

  __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    const newValues = this._values.__ensureOwner(ownerID);
    if (!ownerID) {
      this.__ownerID = ownerID;
      this._values = newValues;
      return this;
    }
    return makeRecord(this, newValues, ownerID);
  }
}

Record.isRecord = isRecord;
Record.getDescriptiveName = recordName;
const RecordPrototype = Record.prototype;
RecordPrototype[IS_RECORD_SENTINEL] = true;
RecordPrototype[DELETE] = RecordPrototype.remove;
RecordPrototype.deleteIn = (RecordPrototype.removeIn = MapPrototype.removeIn);
RecordPrototype.getIn = CollectionPrototype.getIn;
RecordPrototype.hasIn = CollectionPrototype.hasIn;
RecordPrototype.merge = MapPrototype.merge;
RecordPrototype.mergeWith = MapPrototype.mergeWith;
RecordPrototype.mergeIn = MapPrototype.mergeIn;
RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
RecordPrototype.setIn = MapPrototype.setIn;
RecordPrototype.update = MapPrototype.update;
RecordPrototype.updateIn = MapPrototype.updateIn;
RecordPrototype.withMutations = MapPrototype.withMutations;
RecordPrototype.asMutable = MapPrototype.asMutable;
RecordPrototype.asImmutable = MapPrototype.asImmutable;
RecordPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
RecordPrototype.toJSON = (RecordPrototype.toObject = CollectionPrototype.toObject);
RecordPrototype.inspect = (RecordPrototype.toSource = CollectionPrototype.toSource);

function makeRecord(likeRecord, values, ownerID) {
  const record = Object.create(Object.getPrototypeOf(likeRecord));
  record._values = values;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record._name || record.constructor.name || 'Record';
}

function recordSeq(record) {
  return keyedSeqFromValue(record._keys.map(k => [k, record.get(k)]));
}

function setProp(prototype, name) {
  try {
    Object.defineProperty(prototype, name, {
      get: function() {
        return this.get(name);
      },
      set: function(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  } catch (error) {
    // Object.defineProperty failed. Probably IE8.
  }
}
