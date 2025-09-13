# Background Operations（后台操作）

If your add-on performs a long-running operation directly, the user interface will freeze until the operation completes - no progress window will be shown, and the app will look as if it's stuck. This is annoying for users, so care should be taken to avoid it happening.<br>
如果你的插件直接执行耗时较长的操作，那么在操作完成之前，用户界面会一直处于冻结状态——不仅不会显示进度窗口，而且整个应用程序看起来会像是卡死了。这会给用户带来糟糕的体验，因此应谨慎避免这种情况的发生。

The reason it happens is because the user interface runs on the "main thread". When your add-on performs a long-running operation directly, it also runs on the main thread, and it prevents the UI code from running again until your operation completes. The solution is to run your add-on code in a background thread, so that the UI can continue to function.<br>
出现这种情况，是因为用户界面运行在「主线程」上。当你的插件直接执行耗时操作时，该操作同样在主线程上运行，这会阻塞 UI 代码的执行，直到你的操作完成为止。解决方案就是将插件代码放在「后台线程」中运行，这样 UI 才能继续正常工作。

A complicating factor is that any code you write that interacts with the UI also needs to be run on the main thread. If your add-on only ran in the background, and it attempted to access the UI, it would cause Anki to crash. So selectivity is required - UI operations should be run on the main thread, and long-running operations like collection and network access should be run in the background. Anki provides some tools to make this easier.<br>
但一个更复杂的因素是，任何与 UI 交互的代码**也必须**在主线程上运行。如果你的插件只在后台运行，一旦它试图访问 UI，就会导致 Anki 崩溃。因此，你需要区别处理：UI 相关的操作应在主线程上运行，而像操作集合、访问网络这类耗时操作则应在后台运行。为了简化这一过程，Anki 提供了一些实用工具。

## Read-Only/Non-Undoable Operations（只读/不可撤销的操作）

For long-running operations like gathering a group of notes, or things like network access, `QueryOp` is recommended. For the latter, make sure to read about serialization further below.<br>
对于收集一组笔记或进行网络访问这类耗时操作，推荐使用 `QueryOp`。对于网络访问这类操作，请务必阅读下文有关序列化的部分。

In the following example, my_ui_action() will return quickly, and the operation will continue to run in the background until it completes. If it finishes successfully, on_success will be called.<br>
在下面的示例中，`my_ui_action()` 函数会立即返回，而实际操作会继续在后台运行，直到完成。如果操作成功结束，`on_success` 函数将会被调用。

```python
from anki.collection import Collection
from aqt.operations import QueryOp
from aqt.utils import showInfo
from aqt import mw

def my_background_op(col: Collection, note_ids: list[int]) -> int:
    # some long-running op, eg
    # 某个耗时操作，例如：
    for id in note_ids:
        note = col.get_note(note_id)
        # ...

    return 123

def on_success(count: int) -> None:
    showInfo(f"my_background_op() returned {count}")
    # showInfo(f"my_background_op() 返回了 {count}")

def my_ui_action(note_ids: list[int]):
    op = QueryOp(
        # the active window (main window in this case)
        # 父窗口（此处为主窗口）
        parent=mw,
        # the operation is passed the collection for convenience; you can
        # ignore it if you wish
        # 为方便起见，操作会接收 collection 对象作为参数；
        # 如果用不到，可以忽略
        op=lambda col: my_background_op(col, note_ids),
        # this function will be called if op completes successfully,
        # and it is given the return value of the op
        # 如果操作成功完成，此函数将被调用，
        # 并接收操作的返回值
        success=on_success,
    )

    # if with_progress() is not called, no progress window will be shown.
    # note: QueryOp.with_progress() was broken until Anki 2.1.50
    # 如果不调用 with_progress()，则不会显示进度窗口。
    # 注意：在 Anki 2.1.50 版本之前，QueryOp.with_progress() 存在缺陷
    op.with_progress().run_in_background()
```

**Be careful not to directly call any Qt/UI routines inside the background operation!**<br>
**切记，不要在后台操作内部直接调用任何 Qt/UI 相关的功能！**

- If you need to modify the UI after an operation completes (e.g.show a tooltip),
  you should do it from the success function.
- If the operation needs data from the UI (e.g.a combo box value), that data should be gathered
  prior to executing the operation.
- If you need to update the UI during the background operation (e.g.to update the text of the progress window), your operation needs to perform that update on the main thread. For example, in a loop:
- 如果你需要在操作完成后修改 UI（例如，显示一个工具提示），应在 `success` 函数中执行。
- 如果操作需要来自 UI 的数据（例如，一个下拉框的选项值），应在执行后台操作**之前**获取这些数据。
- 如果你需要在后台操作的**过程中**更新 UI（例如，更新进度窗口的文本），你的操作需要将该更新任务交由主线程来执行。例如，在循环中可以这样做：

```python
if time.time() - last_progress >= 0.1:
    aqt.mw.taskman.run_on_main(
        lambda: aqt.mw.progress.update(
            label=f"Remaining: {remaining}",
            value=total - remaining,
            max=total,
        )
    )
    last_progress = time.time()
```

**Operations are serialized by default**<br>
**操作默认是串行（译注：逐个执行）执行的**

By default, only a single operation can run at once, to ensure multiple read operations on the
collection don't interleave with another write operation.
默认情况下，同一时间只能运行一个后台操作。这是为了确保对集合（collection）的多个读取操作不会与另一个写入操作发生冲突。

If your operation does not touch the collection (e.g., it is a network request), then you can
opt out of this serialization so that the operation runs concurrently to other ops:
如果你的操作不涉及集合（例如，只是一个网络请求），那么你可以选择不参与串行化，让该操作与其他操作并发执行：

```python
op.without_collection().run_in_background()
```

## Collection Operations（集合操作）

A separate `CollectionOp` is provided for undoable operations that modify the collection. It functions similarly to QueryOp, but will also update the UI as changes are made (e.g.refresh the Browse screen if any notes are changed).<br>
对于那些需要修改集合并支持撤销的操作，Anki 提供了另一个专门的 `CollectionOp`。它的功能与 `QueryOp` 类似，但它还会在数据发生变化时自动更新 UI（例如，当笔记被修改后，它会自动刷新浏览器界面）。

Many undoable ops already have a `CollectionOp` defined in [aqt/operations/\*.py](https://github.com/ankitects/anki/tree/main/qt/aqt/operations). You can often use one of them directly rather than having to create your own. For example:<br>
许多常见的可撤销操作已经在 [`aqt/operations/*.py`](https://github.com/ankitects/anki/tree/main/qt/aqt/operations) 目录中被封装成了 `CollectionOp`。你通常可以直接使用这些现成的操作，而无需自己创建。例如：

```python
from aqt.operations.note import remove_notes

def my_ui_action(note_ids: list[int]) -> None:
    remove_notes(parent=mw, note_ids=note_ids).run_in_background()
```

By default that routine will show a tooltip on success. You can call .success() or .failure() on it to provide an alternative routine.<br>
默认情况下，该操作成功后会显示一个工具提示。你也可以通过链式调用 `.success()` 或 `.failure()` 方法来提供自定义的回调函数。

For more information on undo handling, including combining multiple operations into a single undo step, please see [this forum page](https://forums.ankiweb.net/t/add-on-porting-notes-for-anki-2-1-45/11212#undoredo-4).<br>
如果想了解更多关于撤销处理的信息，包括如何将多个操作合并为一个撤销步骤，请参阅[此论坛页面](https://forums.ankiweb.net/t/add-on-porting-notes-for-anki-2-1-45/11212#undoredo-4)。
