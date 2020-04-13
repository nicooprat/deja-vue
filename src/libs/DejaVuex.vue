<script>
import { createAll } from '@/libs/deja-vuex';

export default {
  props: {
    limit: {
      type: Number,
      default: 20,
    },
    include: {
      type: Function,
      default: () => true,
    },
    objectHash: {
      type: Function,
      default: null,
    },
  },
  created() {
    // Register module on created so mounted can watch getter
    const { namespace, register } = createAll({
      store: this.$store,
      limit: this.$options.propsData.limit,
      include: this.$options.propsData.include,
      objectHash: this.objectHash,
    });
    register();
    this.namespace = namespace;
    this.$store.dispatch(`${this.namespace}/record`);
  },
  mounted() {
    // Emit cursor change event
    this.$watch(
      () => this.$store.getters[`${this.namespace}/getCursor`],
      (cursor) => this.$emit('cursorChanged', cursor),
    );
  },
  destroyed() {
    this.$store.dispatch(`${this.namespace}/stop`);
    this.$store.unregisterModule(this.namespace);
  },
  render(h) {
    return h(
      'div',
      this.$scopedSlots.default({
        getHistory: this.$store.getters[`${this.namespace}/getHistory`],
        getCursor: this.$store.getters[`${this.namespace}/getCursor`],
        canUndo: this.$store.getters[`${this.namespace}/canUndo`],
        canRedo: this.$store.getters[`${this.namespace}/canRedo`],
        undo: () => this.$store.dispatch(`${this.namespace}/undo`),
        redo: () => this.$store.dispatch(`${this.namespace}/redo`),
        travel: (id) => this.$store.dispatch(`${this.namespace}/travel`, id),
        reapply: (id) => this.$store.dispatch(`${this.namespace}/reapply`, id),
      }),
    );
  },
};
</script>
