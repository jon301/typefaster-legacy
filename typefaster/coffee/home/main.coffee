require ['../common'], (common) ->
    require ['jquery', 'underscore', 'templates'], ($, _, JST) ->
        templates = JST['typefaster/static/scripts/templates/test.ejs']
        console.log $._('home main')
        console.log templates({ my_var: 'bonjour' })
