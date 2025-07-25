#!/bin/bash

REPO_DISTS_URL="https://ci.deepin.com/repo/deepin/deepin-community/stable/dists/"
CODENAME="crimson"

IFS=' ' read -r -a COMPS <<< $(curl $REPO_DISTS_URL/$CODENAME/Release | grep "Components:" | sed 's/Components: //g')

WORKDIR=$(mktemp -d)

for COMP in "${COMPS[@]}"; do
  mkdir -p $WORKDIR/$COMP
  for CMPARCH in amd64 riscv64; do
    curl $REPO_DISTS_URL/$CODENAME/$COMP/binary-$CMPARCH/Packages.gz | gzip -d | grep-dctrl -s Source,Package,Version -n -v 'dbgsym' | sed 's/^$/@/' | tr '\n' ' ' | tr '@' '\n' | awk 'NF>0 {print $1,$(NF-1),$NF}' | sort | uniq > $WORKDIR/$COMP/$CMPARCH
  done
  tmpsrc=$(mktemp)
  curl $REPO_DISTS_URL/$CODENAME/$COMP/source/Sources.gz | gzip -d > $tmpsrc
  comm -23 \
    <(cat $WORKDIR/$COMP/amd64 | cut -f1 -d ' ') \
    <(cat $WORKDIR/$COMP/riscv64 | cut -f1 -d ' ') \
    | xargs -I @ bash -c "for srcarch in \$(grep-dctrl -w -s Architecture -n -P @ $tmpsrc); do dpkg-architecture -a linux-riscv64 -i \$srcarch && echo @ >> $WORKDIR/$COMP.missing.list && continue; done"
  comm -23 $WORKDIR/$COMP/amd64 $WORKDIR/$COMP/riscv64 > $WORKDIR/$COMP.diff.list
done

echo $WORKDIR
