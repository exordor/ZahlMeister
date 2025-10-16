# 📚 Git 使用指南

本指南将帮助您使用Git管理德语数字练习项目。

## 🚀 快速开始

### 1. 克隆项目（如果是新开发者）
```bash
git clone <repository-url>
cd ZahlMeister
```

### 2. 查看项目状态
```bash
git status
```

### 3. 查看提交历史
```bash
git log --oneline
```

## 📝 日常开发流程

### 创建新功能分支
```bash
# 从main分支创建新分支
git checkout -b feature/your-feature-name

# 或者从develop分支创建（如果有的话）
git checkout -b feature/your-feature-name develop
```

### 开发过程中的提交
```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .
# 或者添加特定文件
git add frontend/src/components/NewComponent.jsx

# 提交更改
git commit -m "✨ feat: 添加新的练习模式"
```

### 推送分支到远程
```bash
# 首次推送新分支
git push -u origin feature/your-feature-name

# 后续推送
git push
```

## 🔄 分支管理策略

### 主要分支
- `main` - 生产就绪的稳定代码
- `develop` - 开发集成分支（可选）

### 功能分支
- `feature/*` - 新功能开发
- `fix/*` - Bug修复
- `hotfix/*` - 紧急修复

### 分支命名规范
```bash
feature/add-number-range-selector    # 新功能
fix/tts-audio-playback-issue        # Bug修复
hotfix/critical-security-patch      # 紧急修复
docs/update-readme-instructions     # 文档更新
refactor/clean-up-component-structure # 重构
```

## 📋 提交信息规范

### 格式
```
<emoji> <type>: <description>

[optional body]

[optional footer]
```

### 类型说明
- `feat` 🎉 - 新功能
- `fix` 🐛 - 修复bug
- `docs` 📚 - 文档更新
- `style` 🎨 - 代码格式化
- `refactor` ♻️ - 重构代码
- `perf` ⚡ - 性能优化
- `test` 🧪 - 添加测试
- `chore` 🔧 - 构建过程或辅助工具变动

### 示例
```bash
git commit -m "✨ feat: 添加数字范围选择功能

用户可以自定义练习的数字范围，从0-10到0-1000"

git commit -m "🐛 fix: 修复TTS在某些浏览器中播放失败的问题"

git commit -m "📚 docs: 更新README中的安装说明"
```

## 🔍 查看和比较

### 查看文件差异
```bash
# 查看工作区与暂存区的差异
git diff

# 查看暂存区与最新提交的差异
git diff --cached

# 查看与特定提交的差异
git diff HEAD~1
```

### 查看提交详情
```bash
# 查看最近提交的详细信息
git show

# 查看特定提交
git show <commit-hash>

# 查看文件的修改历史
git log --follow frontend/src/components/NumberPractice.jsx
```

## 🔄 合并和同步

### 合并分支
```bash
# 切换到目标分支
git checkout main

# 合并功能分支
git merge feature/your-feature-name

# 删除已合并的分支
git branch -d feature/your-feature-name
```

### 同步远程更改
```bash
# 获取远程更改但不合并
git fetch origin

# 拉取并合并远程更改
git pull origin main

# 查看远程分支
git branch -r
```

## 🏷️ 标签管理

### 查看标签
```bash
# 查看所有标签
git tag -l

# 查看标签详情
git show v1.0.0
```

### 创建标签
```bash
# 创建轻量标签
git tag v1.1.0

# 创建带注释的标签
git tag -a v1.1.0 -m "发布版本1.1.0"
```

## 🚨 撤销操作

### 撤销工作区修改
```bash
# 撤销单个文件的修改
git checkout -- frontend/src/App.jsx

# 撤销所有修改
git checkout -- .
```

### 撤销暂存区修改
```bash
# 取消暂存单个文件
git reset HEAD frontend/src/App.jsx

# 取消暂存所有文件
git reset HEAD
```

### 撤销提交
```bash
# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最后一次提交（删除修改）
git reset --hard HEAD~1
```

## 🛠️ 常用命令速查

```bash
# 基础操作
git status                    # 查看状态
git add <file>               # 添加文件
git commit -m "message"      # 提交
git push                     # 推送
git pull                     # 拉取

# 分支操作
git branch                   # 查看分支
git checkout <branch>        # 切换分支
git checkout -b <branch>     # 创建并切换分支
git merge <branch>           # 合并分支

# 查看历史
git log --oneline            # 简洁日志
git log --graph              # 图形化日志
git log -p                   # 详细日志

# 远程操作
git remote -v                # 查看远程仓库
git fetch                    # 获取远程更新
git push origin <branch>     # 推送到远程分支
```

## 🚀 项目特定命令

```bash
# 快速启动开发环境
npm run setup

# 启动开发服务器
npm run dev

# 清理依赖
npm run clean

# 重新安装依赖
npm run install:all

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📞 遇到问题？

1. **查看Git状态**: `git status`
2. **查看提交历史**: `git log --oneline`
3. **查看文件差异**: `git diff`
4. **检查远程仓库**: `git remote -v`

如果仍有问题，请查看Git官方文档或联系项目维护者。

---

**Happy Coding! 🎉**
