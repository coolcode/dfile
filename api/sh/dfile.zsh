dfile() {
    if [ $# -eq 0 ]; then
        echo -e "No arguments specified. Usage: echo dfile /tmp/test.md cat /tmp/test.md | dfile test.md";
        return 1;
    fi; 
    tmpfile=$( mktemp -t transferXXX ); 
    if tty -s; then 
        basefile=$(basename "$1" | sed -e 's/[^a-zA-Z0-9._-]/-/g'); 
        curl --progress-bar -F file=@"$1" "https://dfile.app" >> $tmpfile; 
    else 
        curl --progress-bar -F file=@"-" "https://dfile.app/$1" >> $tmpfile;
    fi; 
    cat $tmpfile; 
    rm -f $tmpfile;
}