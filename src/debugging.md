# Debugging（调试）

## Exceptions and Stdout/Stderr（异常、标准输出与标准错误）

If your code throws an uncaught exception, it will be caught by Anki’s standard exception handler, and an error will be presented to the user.
如果你的代码抛出一个未被捕获的异常，Anki 的标准异常 handler 将会捕获它，并向用户显示一个错误提示。

The handler catches anything that is printed to stderr, so you should avoid logging text to stderr unless you want the user to see it in a popup.
该 handler 会捕获所有打印到 stderr 的内容。因此，除非你希望用户在弹窗中看到某些信息，否则应避免将文本日志记录到 stderr。

Text printed to standard output is covered in [this section](./console-output.md).
关于打印到标准输出流的文本，请参阅[此章节](./console-output.md)。

## Webviews（网页视图）

If you set the env var QTWEBENGINE_REMOTE_DEBUGGING to 8080 prior to starting Anki, you can surf to http://localhost:8080 in Chrome to debug the visible webpages.
在启动 Anki 之前，如果你将环境变量 `QTWEBENGINE_REMOTE_DEBUGGING` 设置为 `8080`，就可以在 Chrome 浏览器中通过访问 `http://localhost:8080` 来调试当前显示的网页。

Alternatively, you can use [this add-on](https://ankiweb.net/shared/info/31746032) to open the inspector inside Anki.
此外，你也可以使用[这款插件](https://ankiweb.net/shared/info/31746032)直接在 Anki 程序内部打开开发者工具。

## Debug Console（调试控制台）

Anki also includes a REPL. From within the program, press the [shortcut key](https://docs.ankiweb.net/misc.html#debug-console) and a window will open up. You can enter expressions or statements into the top area, and then press ctrl+return/command+return to evaluate them. An example session follows:
Anki 还内置了一个 REPL。在 Anki 程序中，按下指定的[快捷键](https://docs.ankiweb.net/misc.html#debug-console)即可打开一个窗口。你可以在上方的文本区域输入表达式或语句，然后按 `Ctrl+Return`（macOS 上为 `Command+Return`）来执行。下面是一个示例会话：

    >>> mw
    <no output>

    >>> print(mw)
    <aqt.main.AnkiQt object at 0x10c0ddc20>

    >>> invalidName
    Traceback (most recent call last):
      File "/Users/dae/Lib/anki/qt/aqt/main.py", line 933, in onDebugRet
        exec text
      File "<string>", line 1, in <module>
    NameError: name 'invalidName' is not defined

    >>> a = [a for a in dir(mw.form) if a.startswith("action")]
    ... print(a)
    ... print()
    ... pp(a)
    ['actionAbout', 'actionCheckMediaDatabase', ...]

    ['actionAbout',
     'actionCheckMediaDatabase',
     'actionDocumentation',
     'actionDonate',
     ...]

    >>> pp(mw.reviewer.card)
    <anki.cards.Card object at 0x112181150>

    >>> pp(card()) # shortcut for mw.reviewer.card.__dict__
    {'_note': <anki.notes.Note object at 0x11221da90>,
     '_qa': [...]
     'col': <anki.collection._Collection object at 0x1122415d0>,
     'data': u'',
     'did': 1,
     'due': -1,
     'factor': 2350,
     'flags': 0,
     'id': 1307820012852L,
     [...]
    }

    >>> pp(bcard()) # shortcut for selected card in browser
    <as above>

Note that you need to explicitly print an expression in order to see what it evaluates to. Anki exports pp() (pretty print) in the scope to make it easier to quickly dump the details of objects, and the shortcut
ctrl+shift+return will wrap the current text in the upper area with pp() and execute the result.
请注意，你必须显式地使用 `print` 函数才能看到表达式的求值结果。Anki 在环境中预置了 `pp()` 函数（即 pretty print，优美打印），方便你快速输出对象的详细信息。快捷键 `Ctrl+Shift+Return` 会自动用 `pp()` 包裹当前文本区域的内容并执行该代码。

## PDB

If you’re on Linux or are running Anki from source, it’s also possible to debug your script with pdb. Place the following line somewhere in your code, and when Anki reaches that point it will kick into the debugger in the terminal:
如果你在 Linux 系统，或者从源代码运行 Anki，还可以使用 `pdb` 来调试你的脚本。只需将下面这行代码插入到你的代码中，当 Anki 执行到该处时，便会在终端里激活调试器：

```python
    from aqt.qt import debug; debug()
```

Alternatively you can export DEBUG=1 in your shell and it will kick into the debugger on an uncaught exception.
另外一个方法是，在你的 shell 环境中 export DEBUG=1 变量，这样当程序遇到未捕获的异常时，就会自动进入调试器。

## Python Assertions（Python 断言）

Runtime checks using Python's `assert` statement are not evaluated in Anki's release builds, even when running in debug mode. If you want to use `assert` for testing you can use the [packaged versions from PyPI](https://betas.ankiweb.net/#via-pypipip) or [run Anki from source](https://github.com/ankitects/anki/blob/main/docs/development.md).
在 Anki 的正式发布版中，即便是在调试模式下运行，使用 Python `assert` 语句进行的运行时检查也不会被执行。如果你希望使用 `assert` 来进行测试，可以安装[通过 PyPI 提供的打包版本](https://betas.ankiweb.net/#via-pypipip)，或者[从源代码运行 Anki](https://github.com/ankitects/anki/blob/main/docs/development.md)。
