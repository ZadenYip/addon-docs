# Editor Setup（编辑器设置）

While you can write an add-on with a basic text editor such as Notepad,
setting up a proper Python editor/development environment (IDE) will make
your life considerably easier.

虽然你可以用「记事本」等基本文本编辑器来编写插件，但配置一个合适的 Python 编辑器或集成开发环境（IDE）会让你的开发工作事半功倍。

## PyCharm setup（PyCharm 设置）

The free community edition of PyCharm has good out of the box support for Python: <https://www.jetbrains.com/pycharm/>. You can also use other
editors like Visual Studio Code, but we find PyCharm gives the best results.
PyCharm 的免费社区版对 Python 提供了良好的开箱即用支持：<https://www.jetbrains.com/pycharm/>。你也可以使用 Visual Studio Code 等其他编辑器，但我们发现 PyCharm 的效果最佳。

Over the last year, Anki’s codebase has been updated to add type hints to almost all of the code. These type hints make development easier, by providing better code completion, and by catching errors using tools like mypy. As an add-on author, you can take advantage of this type hinting as well.
在过去一年里，Anki 的代码库已经更新，为几乎所有代码都添加了类型提示。这些类型提示通过提供更强大的代码补全功能，并利用 mypy 等工具来捕捉错误，从而简化了开发流程。作为插件开发者，你同样可以善用这一特性。

To get started with your first add-on:
要开始开发你的第一个插件，请按以下步骤操作：

- Open PyCharm and create a new project.
- 打开 PyCharm 并创建一个新项目。
<br>
- Right click/ctrl+click on your project on the left and create a new Python package called "myaddon"
- 在项目左侧面板上右键单击（在 Mac 上按住 Ctrl 并单击），然后创建一个名为「myaddon」的新 Python 包。

Now you’ll need to fetch Anki’s bundled source code so you can get type completion. As of Anki 2.1.24, these are available on PyPI. **You will need to be using a 64 bit version of Python, and your Python version must match a version the Anki version you are fetching supports.** To install Anki via PyCharm, click on Python Console in the bottom left and type the following in:
现在，你需要获取 Anki 捆绑的源代码，以便在编辑器中获得类型补全功能。从 Anki 2.1.24 版本开始，这些代码已经发布在 PyPI 上。**你必须使用 64 位版本的 Python，并且你的 Python 版本必须与你所获取的 Anki 版本所支持的版本相匹配。** 要通过 PyCharm 安装 Anki，请点击左下角的「Python 控制台」，然后输入以下命令：

```python
import subprocess

subprocess.check_call(["pip3", "install", "--upgrade", "pip"])
subprocess.check_call(["pip3", "install", "mypy", "aqt[qt6]"])
```

Hit enter and wait. Once it completes, you should now have code completion.
按下回车键并等待。命令执行完毕后，你的编辑器就应该具备代码补全功能了。

If you get an error, you are probably not using a 64 bit version of Python, or your Python version is not one the latest Anki version supports. Try running the
commands above with "-vvv" to get more info.
如果你遇到错误，原因可能是你没有使用 64 位版本的 Python，或者你的 Python 版本不被你所安装的 Anki 版本支持。你可以尝试在上述命令后加上「-vvv」参数来运行，以获取更详细的错误信息。

After installing, try out the code completion by double clicking on the `__init__.py` file. If you see a spinner down the bottom, wait for it to complete. Then type in:
安装完成后，双击 `__init__.py` 文件来体验代码补全功能。如果你在界面底部看到一个旋转加载的图标，请等待它完成。然后输入：

```python
from anki import hooks
hooks.
```

and you should see completions pop up.
这时，你应该能看到弹出的代码补全建议。

**Please note that you can not run your add-on from within PyCharm - you will get errors.** Add-ons need to be run from within Anki, which is covered in the [A Basic Add-on](a-basic-addon.md) section.
**请注意，你不能直接在 PyCharm 内部运行你的插件，否则将会报错。** 插件需要在 Anki 内部运行，具体方法在[《一个基本的插件》](a-basic-addon.md)一章中有详细说明。
