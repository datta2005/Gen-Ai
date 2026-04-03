import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'meditrack_ai')
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    JWT_EXPIRY_HOURS = int(os.getenv('JWT_EXPIRY_HOURS', 24))

    # SSL — auto-enable for cloud databases (non-localhost)
    DB_SSL = os.getenv('DB_SSL', 'auto')

    # Twilio
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
    TWILIO_NUMBER = os.getenv('TWILIO_NUMBER', '')

    @staticmethod
    def get_db_config():
        cfg = {
            'host': Config.DB_HOST,
            'port': Config.DB_PORT,
            'user': Config.DB_USER,
            'password': Config.DB_PASSWORD,
            'database': Config.DB_NAME,
        }
        # Enable SSL for cloud databases (Aiven, etc.)
        use_ssl = Config.DB_SSL
        if use_ssl == 'auto':
            use_ssl = Config.DB_HOST != 'localhost' and Config.DB_HOST != '127.0.0.1'
        else:
            use_ssl = use_ssl.lower() == 'true'

        if use_ssl:
            cfg['ssl_disabled'] = False

        return cfg

