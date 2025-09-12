# Sharing Add-ons（分享插件）

<!-- toc -->

## Sharing via AnkiWeb（通过 AnkiWeb 分享）

You can package up an add-on for distribution by zipping it up, and giving it a name ending in .ankiaddon.
你可以将插件打包成一个以「.ankiaddon」为后缀的 zip 压缩文件，以便分发。

The top level folder should not be included in the zip file. For example, if you have a module like the following:
打包时，请确保压缩文件的根目录直接包含插件文件，而不是将它们放在一个顶层文件夹内。例如，如果你的插件模块结构如下：

    addons21/myaddon/__init__.py
    addons21/myaddon/my.data

Then the zip file contents should be:
那么，zip 压缩文件的内容应直接是：

    __init__.py
    my.data

If you include the folder name in the zip like the following, AnkiWeb will not accept the zip file:
如果你在压缩文件中包含了 **myaddon** 这个顶层文件夹，如下所示，AnkiWeb 将会拒绝接收该文件：

    myaddon/__init__.py
    myaddon/my.data

On Unix-based machines, you can create a properly-formed file with the following command:
在类 Unix 系统（如 macOS 或 Linux）上，你可以使用以下命令来创建一个符合规范的压缩文件：

    $ cd myaddon && zip -r ../myaddon.ankiaddon *

Python automatically creates `pycache` folders when your add-on is run. Please make sure you delete these prior to creating the zip file, as AnkiWeb can not accept zip files that contain `pycache` folders.
另外，当你的插件运行时，Python 会自动生成 `pycache` 文件夹。在创建 zip 文件之前，请务必删除这些缓存文件夹，因为 AnkiWeb 不接受含有 `pycache` 文件夹的压缩包。

Once you’ve created a .ankiaddon file, you can use the Upload button on <https://ankiweb.net/shared/addons/> to share the add-on with others.
创建好「.ankiaddon」文件后，你就可以访问 <https://ankiweb.net/shared/addons/>，点击「上传」按钮，将你的插件分享给其他人。

## Sharing outside AnkiWeb（在 AnkiWeb 平台之外分享）

If you wish to distribute .ankiaddon files outside of AnkiWeb, your add-on folder needs to contain a 'manifest.json' file. The file should contain at least two keys: 'package' specifies the folder name the add-on will be stored in, and 'name' specifies the name that will be shown to the user. You can optionally include a 'conflicts' key which is a list of other packages that conflict with the add-on, and a 'mod' key which specifies when the add-on was updated.
如果你希望在 AnkiWeb 平台之外分发「.ankiaddon」文件，你的插件文件夹中必须包含一个名为「manifest.json」的配置文件。该文件至少需要包含两个键：「package」用于指定插件安装后在 `addons21` 目录中的文件夹名称，「name」则指定了在插件列表中向用户显示的名称。

此外，你还可以选择性地添加以下键：
*   「conflicts」：一个 list，包含与此插件不兼容（或冲突）的其他插件包的名称。
*   「mod」：一个时间戳，用于记录插件的最后更新时间。

When Anki downloads add-ons from AnkiWeb, only the conflicts key is used
from the manifest.
需要注意的是，当 Anki 从 AnkiWeb 下载插件时，它只会读取并使用「manifest.json」文件中的「conflicts」键。
