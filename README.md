# 🔢 德语数字练习网站

一个帮助学习德语数字发音的交互式练习网站，使用 Web Speech API 播放德语数字，用户通过输入框输入答案进行练习。

## ✨ 功能特点

- 🎵 **语音播放**: 使用浏览器内置的 Web Speech API 播放德语数字
- 📝 **交互练习**: 用户输入听到的数字，系统验证答案
- 📊 **统计功能**: 显示练习统计（总题数、正确数、正确率）
- 🎨 **现代界面**: 响应式设计，支持深色/浅色主题
- 🌍 **德语支持**: 完整的德语数字规则（0-1000）
- ⚡ **实时反馈**: 即时显示答案正确性

## 🛠️ 技术栈

### 后端
- **Node.js** - 服务器运行环境
- **Express** - Web 框架
- **CORS** - 跨域资源共享

### 前端
- **React** - 用户界面框架
- **Vite** - 构建工具
- **Web Speech API** - 文字转语音

## 📁 项目结构

```
NumPrac/
├── backend/                 # 后端代码
│   ├── package.json        # 后端依赖配置
│   ├── server.js           # Express 服务器
│   └── utils/
│       └── germanNumbers.js # 德语数字转换逻辑
├── frontend/               # 前端代码
│   ├── package.json        # 前端依赖配置
│   ├── index.html          # HTML 模板
│   ├── vite.config.js      # Vite 配置
│   └── src/
│       ├── App.jsx         # 主应用组件
│       ├── main.jsx        # 应用入口
│       ├── components/
│       │   ├── NumberPractice.jsx  # 主练习组件
│       │   └── AnswerInput.jsx     # 答案输入组件
│       └── utils/
│           └── tts.js      # TTS 工具函数
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js (版本 14 或更高)
- 现代浏览器（Chrome、Edge、Safari 支持 Web Speech API）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd NumPrac
   ```

2. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

3. **安装前端依赖**
   ```bash
   cd ../frontend
   npm install
   ```

4. **启动后端服务器**
   ```bash
   cd ../backend
   npm run dev
   ```
   后端服务器将在 http://localhost:3001 启动

5. **启动前端开发服务器**
   ```bash
   cd ../frontend
   npm run dev
   ```
   前端应用将在 http://localhost:3000 启动

6. **开始练习**
   在浏览器中访问 http://localhost:3000

## 📚 使用方法

1. **播放数字**: 点击"🔊 播放数字"按钮听德语数字发音
2. **输入答案**: 在输入框中输入听到的数字
3. **提交验证**: 点击"提交答案"按钮检查答案
4. **查看反馈**: 系统会显示答案是否正确
5. **继续练习**: 点击"下一题"开始新的练习

## 🎯 德语数字规则

本应用实现了完整的德语数字发音规则：

- **0-12**: 特殊单词（null, eins, zwei, drei...）
- **13-19**: 个位数 + zehn（dreizehn, vierzehn...）
- **20-99**: 个位 + und + 十位（dreiundzwanzig, vierunddreißig...）
- **100-999**: 百位数 + 剩余部分（einhundert, zweihundertdrei...）
- **1000**: eintausend

## 🔧 API 接口

### 后端 API 端点

- `GET /api/number?min=0&max=100` - 获取随机德语数字
- `POST /api/check` - 验证用户答案
- `GET /api/health` - 健康检查

### 请求示例

**获取随机数字**
```bash
curl "http://localhost:3001/api/number?min=0&max=50"
```

**验证答案**
```bash
curl -X POST "http://localhost:3001/api/check" \
  -H "Content-Type: application/json" \
  -d '{"answer": 23, "correctAnswer": 23}'
```

## 🌐 浏览器兼容性

### Web Speech API 支持
- ✅ Chrome 33+
- ✅ Edge 14+
- ✅ Safari 7+
- ❌ Firefox（需要额外配置）

### 推荐浏览器
- **Chrome** - 最佳支持
- **Edge** - 良好支持
- **Safari** - 基本支持

## 🎨 自定义配置

### 修改数字范围
在 `NumberPractice.jsx` 中修改 `fetchNewNumber` 函数：
```javascript
const response = await fetch('/api/number?min=0&max=1000');
```

### 调整语音参数
在 `tts.js` 中修改语音设置：
```javascript
await speakGermanText(text, 0.8, 1, 1); // rate, pitch, volume
```

## 🐛 故障排除

### 常见问题

1. **语音不播放**
   - 确保使用支持的浏览器
   - 检查浏览器音量设置
   - 尝试刷新页面

2. **后端连接失败**
   - 确保后端服务器正在运行
   - 检查端口 3001 是否被占用
   - 查看控制台错误信息

3. **德语语音质量差**
   - 系统会尝试使用德语语音
   - 如果没有德语语音，会使用默认语音
   - 可以在浏览器设置中安装德语语音包

## 📝 开发说明

### 添加新功能
1. 后端功能在 `backend/` 目录添加
2. 前端组件在 `frontend/src/components/` 添加
3. 工具函数在 `frontend/src/utils/` 添加

### 代码规范
- 使用 ESLint 检查代码质量
- 组件使用函数式组件和 Hooks
- 遵循 React 最佳实践

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至 [your-email@example.com]

---

**享受德语数字学习之旅！** 🇩🇪✨
