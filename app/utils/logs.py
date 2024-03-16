import logging
from logging.handlers import TimedRotatingFileHandler

import os


class Logger:
    """
    Level    | Numeric value
    ------------------------
    CRITICAL | 50
    ERROR    | 40
    WARNING  | 30
    INFO     | 20
    DEBUG    | 10
    NOTSET   | 0
    """

    def __init__(self, name, log_folder=None, stderr_level=logging.INFO, file_level=logging.DEBUG):
        self.log_folder = log_folder
        if log_folder:
            self.file_path = os.path.join(log_folder, name + ".log")
            self.file_level = file_level
        self.stderr_level = stderr_level
        self.name = name
        self.logger = logging.getLogger(self.name)
        self.logger.setLevel(logging.INFO)
        self.formater = logging.Formatter("%(asctime)s - %(levelname)s - Line: %(lineno)d - %(pathname)s - %(message)s")

    def initialize(self):
        self.console_handler()
        if self.log_folder:
            try:
                self.file_handler()
            except FileNotFoundError:
                self.logger.error(
                    f"Logging folder {self.log_folder} not found,"
                    "please add folder manually, or init without log_folder!"
                )
        return self.logger

    def console_handler(self):
        # logs in stderr
        handler = logging.StreamHandler()
        handler.setLevel(self.stderr_level)
        handler.setFormatter(self.formater)
        self.logger.addHandler(handler)

    def file_handler(self):
        # logs in file and cycle once a week every tuesday
        handler = TimedRotatingFileHandler(self.file_path, when="W1")
        handler.setLevel(self.file_level)
        handler.setFormatter(self.formater)
        self.logger.addHandler(handler)


logger = Logger("v_ap", stderr_level=logging.INFO).initialize()
