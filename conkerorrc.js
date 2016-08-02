
dumpln("hello, world!");

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

require ("new-tabs.js");
require ("clicks-in-new-buffer.js");
url_remoting_fn = load_url_in_new_buffer;
define_key(content_buffer_normal_keymap, "C-u f", "follow-new-buffer-background");

url_completion_use_history = true;
url_completion_use_bookmarks = true;
url_completion_use_webjumps = true;
minibuffer_auto_complete_default = true;

require("session.js");
session_auto_save_auto_load = true;
session_pref('browser.history_expire_days', 60);

require("mode-line.js");

remove_hook("mode_line_hook", mode_line_adder(clock_widget));

add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);
add_hook("mode_line_hook", mode_line_adder(zoom_widget));
add_hook("mode_line_hook", mode_line_adder(downloads_status_widget));

require("favicon.js");
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
read_buffer_show_icons = true;

hints_display_url_panel = true;
hints_minibuffer_annotation_mode(true);
// hint_digits="asdfghjkl";

cwd = get_home_directory();
cwd = make_file("/home/nuk3/Downloads");
download_buffer_automatic_open_target=OPEN_NEW_BUFFER_BACKGROUND;

//remove_hook("download_added_hook", open_download_buffer_automatically);

// editor_shell_command = "emacsclient -c -a emacs";
editor_shell_command = "emacsclient -c -a \"\"";
view_source_use_external_editor = true;

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

//require("user-agent-policy");

//user_agent_policy

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

dumpln("Parsed Entire File Successfully...");
