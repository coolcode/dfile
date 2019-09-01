function dfile --description "https://dfile.app"
    if test (count $argv) -eq 0
        echo "No arguments specified. Usage:\necho dfile /tmp/test.md\ncat /tmp/test.md | dfile test.md"
        return 1
    end

    ## get temporarily filename, output is written to this file show progress can be showed
    set tmpfile ( mktemp -t transferXXX )

    ## upload stdin or file
    set file $argv[1]

    set basefile (basename "$file" | sed -e 's/[^a-zA-Z0-9._-]/-/g')

    if test -d $file
        # zip directory and transfer
        set zipfile ( mktemp -t transferXXX.zip )
        # echo (dirname $file)
        #cd (dirname $file) and echo (pwd)
        zip -r -q - $file >> $zipfile
        curl --progress-bar  -F file=@"$zipfile" "https://dfile.app" >> $tmpfile
        rm -f $zipfile
    else
        # transfer file
        curl --progress-bar -F file=@$file "https://dfile.app" >> $tmpfile
    end

    ## cat output link
    cat $tmpfile

    ## cleanup
    rm -f $tmpfile
end