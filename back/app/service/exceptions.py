

from fastapi import HTTPException, status
from typing import Any, Dict, Optional, List


class BaseServiceException(Exception):
    def __init__(self, message: str = "Внутренняя ошибка сервиса", **kwargs):
        self.message = message
        self.details = kwargs
        super().__init__(self.message)

