from django.db import models

class Bok(models.Model):
    tittel = models.CharField(max_length=100)

class Forfatter(models.Model):
    navn = models.CharField(max_length=100)
    alder = models.PositiveSmallIntegerField()
    bøker = models.ForeignKey(Bok, on_delete=models.CASCADE)


class Bok(models.Model):
    tittel = models.CharField(max_length=100)
    forfatter = models.ForeignKey(Forfatter, on_delete=models.CASCADE)

class Forfatter(models.Model):
    navn = models.CharField(max_length=100)
    alder = models.PositiveSmallIntegerField()

from django.db import models

class Forfatter(models.Model):
    navn = models.CharField(max_length=100)
    alder = models.PositiveSmallIntegerField()

class Bok(models.Model):
    tittel = models.CharField(max_length=100)
    forfattere = models.ManyToManyField(Forfatter)

class Forfatter(models.Model):
    navn = models.CharField(max_length=100)
    alder = models.PositiveSmallIntegerField()
    bok = models.ManyToManyField(Bok)

class Bok(models.Model):
    tittel = models.CharField(max_length=100)
