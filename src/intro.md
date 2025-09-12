# Introduction（介绍）

## Translations（其他语言版本）

- 日语：
  - <https://t-cool.github.io/anki-addon-docs-ja/>
  - <http://rs.luminousspice.com/ankiaddons21/>

## Overview（概述）

Anki 的 UI 主要由 Python/PyQt 构建。许多界面（如复习界面和编辑器）也使用了 TypeScript 和 Svelte。要编写插件，你需要具备一定的编程基础并一定程度上熟悉 Python。[Python 官方教程](http://docs.python.org/tutorial/) 是一个很好的入门资源。

Anki 的插件是以 Python 模块的形式实现的，Anki 会在启动时加载它们。插件可以注册 **hooks**，以便在特定操作（例如，加载「浏览」界面时）发生时被触发，进而对 UI 进行修改（例如，添加新的菜单项）。

这里有一份可供查阅的 [Anki 架构简述](https://github.com/ankitects/anki/blob/main/docs/architecture.md)。

虽然只用纯文本编辑器也能开发 Anki 插件，但使用合适的代码编辑器或 IDE 能让你事半功倍。更多信息请参阅[编辑器设置](https://addon-docs.ankiweb.net/editor-setup.html)一节。