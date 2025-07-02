(function(){
    window.PrototextTool = {
        name: 'PrototextTool',
        components: { JsonEditorView: window.JsonEditorView },
        data() {
            return {
                input: '',
                output: '',
                jsonObj: null
            };
        },
        methods: {
            toJson() {
                try {
                    const obj = window.parsePrototext(this.input);
                    const decoded = window.decodeObject(obj);
                    this.output = JSON.stringify(decoded, null, 2);
                    this.jsonObj = decoded;
                } catch (e) {
                    this.output = '解析失败：' + e.message;
                    this.jsonObj = null;
                }
            },
            formatInput() { this.toJson(); },
            clearInput() { this.input = ''; this.output = ''; this.jsonObj = null; },
            copyOutput() {
                if (!this.output) return;
                navigator.clipboard.writeText(this.output);
            }
        },
        mounted() {
            let last = '';
            setInterval(() => {
                if (this.input !== last) {
                    last = this.input;
                    this.toJson();
                }
            }, 400);
        },
        template: `
        <div class='main'>
            <div class='block'>
                <label for='input'>Prototext 输入</label>
                <textarea id='input' v-model='input' placeholder='在此粘贴 prototext/pbtxt 数据...'></textarea>
                <div class='btns'>
                    <button @click='formatInput'>格式化输入</button>
                    <button @click='clearInput'>清空</button>
                </div>
            </div>
            <div class='block'>
                <label for='output'>JSON 输出</label>
                <div class='output' id='output'>
                    <JsonEditorView v-if='jsonObj !== null' :json='jsonObj' />
                    <div v-else>{{ output }}</div>
                </div>
                <div class='btns'>
                    <button @click='copyOutput'>复制 JSON</button>
                </div>
            </div>
        </div>
        `
    };
})(); 