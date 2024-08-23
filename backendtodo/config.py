import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:password1@localhost:5432/todoDb'  # Change for MySQL
    SQLALCHEMY_TRACK_MODIFICATIONS = False