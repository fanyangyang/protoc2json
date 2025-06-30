# Proto2JSON

一个纯前端的 Protobuf Text Format（prototext/pbtxt）转 JSON 工具，支持深度嵌套、数组、转义字符自动还原。可直接部署到 GitHub Pages 或本地使用。

![screenshot](./screenshot.png)

## 功能特性
- 支持 Protobuf text format（pbtxt/prototext）转 JSON
- 支持嵌套、数组、字符串、数字、布尔等常见类型
- 自动还原 protobuf/unicode 转义字符（如中文、emoji）
- JSON 输出支持树形折叠/展开，便于查看复杂结构
- 纯前端实现，无需后端，开箱即用
- 可直接本地打开或部署到 GitHub Pages

## 在线体验
> 你可以将本项目部署到 GitHub Pages，或直接本地打开 `index.html` 使用。

## 使用方法
1. 克隆或下载本仓库
2. 直接用浏览器打开 `index.html`
3. 左侧粘贴 prototext/pbtxt 数据，右侧自动输出 JSON
4. 支持格式化、清空、复制 JSON 等操作

## 部署到 GitHub Pages
1. 新建一个公开仓库，将 `index.html` 上传到仓库根目录
2. 在仓库设置（Settings）- Pages，选择 `main` 分支和根目录，保存
3. 稍等片刻，访问 `https://你的用户名.github.io/仓库名/` 即可

## 示例
**输入（Prototext/pbtxt）：**
```text
infoList:<id:"68e5146fb0b29480a95f3ed9c13afe59" nickname:"\345\210\232\345\210\232hhhh" age:28>
```

**输出（JSON）：**
```json
{
  "infoList": [
    {
      "id": "68e5146fb0b29480a95f3ed9c13afe59",
      "nickname": "张张hhhh",
      "age": 28
    }
  ]
}
```

## 适用场景
- Protobuf 调试、日志、配置文件快速查看
- prototext/pbtxt 数据转 JSON 结构化分析
- 需要本地或在线工具的开发者

## License
MIT
