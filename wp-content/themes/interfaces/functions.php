<?php
/**
 * Created by IntelliJ IDEA.
 * User: evilkid
 * Date: 3/28/2017
 * Time: 12:14 AM
 */


function interfaces_scripts()
{

    $scriptVersion = "20170329";

    wp_enqueue_style('interfaces-style-font-google', "https://fonts.googleapis.com/css?family=Nunito:300,400,700,800,900");
    wp_enqueue_style('interfaces-style-font-awesome', "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css");
    wp_enqueue_style('interfaces-style', get_stylesheet_uri());
    wp_enqueue_script('interfaces-script', get_template_directory_uri() . '/script.js', array('jquery'), $scriptVersion, true);
    wp_enqueue_script('interfaces-jquery-ui', "https://code.jquery.com/ui/1.12.1/jquery-ui.js", array('jquery'), $scriptVersion, true);
    wp_enqueue_script('interfaces-script-ng', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.3/angular.min.js', array('jquery'), $scriptVersion, true);
    wp_enqueue_script('interfaces-script-ng-animate', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.3/angular-animate.min.js', array('jquery'), $scriptVersion, true);
    wp_enqueue_script('interfaces-script-ng-route', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.3/angular-route.min.js', array('jquery'), $scriptVersion, true);
    wp_enqueue_script('interfaces-script-ng-scroll', get_template_directory_uri() . '/ng-infinite-scroll.js', null, $scriptVersion, true);
    wp_enqueue_script('interfaces-script-ng-app', get_template_directory_uri() . '/app.js', null, $scriptVersion, true);
}

add_action('wp_enqueue_scripts', 'interfaces_scripts');


function set_default_custom_fields($post_id)
{
    add_post_meta($post_id, '_liked', '0', true);
    return true;
}

add_action('wp_insert_post', 'set_default_custom_fields');

function wpb_force_empty_cats($cat_args)
{
    $cat_args['hide_empty'] = 0;
    return $cat_args;
}

add_filter('widget_categories_args', 'wpb_force_empty_cats');
