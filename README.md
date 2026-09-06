<div align="center">
  <img src="https://raw.githubusercontent.com/lingshu-ai-agent/lingshu/main/assets/lingshu_logo.svg" alt="LingShu Docs" width="100"/>

  <h1>lingshu-docs · 灵枢文档站</h1>
  <p><strong>The Documentation Source</strong></p>
  <p>Docusaurus 3 · 中英双语 · 自动 deploy 到 <a href="https://lingshu-ai-agent.github.io/lingshu-docs/">lingshu-ai-agent.github.io/lingshu-docs/</a></p>

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

## 📁 当前结构(2026-09 bootstrap)

```
lingshu-docs/
├── docs/
│   ├── intro.md                       ← 30s 上手
│   └── concepts/
│       └── identity-and-memory.md     ← v1.5.5 新增
├── static/
│   └── img/lingshu_logo.svg           ← 品牌图标
├── assets/
│   └── lingshu_logo.svg               ← 旧位置(保留兼容)
├── src/css/custom.css                 ← 品牌色(jade + gold)
├── .github/workflows/deploy.yml       ← GitHub Pages 自动部署
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

> ⚠️ **早期规划中的子目录**(concepts/, guides/, adapters/, reference/, ops/, i18n/)正在按 [dsh_agent_design.md](https://github.com/lingshu-ai-agent/lingshu/blob/main/dsh_agent_design.md) §13 版本节奏逐步补全。**Identity & Memory 是 v1.5.5 的首发篇**,后续 ReAct Loop / Slots / SPI / Sandbox / Skills 等会在 v0.5 路线里一起出。

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
2. Commit message 写 `docs: typo fix in identity-and-memory.md`
3. PR 通过 → 自动部署

### 新增一篇

```bash
git checkout -b docs/new-guide-xxx
# 在 docs/ 下新建 xxx.md,头部加:
---
id: xxx
title: My New Guide
sidebar_position: 10
---
# 然后在 sidebars.ts 的 Concepts/Guides 分类下加一行 'concepts/xxx'
git push origin docs/new-guide-xxx
# 在 GitHub 开 PR
```

### 中英同步

英文改完中文 PR 自动合,或者用 Crowdin(后期)。

---

## 🚀 自动部署

`.github/workflows/deploy.yml` 在 `main` 分支 push 时自动 build + deploy 到 GitHub Pages(`lingshu-ai-agent.github.io/lingshu-docs/`):

- Node 18 + `npm ci` + `npm run build`
- `actions/upload-pages-artifact@v3` 上传 build 产物
- `actions/deploy-pages@v4` 推到 Pages

---

## 📚 相关

- 核心引擎:[lingshu-ai-agent/lingshu](https://github.com/lingshu-ai-agent/lingshu)
- 设计文档:[dsh_agent_design.md](https://github.com/lingshu-ai-agent/lingshu/blob/main/dsh_agent_design.md)(v1.5.5)
- 官网:[lingshu-ai-agent.github.io/lingshu-website](https://lingshu-ai-agent.github.io/lingshu-website/)
- 组织首页:[github.com/lingshu-ai-agent](https://github.com/lingshu-ai-agent)

---

## 📜 License

Apache 2.0 — see [LICENSE](LICENSE).