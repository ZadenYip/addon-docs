# Reviewer Javascript（复习器中的 Javascript）

For a general solution not specific to card review, see [the webview section](hooks-and-filters.md#webview).
若需了解非针对卡片复习的通用解决方案，请参阅[网页视图（webview）章节](hooks-and-filters.md#webview)。

Anki provides a hook to modify the question and answer HTML before it is displayed in the review screen, preview dialog, and card layout screen. This can be useful for adding Javascript to the card. If you wish to load external resources in your card, please see [managing external resources in webviews](hooks-and-filters.md#managing-external-resources-in-webviews).
Anki 提供了一个 Hook，允许在问题和答案的 HTML 内容显示于复习屏幕、预览对话框和卡片布局屏幕之前，对其进行修改。这个功能对于向卡片中添加 Javascript 非常有用。如果您希望在卡片中加载外部资源，请参阅[在网页视图中管理外部资源](hooks-and-filters.md#managing-external-resources-in-webviews)。

An example:
示例如下：

```python
from aqt import gui_hooks
def prepare(html, card, context):
    return html + """
<script>
document.body.style.background = "blue";
</script>"""
gui_hooks.card_will_show.append(prepare)
```

The hook takes three arguments: the HTML of the question or answer, the current card object (so you can limit your add-on to specific note types for example), and a string representing the context the hook is running
in.
该 Hook 接受三个参数： 问题或答案的 HTML。当前的kap 对象，（您可以据此将插件功能限定在特定的笔记类型上）和一个表示当前 Hook 运行环境的上下文字符串。

Make sure you return the modified HTML.
请确保您的函数返回修改后的 HTML。

Context is one of: "reviewQuestion", "reviewAnswer", "clayoutQuestion","clayoutAnswer", "previewQuestion" or "previewAnswer".
上下文的取值包括：「reviewQuestion」、「reviewAnswer」、「clayoutQuestion」、「clayoutAnswer」、「previewQuestion」或「previewAnswer」。

The answer preview in the card layout screen, and the previewer set to "show both sides" will only use the "Answer" context. This means
Javascript you append on the back side of the card should not depend on Javascript that is only added on the front.
在卡片布局屏幕的答案预览模式，以及设置为「显示双面」的预览器中，将只会触发与「答案」相关的上下文。这意味着，您附加在卡片背面的 Javascript 代码，不应该依赖于那些仅添加在正面的 Javascript 代码。

Because Anki fades the previous text out before revealing the new text, Javascript hooks are required to perform actions like scrolling at the correct time. You can use them like so:
由于 Anki 在显示新内容前会先将旧内容淡出，因此需要使用 Javascript Hook来确保在恰当的时机执行滚动等操作。你可以这样使用：

```python
from aqt import gui_hooks
def prepare(html, card, context):
    return html + """
<script>
onUpdateHook.push(function () {
    window.scrollTo(0, 2000);
})
</script>"""
gui_hooks.card_will_show.append(prepare)
```

- onUpdateHook fires after the new card has been placed in the DOM, but before it is shown.
- onShownHook fires after the card has faded in.
- onUpdateHook：在新卡片内容加载到 DOM 后、**显示前**触发。
- onShownHook：在卡片内容完全淡入**显示后**触发。

The hooks are reset each time the question or answer is shown.
每次显示问题或答案时，这些 Hook 都会被重置。
