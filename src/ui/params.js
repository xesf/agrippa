import {map, each} from 'lodash';

const mobileRE = /Mobile|webOS|iPhone|iPod|iOS|BlackBerry|IEMobile|Opera Mini/i;

window.params = {};

const paramsDefinitions = {
    mobile: {
        type: 'boolean',
        default: mobileRE.test(navigator.userAgent)
    },
    editor: {
        type: 'boolean',
        default: false
    },
    node: {
        type: 'string',
        default: null
    },
};

export function loadParams() {
    const query = window.location.hash.replace(/^#/, '');
    const src = {};
    const tgt = {};
    map(query.split('&'), (part) => {
        const [name, value] = part.split('=');
        if (name && name in paramsDefinitions) {
            src[name] = decodeURIComponent(value);
        } else if (name) {
            // eslint-disable-next-line no-console
            console.warn(`Unknown parameter: ${part}.`);
        }
    });
    each(paramsDefinitions, (param, name) => {
        if (name in src) {
            tgt[name] = parseParam(param, name, src[name]);
        } else {
            tgt[name] = param.default;
        }
        window.params[name] = tgt[name];
    });
    return tgt;
}

function parseParam(param, name, src) {
    switch (param.type) {
        case 'boolean':
            if (src === 'true') {
                return true;
            }
            if (src === 'false') {
                return false;
            }
            // eslint-disable-next-line no-console
            console.warn(`Invalid value for param ${name}, value: ${src}, type=boolean`);
            return param.default;

        case 'int':
            try {
                const i = Number(src);
                if (Number.isNaN(i)) {
                    // eslint-disable-next-line no-console
                    console.warn(`Invalid value for param ${name}, value: ${src}, type=int`);
                    return param.default;
                }
                return i;
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn(`Invalid value for param ${name}, value: ${src}, type=int`);
                return param.default;
            }
        default:
        case 'string':
            if (src) {
                return src;
            }
            return param.default;
    }
}
