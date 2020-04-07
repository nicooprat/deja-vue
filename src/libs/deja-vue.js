import { cloneDeep } from 'lodash';
import { patch, reverse, create } from 'jsondiffpatch';

export const record = (source, callback) => {
  const diffpatcher = create({
    objectHash: (obj) => obj.id,
  });
  const oldSource = cloneDeep(source);
  return new Promise((resolve) => {
    callback(() => {
      const newSource = cloneDeep(source);
      const changes = diffpatcher.diff(oldSource, newSource);
      resolve({
        changes,
        source,
      });
    });
  });
};

export const revert = ({ source, changes }) => {
  return patch(cloneDeep(source), reverse(changes));
};

export const reapply = ({ source, changes }) => {
  return patch(cloneDeep(source), changes);
};
