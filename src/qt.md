# Qt and PyQt（Qt 与 PyQt）

As mentioned in the overview, Anki uses PyQt for a lot of its UI, and the Qt
documentation and [PyQt
documentation](https://www.riverbankcomputing.com/static/Docs/PyQt6/sip-classes.html)
are invaluable for learning how to display different GUI widgets.

如概述中所述，Anki 的许多 UI 都是用 PyQt 实现的。在学习如何显示不同的 GUI 控件时，Qt 官方文档和 [PyQt 文档](https://www.riverbankcomputing.com/static/Docs/PyQt6/sip-classes.html) 是非常宝贵的参考资料。

## Qt Versions（Qt 版本）

From Anki 2.1.50, separate builds are provided for PyQt5 and PyQt6. Generally speaking, if you write code that works in Qt6, and make sure to import any Qt classes from aqt.qt instead of directly from PyQt6, your code should also work
in Qt5.

从 Anki 2.1.50 版本开始，官方分别为 PyQt5 和 PyQt6 提供了独立的构建版本。通常来说，只要您编写的代码能在 Qt6 环境下运行，并确保所有 Qt 类都从 `aqt.qt` 导入，而不是直接从 `PyQt6` 导入，那么您的代码也应该能兼容 Qt5。

## Designer Files（Designer 文件）

Parts of Anki's UI are defined in .ui files, located in `qt/aqt/forms`. Anki's build process converts them into .py files. If you wish to build your add-on's UI in a similar way, you will need to install Python, and install a program called Qt Designer (Designer.app on macOS). On Linux, it may be available in your distro's packages; on Windows and Mac, you'll need to install it as part of a [Qt install](https://download.qt.io/). Once installed, you will need to use a program provided in the pyqt6 pip package to compile the .ui files.

Anki 的部分用户界面是在 `.ui` 文件中定义的，这些文件位于 `qt/aqt/forms` 目录下。Anki 的构建过程会将这些 `.ui` 文件转换为 `.py` 文件。如果您希望用类似的方式来构建插件的用户界面，就需要安装 Python 和一个名为 Qt Designer 的程序（在 macOS 上是 Designer.app）。在 Linux 系统上，您或许能通过发行版的软件包管理器直接安装；而在 Windows 和 Mac 系统上，则需要通过[安装 Qt](https://download.qt.io/) 来获取它。安装完成后，您还需要使用 `pyqt6` pip 包提供的一个程序来编译 `.ui` 文件。

Generated Python files for PyQt6 won't work with PyQt5 and vice versa, so if you wish to support both versions, you will need to build the .ui files twice, once with pyuic5, and once with pyuic6.
为 PyQt6 生成的 Python 文件与 PyQt5 并不兼容，反之亦然。因此，若想同时支持这两个版本，您需要分别使用 `pyuic5` 和 `pyuic6` 将 `.ui` 文件编译两次。

## Garbage Collection（垃圾回收）

One particular thing to bear in mind is that objects are garbage
collected in Python, so if you do something like:

有一个特殊情况需要牢记：Python 会对对象进行垃圾回收。因此，如果您编写了如下代码：

```python
def myfunc():
    widget = QWidget()
    widget.show()
```

…​then the widget will disappear as soon as the function exits. To
prevent this, assign top level widgets to an existing object, like:

…​那么这个控件会在函数执行完毕后立即消失。为避免这种情况，需要将顶层控件赋值给一个已存在的对象，例如：

```python
def myfunc():
    mw.myWidget = widget = QWidget()
    widget.show()
```

This is often not required when you create a Qt object and give it an existing object as the parent, as the parent will keep a reference to
the object.
不过，在创建一个 Qt 对象并为其指定一个父对象时，通常不必这样做，因为父对象会持有对该子对象的引用。