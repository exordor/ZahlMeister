# 🤝 贡献指南

欢迎为德语数字练习网站项目做出贡献！请遵循以下指南。

## 📋 开发流程

### 1. 克隆项目
```bash
git clone <repository-url>
cd NumPrac
```

### 2. 安装依赖
```bash
npm run install:all
```

### 3. 创建功能分支
```bash
git checkout -b feature/your-feature-name
# 或者
git checkout -b fix/your-bug-fix
```

### 4. 开发并测试
```bash
# 启动开发服务器
npm run dev

# 运行测试（如果有）
npm test
```

### 5. 提交更改
```bash
git add .
git commit -m "✨ 添加新功能: 描述你的更改"
```

### 6. 推送分支
```bash
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request
在GitHub上创建Pull Request，详细描述你的更改。

## 📝 提交信息规范

使用以下格式的提交信息：

```
<emoji> <type>: <description>

[optional body]

[optional footer]
```

### 类型 (type)
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构代码
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

### 示例
```
✨ feat: 添加数字范围选择功能

🎵 fix: 修复TTS播放失败的问题

📚 docs: 更新README使用说明

🎨 style: 改进移动端响应式设计
```

## 🧪 测试

### 后端测试
```bash
cd backend
npm test
```

### 前端测试
```bash
cd frontend
npm test
```

### 手动测试
1. 启动开发服务器: `npm run dev`
2. 访问 http://localhost:3000
3. 测试所有功能：
   - 播放数字
   - 输入答案
   - 验证答案
   - 统计功能

## 🔧 代码规范

### JavaScript/React
- 使用ESLint检查代码质量
- 遵循React最佳实践
- 使用函数式组件和Hooks
- 添加适当的注释

### 后端
- 使用Express最佳实践
- 添加错误处理
- 使用async/await处理异步操作

## 📁 项目结构

```
NumPrac/
├── backend/          # 后端代码
│   ├── utils/       # 工具函数
│   └── tests/       # 测试文件
├── frontend/        # 前端代码
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── utils/      # 工具函数
│   │   └── tests/      # 测试文件
│   └── public/      # 静态资源
└── docs/           # 文档
```

## 🐛 报告问题

提交Issue时请包含：
1. 问题描述
2. 重现步骤
3. 期望行为
4. 实际行为
5. 环境信息（浏览器、操作系统等）

## 💡 功能建议

欢迎提出新功能建议！请描述：
1. 功能描述
2. 使用场景
3. 实现思路（可选）

## 📄 许可证

本项目采用MIT许可证。贡献即表示您同意您的代码将在MIT许可证下发布。

---

感谢您的贡献！🎉
