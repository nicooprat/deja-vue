<script>
import { uniqueId, pick, cloneDeep } from 'lodash';
import { patch as diffPatch, reverse as diffReverse, create as diffCreate } from 'jsondiffpatch';

export default {
  props: {
    objectHash: {
      type: Function,
      default: null,
    },
    record: {
      type: [Array, Object, String],
      required: true,
    },
  },
  data: () => ({
    history: [],
    cursor: -1,
    patches: {},
  }),
  computed: {
    canUndo() {
      return this.history.length && this.cursor >= 0;
    },
    canRedo() {
      return this.history.length && this.cursor < this.history.length - 1;
    },
  },
  watch: {
    record: {
      handler(newRecord) {
        const id = uniqueId();
        const patch = this.diffpatcher.diff(newRecord, this.oldRecord);
        // Ignore if no differences, probably because the prop has been synced with parent
        if (!patch) {
          this.oldRecord = cloneDeep(newRecord);
          return;
        }
        // Delete unreferenced patches
        this.history.slice(Math.max(0, this.cursor + 1)).forEach((patchId) => delete this.patches[patchId]);
        // Erase future, push new patch
        this.history = this.history.slice(0, Math.max(0, this.cursor + 1)).concat(id);
        // Store new patch
        this.patches[id] = patch;
        // Update history cursor
        this.cursor = this.history.length - 1;
        // Remember
        this.oldRecord = cloneDeep(newRecord);
      },
      deep: true,
    },
  },
  created() {
    this.diffpatcher = diffCreate({
      objectHash: this.objectHash,
    });
    this.oldRecord = cloneDeep(this.record);
  },
  methods: {
    undo() {
      if (!this.canUndo) {
        return;
      }
      const patch = this.patches[this.history[this.cursor]];
      const patchedRecord = cloneDeep(this.record);
      diffPatch(patchedRecord, patch);
      this.$emit('update:record', patchedRecord);
      this.oldRecord = patchedRecord;
      this.cursor -= 1;
    },
    redo() {
      if (!this.canRedo) {
        return;
      }
      const patch = this.patches[this.history[this.cursor + 1]];
      const patchedRecord = cloneDeep(this.record);
      diffPatch(patchedRecord, diffReverse(patch));
      this.$emit('update:record', patchedRecord);
      this.oldRecord = patchedRecord;
      this.cursor += 1;
    },
  },
  render(h) {
    return h('div', this.$scopedSlots.default(pick(this, ['history', 'cursor', 'canUndo', 'canRedo', 'undo', 'redo'])));
  },
};
</script>
