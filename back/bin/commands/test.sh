#!/usr/bin/env bash
eval "mocha -r ts-node/register tests/**/*$1*Test.ts"
