require("xkcd");
xkcd_add_title = true;

// proxy_server_default = "proxy.name.com";
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

require("session.js");
session_auto_save_auto_load = true;
session_pref('browser.history_expire_days', 60);

// This is the default anyway
//session_pref("signon.rememberSignons", false);

require("mode-line.js");

remove_hook("mode_line_hook", mode_line_adder(clock_widget));

add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
add_hook("mode_line_hook", mode_line_adder(current_buffer_name_widget), true);
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(zoom_widget));
//add_hook("mode_line_hook", mode_line_adder(downloads_status_widget));

require("favicon.js");
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
read_buffer_show_icons = true;

hints_display_url_panel = true;
hints_minibuffer_annotation_mode(true);
//hint_digits="asdfghjkl";

function my_zoom_set (buffer) {
    browser_zoom_set(buffer, true, 150);
    browser_zoom_set(buffer, false, 100);
}
add_hook('create_buffer_late_hook', my_zoom_set);

cwd = get_home_directory();
cwd.append("Downloads");
download_buffer_automatic_open_target=OPEN_NEW_BUFFER_BACKGROUND;

remove_hook("download_added_hook", open_download_buffer_automatically);

interactive(
    "ekr_cmd_copy",
    "Copy the selection to the clipboard and the Emacs kill ring",
    function (I) {
        call_interactively(I, "cmd_copy")
        var cc = read_from_x_primary_selection();
        cc = cc.replace(/([^\\]*)\\([^\\]*)/g, "$1\\\\$2");
        cc = cc.replace('"', '\\"', "g");
        cc = cc.replace("'", "'\\''", "g");
        var ecc = "emacsclient -e '(kill-new \"" + cc + "\")' > /dev/null";
        shell_command_blind(ecc);
    }
);
undefine_key(caret_keymap,"M-w");
define_key(caret_keymap,"M-w", "ekr_cmd_copy");
undefine_key(content_buffer_normal_keymap,"M-w");
define_key(content_buffer_normal_keymap,"M-w", "ekr_cmd_copy");
undefine_key(special_buffer_keymap,"M-w");
define_key(special_buffer_keymap,"M-w", "ekr_cmd_copy");
undefine_key(text_keymap,"M-w");
define_key(text_keymap,"M-w", "ekr_cmd_copy");

// editor_shell_command = "emacsclient -c -a emacs";
editor_shell_command = "emacsclient -c -a \"\"";
view_source_use_external_editor = true;

// org-protocol

// simplified, neater wrapper function

function org_capture_wrapper (url, title, selection, window, cmd_str) {
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}
function org_capture (url, title, selection, window) {
    var cmd_str =
            'emacsclient \"org-protocol://capture:/w/'+url+'/'+title+'/'+selection+'\"';
    org_capture_wrapper(url,title,selection,window,cmd_str);
}
function org_store_link (url, title, window) {
    var cmd_str =
            'emacsclient \"org-protocol:/store-link:/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}
function org_capture_journal (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/j/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}
function org_capture_kaizen (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/k/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);
}
function org_capture_emacs (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/e/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);

}
function org_capture_devenv (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/d/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);

}
function org_capture_code (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/p/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);

}
function org_capture_course (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/c/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);

}
function org_capture_monopoly (url, title, selection, window) {
    var cmd_str = 'emacsclient \"org-protocol://capture:/m/'+url+'/'+title+'\"';
    if (window != null) {
        window.minibuffer.message('Issuing ' + cmd_str);
    }
    shell_command_blind(cmd_str);

}
interactive("org-capture", "Clip URL, title and selection to capture via org-protocol",
            function (I) {
                org_capture(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-store-link", "Stores [[url][title]] as org link and copies url to emacs kill ring",
            function (I) {
                org_store_link(encodeURIComponent(I.buffer.display_uri_string),
                               encodeURIComponent(I.buffer.document.title),
                               I.window);
            });
interactive("org-capture-journal", "Journal",
            function (I) {
                org_capture_journal(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-capture-kaizen", "Kaizen - Self Enlightenment",
            function (I) {
                org_capture_kaizen(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-capture-emacs", "Emacs",
            function (I) {
                org_capture_emacs(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-capture-devenv", "Development Environment",
            function (I) {
                org_capture_devenv(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-capture-code", "Programming and Code",
            function (I) {
                org_capture_code(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-capture-course", "Chow Course",
            function (I) {
                org_capture_course(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });
interactive("org-capture-monopoly", "Monopolize the 1%",
            function (I) {
                org_capture_monopoly(encodeURIComponent(I.buffer.display_uri_string),
                                 encodeURIComponent(I.buffer.document.title),
                                 encodeURIComponent(I.buffer.top_frame.getSelection()),
                                 I.window);
            });

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

require("reddit");
require("gmail");
require("feedly");
require("twitter");

interactive("sqlite-manager",
            "Open SQLite Manager window.",
            function (I) {
                make_chrome_window('chrome://SQLiteManager/content/sqlitemanager.xul');
            });

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

read_url_handler_list = [read_url_make_default_webjump_handler("duckduckgo")];

define_webjump("mikrotik", "http://192.168.88.1");
define_webjump("netgear", "http://192.168.88.2");

define_webjump("linux-questions","http://www.linuxquestions.org/questions/");
define_webjump("gmane", "http://gmane.org/find.php?list=%s");
// define_webjump("gwene", "http://gwene.org/",
//                $post_data = [['name', 'url'], ['value', '%s']],
//                $alternative = "http://gwene.org");
define_webjump("gwene",
    function (term) {
        return load_spec(
            { uri: "http://gwene.org/",
              post_data: make_post_data([['url', term]]) });
    },
    $alternative = "http://gwene.org");
define_webjump("hackernews", "http://searchyc.com/%s", $alternative = "http://news.ycombinator.com/");
define_webjump("slashdot", "http://slashdot.org/search.pl?query=%s");
define_webjump("stackexchange", "http://stackexchange.com/search?q=%s", $alternative = "http://stackexchange.com/");
define_webjump("stackoverflow", "http://stackoverflow.com/search?q=%s", $alternative = "http://stackoverflow.com/");
define_webjump("superuser", "http://superuser.com/search?q=%s", $alternative = "http://superuser.com/");
// free eBooks
define_webjump("gutenberg",
    function (term) {
        return load_spec(
            { uri: "http://www.gutenberg.org/ebooks/search/",
              post_data: make_post_data([['query', term]]) });
    },
    $alternative = "http://www.gutenberg.org/");

define_webjump("reddit", "http://www.reddit.com/search?q=%s", $alternative = "http://www.reddit.com/");
define_webjump("reddit/subreddit", "http://www.reddit.com/r/%s");

define_webjump("stackexchange/linux", "http://unix.stackexchange.com/search?q=%s", $alternative="http://unix.stackexchange.com");

define_webjump("arch/forums",
    function (term) {
        return load_spec(
            { uri: "https://bbs.archlinux.org/search.php",
              post_data: make_post_data([['keywords', term]]) });
    },
    $alternative="https://bbs.archlinux.org");
define_webjump("arch/wiki", "https://wiki.archlinux.org/index.php?search=%s",
               $alternative="https://wiki.archlinux.org/");
define_webjump("arch/aur", "https://aur.archlinux.org/packages.php?O=0&K=%s",
               $alternative="https://aur.archlinux.org/packages");
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
define_webjump("python3", "http://docs.python.org/3/search.html?q=%s", $alternative = "http://docs.python.org/3/search.html");

define_webjump("ctan/desc", "http://www.ctan.org/search/?search=%s&search_type=description");
define_webjump("ctan/file", "http://www.ctan.org/search/?search=%s&search_type=filename");
define_webjump("ctan/pack", "http://www.ctan.org/search/?search=%s&search_type=id");
define_webjump("ctan", "http://www.ctan.org/search/?search=%s&search_type=description&search_type=filename&search_type=id");
define_webjump("stackexchange/tex", "http://tex.stackexchange.com/search?q=%s", $alternative="http://tex.stackexchange.com");

//require("google-maps");
//require("page-modes/google-maps.js");
define_webjump("google/za", "https://www.google.co.za/webhp?#q=%s&tbs=ctr:countryZA&cr=countryZA", $alternative="https://www.google.co.za/");
define_webjump("google/image", "https://www.google.com/images?q=%s&safe=off", $alternative = "https://www.google.com/imghp?as_q=&safe=off");
define_webjump("google/translate", "https://translate.google.com/translate_t#auto|en|%s");
define_webjump("google/scholar", "https://scholar.google.com/scholar?q=%s", $alternative = "https://scholar.google.com");
define_webjump("google/maps", "https://www.google.com/maps/place/%s", $alternative = "https://maps.google.com")

define_webjump("urban", "http://www.urbandictionary.com/define.php?term=%s");

define_webjump("webofscience", "http://apps.webofknowledge.com/");

define_webjump("scopus", "https://www.scopus.com/");

define_webjump("1337x", "https://www.1337x.to/srch?search=%s");

require("page-modes/wikipedia.js");
//wikipedia_webjumps_format = "wp-%s"; // controls the webjump names. default "wikipedia-%s"
define_wikipedia_webjumps("en"); // For English
//require("wikipedia-didyoumean");

define_webjump("fnb", "https://www.fnb.co.za");

define_webjump("amazon", "https://www.amazon.com/s/?url=search-alias%3Daps&field-keywords=%s", $alternative = "https://www.amazon.com/");

define_webjump("pricecheck", "https://www.pricecheck.co.za/search?search=%s", $alternative = "https:/www.pricecheck.co.za/");
define_webjump("takealot/deals", "http://www.takealot.com/deals", $alternative = "https:/www.takealot.com/");
define_webjump("takealot", "http://www.takealot.com/all/?qsearch=%s&_sb=1&_dt=all&_r=1", $alternative = "https:/www.takealot.com/");
define_webjump("ebucks", "https://www.ebucks.com/web/shop/categorySelected.do?catId=291707128", $alternative = "https://www.ebucks.com/web/shop/shopHome.do")

define_webjump("htxt", "http://www.htxt.co.za/");

lastfm_user = "your username here";
define_webjump("lastfm", "http://www.last.fm/user/" + lastfm_user);
define_webjump("lastfm-music", "http://www.last.fm/search?m=all&q=%s");
define_webjump("lastfm-event", "http://www.last.fm/events/search?search=1&q=%s");
define_webjump("lastfm-tag", "http://www.last.fm/search?m=tag&q=%s");
define_webjump("lastfm-user", "http://www.last.fm/users?m=search&type=un&q=%s");
define_webjump("lastfm-group", "http://www.last.fm/users/groups?s_bio=%s");
define_webjump("lastfm-label", "http://www.last.fm/search?m=label&q=%s");

define_webjump("rottentomatoes", "http://www.rottentomatoes.com/search/?search=%s");

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

//define_key(content_buffer_normal_keymap, "C-u f", "follow-new-buffer-background");
undefine_key(content_buffer_normal_keymap, "l", "back");
define_key(content_buffer_normal_keymap, "l", "follow-new-buffer-background");
define_key(content_buffer_normal_keymap, "M-f", "buffer-next");
define_key(content_buffer_normal_keymap, "M-b", "buffer-previous");

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

require("client-redirect");

define_client_redirect("google-images",
                       function (uri) {
                           return /(images|www)\.google\.com$/.test(uri.host)
                               && uri.filePath == "/imgres"
                               && regexp_exec(/imgurl=([^&]+)/, uri.query, 1);
                       });

define_client_redirect("imgur",
                       build_url_regexp($domain = "imgur", $path = /.*/),
                       function (m) {
                           return m[0].replace("//", "//i.")+".jpg";
                       });

require('eye-guide.js');
define_key(content_buffer_normal_keymap, "space", "eye-guide-scroll-down");
define_key(content_buffer_normal_keymap, "back_space", "eye-guide-scroll-up");

interactive("rgc-goto-buffer", "Switches to buffer (tab number)",
            function rgc_switch_to_buffer(I){
                var buff = yield I.minibuffer.read( $prompt = "Tab number?:");
                switch_to_buffer(I.window, I.window.buffers.get_buffer(buff-1));
            });
interactive("switch-to-recent-buffer",
            "Prompt for a buffer and switch to it, displaying the list in last-visited order.",
            function (I) {
                switch_to_buffer(
                    I.window,
                    (yield I.minibuffer.read_buffer(
                        $prompt = "Switch to buffer:",
                        $buffers = I.window.buffers.buffer_history,
                        $default = (I.window.buffers.count > 1 ?
                                    I.window.buffers.buffer_history[1] :
                                    I.buffer))));
            });
define_key(content_buffer_normal_keymap, "M-g M-g", "rgc-goto-buffer");
define_key(content_buffer_normal_keymap, "C-x C-b", "switch-to-recent-buffer");

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

session_pref("general.useragent.compatMode.firefox", true);

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

var my_killed_buffers = new Array();
// Save the URL of the current buffer before closing it.
interactive("my_save_url_then_kill_buffer",
            "Push URL of current buffer onto stack before closing it",
            function(I) {
                if(my_killed_buffers.length == 10){
                    my_killed_buffers.shift();
                    // Only store 10 most recently killed entries
                }
                my_killed_buffers.push(I.buffer.document.URL);
                kill_buffer(I.buffer);
            });
// Redefine kill buffer key
undefine_key(default_global_keymap, "q");
define_key(default_global_keymap, "q", "my_save_url_then_kill_buffer");
interactive("my_restore_last_killed_buffer",
            "Pop URL of last killed buffer from stack and open in new buffer.",
            function(I){
                if(my_killed_buffers.length > 0){
                    load_url_in_new_buffer(
                        my_killed_buffers[my_killed_buffers.length - 1], I.window);
                    my_killed_buffers.pop();
                }
            });
define_key(default_global_keymap, "Q", "my_restore_last_killed_buffer");

define_key(content_buffer_normal_keymap, "C-c c w", "org-capture");
define_key(content_buffer_normal_keymap, "C-c c l", "org-store-link");
define_key(content_buffer_normal_keymap, "C-c c j", "org-capture-journal");
define_key(content_buffer_normal_keymap, "C-c c k", "org-capture-kaizen");
define_key(content_buffer_normal_keymap, "C-c c e", "org-capture-emacs");
define_key(content_buffer_normal_keymap, "C-c c d", "org-capture-devenv");
define_key(content_buffer_normal_keymap, "C-c c p", "org-capture-code");
define_key(content_buffer_normal_keymap, "C-c c c", "org-capture-course");
define_key(content_buffer_normal_keymap, "C-c c m", "org-capture-monopoly");

interactive("duplicate-buffer", "Duplicate buffer",
            function (I) {
                browser_object_follow(I.buffer, OPEN_NEW_BUFFER, I.buffer.current_uri.spec);
            });
define_key(content_buffer_normal_keymap, "M-D", "duplicate-buffer");

function create_selection_search(webjump, key) {
    interactive(webjump+"-selection-search",
                "Search " + webjump + " with selection contents",
                "find-url-new-buffer",
                $browser_object = function (I) {
                    return webjump + " " + I.buffer.top_frame.getSelection();}
               );
    interactive("prompted-"+webjump+"-search", null,
                function (I) {
                    var term = yield I.minibuffer.read_url($prompt = "Search "+webjump+":",
                                                           $initial_value = webjump+" ",
                                                           $select = false);
                    browser_object_follow(I.buffer, FOLLOW_DEFAULT, term);
                });
    define_key(content_buffer_normal_keymap, key.toUpperCase(), webjump + "-selection-search");
    define_key(content_buffer_normal_keymap, key, "prompted-" + webjump + "-search");
}
create_selection_search("google", "o");
create_selection_search("wikipedia", "w");
create_selection_search("duckduckgo", "d");
create_selection_search("amazon", "a");
create_selection_search("youtube", "y");

dumpln("Conkerror.rc Parsed Successfully...");
