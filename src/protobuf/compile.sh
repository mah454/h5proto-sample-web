#!/bin/bash

WORK_DIR=$(dirname $0)
cd ${WORK_DIR}

SRC_DIR=.
DST_DIR=../app/protobuf
PROTOC_GEN_TS_PATH="../../node_modules/.bin/protoc-gen-ts"

if [ ! -e ${DST_DIR} ]  ;then
  mkdir ${DST_DIR}
else
  rm -rf ${DST_DIR/*}
fi

protoc --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
       -I=$SRC_DIR \
       --js_out="import_style=commonjs,binary:${DST_DIR}" \
       --ts_out=${DST_DIR} \
       ./MessageStructure.proto
