// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="intro.html"><strong aria-hidden="true">1.</strong> Introduction（一个简单的插件）</a></li><li class="chapter-item expanded "><a href="support.html"><strong aria-hidden="true">2.</strong> Support（技术支持）</a></li><li class="chapter-item expanded "><a href="editor-setup.html"><strong aria-hidden="true">3.</strong> Editor Setup（编辑器设置）</a></li><li class="chapter-item expanded "><a href="mypy.html"><strong aria-hidden="true">4.</strong> MyPy（插件文件夹）</a></li><li class="chapter-item expanded "><a href="addon-folders.html"><strong aria-hidden="true">5.</strong> Add-on Folders（插件文件夹）</a></li><li class="chapter-item expanded "><a href="a-basic-addon.html"><strong aria-hidden="true">6.</strong> A Basic Add-on（一个简单的插件）</a></li><li class="chapter-item expanded "><a href="the-anki-module.html"><strong aria-hidden="true">7.</strong> The &#39;anki&#39; Module（「anki」模块）</a></li><li class="chapter-item expanded "><a href="command-line-use.html"><strong aria-hidden="true">8.</strong> Command-Line Use（「anki」模块）</a></li><li class="chapter-item expanded "><a href="hooks-and-filters.html"><strong aria-hidden="true">9.</strong> Hooks and Filters（Hook 与过滤器）</a></li><li class="chapter-item expanded "><a href="console-output.html"><strong aria-hidden="true">10.</strong> Console Output（控制台输出）</a></li><li class="chapter-item expanded "><a href="background-ops.html"><strong aria-hidden="true">11.</strong> Background Operations（后台操作）</a></li><li class="chapter-item expanded "><a href="qt.html"><strong aria-hidden="true">12.</strong> Qt and PyQt（Qt 与 PyQt）</a></li><li class="chapter-item expanded "><a href="python-modules.html"><strong aria-hidden="true">13.</strong> Python Modules（Qt 与 PyQt）</a></li><li class="chapter-item expanded "><a href="addon-config.html"><strong aria-hidden="true">14.</strong> Add-on Config（插件配置）</a></li><li class="chapter-item expanded "><a href="reviewer-javascript.html"><strong aria-hidden="true">15.</strong> Reviewer Javascript（复习器中的 Javascript）</a></li><li class="chapter-item expanded "><a href="debugging.html"><strong aria-hidden="true">16.</strong> Debugging（调试）</a></li><li class="chapter-item expanded "><a href="monkey-patching.html"><strong aria-hidden="true">17.</strong> Monkey Patching（猴子补丁）</a></li><li class="chapter-item expanded "><a href="sharing.html"><strong aria-hidden="true">18.</strong> Sharing Add-ons（分享插件）</a></li><li class="chapter-item expanded "><a href="porting2.1.x.html"><strong aria-hidden="true">19.</strong> Porting 2.1.x Add-ons（迁移 2.1.x 版本的插件）</a></li><li class="chapter-item expanded "><a href="porting2.0.html"><strong aria-hidden="true">20.</strong> Porting 2.0 Add-ons（迁移 Anki 2.0 插件）</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
