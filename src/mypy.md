# MyPy

## Using MyPy（使用 MyPy）

The type hints you installed when [setting up PyCharm](./editor-setup.md) can also be used to check your code is correct, using a tool called MyPy. My Py will catch some cases where you’ve called Anki functions incorrectly, such as when
you've typed a function name in incorrectly, or passed a string when an integer was expected.

您在[设置 PyCharm](./editor-setup.md)时安装的类型提示，同样可以用于检查代码的正确性，这需要借助一个名为 MyPy 的工具。MyPy 能够发现某些对 Anki 函数的错误调用，例如函数名拼写错误，或是在需要整数的地方传入了字符串。

In PyCharm, click on Terminal in the bottom left, and type `mypy myaddon`. After some processing, it will show a success or tell you any mistakes you’ve made. For example, if you specified a hook incorrectly:
在 PyCharm 中，点击左下角的「终端」窗口，然后输入 `mypy myaddon`。经过短暂处理，它会显示成功信息，或报告代码中存在的错误。例如，如果您错误地指定了一个钩子（hook）：

```python
from aqt import gui_hooks

def myfunc() -> None:
  print("myfunc")

gui_hooks.reviewer_did_show_answer.append(myfunc)
```

Then mypy will report:
MyPy 将会报告如下错误：

    myaddon/__init__.py:5: error: Argument 1 to "append" of "list" has incompatible type "Callable[[], Any]"; expected "Callable[[Card], None]"
    Found 1 error in 1 file (checked 1 source file)

..which is telling you that the hook expects a function which takes a card as the first argument, eg
..这条信息告诉您，该钩子需要一个接受 `Card` 对象作为第一个参数的函数，例如：

```python
from anki.cards import Card

def myfunc(card: Card) -> None:
  print("myfunc")
```

## Checking Existing Add-Ons

## 检查现有的插件

Mypy has a "check_untyped_defs" option that will give you some type checking even if your own code lacks type hints, but to get the most out of it, you will need to add type hints to your own code. This can take some initial time, but pays off in the long term, as it becomes easier to navigate your own code, and allows you to catch errors in parts of the code you might not regularly exercise yourself. It is also makes it easier to check for any problems caused by updating to a newer Anki version.

Mypy 提供了一个 `check_untyped_defs` 选项，即便您的代码没有类型提示，也能进行基本的类型检查。但为了最大限度地发挥其作用，您仍需为自己的代码添加类型提示。这在初期可能会花费一些时间，但从长远来看是值得的。因为它不仅能让您更容易地浏览自己的代码，还能帮助您发现那些不经常执行的代码路径中的潜在错误。同时，它也让检查因 Anki 版本更新而引发的问题变得更加简单。

If you have a large existing add-on, you may wish to look into tools like monkeytype to automatically add types to your code.
如果您有一个庞大且历史悠久的插件，不妨考虑使用 `monkeytype` 这类工具来自动为代码添加类型。

<details>
<summary>Monkeytype</summary>

<details>
<summary>Monkeytype</summary>

To use monkeytype with an add-on called 'test', you could do something like the following:
要对一个名为「test」的插件使用 `monkeytype`，您可以参照以下步骤：

```shell
% /usr/local/bin/python3.8 -m venv pyenv
% cd pyenv && . bin/activate
(pyenv) % pip install aqt monkeytype
(pyenv) % monkeytype run bin/anki
```

Then click around in your add-on to gather the runtime type information, and close Anki when you're done.
接着，在您的插件界面中进行各种操作，以收集运行时的类型信息，然后在完成时关闭 Anki。

After doing so, you'll need to comment out any top-level actions (such as code modifying menus outside of a function), as that will trip up monkeytype. Finally, you can generate the modified files with:
之后，您需要注释掉所有顶层操作（例如在函数外部修改菜单的代码），因为这些操作会干扰 `monkeytype` 的正常工作。最后，您可以通过以下命令生成带有类型提示的文件：

```shell
(pyenv) % PYTHONPATH=~/Library/Application\ Support/Anki2/addons21 monkeytype apply test
```

</details>

</details>

Here are some example add-ons that use type hints:
这里有一些使用类型提示的插件示例：

<https://github.com/ankitects/anki-addons/blob/master/demos/>
