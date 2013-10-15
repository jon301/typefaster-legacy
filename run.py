import os
os.environ['TYPEFASTER_SETTINGS'] = 'local_settings.conf'

from typefaster import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
