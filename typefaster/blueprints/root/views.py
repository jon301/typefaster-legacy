# -*- coding: utf-8 -*-

from flask import Blueprint, render_template

root = Blueprint('root', __name__)

@root.route('/scripts/tests/')
def js_tests():
    return render_template('test_runner.html')
