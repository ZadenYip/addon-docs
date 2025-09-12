# Command-Line Use（命令行使用）

The `anki` module can be used separately from Anki's GUI. It is strongly recommended you use it instead of attempting to read or write a .anki2 file directly.

`anki` 模块可以独立于 Anki 的图形用户界面（GUI）运行。我们强烈建议你通过此模块进行操作，而不是直接尝试读取或写入 `.anki2` 文件。

Install it with pip:
请使用 pip 来安装该模块：

```shell
$ pip install anki
```

Then you can use it in a .py file, like so:
安装后，你就可以在 `.py` 文件中如下所示地使用它：

```python
from anki.collection import Collection
col = Collection("/path/to/collection.anki2")
print(col.sched.deck_due_tree())
```

See [the Anki module](./the-anki-module.md) for more.
更多详细信息，请参阅 [Anki 模块](./the-anki-module.md) 章节。
