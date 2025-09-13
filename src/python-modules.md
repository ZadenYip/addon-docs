# Python Modules（Python 模块）

From Anki 2.1.50, the packaged builds include most built-in Python modules. Earlier versions ship with only the standard modules necessary to run Anki.<br>
自 Anki 2.1.50 版本起，其打包发行版已包含大部分 Python 内置模块。而早期版本仅提供运行 Anki 所必需的标准模块。

If your add-on uses a standard Python module that has not been included, or a package from PyPI, then your add-on will need to bundle the module.<br>
如果你的插件需要使用某个未被包含的标准 Python 模块，或是来自 PyPI 的第三方包，那么你就需要在插件中捆绑该模块。

For pure Python modules, this is usually as simple as putting them in a subfolder, and adjusting sys.path. For modules that require C extensions such as numpy, things get a fair bit more complicated, as you'll need to bundle the different module versions for each platform, and ensure you're bundling a version that is compatible with the version of Python Anki is packaged with.<br>
对于纯 Python 模块而言，操作通常很简单：只需将它们放入一个子文件夹，然后调整 `sys.path` 即可。但对于需要 C 语言扩展的模块（如 **numpy**），情况就要复杂得多。因为你需要为每个平台捆绑不同版本的模块，并确保其版本与 Anki 打包所用的 Python 版本相互兼容。
