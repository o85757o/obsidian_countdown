# Obsidian Countdown Timer Plugin

一个功能强大的 Obsidian 倒计时插件，支持多种表盘样式、层级管理和智能提醒功能。

## ✨ 功能特点

### 🎯 多样化表盘展示
- iOS 风格圆形进度表盘
- 简约数字显示
- 模拟时钟表盘
- 支持自定义表盘样式扩展

### 📊 倒计时管理
- 使用 `((2024-12-31|ios-circular))` 语法在任意文档中引用
- 自动聚合所有倒计时引用
- 层级化管理和分类
- 支持搜索和筛选

### 🔔 智能提醒系统
- 可配置多个进度提醒点
- 支持声音和桌面通知
- 安静时间设置
- 每日通知次数限制

### ⚙️ 高度可定制
- 可选择默认表盘样式
- 自定义显示单位（天、时、分、秒）
- 可调整表盘大小
- 进度显示开关

### 📊 提示管理
- 使用 `((2024-12-31|ios-circular|title=Spring Conference))` 语法在任意文档中引用
- 以小文字显示在左上角

## 🚀 快速开始

### 安装
1. 打开 Obsidian 设置
2. 进入第三方插件
3. 关闭安全模式
4. 点击浏览社区插件
5. 搜索 "Countdown Timer"
6. 点击安装并启用

### 基本使用
1. 创建倒计时
   ```markdown
   ((2024-12-31|ios-circular))  # iOS 风格表盘
   ((2024-12-31|digital))       # 数字表盘
   ((2024-12-31|analog))        # 模拟时钟表盘
   ```
2. 设置标题
   ```markdown
   ((2024-12-31|ios-circular|title=Spring Conference))  # iOS 风格表盘
   ((2024-12-31|digital|title=exem Conference))       # 数字表盘
   ((2024-12-31|analog|title=Spring Conference))        # 模拟时钟表盘
   ```
3. 查看倒计时主页
   - 点击左侧功能区的时钟图标
   - 或使用命令面板搜索 "Open Countdown Dashboard"

4. 配置设置
   - 打开设置 > Countdown Timer
   - 选择默认表盘样式
   - 配置通知选项
   - 设置显示偏好

## 🛠️ 高级功能

### 表盘样式
- **iOS 风格 (ios-circular)**
  - 现代简约设计
  - 圆形进度显示
  - 清晰的时间标注

- **数字显示 (digital)**
  - 精确的数字倒计时
  - 简洁直观

- **模拟时钟 (analog)**
  - 传统时钟外观
  - 直观的时间显示

### 通知系统
- 支持多个提醒点
  - 可单独设置每个提醒点的进度百分比
  - 独立的声音和桌面通知开关
- 安静时间
  - 设置免打扰时段
  - 避免工作或休息时被打扰
- 通知限制
  - 设置每日最大通知次数
  - 防止通知干扰过多

### 自定义配置
- 显示选项
  - 选择显示的时间单位
  - 调整表盘大小
  - 进度显示开关
- 刷新设置
  - 自定义更新频率
  - 优化性能和实时性

## 🔧 开发者指南

### 添加新表盘
1. 创建表盘实现：
```typescript
import { DialDefinition, DialRenderer } from './DialRegistry';

export class MyDialRenderer implements DialRenderer {
    render(container: HTMLElement, props: ClockFaceProps) {
        // 实现表盘渲染逻辑
    }
}

export const MyDial: DialDefinition = {
    id: 'my-dial',
    name: 'My Custom Dial',
    description: 'A custom countdown dial',
    renderer: new MyDialRenderer(),
    defaultOptions: {
        // 默认选项
    }
};
```

2. 注册表盘：
```typescript
import { DialRegistry } from './DialRegistry';
import { MyDial } from './MyDial';

DialRegistry.getInstance().registerDial(MyDial);
```

### 开发环境设置
```bash
# 克隆仓库
git clone https://github.com/yourusername/obsidian-countdown.git

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 📝 更新日志

### 1.0.0
- 初始版本发布
- 支持多种表盘样式
- 实现基础的倒计时功能
- 添加通知系统

## 🤝 贡献与支持
- 欢迎提交 Issue 和 Pull Request
- 如遇到任何问题，请在 GitHub 仓库中报告
- 喜欢这个插件？给我们一个 Star ⭐️

## 📄 许可证
本项目采用 GPL-3.0 许可证
