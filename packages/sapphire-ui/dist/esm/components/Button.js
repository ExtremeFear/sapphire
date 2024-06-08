import { defineComponent, ref, openBlock, createElementBlock, toDisplayString } from 'vue';

var _sfc_main = /*#__PURE__*/defineComponent({
  __name: 'Button',
  props: {
  foo: String
},
  setup(__props, { expose: __expose }) {
  __expose();

const props = __props;
const text = ref(0);


const __returned__ = { props, text };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

});

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.increment && _ctx.increment(...args))
    },
    "sssss " + toDisplayString($setup.text),
    1
    /* TEXT */
  );
}
var Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ceff2a60"], ["__file", "E:\\personal\\sapphire\\packages\\sapphire-ui\\src\\components\\Button\\Button.vue"]]);

Button.install = (app) => {
    app.use('Button', Button);
};

export { Button as default };
