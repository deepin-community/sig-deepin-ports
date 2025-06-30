#!/bin/bash

REPO_DISTS_URL="https://ci.deepin.com/repo/deepin/deepin-community/stable/dists/"
CODENAME="crimson"

IFS=' ' read -r -a COMPS <<< $(curl $REPO_DISTS_URL/$CODENAME/Release | grep "Components:" | sed 's/Components: //g')

WORKDIR=$(mktemp -d)

for COMP in "${COMPS[@]}"; do
  mkdir -p $WORKDIR/$COMP
  for CMPARCH in amd64 riscv64; do
    curl $REPO_DISTS_URL/$CODENAME/$COMP/binary-$CMPARCH/Packages.gz | gzip -d | grep -e "^Package:" -e "^Version:" | cut -f2 -d ' ' | xargs -n 2 | grep -v "dbgsym" > $WORKDIR/$COMP/$CMPARCH
  done
  comm -23 \
    <(cat $WORKDIR/$COMP/amd64 | cut -f1 -d ' ') \
    <(cat $WORKDIR/$COMP/riscv64 | cut -f1 -d ' ') \
    > $WORKDIR/$COMP.missing.list
  comm -23 $WORKDIR/$COMP/amd64 $WORKDIR/$COMP/riscv64 > $WORKDIR/$COMP.diff.list
done

echo $WORKDIR
