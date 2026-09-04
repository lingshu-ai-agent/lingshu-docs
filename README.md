<div align="center">
  <img src="https://raw.githubusercontent.com/lingshu-ai-agent/lingshu/main/assets/lingshu_logo.svg" alt="LingShu Docs" width="100"/>

  <h1>lingshu-docs · 灵枢文档站</h1>
  <p><strong>The Documentation Source</strong></p>
  <p>Docusaurus 3 · 中英双语 · 自动 deploy 到 <a href="https://lingshu-ai-agent.github.io/lingshu-docs/">docs.lingshu.ai</a></p>

  <p>
    <a href="https://github.com/lingshu-ai-agent/lingshu-docs/stargazers"><img src="https://img.shields.io/github/stars/lingshu-ai-agent/lingshu-docs?style=for-the-badge" alt="stars"/></a>
    <a href="https://lingshu-ai-agent.github.io/lingshu-docs/"><img src="https://img.shields.io/badge/preview-docs.lingshu--ai-D97706?style=for-the-badge" alt="preview"/></a>
  </p>
</div>

---

## 这是什么

`lingshu-docs` 是 [lingshu](https://github.com/lingshu-ai-agent/lingshu) 引擎的 **官方文档站源**,基于 [Docusaurus 3](https://docusaurus.io) 构建。

文档站内容在 PR 通过后会自动部署到 `https://lingshu-ai-agent.github.io/lingshu-docs/`(后期挂 `docs.lingshu.ai`)。

---

## 📁 目录结构

```
lingshu-docs/
├── docs/                              ← 英文文档
│   ├── intro.md                       ← 30s 上手
│   ├── installation.md
│   ├── quick-start.md
│   ├── concepts/
│   │   ├── react-loop.md
│   │   ├── slots.md
│   │   ├── spi.md
│   │   ├── sandbox.md
│   │   └── skills.md
│   ├── guides/
│   │   ├── first-agent.md
│   │   ├── custom-tool.md
│   │   ├── custom-skill.md
│   │   ├── multi-agent.md
│   │   └── production.md
│   ├── adapters/
│   │   ├── google-adk.md
│   │   ├── alibaba-graph.md
│   │   └── langgraph4j.md
│   ├── reference/
│   │   ├── config.md
│   │   ├── api.md
│   │   └── events.md
│   └── ops/
│       ├── observability.md
│       ├── security.md
│       └── deployment.md
├── i18n/zh-CN/                        ← 中文翻译
├── blog/                              ← Release notes / 案例
├── static/img/                        ← 图片资源
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

---

## 🛠️ 本地预览

```bash
git clone https://github.com/lingshu-ai-agent/lingshu-docs.git
cd lingshu-docs
npm install
npm start
# 浏览器打开 http://localhost:3000
```

需要 Node.js 18+。

---

## ✏️ 如何贡献

### 改一行文字

1. 直接在 GitHub 上点 ✏️ 在线编辑
2. Commit message 写 `docs: typo fix in slots.md`
3. PR 通过 → 自动部署

### 新增一节

```bash
git checkout -b docs/new-guide-xxx
# 在 docs/ 下新建 xxx.md,头部加:
---
id: xxx
title: My New Guide
sidebar_position: 10
---
git push origin docs/new-guide-xxx
# 在 GitHub 开 PR
```

### 中英同步

英文改完中文 PR 自动合,或者用 Crowdin(后期)。

---

## 🚀 自动部署

`.github/workflows/deploy.yml` 在 `main` 分支 push 时自动 build + deploy 到 GitHub Pages:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with: { github_token: ${{ secrets.GITHUB_TOKEN }} }
```

---

## 📚 相关

- 核心引擎:[lingshu-ai-agent/lingshu](https://github.com/lingshu-ai-agent/lingshu)
- 官网:[lingshu-ai-agent.github.io](https://lingshu-ai-agent.github.io)
- 设计文档:见主仓库 `dsh_agent_design.md`

---

## 📜 License

Apache 2.0 — see [LICENSE](LICENSE).