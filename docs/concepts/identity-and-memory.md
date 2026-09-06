---
id: identity-and-memory
title: Identity & Memory — 业务配置三件套
sidebar_position: 6
---

# Identity & Memory

> 设计依据:`dsh_agent_design.md` §8.0 / §8.1.1 / §8.1.2 / §8.1.3 / §8.1.4(v1.5.5)

**LingShu 的业务配置哲学**:Agent 不是空跑的脚本,而是一个**有身份的协作者**。本节讲三件事:

1. **Identity** —— 你是谁(name / role / traits / tone)
2. **Instructions** —— 你的系统提示词(file / inline / 模板引擎)
3. **Memory** —— 你的项目长期记忆(对齐 CLAUDE.md 约定)

配齐这三块,Agent 才有"人味"。

---

## 为什么需要这三件套

LingShu v1.5.4 之前,YAML 里只有 SPI 实现配置(provider / model / sandbox 等),用户**没法在配置文件里定义"Agent 是谁、它知道什么"**。这导致:

| 痛点 | 后果 |
|---|---|
| 没法在 YAML 里给 Agent 起身份 | A2A 端点暴露的 AgentCard 只能写死 |
| System Prompt 必须改源码 | 违反"零代码改业务"原则 |
| 项目记忆埋在 `prompt.memory-sources` 下,无法控制路径 | 配置混乱,新人看不懂 |

v1.5.5 起,这三大块统一归到 **`agent.identity` / `agent.instructions` / `agent.memory`** 三个一级配置块。

---

## 1. `agent.identity` —— Agent 人格

定义 Agent 是谁、说话什么风格。

| 字段 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `name` | string | ❌ | `"lingShu-agent"` | Agent 名,A2A AgentCard 也读这个 |
| `role` | string | ❌ | `null` | 一句话角色(如 `"Java 后端工程师"`) |
| `language` | enum | ❌ | `"auto"` | `zh` / `en` / `auto` |
| `traits` | list[string] | ❌ | `[]` | 人格特质,如 `["严谨", "简洁", "举反例"]` |
| `tone` | string | ❌ | `null` | 语气描述,如 `"直接不啰嗦,一次说一件事"` |
| `avatar` | path | ❌ | `null` | 头像 URI/路径 |

```yaml
agent:
  identity:
    name: lingshu-engineer
    role: Java 后端工程师(熟悉 JDK 8 + Spring Boot 2.7)
    language: zh
    traits:
      - 严谨(看到 unsafe cast 会立刻指出)
      - 简洁(注释只解释 why,不解释 what)
      - 举反例(给方案时主动列失败场景)
    tone: 直接不啰嗦,一次说一件事
    avatar: ./assets/agent-engineer.png
```

**未配置时**:整段 `[ROLE]` 被剔除,系统提示里看不到这些。

---

## 2. `agent.instructions` —— System Prompt

System Prompt 是 Agent 的"灵魂说明"。支持**文件优先 + 内联兜底 + 模板变量**。

| 字段 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `file` | path | ❌ | `null` | 系统提示文件路径(相对/绝对)。**优先于 inline** |
| `inline` | string | ❌ | `null` | 内联字符串,file 不存在或未配置时回退到此 |
| `template-engine` | enum | ❌ | `"none"` | `mustache` / `none` |
| `variables` | map[string,string] | ❌ | `{}` | 注入到 `{{var}}` 的变量 |

**优先级链**:`file 存在且可读` → `inline 非空` → `整段为空(只走 memory + history)`

### 文件示例 (`./prompts/system-engineer.md`)

```markdown
你是 {{identity.name}},{{identity.role}}。
默认 JDK 8 + Spring Boot 2.7;遇到 var/sealed/records 主动提示并改成 Lombok 写法。

## 行为准则
1. 改动前先读现有代码
2. 每个 PR 配单元测试
3. 不在 main 分支直接提交

## 输出格式
- 代码块用 fenced
- 解释用中文,术语用英文
```

### YAML 配置

```yaml
agent:
  instructions:
    file: ./prompts/system-engineer.md
    template-engine: mustache
    variables:
      org: lingshu-ai-agent
      year: 2026
```

> **`{identity.name}` 这种引用是运行时解析的** —— PromptBuilder 拿到 `Identity` 后再渲染。所以改了 `agent.identity.name` 不需要重新写 `instructions.inline`。

---

## 3. `agent.memory` —— 项目长期记忆

对齐 Claude Code 的 `CLAUDE.md` 心智模型。

| 字段 | 类型 | 必填 | 默认 | 说明 |
|---|---|---|---|---|
| `claude-md.enabled` | bool | ❌ | `true` | 一键开关 `CLAUDE.md` 段(false → 不注入) |
| `claude-md.project` | path | ❌ | `"./CLAUDE.md"` | 项目级路径,文件不存在**静默跳过** |
| `claude-md.user` | path | ❌ | `"~/.lingshu/CLAUDE.md"` | 用户级路径,文件不存在**静默跳过** |
| `extras` | list[path] | ❌ | `[]` | 额外 .md 记忆源,按顺序注入 |

### 注入顺序

```
[PROJECT MEMORY] 段
├── 1. <./CLAUDE.md>           (如果 enabled && 文件存在)
├── 2. <~/.lingshu/CLAUDE.md>  (同上)
├── 3. <extras[0]>
├── 4. <extras[1]>
└── ...
```

每段之间用 `── separator ──` 分隔。**整段都不存在时,`[PROJECT MEMORY]` 段被剔除,不输出空标题**。

### 示例

```yaml
agent:
  memory:
    claude-md:
      enabled: true
      project: ./CLAUDE.md
      user: ~/.lingshu/CLAUDE.md
    extras:
      - ./docs/team-conventions.md
      - ./docs/architecture.md
      - ./docs/spring-boot-2.7-migration.md
```

### `./CLAUDE.md` 推荐内容

```markdown
# Project: lingshu

## 技术栈
- JDK 8 + Spring Boot 2.7 + Maven 3.6
- 不用 var/sealed/records,统一 Lombok @Value

## 代码规范
- 所有 public 方法必须有 Javadoc
- 单元测试覆盖率 > 80%
- 提交前跑 `mvn verify`

## 不允许
- 在生产代码里用 Thread.sleep(>1s)
- 直接捕获 Exception 不打日志
```

---

## System Prompt 装配顺序

`DefaultPromptBuilder.build(ctx)` 按下面顺序装配 system 块 → 喂给 LLM。每段**可独立禁用**,空段被自动剔除:

```
┌─ [ROLE] ───────────────────────────────────────────────┐
│ 你是 {identity.name}, {identity.role}。 │
│ 人格特质:{identity.traits.join('、')} │
│ 语气:{identity.tone} │
│ 输出语言:{identity.language} │
└────────────────────────────────────────────────────┘
┌─ [INSTRUCTIONS] ────────────────────────────────────────┐
│ (instructions.file 存在 → 读文件) │
│ (否则用 instructions.inline) │
│ (template-engine=mustache → 替换 {{var}}) │
└────────────────────────────────────────────────────┘
┌─ [PROJECT MEMORY] ──────────────────────────────────────┐
│ <./CLAUDE.md 内容> │
│ ─── separator ─── │
│ <~/.lingshu/CLAUDE.md 内容> │
│ ─── separator ─── │
│ <./docs/team-conventions.md> │
│ <./docs/architecture.md> │
└────────────────────────────────────────────────────┘
┌─ [CONVERSATION HISTORY] ────────────────────────────────┐
│ ... │
└────────────────────────────────────────────────────┘
┌─ [USER MESSAGE] ────────────────────────────────────────┐
│ ... │
└────────────────────────────────────────────────────┘
```

---

## Sub-agent 继承(DelegateTool)

`§6.6.1 DelegateTool` 里定义的 sub-agent(EXPLORE / ENGINEER / REVIEWER),**默认继承父 Agent 的 Identity/Instructions/Memory**,避免每个 sub-agent 都重复声明:

| 字段 | 子 Agent 未指定时 |
|---|---|
| `identity.name` | 父的 name + `"(Sub-agent: {type})"` 后缀 |
| `identity.role/traits/tone/language/avatar` | 沿用父 |
| `instructions.*` | 沿用父 |
| `memory.*` | 沿用父路径(可指向 sub-agent 专属 CLAUDE.md) |

**完全替换语义** —— 子 AgentTypeConfig 里写一个字段就整个替换,不是字段级 deep-merge。简化心智。

---

## A2A AgentCard 自动联动

`§5.6.8 LocalAgentCardGenerator` 直接读 `cfg.getIdentity()`,**零额外配置**:

```json
{
  "name": "lingshu-engineer",
  "description": "Java 后端工程师(熟悉 JDK 8 + Spring Boot 2.7)/直接不啰嗦,一次说一件事",
  "version": "1.0.0",
  "skills": ["Read", "Grep", "Glob", "Write", "Edit", "Bash"],
  "provider": { "organization": "lingshu-ai-agent" }
}
```

启动 `lingshu serve --a2a` 时,`/.well-known/agent.json` 自动从当前 `AgentConfig.identity` 渲染 —— **改 YAML 一行,A2A 端点立即跟着变**。

---

## 完整业务配置示例(Java 工程师 Agent)

```yaml
agent:
  # ── 编排 & 基础设施 ──
  flow-engine: linear
  llm:
    provider: anthropic
    model: claude-sonnet-4-5
    max-tokens: 16000
  prompt:
    builder: default
    memory-sources: [project-claude-md, user-claude-md]
  tool-executor: default
  sandbox:
    policy: strict
    runtime: chroot
    working-directory: ${user.dir}
    command-whitelist: [git, ls, cat, grep, find, mvn, java]
    domain-whitelist: [github.com, maven.aliyun.com]
  compactor: truncating
  session-store: file

  # ── 运行时调优 ──
  tool:
    parallelism: 4
    timeout-seconds: 30
  react:
    max-steps: 50

  # ── 🆕 业务身份 / 人格 ──
  identity:
    name: lingshu-engineer
    role: Java 后端工程师(熟悉 JDK 8 + Spring Boot 2.7)
    language: zh
    traits:
      - 严谨(看到 unsafe cast 会立刻指出)
      - 简洁(注释只解释 why,不解释 what)
      - 举反例(给方案时主动列失败场景)
    tone: 直接不啰嗦,一次说一件事
    avatar: ./assets/agent-engineer.png

  # ── 🆕 System Prompt ──
  instructions:
    file: ./prompts/system-engineer.md
    inline: |
      你是 {{identity.name}},{{identity.role}}。
      默认 JDK 8 + Spring Boot 2.7;遇到 var/sealed/records 主动提示并改成 Lombok 写法。
    template-engine: mustache
    variables:
      org: lingshu-ai-agent
      year: 2026

  # ── 🆕 项目长期记忆 ──
  memory:
    claude-md:
      enabled: true
      project: ./CLAUDE.md
      user: ~/.lingshu/CLAUDE.md
    extras:
      - ./docs/team-conventions.md
      - ./docs/spring-boot-2.7-migration.md

  # ── 多 Agent 协作 ──
  delegate:
    prompts-dir: ./prompts/subagents
    types:
      explore:  { llm: { provider: anthropic, model: claude-haiku-4-5 },   tools: [Read, Grep, Glob] }
      engineer: { llm: { provider: anthropic, model: claude-sonnet-4-5 }, tools: [Read, Write, Edit, Bash] }
      reviewer:
        llm:    { provider: anthropic, model: claude-sonnet-4-5 }
        tools:  [Read, Grep, Glob]
        instructions:
          file: ./prompts/subagents/reviewer.md   # 完全替换父的 system prompt
```

---

## 零配置启动

以上是"完整业务配置示例"。**但 LingShu 不要求这么写** —— 每个字段都有出厂默认值,你可以从空文件开始:

```yaml
# application.yml —— 注释也可以不要,Agent 用所有默认值启动
```

`§8.0 SPI 默认值总表` 列了 27 个字段的默认值,**零配置也能跑通**(用 Anthropic Claude Sonnet 4.5 + 默认白名单 + 默认 sandbox)。这意味着:

- ✅ **CI smoke test** 用 `AgentConfig.builder().build()` 跑通,不需要任何外部依赖
- ✅ **新人 demo** `git clone` + `mvn spring-boot:run` 立刻能看到效果
- ✅ **生产环境** 在默认基础上叠加业务配置(identity / instructions / memory)

---

## 下一步

- 看 9 个 SPI 槽位的完整说明:[Slots →](./slots.md)
- 写第一个 Tool / Skill:[Guides → Custom Tool →](../guides/custom-tool.md)
- 多 Agent / A2A 协作:[Guides → Multi-Agent →](../guides/multi-agent.md)
- 上生产:[Guides → Production →](../guides/production.md)