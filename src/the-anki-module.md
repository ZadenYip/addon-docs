# The 'anki' module（「anki」模块）

All access to your collection and associated media go through a Python package called `anki`, located in [pylib/anki](https://github.com/ankitects/anki/tree/main/pylib/anki) in Anki's source repo.
所有对你的牌组集合及相关媒体文件的访问，都是通过一个名为 `anki` 的 Python 包进行的。该包位于 Anki 源码仓库的 [pylib/anki](https://github.com/ankitects/anki/tree/main/pylib/anki) 目录中。

## The Collection（牌组集合）

All operations on a collection file are accessed via a `Collection` object. The currently-open Collection is accessible via a global `mw.col`, where `mw` stands for `main window`. When using the `anki` module outside of Anki, you will need to create your own Collection object.
所有对牌组集合文件的操作都是通过一个 `Collection` 对象来访问的。当前打开的牌组集合可以通过全局变量 `mw.col` 来访问，其中 `mw` 代表「main window」（主窗口）。当在 Anki 环境之外使用 `anki` 模块时，你需要自己创建一个 `Collection` 对象。

Some basic examples of what you can do follow. Please note that you should put these in something like [testFunction()](./a-basic-addon.md). You can’t run them directly in an add-on, as add-ons are initialized during Anki startup, before any collection or profile has been loaded.
下面是一些你可以实现的基本操作示例。请注意，你应该将这些代码放在像 [testFunction()](./a-basic-addon.md) 这样的函数中。你不能直接在插件的顶层代码中运行它们，因为插件是在 Anki 启动过程中初始化的，那时还没有加载任何牌组集合或用户配置文件。

Also please note that accessing the collection directly can lead to the UI temporarily freezing if the operation doesn't complete quickly - in practice you would typically run the code below in a background thread.
另外也请注意，如果操作不能快速完成，直接访问牌组集合可能会导致 UI 暂时冻结。在实际应用中，你通常应该在后台线程中运行下面的代码。

**Get a due card:**
**获取一张到期卡片：**

```python
card = mw.col.sched.getCard()
if not card:
    # current deck is finished
    # 当前牌组已完成
```

**Answer the card:**
**回答卡片：**

```python
mw.col.sched.answerCard(card, ease)
```

**Edit a note (append "new" to the end of each field):**
**编辑一条笔记（在每个字段末尾追加「new」）：**

```python
note = card.note()
for (name, value) in note.items():
    note[name] = value + " new"
mw.col.update_note(note)
```

**Get card IDs for notes with tag x:**
**获取带有标签 x 的笔记的所有卡片 ID：**

```python
ids = mw.col.find_cards("tag:x")
```

**Get question and answer for each of those ids:**
**根据这些 ID 获取每张卡片的问题和答案：**

```python
for id in ids:
    card = mw.col.get_card(id)
    question = card.question()
    answer = card.answer()
```

**Make reviews due tomorrow**
**将复习卡片的到期日设为明天：**

```python
ids = mw.col.find_cards("is:due")
mw.col.sched.set_due_date(ids, "1")
```

**Import a text file into the collection**
**将一个文本文件导入到牌组集合中：**

Requires Anki 2.1.55+.
需要 Anki 2.1.55+ 版本。

```python
from anki.collection import ImportCsvRequest
from aqt import mw
col = mw.col
path = "/home/dae/foo.csv"
metadata = col.get_csv_metadata(path=path, delimiter=None)
request = ImportCsvRequest(path=path, metadata=metadata)
response = col.import_csv(request)
print(response.log.found_notes, list(response.log.updated), list(response.log.new))
```

Almost every GUI operation has an associated function in anki, so any of
the operations that Anki makes available can also be called in an
add-on.
几乎每个 GUI 操作在 `anki` 模块中都有一个对应的函数，因此 Anki 提供的任何操作都可以在插件中调用。

## Reading/Writing （读/写对象）

Most objects in Anki can be read and written via methods in pylib.

Anki 中的大多数对象都可以通过 pylib 中的方法进行读取和写入。

```python
card = col.get_card(card_id)
card.ivl += 1
col.update_card(card)
```

```python
note = col.get_note(note_id)
note["Front"] += " hello"
col.update_note(note)
```

```python
deck = col.decks.get(deck_id)
deck["name"] += " hello"
col.decks.save(deck)

deck = col.decks.by_name("Default hello")
...
```

```python
config = col.decks.get_config(config_id)
config["new"]["perDay"] = 20
col.decks.save(config)
```

```python
notetype = col.models.get(notetype_id)
notetype["css"] += "\nbody { background: grey; }\n"
col.models.save(note)

notetype = col.models.by_name("Basic")
...
```

You should prefer these methods over directly accessing the database, as they take care of marking items as requiring a sync, and they prevent some forms of invalid data from being written to the database.
你应该优先使用这些方法，而不是直接访问数据库。因为这些方法会自动处理需要同步的项目标记，并能防止某些形式的无效数据被写入数据库。

For locating specific cards and notes, col.find_cards() and
col.find_notes() are useful.
要查找特定的卡片和笔记，`col.find_cards()` 和 `col.find_notes()` 函数非常有用。

## The Database（数据库）

:warning: You can easily cause problems by writing directly to the database.
Where possible, please use methods such as the ones mentioned above instead.
:warning: 直接写入数据库很容易引发问题。请尽可能使用上文提到的方法来代替直接操作数据库。

Anki’s DB object supports the following functions:
Anki 的 DB 对象支持以下函数：

**scalar() returns a single item:**
**scalar() 返回单个值：**

```python
showInfo("card count: %d" % mw.col.db.scalar("select count() from cards"))
```

**list() returns a list of the first column in each row, e.g.[1, 2, 3]**
**list() 返回每行第一列数据组成的 list，例如：[1, 2, 3]**

```python
ids = mw.col.db.list("select id from cards limit 3")
```

**all() returns a list of rows, where each row is a list:**
**all() 返回一个由多个行行组成的 list，其中每一行本身也是一个 list：**

```python
ids_and_ivl = mw.col.db.all("select id, ivl from cards")
```

**execute() can also be used to iterate over a result set without
building an intermediate list. eg:**
**execute() 也可以用来遍历 result set，而无需构建一个中间 list。例如：**

```python
for id, ivl in mw.col.db.execute("select id, ivl from cards limit 3"):
    showInfo("card id %d has ivl %d" % (id, ivl))
```

**execute() allows you to perform an insert or update operation. Use named arguments with ?. eg:**
**execute() 允许你执行插入或更新操作。请使用 `?` 作为占位符。例如：**
```python
mw.col.db.execute("update cards set ivl = ? where id = ?", newIvl, cardId)
```

Note that these changes won't sync, as they would if you used the functions mentioned in the previous section.
请注意，这些更改不会被同步，而使用上一节提到的函数所做的更改则会被同步。

**executemany() allows you to perform bulk update or insert operations. For large updates, this is much faster than calling execute() for each data point. eg:**
**executemany() 允许你执行批量更新或插入操作。对于大量更新，这比为每个数据点调用 `execute()` 要快得多。例如：**

```python
data = [[newIvl1, cardId1], [newIvl2, cardId2]]
mw.col.db.executemany(same_sql_as_above, data)
```

As above, these changes won't sync.
与上面一样，这些更改也不会被同步。

Add-ons should never modify the schema of existing tables, as that may break future versions of Anki.
插件永远不应该修改现有表的结构（schema），因为这可能会破坏未来版本的 Anki。

If you need to store addon-specific data, consider using Anki’s
[Configuration](addon-config.md#config-json) support.
如果你需要存储插件特有的数据，可以考虑使用 Anki 的[配置](addon-config.md#config-json)功能。

If you need the data to sync across devices, small options can be stored within mw.col.conf. Please don’t store large amounts of data there, as it’s currently sent on every sync.
如果你需要数据在不同设备间同步，可以将小的配置项存储在 `mw.col.conf` 中。请不要在那里存储大量数据，因为它目前会在每次同步时都被发送。
