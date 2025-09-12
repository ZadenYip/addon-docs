# Console Output（控制台输出）

Because Anki is a GUI app, text output to stdout (e.g.`print("foo")`) is not usually visible to the user. You can optionally reveal text printed to stdout, and it is recommended that you do so while developing your add-on.
因为 Anki 是一个 GUI 应用程序，所以输出到 stdout 的文本（例如 `print("foo")`）通常对用户是不可见的。您可以选择性地显示打印到标准输出的文本，我们建议您在开发插件时这样做。

## Warnings（警告）

Anki uses stdout to print warnings about API deprecations, eg:
Anki 使用标准输出来打印关于 API 已弃用的警告，例如：

```
addons21/mytest/__init__.py:10:getNote is deprecated: please use 'get_note'
```

If these warnings are occurring in a loop, please address them promptly, as they can
slow Anki down even if the console is not shown.
如果这些警告出现在循环中，请及时处理，因为即使控制台没有显示，它们也会拖慢 Anki 的运行速度。

## Printing text（打印文本）

You may find it useful to print text to stdout to aid in debugging your add-on. Please avoid printing large amounts of text (e.g.in a loop that deals with hundreds or thousands of items), as that may slow Anki down, even if the console is not shown.
您可能会发现在调试插件时，将文本打印到标准输出会很有帮助。请避免打印大量文本（例如，在处理成百上千个项目的循环中），因为即使不显示控制台，这也可能会拖慢 Anki 的运行速度。

## Showing the Console（显示控制台）

### Windows

If you start Anki via the `anki-console.bat` file in `C:\Users\user\AppData\Local\Programs\Anki` (or `C:\Program Files\Anki`), a separate console window will appear.
如果您通过 `C:\Users\user\AppData\Local\Programs\Anki`（或 `C:\Program Files\Anki`）中的 `anki-console.bat` 文件启动 Anki，将会出现一个独立的控制台窗口。

### macOS

Open Terminal.app, then enter the following text and hit enter:
打开「终端.app」（Terminal.app），然后输入以下文本并按回车键：

```
/Applications/Anki.app/Contents/MacOS/anki
```

### Linux

Open a terminal/xterm, then run Anki with `anki`
打开一个终端/xterm，然后使用 `anki` 运行 Anki。
