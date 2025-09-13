# Add-on Folders（插件文件夹）
You can access the top level add-ons folder by going to the Tools&gt;Add-ons menu item in the main Anki window. Click on the View Files button, and a folder will pop up. If you had no add-ons installed, the top level add-ons folder will be shown. If you had an add-on selected, the add-on’s module folder will be shown, and you will need to go up one level.<br>
你可以通过 Anki 主窗口的 **工具** > **插件** 菜单，来访问顶层插件文件夹。点击 **查看文件** 按钮，系统就会弹出一个文件夹。如果你没有安装任何插件，那么弹出的就是顶层插件文件夹；如果你选中了某个插件，那么弹出的将是该插件的模块文件夹，此时你需要返回上一级目录。

The add-ons folder is named "addons21", corresponding to Anki 2.1. If you have an "addons" folder, it is because you have previously used Anki<br>
2.0.x. 这个插件文件夹名为「addons21」，以对应 Anki 2.1 版本。如果你还有一个名为「addons」的文件夹，那说明你之前使用过 Anki 2.0.x 版本。

Each add-on uses one folder inside the add-on folder. Anki looks for a file called `__init__.py` file inside the folder, eg:<br>
每个插件在插件文件夹内都使用一个独立的文件夹。Anki 会在这些文件夹中寻找一个名为 `__init__.py` 的文件，例如：

    addons21/myaddon/__init__.py

If `__init__.py` does not exist, Anki will ignore the folder.<br>
如果 `__init__.py` 文件不存在，Anki 就会忽略这个文件夹。

When choosing a folder name, it is recommended to stick to a-z and 0-9 characters to avoid problems with Python’s module system.<br>
为插件文件夹命名时，建议只使用 a-z 和 0-9 这些字符，以避免与 Python 的模块系统发生冲突。

While you can use whatever folder name you wish for folders you create yourself, when you download an add-on from AnkiWeb, Anki will use the item’s ID as the folder name, such as:<br>
当然，你可以为你自己创建的文件夹随意命名。但是，当你从 AnkiWeb 下载插件时，Anki 会使用该插件的项目 ID 作为文件夹名称，例如：

    addons21/48927303923/__init__.py

Anki will also place a meta.json file in the folder, which keeps track of the original add-on name, when it was downloaded, and whether it’s enabled or not.<br>
Anki 同时还会在该文件夹中放置一个 `meta.json` 文件，用以记录插件的原始名称、下载时间以及是否启用等信息。

You should not store user data in the add-on folder, as it’s [deleted when the user upgrades an add-on](addon-config.md#config-json).<br>
请注意，你不应该在插件文件夹中存储用户数据，因为当用户[升级插件时，这些数据会被删除](addon-config.md#config-json)。

If you followed the steps in the [editor setup](editor-setup.md) section, you can either copy your myaddon folder into Anki’s add-on folder to test it, or on Mac or Linux, create a symlink from the folder’s original location into your add-ons folder.<br>
如果你已经按照[编辑器设置](editor-setup.md)章节的步骤操作，那么你可以将你的 `myaddon` 文件夹复制到 Anki 的插件文件夹中进行测试。或者，在 Mac 或 Linux 系统上，你也可以从 `myaddon` 文件夹的原始位置创建一个符号链接到你的插件文件夹中。
