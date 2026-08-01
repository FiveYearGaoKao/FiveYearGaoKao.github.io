# FiveYearGaoKao.github.io

FiveYearGaoKao 的个人主页（GitHub Pages），主要包含与 Googology（大数数学）相关的小工具和课程笔记。

## 项目结构

| 目录 | 说明 |
| --- | --- |
| `index.html` | 主页导航 |
| `styles/` | 所有页面的共享样式 |
| `googology/` | 与大数（Googology）相关的工具 |
| `sequence-expander/` | 各种大数记号的展开器（Notation Expander） |
| `tools/` | 各种小工具 |
| `notes/` | 课程笔记（规划中） |
| `bms-analyzer-plus/` | BMS 分析工具（暂不更新） |

## 子项目

- [Notation Expander](sequence-expander/) — 各种大数记号（Y 序列、BMS、Hydra 等）的展开器
- [0-Y Mountain Viewer](googology/0y-mountain-viewer.html) — 0-Y 序列的山脉图绘制工具
- [BMS-(0-Y) Converter](googology/bms-0y-converter.html) — BMS 与 0-Y 互转工具（已废弃）
- [Ordinal Dice](tools/dice.html) — 随机生成不超过指定上限的序数

## 本地预览

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000>。
