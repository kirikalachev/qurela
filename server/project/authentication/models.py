from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email_verification_code = models.CharField(max_length=6, blank=True, null=True)

    class Meta:
        swappable = "AUTH_USER_MODEL"

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_groups",  # Add unique related_name
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions",  # Add unique related_name
        blank=True,
    )
