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
  mounted() {
    this.$watch(
      () => this.$store.getters[`${this.namespace}/getCursor`],
      (cursor) => this.$emit('cursorChanged', cursor),
    );
  },
  created() {
    const { namespace, register, subscribe } = createAll({
      store: this.$store,
      limit: this.$options.propsData.limit,
      include: this.$options.propsData.include,
      objectHash: this.objectHash,
    });
    register();
    this.namespace = namespace;
    this.unsubscribe = subscribe();
  },
  destroyed() {
    this.$store.unregisterModule(this.namespace);
    this.unsubscribe();
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
