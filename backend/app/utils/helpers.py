import logging
from datetime import datetime

def setup_logging():
    """Setup basic logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler()
        ]
    )

def get_current_timestamp():
    """Get current timestamp in readable format"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")