// --- Prototext Parser ---
window.parsePrototext = function(text) {
    let i = 0;
    const len = text.length;
    function skipWs() { while (i < len && /[\s,]/.test(text[i])) i++; }
    function parseValue() {
        skipWs();
        if (text[i] === '<' || text[i] === '{') { return parseObject(); }
        else if (text[i] === '"') { return parseString(); }
        else if (text[i] === '-' || /[0-9]/.test(text[i])) { return parseNumber(); }
        else if (/true|false/.test(text.slice(i, i + 5))) { return parseBool(); }
        else { return parseBareString(); }
    }
    function parseString() {
        let res = '';
        i++; // skip "
        while (i < len) {
            if (text[i] === '\\') {
                if (i + 1 < len) {
                    if (text[i + 1] === 'n') { res += '\n'; i += 2; continue; }
                    if (text[i + 1] === 't') { res += '\t'; i += 2; continue; }
                    if (text[i + 1] === '"') { res += '"'; i += 2; continue; }
                    if (text[i + 1] === '\\') { res += '\\'; i += 2; continue; }
                    if (text[i + 1] === 'u' && i + 5 < len) {
                        res += String.fromCharCode(parseInt(text.slice(i + 2, i + 6), 16));
                        i += 6; continue;
                    }
                }
            }
            if (text[i] === '"') { i++; break; }
            res += text[i++];
        }
        return res;
    }
    function parseBareString() {
        let start = i;
        while (i < len && /[\w\-\.\@\/\:]/.test(text[i])) i++;
        return text.slice(start, i);
    }
    function parseNumber() {
        let start = i;
        if (text[i] === '-') i++;
        while (i < len && /[0-9]/.test(text[i])) i++;
        if (text[i] === '.') {
            i++;
            while (i < len && /[0-9]/.test(text[i])) i++;
        }
        return Number(text.slice(start, i));
    }
    function parseBool() {
        if (text.slice(i, i + 4) === 'true') { i += 4; return true; }
        if (text.slice(i, i + 5) === 'false') { i += 5; return false; }
        return null;
    }
    function parseObject() {
        let obj = {};
        let arrMode = false;
        let arr = [];
        let open = text[i];
        let close = open === '<' ? '>' : '}';
        i++; // skip < or {
        skipWs();
        while (i < len && text[i] !== close) {
            skipWs();
            let keyStart = i;
            while (i < len && /[\w\-\_]/.test(text[i])) i++;
            let key = text.slice(keyStart, i);
            skipWs();
            if (text[i] === ':') i++;
            skipWs();
            let value = parseValue();
            skipWs();
            if (obj.hasOwnProperty(key)) {
                if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
                obj[key].push(value);
            } else {
                obj[key] = value;
            }
            skipWs();
        }
        i++; // skip > or }
        return obj;
    }
    let result = {};
    while (i < len) {
        skipWs();
        if (i >= len) break;
        let keyStart = i;
        while (i < len && /[\w\-\_]/.test(text[i])) i++;
        let key = text.slice(keyStart, i);
        skipWs();
        if (text[i] === ':') i++;
        skipWs();
        let value = parseValue();
        skipWs();
        if (result.hasOwnProperty(key)) {
            if (!Array.isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
        } else {
            result[key] = value;
        }
    }
    return result;
};
window.decodeEscapedString = function(str) {
    str = str.replace(/\\u([0-9a-fA-F]{4})/g, (m, g1) => String.fromCharCode(parseInt(g1, 16)));
    str = str.replace(/(\\[0-7]{3})+/g, (m) => {
        let bytes = m.match(/\\([0-7]{3})/g).map(s => parseInt(s.replace('\\', ''), 8));
        try {
            return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
        } catch { return m; }
    });
    return str;
};
window.decodeObject = function(obj) {
    if (typeof obj === 'string') {
        return window.decodeEscapedString(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(window.decodeObject);
    } else if (typeof obj === 'object' && obj !== null) {
        let res = {};
        for (let k in obj) {
            res[k] = window.decodeObject(obj[k]);
        }
        return res;
    } else {
        return obj;
    }
};

window.addEventListener('DOMContentLoaded', function() {
    const { createApp } = Vue;
    createApp({
        components: {
            PrototextTool: window.PrototextTool,
            JsonStrTool: window.JsonStrTool
        },
        data() {
            return {
                tab: 'prototext'
            };
        },
        template: `
        <div class='container'>
            <h1>Prototext/JSON 工具箱</h1>
            <div class='desc'>支持多种开发常用格式互转，纯前端实现，支持树形 JSON 展示。</div>
            <div class='tabs'>
                <div class='tab' :class="{active: tab==='prototext'}" @click="tab='prototext'">Prototext 转 JSON</div>
                <div class='tab' :class="{active: tab==='jsonstr'}" @click="tab='jsonstr'">JSON字符串转 JSON</div>
            </div>
            <PrototextTool v-if="tab==='prototext'" />
            <JsonStrTool v-else-if="tab==='jsonstr'" />
            <div style="color:#888;font-size:0.95rem;margin-top:18px;">开源地址：<a href="https://github.com/" target="_blank">GitHub Pages</a> | 仅供学习交流</div>
        </div>
        `
    }).mount('#app');
}); 