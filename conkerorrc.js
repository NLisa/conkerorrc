
dumpln("hello, world!");

// Kenrtron
// proxy_server_default = "proxy.kentron.co.za";
// proxy_port_default = 80;

user_pref("javascript.options.showInConsole", false);
user_pref("devtools.errorconsole.deprecation_warnings", false);
user_pref("datareporting.healthreport.logging.consoleEnabled", false);
// user_pref("datareporting.healthreport.logging.consoleLevel", "Warn");
user_pref("datareporting.healthreport.logging.consoleLevel", "Error");
// user_pref("datareporting.healthreport.logging.dumpLevel", "Debug");
user_pref("browser.dom.window.dump.enabled", false);
user_pref("javascript.options.strict", false);
user_pref("extensions.logging.enabled", false);
user_pref("services.sync.log.logger.addonutils", "Error");
user_pref("services.sync.log.logger.engine.addons", "Error");

var themes = "~/.conkerorrc/theme";
load_paths.unshift("chrome://conkeror-contrib/content");
theme_load_paths.unshift(themes);
theme_unload("default");
theme_load("conkeror-theme-zenburn");

// Learn something new everyday
homepage = "http://en.wikipedia.org/wiki/Special:Random";

require ("new-tabs.js");
require ("clicks-in-new-buffer.js");
url_remoting_fn = load_url_in_new_buffer;
define_key(content_buffer_normal_keymap, "C-u f", "follow-new-buffer-background");

require("session.js");
session_auto_save_auto_load = true;
session_pref('browser.history_expire_days', 60);

require("mode-line.js");

remove_hook("mode_line_hook", mode_line_adder(clock_widget));

add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
add_hook("mode_line_hook", mode_line_adder(current_buffer_name_widget), true);
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(zoom_widget));
add_hook("mode_line_hook", mode_line_adder(downloads_status_widget));

require("favicon.js");
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
read_buffer_show_icons = true;

hints_display_url_panel = true;
hints_minibuffer_annotation_mode(true);
//hint_digits="asdfghjkl";

cwd = get_home_directory();
cwd = make_file("/home/nuk3/Downloads");
download_buffer_automatic_open_target=OPEN_NEW_BUFFER_BACKGROUND;

remove_hook("download_added_hook", open_download_buffer_automatically);

// editor_shell_command = "emacsclient -c -a emacs";
editor_shell_command = "emacsclient -c -a \"\"";
view_source_use_external_editor = true;

// org-protocol
function org_capture (url, title, selection, window) {
    var cmd_str =
            'emacsclient \"org-protocol:/capture:/w/'+url+'/'+title+'/'+selection+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}

content_handlers.set("application/pdf", content_handler_open_default_viewer);
external_content_handlers.set("application/pdf", "evince");

external_content_handlers.set(
    "application/vnd.ms-excel",
    "libreoffice"
);
external_content_handlers.set(
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "libreoffice"
);
external_content_handlers.set(
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "libreoffice"
);
external_content_handlers.set(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "libreoffice"
);

//set_protocol_handler("magnet", find_file_in_path("deluge-gtk"));
//content_handlers.set("application/x-bittorrent", content_handler_open);
//external_content_handlers.set("application/x-bittorrent", "deluge-gtk");
content_handlers.set("application/x-bittorrent", content_handler_save);

set_protocol_handler("mailto", make_file("~/bin/handle-mailto"));

session_pref('extensions.checkCompatibility', false);
session_pref("xpinstall.whitelist.required", false);
user_pref("extensions.checkUpdateSecurity", true);

/*define_variable("firebug_url",
    "http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js");*/
define_variable("firebug_url",
    "http://getfirebug.com/releases/lite/1.4/firebug-lite.js");

function firebug (I) {
    var doc = I.buffer.document;
    var script = doc.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('type', firebug_url);
    script.setAttribute('type', 'firebug.init();');
    doc.body.appendChild(script);
}
interactive("firebug", "open firebug lite", firebug);

if ('@eff.org/https-everywhere;1' in Cc) {
    interactive("https-everywhere-options-dialog",
                "Open the HTTPS Everywhere options dialog.",
                function (I) {
                    window_watcher.openWindow(
                        null, "chrome://https-everywhere/content/preferences.xul",
                        "","chrome,titlebar,toolbar,centerscreen,resizable",null);
                });
}

require("adblockplus");

url_completion_use_history = false;
url_completion_use_bookmarks = true;
url_completion_use_webjumps = true;
minibuffer_auto_complete_default = true;

define_browser_object_class(
    "history-url", null,
    function (I, prompt) {
        check_buffer (I.buffer, content_buffer);
        var result = yield I.buffer.window.minibuffer.read_url(
            $prompt = prompt, $use_webjumps = false, $use_history = true, $use_bookmarks = false);
        yield co_return (result);
    });

interactive("find-url-from-history",
            "Find a page from history in the current buffer",
            "find-url",
            $browser_object = browser_object_history_url);

interactive("find-url-from-history-new-buffer",
            "Find a page from history in a new buffer",
            "find-url-new-buffer",
            $browser_object = browser_object_history_url);

define_key(content_buffer_normal_keymap, "h", "find-url-from-history-new-buffer");
define_key(content_buffer_normal_keymap, "H", "find-url-from-history");

define_webjump("linux-questions","http://www.linuxquestions.org/questions/");
define_webjump("gmane", "http://gmane.org/find.php?list=%s");
define_webjump("hackernews", "http://searchyc.com/%s", $alternative = "http://news.ycombinator.com/");
define_webjump("reddit", "http://www.reddit.com/search?q=%s", $alternative = "http://www.reddit.com/");
define_webjump("slashdot", "http://slashdot.org/search.pl?query=%s");
define_webjump("stackexchange", "http://stackexchange.com/search?q=%s", $alternative = "http://stackexchange.com/");
define_webjump("stackoverflow", "http://stackoverflow.com/search?q=%s", $alternative = "http://stackoverflow.com/");
define_webjump("superuser", "http://superuser.com/search?q=%s", $alternative = "http://superuser.com/");

define_webjump("stackexchange/linux", "http://unix-stackexchange.com/search?q=%s", $alternative="http://unix.stackexchange.com");

define_webjump("arch/forums", "http://bbs.archlinux.org");
define_webjump("arch/wiki", "http://wiki.archlinux.org/index.php?search=%s");
define_webjump("arch/aur", "http://aur.archlinux.org/packages.php?O=0&K=%s");
define_webjump("arch/packages",
               "https://www.archlinux.org/packages/?sort=&q=%s&limit=50",
               $alternative="https://packages.archlinux.org");

define_webjump("distrowatch", "http://distrowatch.com/table.php?distribution=%s");

define_webjump("emacswiki", "https://www.emacswiki.org/search?q=%s", $alternative="https://www.emacswiki.org/");
define_webjump("marmalade", "http://marmalade-repo.org/packages?q=%s");



//require("github");
define_webjump("github", "http://github.com/search?q=%s&type=Everything");

define_webjump("bashfaq", "http://mywiki.wooledge.org/BashFAQ?action=fullsearch&context=180&value=%s&fullsearch=Text",
               $alternative = "http://mywiki.wooledge.org/BashFAQ");
define_webjump("cmdlinefu",
               function(term) {
                   return 'http://www.commandlinefu.com/commands/matching/' +
                       term.replace(/[^a-zA-Z0-9_\-]/g, '')
                       .replace(/[\s\-]+/g, '-') +
                       '/' + btoa(term);
               },
               $alternative = "http://www.commandlinefu.com/");

define_webjump("clhs",
               "http://www.xach.com/clhs?q=%s",
               $alternative = "http://www.lispworks.com/documentation/HyperSpec/Front/index.htm");
define_webjump("cliki", "http://www.cliki.net/admin/search?words=%s");

define_webjump("perldoc", "http://perldoc.perl.org/search.html?q=%s");
define_webjump("cpan", "http://search.cpan.org/search?query=%s&mode=all");
define_webjump("metacpan", "https://metacpan.org/search?q=%s");

define_webjump("python", "http://docs.python.org/search.html?q=%s");
define_webjump("python3", "http://docs.python.org/py3k/search.html?q=%s");

define_webjump("ctan/desc", "http://www.ctan.org/search/?search=%s&search_type=description");
define_webjump("ctan/file", "http://www.ctan.org/search/?search=%s&search_type=filename");
define_webjump("ctan/pack", "http://www.ctan.org/search/?search=%s&search_type=id");
define_webjump("ctan", "http://www.ctan.org/search/?search=%s&search_type=description&search_type=filename&search_type=id");
define_webjump("stackexchange/tex", "http://tex.stackexchange.com/search?q=%s", $alternative="http://tex.stackexchange.com");

//require("duckduckgo");
//define_webjump("ddg", "http://duckduckgo.com/?q=%s");

//require("google-maps");
//require("page-modes/google-maps.js");
define_webjump("google/za", "http://www.google.co.za/webhp?#q=%s&tbs=ctr:countryZA&cr=countryZA", $alternative="http://www.google.co.za/");
define_webjump("image", "http://www.google.com/images?q=%s&safe=off", $alternative = "http://www.google.com/imghp?as_q=&safe=off");

require("page-modes/wikipedia.js");
//wikipedia_webjumps_format = "wp-%s"; // controls the webjump names. default "wikipedia-%s"
define_wikipedia_webjumps("en"); // For English
//require("wikipedia-didyoumean");

define_webjump("fnb", "https://www.fnb.co.za");

define_webjump("amazon", "https://www.amazon.com/s/?url=search-alias%3Daps&field-keywords=%s", $alternative = "https://www.amazon.com/");

//require("youtube");
//require("youtube-player");
define_webjump("youtube", "http://www.youtube.com/results?search_query=%s&search=Search");

define_webjump("wordpress", "http://wordpress.org/search/%s");

var unused_webjumps = ['answers', 'creativecommons', 'lucky', 'yahoo'];

for (var i=0; i<unused_webjumps.length; i++) {
    delete webjumps[unused_webjumps[i]];
}

key_bindings_ignore_capslock = true;

undefine_key(content_buffer_normal_keymap, "up", "cmd_scrollLineUp");
undefine_key(content_buffer_normal_keymap, "down", "cmd_scrollLineDown");
undefine_key(content_buffer_normal_keymap, "left", "cmd_scrollLeft");
undefine_key(content_buffer_normal_keymap, "right", "cmd_scrollRight");

/*
function define_switch_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   switch_to_buffer(I.window,
                                    I.window.buffers.get_buffer(buf_num));
               });
}
for (let i = 0; i < 10; ++i) {
    define_switch_buffer_key(String((i+1)%10), i);
}
*/

require("client-redirect");

define_client_redirect("google-images",
                       function (uri) {
                           return /(images|www)\.google\.com$/.test(uri.host)
                               && uri.filePath == "/imgres"
                               && regexp_exec(/imgur=([^8]+)/, uri.query, 1);
                       });

require('eye-guide.js');
define_key(content_buffer_normal_keymap, "space", "eye-guide-scroll-down");
define_key(content_buffer_normal_keymap, "back_space", "eye-guide-scroll-up");

interactive("rgc-goto-buffer", "Switches to buffer (tab number)",
            function rgc_switch_to_buffer(I){
                var buff = yield I.minibuffer.read( $prompt = "Tab number?:");
                switch_to_buffer(I.window, I.window.buffers.get_buffer(buff-1));
            });
//define_key(content_buffer_normal_keymap, "M-g M-g", "rgc-goto-buffer");
define_key(content_buffer_normal_keymap, "C-x C-b", "rgc-goto-buffer");

add_hook("window_before_close_hook",
         function () {
             var w = get_recent_conkeror_window();
             var result = (w == null) ||
                     "y" == (yield w.minibuffer.read_single_character_option(
                         $prompt = "Quit Conkeror? (y/n)",
                         $options = ["y", "n"]));
             yield co_return(result);
         });

var kill_buffer_original = kill_buffer_original || kill_buffer;

var killed_buffer_urls = [];

kill_buffer = function (buffer, force) {
    if (buffer.display_uri_string) {
        killed_buffer_urls.push(buffer.display_uri_string);
    }

    kill_buffer_original(buffer,force);
};

interactive("restore-killed-buffer-url", "Loads URL from a previously killed buffer",
            function restore_killed_buffer_url (I) {
                if (killed_buffer_urls.length !== 0) {
                    var url = yield I.minibuffer.read(
                        $prompt = "Restore killed url:",
                        $completer = new all_word_completer($completions = killed_buffer_urls),
                        $default_completion = killed_buffer_urls[killed_buffer_urls.length - 1],
                        $auto_complete = "url",
                        $auto_compete_initial = true,
                        $auto_complete_delay = 0,
                        $require_match = true);

                    load_url_in_new_buffer(url);
                } else {
                    I.window.minibuffer.message("No killed buffer urls");
                }
            });

function history_clear () {
    var history = Cc["@mozilla.org/browser/nav-history-service;1"].getService(Ci.nsIBrowserHistory);
    history.removeAllPages();
}

interactive("history-clear", "Clear all history",
            history_clear);

interactive("reload-config", "Reload conkerorrc",
            function(I) {
                load_rc();
                I.window.minibuffer.message("config reloaded");
            });
define_key(default_global_keymap, "C-c r", "reload-config");

/*
// Need to confirm variable names and function settings here.
// i.e. perhaps use I.buffer.document;
function focusblock (buffer) {
    var s = Components.utils.Sandbox(buffer.frame);
    s.document = buffer.document.wrappedJSObject;
    Components.utils.evalInSandbox(
        "(function () {\
            function nothing () {}\
            if (! document.forms)\
                return;\
            for (var i = 0, nforms = document.forms.length; i < nforms; i++) {\
              for (var j = 0, nels = document.forms[i].elements.length; j < nels; j++)\
                document.forms[i].elements[j].focus = nothing;\
            }\
          })();",
        s);
}
add_hook('content_buffer_progress_change_hook', focusblock);
 */
//require("block-content-focus-change.js");
// If conkeror seems to be blocking focuses from clicks (on slower computers)
// block_content_focus_change_duration = 40;

require("user-agent-policy");

user_agent_policy.define_policy("default",
                                user_agent_firefox(),
                                "images.google.com",
                                build_url_regexp($domain = /(.*\.)?google/, $path = /images|search\?tbm=isch/),
                                "plus.google.com");

user_agent_policy.define_policy("firefoxcompatmode",
                                "Mozilla/5.0 (X11; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0 conkeror/1.0pre1",
                               "de.eurosport.yahoo.com")

/*var user_agents = { "conkeror": "Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) " +
                    "Gecko/20100101 conkeror/1.0pre",
                    "chromium": "Mozilla/5.0 (X11; U; Linux x86_64; en-US) " +
                    "AppleWebKit/534.3 (KHTML, like Gecko) Chrome/6.0.472.63" +
                    "Safari/534.3",
                    "firefox": "Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) " +
                    "Gecko/20100101 Firefox/8.0.1",
                    "android": "Mozilla/5.0 (Linux; U; Android 2.2; en-us; " +
                    "Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like " +
                    "Gecko) Version/4.0 Mobile Safari/533.1"};
var agent_completer = prefix_completer($completions = Object.keys(user_agents));
interactive("user-agent", "Pick a user agent from the list of presets",
            function(I) {
                var ua = (yield I.window.minibuffer.read(
                    $prompt = "Agent:",
                    $completer = agent_completer));
                set_user_agent(user_agents[ua]);
            });
*/

dumpln("Conkerror.rc Parsed Successfully...");

require("xkcd");
xkcd_add_title = true;
