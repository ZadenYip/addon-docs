# Add-on Config（插件配置）

## Config JSON（JSON 配置）

Add-ons can store config data in a JSON dictionary. You provide the default values by shipping a file called `config.json`. A simple example:
插件可将配置数据存储于一个 JSON 字典中。你可以通过随插件一同发布一个名为 `config.json` 的文件来提供默认值。示例如下：

    {"myvar": 5}

In config.md:
在 config.md 中：

    This is documentation for this add-on's configuration, in *markdown* format.
    这是此插件的配置文档，采用「markdown」格式。

In your add-on’s code:
在你的插件代码中：

```python
from aqt import mw
config = mw.addonManager.getConfig(__name__)
print("var is", config['myvar'])
```

If the config hasn't been customized, the default values from that file will be used.
如果用户尚未自定义配置，程序将采用该文件中的默认值。

If you need to programmatically modify the config, you can save your changes with:
如果你需要通过编程方式修改配置，可以使用以下代码保存更改：

```python
mw.addonManager.writeConfig(__name__, config)
```

Users are also able to edit the config inside the GUI.
用户也可以在图形用户界面（GUI）中直接编辑配置。
The edited config is stored in `meta.json`.
编辑后的配置被存储在 `meta.json` 文件中。

When `getConfig()` is used after edits, meta.json is used preferentially. If a key is missing from meta.json's config, Anki will fall back on the default config.
当 `getConfig()` 在配置被编辑后调用时，程序将优先使用 `meta.json` 中的数据。如果 `meta.json` 的配置中缺少某个键，Anki 将回退至默认配置。

If you change the value of existing keys in config.json, users who have customized their configuration will continue to see the old values unless they use the "restore defaults" button.
如果你更改了 `config.json` 文件中现有键的值，已自定义配置的用户将继续看到旧的值，除非他们使用「恢复默认值」按钮。

If no config.json file exists, getConfig() will return None - even if you have called writeConfig().
如果 `config.json` 文件不存在，`getConfig()` 将返回 `None`——即使你已经调用过 `writeConfig()`。

Add-ons that manage options in their own GUI can have that GUI displayed when the config button is clicked:
对于在自有图形界面中管理选项的插件，可以设置在用户点击配置按钮时显示该界面：

```python
mw.addonManager.setConfigAction(__name__, myOptionsFunc)
```

Avoid key names starting with an underscore - they are reserved for future use by Anki.
请避免使用以下划线开头的键名——它们已被 Anki 预留给未来功能使用。

## User Files（用户文件）

When your add-on needs configuration data other than simple keys and values, it can use a special folder called user_files in the root of your add-on’s folder. Any files placed in this folder will be preserved when the add-on is upgraded. All other files in the add-on folder are removed on upgrade.
当你的插件需要的配置数据超出了简单的键值对外，它可以使用一个位于插件根目录下的特殊文件夹 `user_files`。放置在此文件夹中的任何文件都会在插件升级时被保留。插件文件夹中的所有其他文件都将在升级时被移除。

To ensure the user_files folder is created for the user, you can put a README.txt or similar file inside it before zipping up your add-on.
为了确保系统能为用户创建 `user_files` 文件夹，你可以在打包插件（`.zip`）前，在该文件夹内放置一个 `README.txt` 或类似的文件。

When Anki upgrades an add-on, it will ignore any files in the .zip that already exist in the user_files folder.
当 Anki 升级插件时，它会忽略压缩包中那些与 `user_files` 文件夹内已存在文件同名的文件。
