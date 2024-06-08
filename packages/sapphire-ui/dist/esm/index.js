import * as components from './components';
export * from './components';
import * as utils from './utils';
export { utils };

const install = (app) => {
    console.log(components);
};
var index = {
    install
};

export { index as default };
