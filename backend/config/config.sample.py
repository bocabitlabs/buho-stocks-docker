# Debug mode enabled
# Default: False
DEBUG = False
# Log level
# Default: "DEBUG" (Other options: "INFO", "WARNING", "ERROR", "CRITICAL")
LOG_LEVEL = "DEBUG"
# Whether or not to log to file
# Default: False
LOG_TO_FILE = False
# Active handlers for the logger
# Default:["console"]. Other options: ["console", "file"]
LOGGER_HANDLERS = ["console"]
# Path to the log files
# Default: "". Other options: "/usr/src/logs/"
LOGS_ROOT = ""
# Type of database
# VALUES: sqlite | mysql | postgresql
DATABASE_TYPE = "sqlite"
# Path of the database
# Default: "/usr/src/data/db.sqlite3"
DATABASE_SQLITE_PATH = "/usr/src/data/db.sqlite3"
# Path to the mysql.conf file
# Default: "/usr/src/data/mysql.conf"
DATABASE_MYSQL_CONFIG_PATH = "/usr/src/app/config/mysql.conf"
# Secret key for the application. Can be generated by os.urandom(20).
# It is generated automatically when the container is created for the first time
SECRET_KEY = 'REPLACE_SECRET_KEY'
# List of allowed hosts to access the application
# Default: ['0.0.0.0', 'localhost']
ALLOWED_HOSTS = ['0.0.0.0', 'localhost']
# Path to the media files uploaded by the users
# Default: "/usr/src/media/"
MEDIA_ROOT = "/usr/src/media/"
# Timezone of the application
# Default: "UTC"
TIME_ZONE = "UTC"
# Minutes it takes the authentication token to expire
# Default: 60 * 24 * 15 (15 days)
TOKEN_EXPIRED_AFTER_MINUTES = 60 * 24 * 15