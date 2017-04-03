<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'woo');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '|)C5:C8$~RrsoTr~eiAe_QYtC5%Hs@QbiE&zzJ+z-wsw,>og47tD=hlP49g)qgZa');
define('SECURE_AUTH_KEY',  '/N{@D_Xuc#~Z*Wrx{zDe[jRYq#h.tNEnZiv![J,YUuzxq`)Fy/v3/8v!trjrN%$n');
define('LOGGED_IN_KEY',    '!,55`D$[:NAt8A^{/_Ru6IHLu?!<L!xoU=`s1edrPWu&_7Gr{LpUMvb %gG9JA|Z');
define('NONCE_KEY',        'R=^Sb2q0=.?(TAGbfPa(>yAQmI_7l!4yN9.|uq:]pAu=DM9(DET_UxOn?).>PpHm');
define('AUTH_SALT',        'UV6Mkn;h{ImuDb^yc1M?O6U4~Zp`;FxMlK[OuXm,kr0 _NdiQLJCunX#,H&sEJ Y');
define('SECURE_AUTH_SALT', 'FN`^Jp3h^bioL)&m~Bw*^bz9p2e37jwyz>DWXICg^U@IQ77S/,Rr.cf432!9o68!');
define('LOGGED_IN_SALT',   '9d3f7G[^.}qtPKF-nEkg8Z?6Z-I:7(U>/.N2^r&4[Y:WbQZ8tUk=_@?`3qc/g>8j');
define('NONCE_SALT',       ' 2HJE2 -xGHk0K~eOBIvM7fp9nUKJmQH>qwA5Y;f`8s(Jyf1>#T(h;qZzs|bg{@M');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
