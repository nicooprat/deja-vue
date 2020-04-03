import { cloneDeep } from 'lodash';
import { patch, reverse, create } from 'jsondiffpatch';

export const record = (source, target, callback) => {
  const diffpatcher = create({
    objectHash: (obj) => obj.id,
  });
  const oldSource = cloneDeep(source[target]);
  return new Promise((resolve) => {
    callback(() => {
      const newSource = cloneDeep(source[target]);
      const changes = diffpatcher.diff(oldSource, newSource);
      resolve({
        changes,
        source,
        target,
      });
    });
  });
};

export const revert = ({ source, target, changes }) => {
  return patch(cloneDeep(source)[target], reverse(changes));
};

export const reapply = ({ source, target, changes }) => {
  return patch(cloneDeep(source)[target], changes);
};
