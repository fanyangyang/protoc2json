(function(){
    window.JsonEditorView = {
        name: 'JsonEditorView',
        props: { json: { type: [Object, Array], required: true } },
        mounted() {
            this.editor = new window.JSONEditor(this.$refs.container, {
                mode: 'view',
                mainMenuBar: false,
                navigationBar: false,
                statusBar: false,
                onError: function (err) { alert('JSON 解析错误: ' + err.message); }
            });
            this.editor.set(this.json);
        },
        watch: {
            json: {
                handler(val) {
                    if (this.editor) this.editor.set(val);
                },
                deep: true
            }
        },
        beforeUnmount() {
            if (this.editor) { this.editor.destroy(); this.editor = null; }
        },
        render() {
            return Vue.h('div', { ref: 'container', class: 'jsoneditor', style: 'height:340px;' });
        }
    };
})(); 