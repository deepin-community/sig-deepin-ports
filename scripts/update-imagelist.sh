#!/bin/bash

SSHHOST="deepin@repo"
IMGPATH=/storage/repos/deepin-ports/cdimage
GITMETA="git@github.com:deepin-community/sig-deepin-ports-images.git"

function echoout() {
  cat <<EOF
{
  "type": "$ftype",
  "size": "$fsize",
  "device": "$fdevice",
  "date": "$fdate-$ftime",
  "link": "https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/$fpath"
}
EOF
  unset fname ftype fdevice fdate ftime fsize fpath
}

function process_arg() {
  ftype="$1"
  fdevice="${3:-generic}"
  fdate=$(echo $2 | cut -f1 -d '-')
  ftime=$(echo $2 | cut -f2 -d '-')
  echoout
}

function process() {
  fpath=$1
  fname=$(echo $fpath | rev | cut -f 1 -d '/' | rev)
  fsize=$2
  case $fname in
    *.iso)
      # deepin-23-beige-preview-riscv64-20250107-145422 
      process_arg \
        $(echo $fname | cut -f 2,3,4 -d '-') \
	$(echo $fname | cut -f 1 -d '.' | rev | cut -f 1,2 -d '-' | rev)
      ;;
    *.tar.xz | *.tar.gz)
      # deepin-23-beige-preview-riscv64-th1520-20241227-161022
      process_arg \
        $(echo $fname | cut -f 2,3,4 -d '-') \
	$(echo $fname | cut -f 1 -d '.' | rev | cut -f 1,2 -d '-' | rev) \
	$(echo $fname | cut -f 1 -d '.' | rev | cut -f 3- -d '-' | rev | cut -f 6- -d '-') \
      ;;
    *)
      ;;
  esac
}

export -f process process_arg echoout

tmpdir=$(mktemp -d)
mkdir -p $tmpdir

for imgarch in riscv64 arm64; do
  (ssh -p 2222 $SSHHOST "bash -c \"cd $IMGPATH && find 20*/$imgarch/deepin-*-*-*-$imgarch-*.* -type f \( -iname \*.tar.xz -o -iname \*.iso -o -iname \*.tar.gz \) -printf '%p %s\n' \"" | xargs -I @ bash -c "process @") | jq -s '.' > $tmpdir/images-$imgarch.json
done

pushd $tmpdir
git init
git add *.json
git config user.name "deepin-ports Auto Update"
git config user.email "noreply@deepin.org"
git commit -m "update images: $(LANG=C date +%c)"
git remote add origin $GITMETA
git push -u origin master -f
