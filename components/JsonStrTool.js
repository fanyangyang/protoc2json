(function(){
    window.JsonStrTool = {
        name: 'JsonStrTool',
        components: { JsonEditorView: window.JsonEditorView },
        data() {
            return {
                jsonStrInput: '',
                jsonStrOutput: '',
                jsonStrObj: null
            };
        },
        methods: {
            toJsonStr() {
                try {
                    let val = this.jsonStrInput.trim();
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = JSON.parse(val);
                    }
                    const obj = JSON.parse(val);
                    this.jsonStrOutput = JSON.stringify(obj, null, 2);
                    this.jsonStrObj = obj;
                } catch (e) {
                    this.jsonStrOutput = '解析失败：' + e.message;
                    this.jsonStrObj = null;
                }
            },
            formatJsonStr() { this.toJsonStr(); },
            clearJsonStr() { this.jsonStrInput = ''; this.jsonStrOutput = ''; this.jsonStrObj = null; },
            copyJsonStrOutput() {
                if (!this.jsonStrOutput) return;
                navigator.clipboard.writeText(this.jsonStrOutput);
            }
        },
        mounted() {
            let last = '';
            setInterval(() => {
                if (this.jsonStrInput !== last) {
                    last = this.jsonStrInput;
                    this.toJsonStr();
                }
            }, 400);
        },
        template: `
        <div class='main'>
            <div class='block'>
                <label for='jsonstr'>JSON 字符串输入</label>
                <textarea id='jsonstr' v-model='jsonStrInput' placeholder='输入如 {"a":"b"} 或 "{\\"a\\":\\"b\\"}"'></textarea>
                <div class='btns'>
                    <button @click='formatJsonStr'>格式化输入</button>
                    <button @click='clearJsonStr'>清空</button>
                </div>
            </div>
            <div class='block'>
                <label for='jsonstr-output'>JSON 输出</label>
                <div class='output' id='jsonstr-output'>
                    <JsonEditorView v-if='jsonStrObj !== null' :json='jsonStrObj' />
                    <div v-else>{{ jsonStrOutput }}</div>
                </div>
                <div class='btns'>
                    <button @click='copyJsonStrOutput'>复制 JSON</button>
                </div>
            </div>
        </div>
        `
    };
})(); 