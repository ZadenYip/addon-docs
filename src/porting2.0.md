# Porting Anki 2.0 add-ons（迁移 Anki 2.0 插件）

<!-- toc -->

## Python 3

Anki 2.1 requires Python 3 or later. After installing Python 3 on your machine, you can use the 2to3 tool to automatically convert your existing scripts to Python 3 code on a folder by folder basis, like:<br>
Anki 2.1 需要 Python 3 或更高版本。在你的电脑上安装 Python 3 后，你可以使用 `2to3` 工具，按文件夹逐一将现有脚本自动转换为 Python 3 代码，如下所示：

    2to3-3.8 --output-dir=aqt3 -W -n aqt
    mv aqt aqt-old
    mv aqt3 aqt

Most simple code can be converted automatically, but there may be parts of the code that you need to manually modify.<br>
大多数简单的代码都能自动转换，但仍可能有些部分需要你手动修改。

## Qt5 / PyQt5

The syntax for connecting signals and slots has changed in PyQt5. Recent PyQt4 versions support the new syntax as well, so the same syntax can be used for both Anki 2.0 and 2.1 add-ons.<br>
`PyQt5` 中连接「信号和槽」的语法已发生变化。不过，较新版本的 `PyQt4` 也支持新语法，因此同一套语法可同时用于 Anki 2.0 和 2.1 的插件。

More info is available at <http://pyqt.sourceforge.net/Docs/PyQt4/new_style_signals_slots.html><br>
更多信息请参阅：<http://pyqt.sourceforge.net/Docs/PyQt4/new_style_signals_slots.html>

One add-on author reported that the following tool was useful to automatically convert the code: <https://github.com/rferrazz/pyqt4topyqt5><br>
据一位插件作者反映，以下工具对自动转换代码很有帮助：<https://github.com/rferrazz/pyqt4topyqt5>

The Qt modules are in 'PyQt5' instead of 'PyQt4'. You can do a conditional import, but an easier way is to import from aqt.qt - eg<br>
Qt 模块位于 `PyQt5` 中，而非 `PyQt4`。你可以进行条件导入，但更简单的方法是从 `aqt.qt` 导入，例如：

    from aqt.qt import *

That will import all the Qt objects like QDialog without having to specify the Qt version.<br>
这样就能导入像 `QDialog` 等所有 Qt 对象，而无需指定具体的 Qt 版本。

## Single .py add-ons need their own folder（单个 `.py` 文件插件需要独立的文件夹）
Each add-on is now stored in its own folder. If your add-on was previously called `demo.py`, you’ll need to create a `demo` folder with an `__init__.py` file.<br>
现在，每个插件都存储在各自独立的文件夹中。如果你的插件之前是名为 `demo.py` 的单个文件，那么你需要创建一个 `demo` 文件夹，并在其中包含一个 `__init__.py` 文件。

If you don’t care about 2.0 compatibility, you can just rename `demo.py` to `demo/__init__.py`.<br>
如果你无需考虑与 2.0 版本的兼容性，可以直接将 `demo.py` 重命名为 `demo/__init__.py`。

If you plan to support 2.0 with the same file, you can copy your original file into the folder (`demo.py` → `demo/demo.py`), and then import it relatively by adding the following to `demo/__init__.py`:<br>
如果你计划用同一个文件来同时支持 2.0 版本，可以将原文件复制到新文件夹中（即 `demo.py` → `demo/demo.py`），然后在 `demo/__init__.py` 文件里添加以下代码来进行相对导入：

    from . import demo

The folder needs to be zipped up when uploading to AnkiWeb. For more info, please see [sharing add-ons](sharing.md).<br>
上传到 AnkiWeb 时，需要将该文件夹打包成 zip 压缩文件。更多信息，请参阅[分享插件](sharing.md)。

## Folders are deleted when upgrading（升级时插件文件夹会被删除）

When an add-on is upgraded, all files in the add-on folder are deleted. The only exception is the special [user\_files folder](addon-config.md#user-files). If your add-on requires more than simple key/value configuration, make sure you store the associated files in the user\_files folder, or they will be lost on upgrade.<br>
当升级插件时，其文件夹内的所有文件都将被删除。唯一的例外是一个名为 [`user_files` 的特殊文件夹](addon-config.md#user-files)。如果你的插件需要的配置比简单的「键/值」对更复杂，请务必将相关文件存储在 `user_files` 文件夹中，否则这些文件将在升级过程中丢失。

## Supporting both 2.0 and 2.1 in one codebase（在同一代码库中支持 2.0 和 2.1 版本）

Most Python 3 code will run on Python 2 as well, so it is possible to update your add-ons in such a way that they run on both Anki 2.0 and 2.1. Whether this is worth it depends on the changes you need to make.<br>
大多数 Python 3 代码也能在 Python 2 上运行，因此你可以通过更新，让插件同时在 Anki 2.0 和 2.1 上运行。是否值得这样做，取决于你需要做出的改动大小。

Most add-ons that affect the scheduler should require only minor changes to work on 2.1. Add-ons that alter the behaviour of the reviewer, browser or editor may require more work.<br>
大多数影响**调度器**的插件只需少量修改即可在 2.1 版本上运行。而那些修改**复习器**、**浏览器**或**编辑器**行为的插件则可能需要更多工作。

The most difficult part is the change from the unsupported QtWebKit to QtWebEngine. If you do any non-trivial work with webviews, some work will be required to port your code to Anki 2.1, and you may find it difficult to support both Anki versions in the one codebase.<br>
最困难的部分是从不再受支持的 `QtWebKit` 迁移到 `QtWebEngine`。如果你对 `webview` 进行了任何复杂的操作，那么将代码迁移到 Anki 2.1 将需要不少工作，而且你可能会发现在单个代码库中同时支持两个 Anki 版本非常困难。

If you find your add-on runs without modification, or requires only minor changes, you may find it easiest to add some if statements to your code and upload the same file for both 2.0.x and 2.1.x.<br>
如果你发现插件无需修改即可运行，或者仅需微调，那么最简单的方法可能是在代码中添加一些 `if` 判断语句，然后为 2.0.x 和 2.1.x 版本上传同一个文件。

If your add-on requires more significant changes, you may find it easier to stop providing updates for 2.0.x, or to maintain separate files for the two Anki versions.<br>
如果你的插件需要较大改动，那么更简单的做法可能是停止为 2.0.x 版本提供更新，或者为这两个 Anki 版本分别维护不同的文件。

## Webview Changes（Webview 变更）

Qt 5 has dropped WebKit in favour of the Chromium-based WebEngine, so Anki’s webviews are now using WebEngine. Of note:<br>
Qt 5 已弃用 `WebKit`，转而采用基于 `Chromium` 的 `WebEngine`，因此 Anki 的 `webview` 现在使用的是 `WebEngine`。值得注意的变更如下：

-   You can now debug the webviews using an external Chrome instance, by setting the env var QTWEBENGINE\_REMOTE\_DEBUGGING to 8080 prior to starting Anki, then surfing to localhost:8080 in Chrome.
-   现在，你可以通过外部的 Chrome 浏览器实例来调试 `webview`。只需在启动 Anki 前，将环境变量 `QTWEBENGINE_REMOTE_DEBUGGING` 设置为 `8080`，然后在 Chrome 中访问 `localhost:8080` 即可。<br>

-   WebEngine uses a different method of communicating back to Python. AnkiWebView() is a wrapper for webviews which provides a pycmd(str) function in Javascript which will call the ankiwebview’s onBridgeCmd(str) method. Various parts of Anki’s UI like reviewer.py and deckbrowser.py have had to be modified to use this.
-   `WebEngine` 使用了不同的方法与 Python 进行反向通信。`AnkiWebView()` 是一个 `webview` 的包装器，它在 Javascript 端提供了一个 `pycmd(str)` 函数，该函数会调用 Python 端 `ankiwebview` 对象的 `onBridgeCmd(str)` 方法。Anki 界面中的许多部分（如 `reviewer.py` 和 `deckbrowser.py`）都已为此做出修改。<br>

-   Javascript is evaluated asynchronously, so if you need the result of a JS expression you can use ankiwebview’s evalWithCallback().
-   Javascript 是异步执行的。因此，如果你需要获取某个 JS 表达式的执行结果，应使用 `ankiwebview` 的 `evalWithCallback()` 方法。<br>

-   As a result of this asynchronous behaviour, editor.saveNow() now requires a callback. If your add-on performs actions in the browser, you likely need to call editor.saveNow() first and then run the rest of your code in the callback. Calls to .onSearch() will need to be changed to .search()/.onSearchActivated() as well. See the browser’s .deleteNotes() for an example.
-   受此异步行为影响，`editor.saveNow()` 现在需要一个回调函数。如果你的插件需要在浏览器（Anki 浏览器，非 Chrome）中执行操作，很可能需要先调用 `editor.saveNow()`，然后将余下的代码放在回调函数中执行。同样，对 `.onSearch()` 的调用也需要改为 `.search()` 或 `.onSearchActivated()`。具体可参考浏览器中的 `.deleteNotes()` 方法作为示例。<br>

-   Various operations that were supported by WebKit like setScrollPosition() now need to be implemented in javascript.
-   许多 `WebKit` 支持的操作（如 `setScrollPosition()`）现在需要通过 Javascript 来实现。<br>

-   Page actions like mw.web.triggerPageAction(QWebEnginePage.Copy) are also asynchronous, and need to be rewritten to use javascript or a delay.
-   页面动作（如 `mw.web.triggerPageAction(QWebEnginePage.Copy)`）也变为异步执行，需要重写为使用 Javascript 或添加延迟处理。<br>

-   WebEngine doesn’t provide a keyPressEvent() like WebKit did, so the code that catches shortcuts not attached to a menu or button has had to be changed. setStateShortcuts() fires a hook that can be used to adjust the shortcuts for a given state.
-   `WebEngine` 不再提供 `keyPressEvent()` 方法，因此，用于捕获未绑定到菜单或按钮上的快捷键的代码也必须修改。`setStateShortcuts()` 会触发一个钩子（hook），你可以利用这个钩子来调整特定状态下的快捷键。<br>

## Reviewer Changes（复习器变更）

Anki now fades the previous card out before fading the next card in, so the next card won’t be available in the DOM when the showQuestion hook fires. There are some new hooks you can use to run Javascript at the appropriate time - see [here](reviewer-javascript.md) for more.<br>
Anki 现在的卡片切换效果是：先将上一张卡片淡出，再将下一张卡片淡入。因此，当 `showQuestion` 钩子触发时，下一张卡片尚未在 `DOM` 中生成，故无法访问。为解决此问题，Anki 提供了一些新的钩子，以便你可以在恰当的时机运行 Javascript。更多详情请参阅[此文档](reviewer-javascript.md)。

## Add-on Configuration（插件配置）

Many small 2.0 add-ons relied on users editing the sourcecode to customize them. This is no longer a good idea in 2.1, because changes made by the user will be overwritten when they check for and download updates. 2.1 provides a [Configuration](addon-config.md#config-json) system to work around this. If you need to continue supporting 2.0 as well, you could use code like the following:<br>

许多小型的 2.0 版本插件依赖用户通过编辑源代码来进行自定义。在 2.1 版本中，这种做法已不再推荐，因为当用户检查并下载更新时，他们对代码的任何修改都将被覆盖。为了解决这个问题，2.1 版本提供了一套[配置](addon-config.md#config-json)系统。如果你需要让插件同时兼容 2.0 版本，可以使用类似下面的代码来向后兼容：

```python
if getattr(getattr(mw, "addonManager", None), "getConfig", None):
    config = mw.addonManager.getConfig(__name__)
else:
    config = dict(optionA=123, optionB=456)
```

