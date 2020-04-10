import { cloneDeep } from 'lodash';
import { patch, reverse, create } from 'jsondiffpatch';

export const record = (source, callback, opts) => {
  const diffpatcher = create(opts);
  const oldSource = cloneDeep(source);

  const promise = callback.then
    ? // If the callback function is async, just wait for its resolution
      callback
    : new Promise((resolve) => {
        // Otherwise wait for the sync execution.
        callback();
        resolve();
      });

  return promise.then(() => {
    const newSource = cloneDeep(source);
    const changes = diffpatcher.diff(oldSource, newSource);
    return {
      changes,
      source,
    };
  });
};

export const revert = ({ source, changes }) => {
  return patch(cloneDeep(source), reverse(changes));
};

export const reapply = ({ source, changes }) => {
  return patch(cloneDeep(source), changes);
};
