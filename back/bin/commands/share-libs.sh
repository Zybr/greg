#!/usr/bin/env bash
# Share common configs between back and front sides.
dstPath=$1
eventNamesPath="src/crawl/parser/types/event-names.ts"
#eval "echo 'cp $eventNamesPath $dstPath/socket-events.ts'";
eval "cp $eventNamesPath $dstPath/socket-events.ts";
