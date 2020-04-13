import { cloneDeep } from 'lodash';
import { patch as diffPatch, reverse as diffReverse, create as diffCreate } from 'jsondiffpatch';

export const record = (source, callback, { objectHash }) => {
  const diffpatcher = diffCreate({ objectHash });
  // Clone source to remember it when diffing
  const oldSource = cloneDeep(source);
  // If the callback function is async, just wait for its resolution
  // Otherwise wait for the sync execution.
  const promise = callback.then
    ? callback
    : new Promise((resolve) => {
        callback();
        resolve();
      });
  // Returns a patch than can be reverted or reapplied later
  return promise.then(() => diffpatcher.diff(oldSource, cloneDeep(source)));
};

export const revert = (source, patch) => diffPatch(cloneDeep(source), diffReverse(patch));

export const reapply = (source, patch) => diffPatch(cloneDeep(source), patch);
