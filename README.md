# My Nose - 香水收藏应用

一个类似社交媒体的香水收藏记录应用，你可以像发帖子一样记录你拥有的香水。

## 功能特点

- 📸 记录香水照片
- 🏷️ 记录香水名称、香型和调香师
- 🌸 添加香调笔记及对应图片
- 📅 按时间流展示所有香水记录
- 💫 优雅的深色主题UI

## 技术栈

- React 18
- TypeScript
- Vite

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 使用说明

1. 点击 "✨ 发布新香水" 按钮展开表单
2. 填写香水信息：
   - 香水照片 (可选，留空使用默认图片)
   - 香水名称 (必填)
   - 香型 (必填)
   - 调香师 (可选)
3. 添加香调笔记：
   - 填写香调名称
   - 可选添加对应图片
   - 点击 "+ 添加香调" 可添加更多香调
4. 点击 "发布" 保存你的香水记录
5. 新记录会出现在时间流顶部

## 项目结构

```
my-nose/
├── src/
│   ├── components/
│   │   ├── Header.tsx       # 页面头部
│   │   ├── Header.css
│   │   ├── CreatePost.tsx   # 创建新帖子组件
│   │   ├── CreatePost.css
│   │   ├── PostList.tsx     # 帖子列表
│   │   ├── PostList.css
│   │   ├── PostCard.tsx     # 单个帖子卡片
│   │   └── PostCard.css
│   ├── types.ts             # TypeScript类型定义
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```
