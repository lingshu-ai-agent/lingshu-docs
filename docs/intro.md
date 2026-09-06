---
id: intro
title: 30s 上手
sidebar_position: 1
slug: /intro
---

# 灵枢 LingShu · 30s 上手

**LingShu**(灵枢,líng shū)是 **JDK 8+** 的 Java Agent Engine —— Spring Boot SPI、ReAct Loop、9 个可插拔槽位。

## 一句话跑通

```java
@SpringBootApplication
public class MyFirstAgent {
  public static void main(String[] args) {
    SpringApplication.run(MyFirstAgent.class, args);
  }
  @Bean CommandLineRunner run(AgentFactory factory) {
    return args -> {
      Agent agent = factory.create(AgentConfig.builder().build()); // 全默认
      System.out.run(agent.runBlocking("用 Java 写一个 fib 函数").getFinalText());
    };
  }
}
```

> 上面这行 `AgentConfig.builder().build()` 用**全默认值**就能跑 —— 这是 LingShu 的设计原则:**零配置启动**(详见 [Identity & Memory](./concepts/identity-and-memory.md))。

## 业务配置三件套

要在 YAML 里给 Agent 起个身份、配 system prompt、加项目长期记忆,只需 3 个块:

```yaml
agent:
  identity:        # 你是谁(name / role / traits / tone / language)
    name: lingshu-engineer
    role: Java 后端工程师
    traits: [严谨, 简洁, 举反例]
    language: zh
    tone: 直接不啰嗦

  instructions:    # System Prompt(file 优先,inline 兜底)
    file: ./prompts/system.md
    template-engine: mustache
    variables: { org: lingshu-ai-agent }

  memory:          # 项目长期记忆(对齐 Claude Code CLAUDE.md 约定)
    claude-md: { enabled: true }
    extras: [./docs/team-conventions.md]
```

完整说明见 **[Identity & Memory →](./concepts/identity-and-memory.md)**。

## 接下来读什么

| 你想... | 读这篇 |
|---|---|
| 理解 ReAct 循环是怎么转的 | [ReAct Loop](./concepts/react-loop.md) |
| 知道 9 个 SPI 槽位是干嘛的 | [Slots](./concepts/slots.md) |
| 自己写一个 Tool / Skill | [Guides → Custom Tool](./guides/custom-tool.md) |
| 多 Agent 协作 / A2A | [Multi-Agent](./guides/multi-agent.md) |
| 上生产 | [Production](./guides/production.md) |