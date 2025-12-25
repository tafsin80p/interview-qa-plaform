export interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const themeQuestions: Question[] = [
  {
    id: 1,
    question: "Which file is required in every WordPress theme?",
    options: [
      "functions.php",
      "index.php",
      "header.php",
      "style.css"
    ],
    correctAnswer: 3,
    explanation: "style.css is the only required file in a WordPress theme. It must contain the theme header comment with theme information."
  },
  {
    id: 2,
    question: "What function is used to register a navigation menu in WordPress themes?",
    options: [
      "add_menu()",
      "register_nav_menus()",
      "create_menu()",
      "wp_nav_menu()"
    ],
    correctAnswer: 1,
    explanation: "register_nav_menus() registers menu locations. wp_nav_menu() is used to display menus, not register them."
  },
  {
    id: 3,
    question: "Which template file displays a single blog post?",
    options: [
      "post.php",
      "single.php",
      "blog.php",
      "article.php"
    ],
    correctAnswer: 1,
    explanation: "single.php is the template for individual posts. WordPress follows a specific template hierarchy."
  },
  {
    id: 4,
    question: "What is the correct way to include the header in a theme template?",
    code: `// Which function to use?
??? ;`,
    options: [
      "include('header.php')",
      "get_header()",
      "require_header()",
      "load_header()"
    ],
    correctAnswer: 1,
    explanation: "get_header() loads header.php and allows for custom headers via get_header('custom')."
  },
  {
    id: 5,
    question: "Which function adds theme support for features like post thumbnails?",
    options: [
      "enable_feature()",
      "add_theme_support()",
      "register_feature()",
      "theme_supports()"
    ],
    correctAnswer: 1,
    explanation: "add_theme_support() enables various theme features like 'post-thumbnails', 'custom-logo', 'title-tag', etc."
  },
  {
    id: 6,
    question: "What hook should be used to enqueue styles and scripts in a theme?",
    options: [
      "init",
      "wp_head",
      "wp_enqueue_scripts",
      "after_setup_theme"
    ],
    correctAnswer: 2,
    explanation: "wp_enqueue_scripts is the proper hook for frontend scripts/styles. Use admin_enqueue_scripts for admin area."
  },
  {
    id: 7,
    question: "Which template tag outputs the post title?",
    options: [
      "get_the_title()",
      "the_title()",
      "post_title()",
      "echo_title()"
    ],
    correctAnswer: 1,
    explanation: "the_title() echoes the title directly. get_the_title() returns the title for further processing."
  },
  {
    id: 8,
    question: "What is the WordPress template hierarchy order for a category archive?",
    options: [
      "archive.php → category.php → index.php",
      "category-{slug}.php → category-{id}.php → category.php → archive.php → index.php",
      "category.php → archive.php → single.php → index.php",
      "index.php → archive.php → category.php"
    ],
    correctAnswer: 1,
    explanation: "WordPress looks for the most specific template first (category-{slug}.php) and falls back to more general templates."
  },
  {
    id: 9,
    question: "Which function is used to add widget areas (sidebars) in a theme?",
    options: [
      "add_sidebar()",
      "register_sidebar()",
      "create_widget_area()",
      "wp_register_sidebar()"
    ],
    correctAnswer: 1,
    explanation: "register_sidebar() creates a widget area. It should be called on the 'widgets_init' hook."
  },
  {
    id: 10,
    question: "What is the purpose of the functions.php file in a theme?",
    options: [
      "To define the theme's CSS styles",
      "To add theme functionality, hooks, and features",
      "To display the homepage content",
      "To handle database connections"
    ],
    correctAnswer: 1,
    explanation: "functions.php acts like a plugin for the theme, adding features, enqueuing scripts, registering menus, and more."
  },
  {
    id: 11,
    question: "Which function outputs the URL to the theme's directory?",
    options: [
      "get_template_directory()",
      "get_template_directory_uri()",
      "theme_url()",
      "get_theme_path()"
    ],
    correctAnswer: 1,
    explanation: "get_template_directory_uri() returns the URL. get_template_directory() returns the server path."
  },
  {
    id: 12,
    question: "What is The Loop in WordPress?",
    code: `if ( have_posts() ) :
    while ( have_posts() ) : the_post();
        // Display post content
    endwhile;
endif;`,
    options: [
      "A JavaScript animation framework",
      "PHP code that processes and outputs posts",
      "A plugin for creating loops",
      "A theme settings page"
    ],
    correctAnswer: 1,
    explanation: "The Loop is the fundamental WordPress code structure that iterates through posts and displays their content."
  },
  {
    id: 13,
    question: "Which function should be called just before </head> in header.php?",
    options: [
      "wp_footer()",
      "wp_head()",
      "the_header()",
      "get_head()"
    ],
    correctAnswer: 1,
    explanation: "wp_head() is essential - it outputs scripts, styles, and meta tags added by WordPress and plugins."
  },
  {
    id: 14,
    question: "What is a child theme used for?",
    options: [
      "Creating themes for child-focused websites",
      "Safely customizing a parent theme without modifying its files",
      "Reducing theme file size",
      "Creating mobile-only versions of themes"
    ],
    correctAnswer: 1,
    explanation: "Child themes inherit parent theme functionality while allowing safe customizations that survive parent theme updates."
  },
  {
    id: 15,
    question: "Which file is required in a child theme besides style.css?",
    options: [
      "functions.php",
      "index.php",
      "header.php",
      "None - only style.css is required"
    ],
    correctAnswer: 3,
    explanation: "Only style.css with the Template header pointing to the parent theme is required. functions.php is optional but commonly used."
  },
  {
    id: 16,
    question: "What function displays the featured image of a post?",
    options: [
      "the_thumbnail()",
      "the_post_thumbnail()",
      "get_featured_image()",
      "post_image()"
    ],
    correctAnswer: 1,
    explanation: "the_post_thumbnail() displays the featured image. Use get_the_post_thumbnail() to return it as a string."
  },
  {
    id: 17,
    question: "Which hook is used for theme setup tasks like registering menus?",
    options: [
      "init",
      "after_setup_theme",
      "wp_loaded",
      "template_redirect"
    ],
    correctAnswer: 1,
    explanation: "after_setup_theme fires after the theme is loaded and is the proper place for theme setup like add_theme_support()."
  },
  {
    id: 18,
    question: "What is the correct way to add custom image sizes in a theme?",
    code: `// Add a custom image size
???('custom-size', 400, 300, true);`,
    options: [
      "register_image_size",
      "add_image_size",
      "create_image_size",
      "set_image_size"
    ],
    correctAnswer: 1,
    explanation: "add_image_size() registers custom image dimensions. The boolean parameter enables hard cropping."
  },
  {
    id: 19,
    question: "Which template tag is used to display post pagination?",
    options: [
      "paginate_links()",
      "the_posts_pagination()",
      "get_pagination()",
      "wp_paginate()"
    ],
    correctAnswer: 1,
    explanation: "the_posts_pagination() outputs pagination links. paginate_links() is the underlying function for custom pagination."
  },
  {
    id: 20,
    question: "What is the purpose of template parts in WordPress themes?",
    code: `get_template_part( 'template-parts/content', 'single' );`,
    options: [
      "To create plugin compatibility",
      "To split templates into reusable, modular pieces",
      "To improve SEO rankings",
      "To add custom post types"
    ],
    correctAnswer: 1,
    explanation: "Template parts allow you to separate repeated code into reusable files, improving maintainability and organization."
  },
  {
    id: 21,
    question: "What is the correct way to implement theme localization and translation?",
    code: `// In functions.php
load_theme_textdomain('my-theme', get_template_directory() . '/languages');

// In template files
echo __('Hello World', 'my-theme');`,
    options: [
      "Use load_theme_textdomain() and text domain in translation functions",
      "Only use __() without text domain",
      "Hardcode all strings in English",
      "Use Google Translate API"
    ],
    correctAnswer: 0,
    explanation: "load_theme_textdomain() loads translation files from /languages directory. Always use text domain (theme name) in __(), _e(), _x() functions. Generate .pot file with text domain for translators."
  },
  {
    id: 22,
    question: "How do you properly implement custom post type archive templates?",
    options: [
      "Create archive-{post_type}.php in theme root",
      "Use single-{post_type}.php for archives",
      "Only use index.php",
      "Create custom-archive.php"
    ],
    correctAnswer: 0,
    explanation: "WordPress template hierarchy: archive-{post_type}.php is used for custom post type archives. Falls back to archive.php then index.php. Use is_post_type_archive() to check in templates."
  },
  {
    id: 23,
    question: "What is the correct way to enqueue conditional stylesheets based on template?",
    code: `function my_theme_styles() {
    wp_enqueue_style('main-style', get_stylesheet_uri());
    
    if (is_page_template('special-page.php')) {
        wp_enqueue_style('special-style', ...);
    }
}
add_action('wp_enqueue_scripts', 'my_theme_styles');`,
    options: [
      "Use conditional checks in wp_enqueue_scripts hook",
      "Load all styles on every page",
      "Use inline styles in templates",
      "Load styles in wp_head directly"
    ],
    correctAnswer: 0,
    explanation: "Use conditional template tags (is_page_template(), is_singular(), etc.) within wp_enqueue_scripts hook to conditionally load styles. This ensures proper dependency handling and prevents unnecessary loading."
  },
  {
    id: 24,
    question: "How do you properly implement custom body classes for theme styling?",
    options: [
      "Use body_class() filter with add_filter('body_class', 'my_classes')",
      "Manually add classes in header.php",
      "Use JavaScript to add classes",
      "Don't use body classes"
    ],
    correctAnswer: 0,
    explanation: "WordPress provides body_class() function that outputs classes. Use 'body_class' filter to add custom classes: add_filter('body_class', function($classes) { $classes[] = 'my-class'; return $classes; });"
  },
  {
    id: 25,
    question: "What is the correct way to implement theme customizer settings?",
    code: `function my_theme_customize_register($wp_customize) {
    $wp_customize->add_setting('header_color', [
        'default' => '#ffffff',
        'sanitize_callback' => 'sanitize_hex_color'
    ]);
    
    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'header_color',
        ['label' => 'Header Color', 'section' => 'colors']
    ));
}
add_action('customize_register', 'my_theme_customize_register');`,
    options: [
      "Use add_setting() with sanitize_callback and add_control()",
      "Store settings in theme options directly",
      "Use JavaScript only",
      "Hardcode all settings"
    ],
    correctAnswer: 0,
    explanation: "Theme Customizer API: add_setting() registers setting with sanitize_callback for security, add_control() adds UI. Use get_theme_mod() to retrieve values. Always sanitize user input."
  },
  {
    id: 26,
    question: "How do you properly implement custom walker classes for navigation menus?",
    options: [
      "Extend Walker_Nav_Menu and override methods",
      "Modify wp_nav_menu() output directly",
      "Use JavaScript to modify menu",
      "Don't customize menu structure"
    ],
    correctAnswer: 0,
    explanation: "Create a class extending Walker_Nav_Menu. Override start_lvl(), end_lvl(), start_el(), end_el() methods. Pass walker instance to wp_nav_menu(['walker' => new My_Walker()])."
  },
  {
    id: 27,
    question: "What is the correct way to implement theme options page using Settings API?",
    code: `function my_theme_settings() {
    register_setting('my_theme_options', 'my_option', [
        'sanitize_callback' => 'sanitize_text_field'
    ]);
    
    add_settings_section('my_section', 'My Section', 'section_callback', 'my_theme_options');
    add_settings_field('my_field', 'My Field', 'field_callback', 'my_theme_options', 'my_section');
}
add_action('admin_init', 'my_theme_settings');`,
    options: [
      "Use Settings API with register_setting(), add_settings_section(), add_settings_field()",
      "Create custom HTML form only",
      "Store options in theme files",
      "Use transients for all options"
    ],
    correctAnswer: 0,
    explanation: "WordPress Settings API provides secure, standardized options pages. Use register_setting() with sanitize_callback, add_settings_section() for grouping, add_settings_field() for inputs. Create options page with add_theme_page()."
  },
  {
    id: 28,
    question: "How do you properly implement custom query modifications for theme templates?",
    code: `function my_custom_query($query) {
    if (!is_admin() && $query->is_main_query()) {
        if (is_home()) {
            $query->set('posts_per_page', 5);
            $query->set('post_type', 'post');
        }
    }
}
add_action('pre_get_posts', 'my_custom_query');`,
    options: [
      "Use pre_get_posts hook with is_main_query() check",
      "Modify $wp_query global directly",
      "Use query_posts() in templates",
      "Create new WP_Query in every template"
    ],
    correctAnswer: 0,
    explanation: "pre_get_posts hook allows modification before query runs. Always check is_main_query() to avoid affecting admin queries or secondary queries. Never use query_posts() - it breaks pagination and is deprecated."
  },
  {
    id: 29,
    question: "What is the correct way to implement theme feature detection and fallbacks?",
    options: [
      "Use function_exists() and add_theme_support() conditionally",
      "Assume all features are available",
      "Use only latest WordPress features",
      "Don't check for feature support"
    ],
    correctAnswer: 0,
    explanation: "Always check if functions/features exist before using: if (function_exists('wp_body_open')) { wp_body_open(); }. Use current_theme_supports() to check theme support. Provide fallbacks for older WordPress versions."
  },
  {
    id: 30,
    question: "How do you properly implement custom post format templates?",
    options: [
      "Create content-{format}.php template parts",
      "Use single-{format}.php templates",
      "Only use content.php",
      "Use JavaScript to change display"
    ],
    correctAnswer: 0,
    explanation: "Post formats use template parts: content-{format}.php (e.g., content-video.php, content-gallery.php). Use get_template_part('content', get_post_format()) or get_post_format(). Falls back to content.php if format template doesn't exist."
  }
];
