from djongo import models

class EventBooking(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=10)
    date = models.DateField()
    guests = models.IntegerField()
    payment_method = models.CharField(max_length=50)
    package = models.CharField(max_length=50)
    

class RegisteredUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.email
