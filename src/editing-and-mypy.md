# Editing and MyPy（编辑与 MyPy）

## Editor/IDE setup（编辑器/IDE 设置）

The free community edition of PyCharm has good out of the box support for Python: <https://www.jetbrains.com/pycharm/>. You can also use other editors like Visual Studio Code, but the instructions in this section will cover PyCharm.<br>
PyCharm 的免费社区版为 Python 提供了开箱即用的良好支持：<https://www.jetbrains.com/pycharm/>。你也可以使用其他编辑器，例如 Visual Studio Code，但本节的说明将以 PyCharm 为例进行介绍。

Over the last year, Anki’s codebase has been updated to add type hints to almost all of the code. These type hints make development easier, by providing better code completion, and by catching errors using tools like mypy. As an add-on author, you can take advantage of this type hinting as well.<br>
在过去一年中，Anki 的代码库已完成更新，为几乎所有代码都添加了类型提示。这些类型提示通过提供更佳的代码补全功能和利用 mypy 等工具来捕捉错误，从而简化了开发流程。作为插件开发者，你同样可以利用类型提示带来的便利。

To get started with your first add-on:<br>
要开始开发你的第一个插件，请按以下步骤操作：

- Open PyCharm and create a new project.
- 打开 PyCharm 并创建一个新项目。

- Right click/ctrl+click on your project on the left and create a new Python package called "myaddon"
- 在左侧的项目视图中，右键点击（或按住 Ctrl 并单击）你的项目，然后创建一个名为「myaddon」的新 Python 包。

Now you’ll need to fetch Anki’s bundled source code so you can get type completion. As of Anki 2.1.24, these are available on PyPI. **You will need to be using a 64 bit version of Python, version 3.8 or 3.9, or the commands below will fail**. To install Anki via PyCharm, click on Python Console in the bottom left and type the following in:<br>
现在你需要获取 Anki 的打包好的源代码，以便编辑器能够提供类型补全。从 Anki 2.1.24 版本开始，这些代码已发布在 PyPI 上。**你必须使用 64 位版本的 Python 3.8 或 3.9，否则以下命令将执行失败**。要通过 PyCharm 安装 Anki，请点击左下角的 Python Console，并输入以下命令：
```python
import subprocess

subprocess.check_call(["pip3", "install", "--upgrade", "pip"])
subprocess.check_call(["pip3", "install", "mypy", "aqt"])
```

Hit enter and wait. Once it completes, you should now have code completion.<br>
按下回车键并耐心等待。命令执行完毕后，你的编辑器就应该能提供代码补全了。

If you get an error, you are probably not using a 64 bit version of Python, or your Python version is not 3.8 or 3.9. Try running the commands above with "-vvv" to get more info.<br>
如果你遇到错误，很可能是因为你没有使用 64 位版本的 Python，或者你的 Python 版本不是 3.8 或 3.9。可以尝试在上述命令后添加「-vvv」参数来运行，以获取更详细的错误信息。

After installing, try out the code completion by double clicking on the `__init__.py` file. If you see a spinner down the bottom, wait for it to complete. Then type in:<br>
安装完成后，双击 `__init__.py` 文件来测试代码补全功能。如果你在窗口底部看到在加载，请等待它加载完成。然后输入：

```python
from anki import hooks
hooks.
```

and you should see completions pop up.<br>
此时，你应该能看到弹出的代码补全建议。

**Please note that you can not run your add-on from within PyCharm - you will get errors.** Add-ons need to be run from within Anki, which is covered in the next section.<br>
**请注意，你无法直接在 PyCharm 中运行你的插件——这样做会导致错误。** 插件必须在 Anki 内部运行，具体方法将在下一节中介绍。

You can use mypy to type-check your code, which will catch some cases where you’ve called Anki functions incorrectly. Click on Terminal in the bottom left, and type 'mypy myaddon'. After some processing, it will show a success or tell you any mistakes you’ve made. For example, if you specified a hook incorrectly:<br>
你可以使用 mypy 对你的代码进行类型检查，这能帮你发现一些错误调用 Anki 函数的情况。点击左下角的终端，输入「mypy myaddon」。经过短暂处理后，它会显示检查成功，或者报告代码中存在的错误。例如，如果你错误地指定了一个 Hook：

```python
from aqt import gui_hooks

def myfunc() -> None:
  print("myfunc")

gui_hooks.reviewer_did_show_answer.append(myfunc)
```

Then mypy will report:<br>
然后 mypy 将会报告：

    myaddon/__init__.py:5: error: Argument 1 to "append" of "list" has incompatible type "Callable[[], Any]"; expected "Callable[[Card], None]"
    Found 1 error in 1 file (checked 1 source file)

Which is telling you that the hook expects a function which takes a card as the first argument, eg<br>
这条错误信息告诉你，该 Hook 期望的函数需要接收一个卡片（Card）对象作为第一个参数，例如：

```python
from anki.cards import Card

def myfunc(card: Card) -> None:
  print("myfunc")
```

Mypy has a "check_untyped_defs" option that will give you some type checking even if your own code lacks type hints, but to get the most out of it, you will need to add type hints to your own code. This can take some initial time, but pays off in the long term, as it becomes easier to navigate your own code, and allows you to catch errors in parts of the code you might not regularly exercise yourself. It is also makes it easier to check for any problems caused by updating to a newer Anki version.<br>
Mypy 提供了一个「check_untyped_defs」选项，即使你自己的代码没有添加类型提示，它也能提供一定程度的类型检查。但要最大限度地发挥其作用，你还是需要为自己的代码添加类型提示。虽然这在开始时会花费一些时间，但从长远来看是值得的。它不仅能让你更容易地浏览自己的代码，还能帮助你捕捉到那些不经常执行的代码路径中的潜在错误。此外，当 Anki 版本更新后，它也能让你更轻松地检查代码是否存在兼容性问题。

If you have a large existing add-on, you may wish to look into tools like monkeytype to automatically add types to your code.<br>
如果你的插件已经有相当大的规模，可以考虑使用像 monkeytype 这样的工具来自动为代码添加类型。

<details>
<summary>Monkeytype</summary>
To use monkeytype with an add-on called 'test', you could do something like the following:
要在一个名为「test」的插件上使用 monkeytype，你可以执行以下类似操作：

```shell
% /usr/local/bin/python3.8 -m venv pyenv
% cd pyenv && . bin/activate
(pyenv) % pip install aqt monkeytype
(pyenv) % monkeytype run bin/anki
```

Then click around in your add-on to gather the runtime type information, and close Anki when you're done.<br>
然后，在你的插件界面中进行各种操作，以收集运行时的类型信息。完成后，关闭 Anki。

After doing so, you'll need to comment out any top-level actions (such as code modifying menus outside of a function), as that will trip up monkeytype. Finally, you can generate the modified files with:<br>
接下来，你需要注释掉所有顶层作用域的操作（例如在函数外部修改菜单的代码），因为这些代码会干扰 monkeytype 的正常工作。最后，你可以使用以下命令生成带有类型提示的文件：

```shell
(pyenv) % PYTHONPATH=~/Library/Application\ Support/Anki2/addons21 monkeytype apply test
```

</details>

Here are some example add-ons that use type hints:<br>
这里有一些使用类型提示的示例插件：

<https://github.com/ankitects/anki-addons/blob/master/demos/>
