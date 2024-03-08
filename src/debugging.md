# Debugging

## Exceptions and Stdout/Stderr

If your code throws an uncaught exception, it will be caught by Anki’s standard
exception handler, and an error will be presented to the user.

The handler catches anything that is printed to stderr, so you should avoid logging text
to stderr unless you want the user to see it in a popup.

Text printed to standard output is covered in [this section](./console-output.md).

## Webviews

If you set the env var QTWEBENGINE_REMOTE_DEBUGGING to 8080 prior to starting Anki,
you can surf to http://localhost:8080 in Chrome to debug the visible webpages.

Alternatively, you can use [this add-on](https://ankiweb.net/shared/info/31746032)
to open the inspector inside Anki.

## Debug Console

Anki also includes a REPL. From within the program, press the [shortcut
key](https://docs.ankiweb.net/misc.html#debug-console) and a
window will open up. You can enter expressions or statements into the
top area, and then press ctrl+return/command+return to evaluate them. An
example session follows:

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

Note that you need to explicitly print an expression in order to see
what it evaluates to. Anki exports pp() (pretty print) in the scope to
make it easier to quickly dump the details of objects, and the shortcut
ctrl+shift+return will wrap the current text in the upper area with pp()
and execute the result.

## PDB

If you’re on Linux or are running Anki from source, it’s also possible
to debug your script with pdb. Place the following line somewhere in
your code, and when Anki reaches that point it will kick into the
debugger in the terminal:

```python
    from aqt.qt import debug; debug()
```

Alternatively you can export DEBUG=1 in your shell and it will kick into
the debugger on an uncaught exception.

## Python Assertions

Runtime checks using Python's `assert` statement are not evaluated in
Anki's release builds, even when running in debug mode. If you want to
use `assert` for testing you can use the [packaged versions from PyPI](https://betas.ankiweb.net/#via-pypipip)
or [run Anki from source](https://github.com/ankitects/anki/blob/main/docs/development.md).
