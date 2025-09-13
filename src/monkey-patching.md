# Monkey Patching and Method Wrapping（猴子补丁与方法包装）

If you want to modify a function that doesn’t already have a hook, it’s possible to overwrite that function with a custom version instead. This is sometimes referred to as 'monkey patching'.<br>
如果你想修改一个尚未提供 hook 的函数，可以用一个自定义版本来覆盖原始函数。这种技术有时被称为「猴子补丁」（Monkey patch）。

Monkey patching is useful in the testing stage, and while waiting for new hooks to be integrated into Anki. But please don’t rely on it long term, as monkey patching is very fragile, and will tend to break as Anki is updated in the future.<br>
在测试阶段，或在等待 Anki 集成新 Hook 期间，猴子补丁非常有用。但请不要长期依赖它，因为猴子补丁非常脆弱，随着 Anki 未来的版本更新，它很可能会失效。

The only exception to the above is if you’re making extensive changes to Anki where adding new hooks would be impractical. In that case, you may unfortunately need to modify your add-on periodically as Anki is updated.<br>
唯一的例外是，当你需要对 Anki 进行大规模修改，以至于添加新 Hook 变得不切实际时。在这种情况下，你可能不得不随着 Anki 的更新，周期性地维护你的插件。

In [aqt/editor.py](https://github.com/ankitects/anki/blob/main/qt/aqt/editor.py) there is a function setupButtons() which creates the buttons like bold, italics and so on that you see in the editor. Let’s imagine you want to add another button in your add-on.<br>
在 [aqt/editor.py](https://github.com/ankitects/anki/blob/main/qt/aqt/editor.py) 文件中，有一个 `setupButtons()` 函数，它负责创建你在编辑器中看到的**粗体**、**斜体**等按钮。现在，我们假设你想在自己的插件中添加一个新按钮。

Anki 2.1 no longer uses setupButtons(). The code below is still useful to understand how monkey patching works, but for adding buttons to the editor please see the setupEditorButtons hook described in the previous section.<br>
Anki 2.1 已不再使用 `setupButtons()`。虽然下面的代码对于理解猴子补丁的工作原理依然有帮助，但若要向编辑器添加按钮，请参阅前一节介绍的 `setupEditorButtons` Hook。

The simplest way is to copy and paste the function from the Anki source code, add your text to the bottom, and then overwrite the original, like so:<br>
最简单的方法是直接从 Anki 源码中复制粘贴整个函数，在末尾加上你的代码，然后覆盖原始函数，如下所示：

```python
from aqt.editor import Editor

def mySetupButtons(self):
    <copy & pasted code from original>
    <custom add-on code>

Editor.setupButtons = mySetupButtons
```

This approach is fragile however, as if the original code is updated in a future version of Anki, you would also have to update your add-on. A better approach would be to save the original, and call it in our custom version:<br>
然而，这种方法非常脆弱。一旦 Anki 未来版本更新了原始代码，你的插件也必须随之更新。更好的方法是先保存原始函数，然后在你的自定义版本中调用它：

```python
from aqt.editor import Editor

def mySetupButtons(self):
    origSetupButtons(self)
    <custom add-on code>

origSetupButtons = Editor.setupButtons
Editor.setupButtons = mySetupButtons
```

Because this is a common operation, Anki provides a function called wrap() which makes this a little more convenient. A real example:<br>
由于这是一种常见操作，Anki 提供了一个名为 `wrap()` 的函数，让整个过程更便捷。下面是一个实例：

```python
from anki.hooks import wrap
from aqt.editor import Editor
from aqt.utils import showInfo

def buttonPressed(self):
    showInfo("pressed " + `self`)

def mySetupButtons(self):
    # - size=False tells Anki not to use a small button
    # - the lambda is necessary to pass the editor instance to the
    #   callback, as we're passing in a function rather than a bound
    #   method
    # - size=False 告诉 Anki 不要使用小尺寸按钮。
    # - 这里必须使用 lambda，才能将编辑器实例（editor instance）传递给
    #   回调函数（callback），因为我们传入的是一个普通函数，而非绑定
    #   方法（bound method）。
    self._addButton("mybutton", lambda s=self: buttonPressed(self),
                    text="PressMe", size=False)

Editor.setupButtons = wrap(Editor.setupButtons, mySetupButtons)
```

By default, wrap() runs your custom code after the original code. You can pass a third argument, "before", to reverse this. If you need to run code both before and after the original version, you can do so like so:<br>
默认情况下，`wrap()` 会在原始代码执行**之后**运行你的自定义代码。你也可以传入第三个参数「before」，让你的代码在原始代码**之前**执行。如果你需要在原始代码执行前后都注入代码，可以这样做：

```python
from anki.hooks import wrap
from aqt.editor import Editor

def mySetupButtons(self, _old):
    <before code>
    ret = _old(self)
    <after code>
    return ret

Editor.setupButtons = wrap(Editor.setupButtons, mySetupButtons, "around")
```
