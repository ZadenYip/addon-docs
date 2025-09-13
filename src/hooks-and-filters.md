# Hooks & Filters（Hook 与过滤器）

<!-- toc -->

Hooks are the way you should connect your add-on code to Anki. If the function you want to alter doesn’t already have a hook, please see the section below about adding new hooks.<br>
Hooks 是你将插件代码与 Anki 连接的首选方式。如果您想修改的函数尚未提供 Hook，请参阅下文关于添加新 Hook 的章节。

There are two different kinds of "hooks":
- Regular hooks are functions that don’t return anything. They are run for their side effects, and may sometimes alter the objects they have been passed, such as inserting an extra item in a list.
- "Filters" are functions that return their first argument, after maybe changing it. An example filter is one that takes the text of a field during card display, and returns an altered version.<br>
“Hook”主要有两种类型：
- 常规 Hook，这类函数没有返回值。它们因其“副作用”（side effects）而被执行，有时可能会修改传递给它们的对象，例如向一个 list 中插入一个额外的 item。
- 过滤器，这类函数会返回其接收的第一个参数，但可能在返回前对其进行修改。一个典型的例子是，在显示卡片时，过滤器可以获取字段中的文本，并返回一个修改后的版本。

The distinction is necessary because some data types in Python can be modified directly, and others can only be modified by creating a changed copy (such as strings).<br>
之所以需要这种区分，是因为在 Python 中，某些数据类型（如 list）是**可变的**，可以直接修改；而其他数据类型（如字符串）是**不可变的**，只能通过创建一个修改后的副本来进行更改。

## New Style Hooks（新式 Hook）
A new style of hook was added in Anki 2.1.20.<br>
Anki 2.1.20 版本引入了一种新式的 Hook。

Imagine you wish to show a message each time the front side of a card is shown in the review screen. You’ve looked at the source code in reviewer.py, and seen the following line in the showQuestion() function:<br>
假设你希望每当在复习界面显示卡片正面时，都弹出一则消息。通过查看 `reviewer.py` 的源代码，您会在 `showQuestion()` 函数中发现这样一行代码：

```python
gui_hooks.reviewer_did_show_question(card)
```

To register a function to be called when this hook is run, you can do the following in your add-on:<br>
为了在该 Hook 触发时调用您自己的函数，您可以在插件中添加如下代码：

```python
from aqt import gui_hooks

def myfunc(card):
  print("question shown, card question is:", card.q())

gui_hooks.reviewer_did_show_question.append(myfunc)
```

Multiple add-ons can register for the same hook or filter - they will all be called in turn.<br>
多个插件可以注册同一个 Hook 或过滤器，Anki 会依次调用所有注册的函数。

To remove a hook, use code like:<br>
若要移除一个已注册的 Hook，可以使用类似下面的代码：

```
gui_hooks.reviewer_did_show_question.remove(myfunc)
```

:warning: Functions you attach to a hook should not modify the hook while they are executing, as it will break things:<br>
:warning: **警告**：您挂载到 Hook 上的函数在执行期间不应尝试修改该 Hook 自身，否则会导致程序异常：

```
def myfunc(card):
  # DON'T DO THIS!
  # 错误示范：不要这样做！
  gui_hooks.reviewer_did_show_question.remove(myfunc)

gui_hooks.reviewer_did_show_question.append(myfunc)
```

An easy way to see all hooks at a glance is to look at [pylib/tools/genhooks.py](https://github.com/ankitects/anki/tree/main/pylib/tools/genhooks.py) and [qt/tools/genhooks_gui.py](https://github.com/ankitects/anki/blob/main/qt/tools/genhooks_gui.py).<br>
要快速浏览所有可用的 Hook，一个简单的方法是查阅 Anki 源代码中的 [pylib/tools/genhooks.py](https://github.com/ankitects/anki/tree/main/pylib/tools/genhooks.py) 和 [qt/tools/genhooks_gui.py](https://github.com/ankitects/anki/blob/main/qt/tools/genhooks_gui.py) 文件。

If you have set up type completion as described in an earlier section, you can also see the hooks in your IDE:<br>
如果您已按照前文指引配置好类型补全，那么在您的集成开发环境（IDE）中也能方便地查看这些 Hook：

<video controls autoplay loop muted>
 <source src="../img/autocomplete.mp4" type="video/mp4">
</video>

In the above video, holding the command/ctrl key down while hovering will show a tooltip, including arguments and documentation if it exists. The argument names and types for the callback can be seen on the bottom line.<br>
在上面的演示视频中，当您按住 `Command` 键（macOS）或 `Ctrl` 键（Windows/Linux）并将鼠标悬停在 Hook 上时，IDE 会显示一个工具提示，其中包含参数信息和相关文档（如果存在）。回调函数所需的参数名和类型会显示在提示的最后一行。

For some examples of how the new hooks are used, please see <https://github.com/ankitects/anki-addons/blob/master/demos/>.<br>
关于新式 Hook 的更多用法示例，请参考 <https://github.com/ankitects/anki-addons/blob/master/demos/>。

Most of the new style hooks will also call the legacy hooks (described further below), so old add-ons will continue to work for now, but add-on authors are encouraged to update to the new style as it allows for code completion, and better error checking.<br>
大部分新式 Hook 也会兼容并调用旧式 Hook（详见下文），因此旧版插件目前仍可继续使用。但我们强烈建议插件开发者升级到新式 Hook，因为它能提供更好的代码自动补全支持和更严格的错误检查。

## Notable Hooks（重要 Hook）

For a full list of hooks, and their documentation, please see<br>
要获取所有 Hook 的完整列表及其详细文档，请参阅：

- [The GUI hooks](https://github.com/ankitects/anki/blob/master/qt/tools/genhooks_gui.py)
- [The pylib hooks](https://github.com/ankitects/anki/blob/master/pylib/tools/genhooks.py)
- [图形界面（GUI）相关 Hook](https://github.com/ankitects/anki/blob/master/qt/tools/genhooks_gui.py)
- [核心库（pylib）相关 Hook](https://github.com/ankitects/anki/blob/master/pylib/tools/genhooks.py)

### Webview（网页视图）

Many of Anki's screens are built with one or more webviews, and there are
some hooks you can use to intercept their use.<br>
Anki 的许多界面都是由一个或多个 Webview 构建的，您可以使用一些特定的 Hook 来干预它们的行为。

From Anki 2.1.22:
- `gui_hooks.webview_will_set_content()` allows you to modify the HTML that various screens send to the webview. You can use this for adding your own HTML/CSS/Javascript to particular screens. This will not work for external pages - see the Anki 2.1.36 section below.
- `gui_hooks.webview_did_receive_js_message()` allows you to intercept
  messages sent from Javascript. Anki provides a `pycmd(string)` function in Javascript which sends a message back to Python, and various screens such as reviewer.py respond to the messages. By using this hook, you can respond to your own messages as well.<br>
自 Anki 2.1.22 版本起：
- `gui_hooks.webview_will_set_content()` 允许你修改各个界面发送到 Webview 的 HTML 内容。您可以利用这个 Hook 向特定界面添加自定义的 HTML、CSS 或 JavaScript。请注意，此 Hook 对外部页面无效——相关说明请参阅下文关于 Anki 2.1.36 的部分。
- `gui_hooks.webview_did_receive_js_message()` 允许您拦截从 JavaScript 发送过来的消息。Anki 在 JavaScript 环境中提供了一个 `pycmd(string)` 函数，用于向 Python 后端发送消息。像 `reviewer.py` 等界面会响应这些消息。通过此 Hook，您也可以处理自己定义的 JavaScript 消息。

From Anki 2.1.36:
- `webview_did_inject_style_into_page()` gives you an opportunity to inject styling or content into external pages like the graphs screen and congratulations page that are loaded with load_ts_page().<br>
自 Anki 2.1.36 版本起：
- `webview_did_inject_style_into_page()`：为您提供了一个机会，可以向通过 `load_ts_page()` 函数加载的外部页面（例如统计图表页和完成复习时的祝贺页）注入自定义样式或内容。


#### Managing External Resources in Webviews（在 Webview 中管理外部资源）

Add-ons may expose their own web assets by utilizing `aqt.addons.AddonManager.setWebExports()`. Web exports registered in this manner may then be accessed under the `/_addons` subpath.<br>
插件可以通过调用 `aqt.addons.AddonManager.setWebExports()` 方法来暴露其自身的网络资源（web assets）。通过这种方式注册的资源，之后便可以通过 `/_addons` 这个子路径进行访问。

For example, to allow access to a `my-addon.js` and `my-addon.css` residing in a "web" subfolder in your add-on package, first register the corresponding web export: <br>
例如，假设您的插件包内有一个 `web` 子文件夹，其中包含 `my-addon.js` 和 `my-addon.css` 两个文件。要让 Anki 能够访问它们，首先需要注册相应的网络导出规则：

```python
from aqt import mw
mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")
```

Then, append the subpaths to the corresponding web_content fields within a function subscribing to `gui_hooks.webview_will_set_content`:<br>
接着，在一个订阅了 `gui_hooks.webview_will_set_content` Hook 的函数中，将这些资源的路径添加到 `web_content` 对象相应的字段里：

```python
def on_webview_will_set_content(web_content: WebContent, context) -> None:
    addon_package = mw.addonManager.addonFromModule(__name__)
    web_content.css.append(f"/_addons/{addon_package}/web/my-addon.css")
    web_content.js.append(f"/_addons/{addon_package}/web/my-addon.js")
```

Note that '/' will also match the os specific path separator.<br>
请注意，路径中的 `/` 符号会自动适配不同操作系统（如 Windows 的 `\`）的路径分隔符。



## Legacy Hook Handling（旧式 Hook）

Older versions of Anki used a different hook system, using the functions runHook(), addHook() and runFilter().<br>
旧版 Anki 采用了一套不同的 Hook 系统，主要使用 `runHook()`、`addHook()` 和 `runFilter()` 这三个函数。

For example, when the scheduler (anki/sched.py) discovers a leech, it calls:<br>
例如，当调度器（`anki/sched.py`）检测到一张“记忆难点”的卡片时，会调用：

```python
runHook("leech", card)
```

If you wished to perform a special operation when a leech was discovered, such as moving the card to a "Difficult" deck, you could do it with the following code:<br>
如果您希望在检测到“记忆难点”卡片时执行特定操作（例如，将其移动到“困难”牌组），可以使用以下代码实现：

```python
from anki.hooks import addHook
from aqt import mw

def onLeech(card):
    # can modify without .flush(), as scheduler will do it for us
    # 此处修改卡片无需调用 .flush()，因为调度器稍后会统一处理
    card.did = mw.col.decks.id("Difficult")
    # if the card was in a cram deck, we have to put back the original due
    # time and original deck
    # 如果卡片原先在临时复习牌组（cram deck）中，
    # 我们需要恢复其原始的到期时间和牌组
    card.odid = 0
    if card.odue:
        card.due = card.odue
        card.odue = 0

addHook("leech", onLeech)
```

An example of a filter is in [aqt/editor.py](https://github.com/ankitects/anki/blob/main/qt/aqt/editor.py). The editor calls the "editFocusLost" filter each time a field loses focus, so that add-ons can apply changes to the note:<br>
关于过滤器（filter）的一个例子可以在 `aqt/editor.py` 文件中找到。每当编辑器中的某个字段失去焦点时，编辑器会调用名为 `editFocusLost` 的过滤器，从而允许插件对笔记内容进行修改：

```python
if runFilter(
    "editFocusLost", False, self.note, self.currentField):
    # something updated the note; schedule reload
    # 过滤器返回 True，表示有内容被更新了，需要重新加载笔记
    def onUpdate():
        self.loadNote()
        self.checkValid()
    self.mw.progress.timer(100, onUpdate, False)
```

Each filter in this example accepts three arguments: a modified flag, the note, and the current field. If a filter makes no changes it returns the modified flag the same as it received it; if it makes a change it returns True. In this way, if any single add-on makes a change, the UI will reload the note to show updates.<br>
在这个例子中，`editFocusLost` 过滤器接收三个参数：一个表示“是否修改”的 flag、当前笔记对象以及当前字段的索引。如果一个过滤器函数没有做任何修改，它应该原样返回这个 flag；如果它修改了笔记，则应返回 `True`。这样一来，只要有任何一个插件对笔记进行了修改，UI 就会重新加载笔记以展示最新的内容。

The Japanese Support add-on uses this hook to automatically generate one field from another. A slightly simplified version is presented below:<br>
“日语支持”（Japanese Support）插件就利用了这个 Hook，根据一个字段的内容自动填充另一个字段。以下是其简化版的代码示例：

```python
def onFocusLost(flag, n, fidx):
    from aqt import mw
    # japanese model?
    # 检查是否为“日语”模板？
    if "japanese" not in n.model()['name'].lower():
        return flag
    # have src and dst fields?
    # 检查模板中是否存在源字段和目标字段？
    for c, name in enumerate(mw.col.models.fieldNames(n.model())):
        for f in srcFields:
            if name == f:
                src = f
                srcIdx = c
        for f in dstFields:
            if name == f:
                dst = f
    if not src or not dst:
        return flag
    # dst field already filled?
    # 目标字段是否已经有内容？
    if n[dst]:
        return flag
    # event coming from src field?
    # 事件是否由源字段触发？
    if fidx != srcIdx:
        return flag
    # grab source text
    # 获取源字段的纯文本内容
    srcTxt = mw.col.media.strip(n[src])
    if not srcTxt:
        return flag
    # update field
    # 更新目标字段
    try:
        n[dst] = mecab.reading(srcTxt)
    except Exception, e:
        mecab = None
        raise
    return True

addHook('editFocusLost', onFocusLost)
```

The first argument of a filter is the argument that should be returned. In the focus lost filter this is a flag, but in other cases it may be some other object. For example, in anki/collection.py, \_renderQA() calls the "mungeQA" filter which contains the generated HTML for the front and back of cards. latex.py uses this filter to convert text in LaTeX tags into images.<br>
过滤器的第一个参数通常是需要被层层处理并最终返回的值。在 `editFocusLost` 过滤器中，这个值是一个flag，但在其他情况下，它也可能是一个对象。例如，在 `anki/collection.py` 中，`_renderQA()` 函数会调用 `mungeQA` 过滤器，这个过滤器处理的是为卡片正反面生成的 HTML 代码。`latex.py` 模块就利用这个过滤器，将 LaTeX 标签内的文本转换成图像。

In Anki 2.1, a hook was added for adding buttons to the editor. It can be used like so:<br>
Anki 2.1 版本为编辑器增加了一个用于添加自定义按钮的 Hook，用法如下：

```python
from aqt.utils import showInfo
from anki.hooks import addHook

# cross out the currently selected text
# 为当前选中的文本添加删除线
def onStrike(editor):
    editor.web.eval("wrap('<del>', '</del>');")

def addMyButton(buttons, editor):
    editor._links['strike'] = onStrike
    return buttons + [editor._addButton(
        "iconname", # "/full/path/to/icon.png",
        "strike", # link name
        "tooltip")]

addHook("setupEditorButtons", addMyButton)
```

## Adding Hooks（添加 Hook）
If you want to modify a function that doesn’t already have a hook, please submit a pull request that adds the hooks you need.<br>
如果您想修改的某个函数目前还没有提供 Hook，欢迎您提交一个拉取请求（Pull Request）来添加您所需要的 Hook。

In your PR, please describe the use-case you're trying to solve. Hooks that are general in nature will typically be approved; hooks that target a very specific use case may need to be refactored to be more general first. For an example of what this might look like, please see [this PR](https://github.com/ankitects/anki/pull/2340).<br>
在您的 PR 中，请详细描述您希望通过这个 Hook 解决的具体应用场景。通常，那些具有通用性的 Hook 会被接受；而那些针对非常特定场景的 Hook，可能需要先进行重构，使其更具通用性。关于这方面的一个实例，可以参考[此 PR](https://github.com/ankitects/anki/pull/2340)。

The hook definitions are located in [pylib/tools/genhooks.py](https://github.com/ankitects/anki/tree/main/pylib/tools/genhooks.py) and [qt/tools/genhooks_gui.py](https://github.com/ankitects/anki/blob/main/qt/tools/genhooks_gui.py). When building Anki, the build scripts will automatically update the hook files with the definitions listed there.<br>
Hook 的定义文件分别位于 [pylib/tools/genhooks.py](https://github.com/ankitects/anki/tree/main/pylib/tools/genhooks.py) 和 [qt/tools/genhooks_gui.py](https://github.com/ankitects/anki/blob/main/qt/tools/genhooks_gui.py)。当 Anki 项目构建时，构建脚本会自动根据这些文件中的定义来更新 Hook 相关的代码。

Please see the [docs/](https://github.com/ankitects/anki/tree/main/docs) folder in the source tree for more information.<br>
更多相关信息，请参阅 Anki 源代码树中的 [docs/](https://github.com/ankitects/anki/tree/main/docs) 文件夹。
