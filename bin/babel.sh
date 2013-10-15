#!/bin/bash

function i18n_extract()
{
    pybabel extract -F babel.cfg -o typefaster/translations/messages.pot .
    pybabel extract -F babel_js.cfg -o typefaster/translations/messages_js.pot .
}

function i18n_init()
{
    pybabel init -D messages -i typefaster/translations/messages.pot -d typefaster/translations -l $1
    pybabel init -D messages_js -i typefaster/translations/messages_js.pot -d typefaster/translations -l $1
}

function i18n_update()
{
    pybabel update -D messages -i typefaster/translations/messages.pot -d typefaster/translations
    pybabel update -D messages_js -i typefaster/translations/messages_js.pot -d typefaster/translations
}

function i18n_compile()
{
    pybabel compile -D messages -f -d typefaster/translations --statistics
    pybabel compile -D messages_js -f -d typefaster/translations --statistics
}

function i18n_po2json()
{
    for f in `find typefaster/translations -maxdepth 1 -mindepth 1 -type d -exec basename {} \;`
    do
        json_path="typefaster/static/scripts/translations/javascript.$f.js"
        echo "var json_locale_data = { messages: " > ${json_path}
        ./bin/po2json.pl typefaster/translations/$f/LC_MESSAGES/messages_js.po >> ${json_path}
        echo "};" >> ${json_path}
        echo "po2json.pl success: $json_path"
    done
}

case "$1" in
    "extract") # Cherche toutes nouvelles les chaines a traduire et cree le fichier .pot
    i18n_extract
    ;;

    "init") # A n'utiliser que pour creer une nouvelle locale
    i18n_init $2
    ;;

    "update") # Mise a jour des chaines
    i18n_update
    ;;

    "compile") # Compile le fichier binaire .mo
    i18n_compile
    ;;

    "po2json") # Convert Javascript .po files to .js
    i18n_po2json
    ;;

    "all") # Do all the steps
    i18n_extract
    i18n_update
    i18n_compile
    i18n_po2json
    ;;

    *)
    echo "This action doesn't exist, only extract|init|update|compile|po2json|all"
    ;;
esac
