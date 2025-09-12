# A Basic Add-on（一个简单的插件）

Add the following to `myaddon/__init__.py` in your add-ons folder:

将以下代码添加到你 Anki 插件文件夹内的 `myaddon/__init__.py` 文件中：

```python
# import the main window object (mw) from aqt
# 从 aqt 模块导入主窗口对象（mw）
from aqt import mw
# import the "show info" tool from utils.py
# 从 aqt.utils 模块导入用于显示信息的工具函数 showInfo
from aqt.utils import showInfo, qconnect
# import all of the Qt GUI library
# 导入所有 Qt GUI 库的组件
from aqt.qt import *

# We're going to add a menu item below. First we want to create a function to
# be called when the menu item is activated.
# 接下来，我们要添加一个菜单项。首先，我们需要创建一个函数，
# 以便在菜单项被激活时进行调用。

def testFunction() -> None:
    # get the number of cards in the current collection, which is stored in
    # the main window
    # 获取当前牌组中的卡片总数，该数据存储在
    # 主窗口对象中
    cardCount = mw.col.card_count()
    # show a message box
    # 弹出一个消息框来显示信息
    showInfo("Card count: %d" % cardCount)

# create a new menu item, "test"
# 创建一个名为「test」的新菜单项
action = QAction("test", mw)
# set it to call testFunction when it's clicked
# 当该菜单项被点击时，将其信号连接到 testFunction 函数
qconnect(action.triggered, testFunction)
# and add it to the tools menu
# 最后将这个操作添加到工具菜单中
mw.form.menuTools.addAction(action)
```

Restart Anki, and you should find a 'test' item in the tools menu.
Running it will display a dialog with the card count.

重启 Anki，你应该能在「工具」菜单中找到一个名为「test」的菜单项。
运行它，将会弹出一个显示卡片总数的对话框。

If you make a mistake when entering in the plugin, Anki will show an
error message on startup indicating where the problem is.

如果你在输入插件代码时出错，Anki 将在启动时显示一条错误消息，并指明问题所在。
