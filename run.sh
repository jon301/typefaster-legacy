#!/bin/sh
export TYPEFASTER_SETTINGS=local_settings.conf
gunicorn -b 0.0.0.0:5000 -w 4 typefaster:app
