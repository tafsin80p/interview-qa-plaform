export interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const wordpressQuestions: Question[] = [
  {
    id: 1,
    question: "Which hook is used to enqueue scripts and styles in WordPress?",
    options: [
      "init",
      "wp_enqueue_scripts",
      "wp_head",
      "admin_init"
    ],
    correctAnswer: 1,
    explanation: "wp_enqueue_scripts is the proper hook to enqueue frontend scripts and styles. It ensures proper dependency handling and prevents duplicate loading."
  },
  {
    id: 2,
    question: "What function is used to register a custom post type in WordPress?",
    options: [
      "add_post_type()",
      "create_post_type()",
      "register_post_type()",
      "new_post_type()"
    ],
    correctAnswer: 2,
    explanation: "register_post_type() is the correct function to register custom post types. It should be called on the 'init' hook."
  },
  {
    id: 3,
    question: "Which of the following is the correct way to add a filter in WordPress?",
    code: `// Option A
add_filter('the_content', 'my_function');

// Option B
apply_filter('the_content', 'my_function');

// Option C
filter_add('the_content', 'my_function');

// Option D
hook_filter('the_content', 'my_function');`,
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    correctAnswer: 0,
    explanation: "add_filter() is the correct function to add a filter. apply_filters() is used to apply the filter, not add it."
  },
  {
    id: 4,
    question: "What is the correct priority order for WordPress hooks? (default is 10)",
    options: [
      "Lower numbers execute later",
      "Higher numbers execute first",
      "Lower numbers execute first",
      "Priority has no effect on execution order"
    ],
    correctAnswer: 2,
    explanation: "In WordPress hooks, lower priority numbers execute first. The default priority is 10."
  },
  {
    id: 5,
    question: "Which function should you use to safely get a $_GET variable in WordPress?",
    options: [
      "$_GET['variable']",
      "get_query_var('variable')",
      "sanitize_text_field($_GET['variable'])",
      "wp_get_var('variable')"
    ],
    correctAnswer: 2,
    explanation: "Using sanitize_text_field() or other sanitization functions is crucial for security. Never use raw $_GET values."
  },
  {
    id: 6,
    question: "What is the correct way to add a submenu page under Settings in WordPress admin?",
    code: `add_options_page(
  'My Plugin Settings',
  'My Plugin',
  '???',
  'my-plugin-settings',
  'my_settings_callback'
);`,
    options: [
      "administrator",
      "manage_options",
      "edit_posts",
      "activate_plugins"
    ],
    correctAnswer: 1,
    explanation: "manage_options is the correct capability for adding pages under the Settings menu. It's the capability required to manage site options."
  },
  {
    id: 7,
    question: "Which WordPress function is used to create a nonce for security?",
    options: [
      "wp_create_nonce()",
      "create_nonce()",
      "wp_nonce_create()",
      "generate_nonce()"
    ],
    correctAnswer: 0,
    explanation: "wp_create_nonce() creates a cryptographic token tied to a specific action, user, and time window for CSRF protection."
  },
  {
    id: 8,
    question: "What hook should be used to run code when a plugin is activated?",
    options: [
      "plugin_loaded",
      "activate_plugin",
      "register_activation_hook()",
      "plugin_init"
    ],
    correctAnswer: 2,
    explanation: "register_activation_hook() is a function that registers a callback to run when the plugin is activated. It's typically used to set up default options or create database tables."
  },
  {
    id: 9,
    question: "Which function is used to add custom meta boxes to the post editor?",
    options: [
      "add_meta_box()",
      "register_meta_box()",
      "create_meta_box()",
      "wp_add_meta()"
    ],
    correctAnswer: 0,
    explanation: "add_meta_box() adds a meta box to one or more screens. It should be called on the 'add_meta_boxes' hook."
  },
  {
    id: 10,
    question: "What is the purpose of the 'plugins_loaded' hook?",
    options: [
      "To check if plugins are installed",
      "To run code after all plugins are loaded but before init",
      "To load plugin assets",
      "To activate plugins"
    ],
    correctAnswer: 1,
    explanation: "plugins_loaded fires after all active plugins have been loaded. It's useful for plugin initialization that requires other plugins to be available."
  },
  {
    id: 11,
    question: "Which function escapes HTML for safe output in WordPress?",
    options: [
      "sanitize_html()",
      "wp_escape()",
      "esc_html()",
      "clean_html()"
    ],
    correctAnswer: 2,
    explanation: "esc_html() escapes HTML entities for safe output. Other escaping functions include esc_attr(), esc_url(), and esc_js()."
  },
  {
    id: 12,
    question: "What is the correct way to make a string translatable in WordPress?",
    options: [
      "translate('Hello', 'my-plugin')",
      "__('Hello', 'my-plugin')",
      "_t('Hello', 'my-plugin')",
      "i18n('Hello', 'my-plugin')"
    ],
    correctAnswer: 1,
    explanation: "__() is the basic translation function. Use _e() to echo directly, and _x() for context-specific translations."
  },
  {
    id: 13,
    question: "Which table stores custom post meta data in WordPress?",
    options: [
      "wp_posts",
      "wp_postmeta",
      "wp_metadata",
      "wp_custom_fields"
    ],
    correctAnswer: 1,
    explanation: "wp_postmeta stores all post meta data (custom fields). Each row contains post_id, meta_key, and meta_value."
  },
  {
    id: 14,
    question: "What is the correct way to include a template part in a plugin?",
    code: `// Inside your plugin
// Which function to use?`,
    options: [
      "include('template-part.php')",
      "get_template_part('template-part')",
      "require(plugin_dir_path(__FILE__) . 'template-part.php')",
      "load_template('template-part')"
    ],
    correctAnswer: 2,
    explanation: "For plugins, use require() or include() with plugin_dir_path(). get_template_part() is for themes only."
  },
  {
    id: 15,
    question: "Which REST API function registers a custom endpoint in WordPress?",
    options: [
      "add_rest_route()",
      "register_rest_route()",
      "create_rest_endpoint()",
      "wp_rest_register()"
    ],
    correctAnswer: 1,
    explanation: "register_rest_route() registers a REST API route. It should be called on the 'rest_api_init' hook."
  },
  {
    id: 16,
    question: "What is the purpose of wp_localize_script()?",
    options: [
      "To translate JavaScript strings",
      "To pass PHP data to JavaScript",
      "To load scripts from a CDN",
      "To minify JavaScript files"
    ],
    correctAnswer: 1,
    explanation: "wp_localize_script() passes PHP variables to JavaScript by creating a global JavaScript object. It's commonly used to pass the AJAX URL and nonces."
  },
  {
    id: 17,
    question: "Which hook is triggered after a post is saved/updated?",
    options: [
      "post_saved",
      "save_post",
      "after_save_post",
      "update_post"
    ],
    correctAnswer: 1,
    explanation: "save_post fires after a post is created or updated. Use save_post_{post_type} for specific post types."
  },
  {
    id: 18,
    question: "What function creates a custom database table with the WordPress prefix?",
    code: `global $wpdb;
$table_name = ??? . 'my_table';`,
    options: [
      "$wpdb->base_prefix",
      "$wpdb->prefix",
      "$wpdb->table_prefix",
      "get_table_prefix()"
    ],
    correctAnswer: 1,
    explanation: "$wpdb->prefix contains the database table prefix (e.g., 'wp_'). Use $wpdb->base_prefix for multisite base prefix."
  },
  {
    id: 19,
    question: "Which capability is required to install plugins in WordPress?",
    options: [
      "manage_options",
      "activate_plugins",
      "install_plugins",
      "update_plugins"
    ],
    correctAnswer: 2,
    explanation: "install_plugins is the specific capability for installing new plugins. Administrators have this by default."
  },
  {
    id: 20,
    question: "What is the recommended way to handle AJAX requests in WordPress plugins?",
    options: [
      "Create a custom PHP file for AJAX",
      "Use admin-ajax.php with wp_ajax hooks",
      "Use JavaScript fetch to /ajax endpoint",
      "Include jQuery AJAX without WordPress"
    ],
    correctAnswer: 1,
    explanation: "WordPress provides admin-ajax.php and hooks (wp_ajax_{action} for logged-in, wp_ajax_nopriv_{action} for guests) for standardized AJAX handling."
  },
  {
    id: 21,
    question: "What is the correct way to implement object caching in a WordPress plugin?",
    code: `// Which approach is correct?
$cache_key = 'my_data';
$data = wp_cache_get($cache_key, 'my_group');
if (false === $data) {
    $data = expensive_operation();
    wp_cache_set($cache_key, $data, 'my_group', 3600);
}`,
    options: [
      "Use wp_cache_get() and wp_cache_set() with a group",
      "Use transients for all caching",
      "Store data in global variables",
      "Use file-based caching only"
    ],
    correctAnswer: 0,
    explanation: "wp_cache_get() and wp_cache_set() work with object cache backends (Redis, Memcached) when available, falling back to database transients. Always use a group name for namespacing."
  },
  {
    id: 22,
    question: "How do you properly sanitize and validate a file upload in WordPress?",
    options: [
      "Use $_FILES directly after checking file size",
      "Use wp_handle_upload() with proper mime type validation",
      "Move uploaded file with move_uploaded_file() only",
      "Check file extension and allow all types"
    ],
    correctAnswer: 1,
    explanation: "wp_handle_upload() handles file validation, sanitization, and proper WordPress file structure. Always validate mime types using get_allowed_mime_types() and check file extensions."
  },
  {
    id: 23,
    question: "What is the correct way to implement a custom REST API endpoint with authentication?",
    code: `register_rest_route('myplugin/v1', '/data', [
    'methods' => 'GET',
    'callback' => 'my_callback',
    'permission_callback' => function() {
        return current_user_can('???');
    }
]);`,
    options: [
      "read",
      "edit_posts",
      "manage_options",
      "is_user_logged_in()"
    ],
    correctAnswer: 0,
    explanation: "For REST API, use permission_callback that returns a boolean. 'read' capability is appropriate for public read endpoints. Use current_user_can() for capability checks, not is_user_logged_in()."
  },
  {
    id: 24,
    question: "How do you properly implement nonce verification for AJAX requests?",
    code: `// In JavaScript
jQuery.ajax({
    url: ajaxurl,
    data: {
        action: 'my_action',
        nonce: '???',
        data: myData
    }
});`,
    options: [
      "wp_create_nonce('my_action')",
      "wp_nonce_field('my_action')",
      "wp_localize_script() with nonce from wp_create_nonce()",
      "Generate random string in JavaScript"
    ],
    correctAnswer: 2,
    explanation: "Use wp_localize_script() to pass the nonce from PHP (wp_create_nonce()) to JavaScript. This ensures the nonce is tied to the current user session and action."
  },
  {
    id: 25,
    question: "What is the correct approach to handle database schema updates in a plugin?",
    options: [
      "Run ALTER TABLE queries on every plugin load",
      "Use dbDelta() with version tracking in options",
      "Drop and recreate tables on activation",
      "Manually update database via admin panel"
    ],
    correctAnswer: 1,
    explanation: "Use dbDelta() to safely update database schema. Store a version number in options and compare on activation/update. dbDelta() handles CREATE/ALTER safely and preserves existing data."
  },
  {
    id: 26,
    question: "How do you properly escape output for different contexts in WordPress?",
    code: `// For different output contexts:
echo esc_html($user_input);        // HTML content
echo esc_attr($user_input);        // HTML attributes
echo esc_url($user_input);         // URLs
echo esc_js($user_input);          // JavaScript
echo wp_kses_post($user_input);    // Allowed HTML tags`,
    options: [
      "All of the above are correct",
      "Only esc_html() is needed",
      "Use htmlspecialchars() for everything",
      "No escaping needed if input is validated"
    ],
    correctAnswer: 0,
    explanation: "WordPress provides context-specific escaping functions. Always escape output based on context: esc_html() for content, esc_attr() for attributes, esc_url() for URLs, esc_js() for JavaScript, and wp_kses_post() for allowed HTML."
  },
  {
    id: 27,
    question: "What is the correct way to implement a custom taxonomy with meta fields?",
    options: [
      "Use add_term_meta() directly in register_taxonomy()",
      "Hook into 'created_term' and 'edited_term' actions",
      "Store meta in a separate custom table",
      "Use post meta with term ID as post ID"
    ],
    correctAnswer: 1,
    explanation: "Use 'created_term' and 'edited_term' hooks to add term meta fields. Register meta with register_term_meta() and use add_term_meta()/update_term_meta() in the hooks. This follows WordPress standards."
  },
  {
    id: 28,
    question: "How do you properly implement a background task in WordPress?",
    options: [
      "Use wp_schedule_event() with wp_cron",
      "Create a separate PHP script",
      "Use JavaScript setInterval()",
      "Run tasks on every page load"
    ],
    correctAnswer: 0,
    explanation: "wp_schedule_event() schedules recurring tasks. For one-time tasks, use wp_schedule_single_event(). WordPress cron runs on page loads (not true cron), but can be triggered via WP-CLI or server cron for wp-cron.php."
  },
  {
    id: 29,
    question: "What is the correct way to handle plugin activation/deactivation hooks?",
    code: `register_activation_hook(__FILE__, 'my_activation');
register_deactivation_hook(__FILE__, 'my_deactivation');

function my_activation() {
    // What should happen here?
}`,
    options: [
      "Create database tables, set default options, flush rewrite rules",
      "Only create database tables",
      "Run all plugin initialization code",
      "Nothing - activation is automatic"
    ],
    correctAnswer: 0,
    explanation: "Activation hook should: create database tables (using dbDelta), set default options, flush rewrite rules (flush_rewrite_rules()). Don't run full initialization - that happens on 'plugins_loaded' hook."
  },
  {
    id: 30,
    question: "How do you properly implement a custom Gutenberg block with server-side rendering?",
    options: [
      "Use register_block_type() with render_callback",
      "Only use JavaScript for rendering",
      "Use shortcodes instead",
      "Render in wp_head hook"
    ],
    correctAnswer: 0,
    explanation: "register_block_type() with 'render_callback' allows server-side PHP rendering. For dynamic blocks, provide both 'editor_script' (JS) and 'render_callback' (PHP). Use attributes for data passing."
  }
];
