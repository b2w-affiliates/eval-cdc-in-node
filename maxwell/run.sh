#!/bin/bash
CONF=$(./get-configs.js)
CMD="sudo docker container run --network=host -it cdc-node -c bin/maxwell $CONF --producer=stdout | get-out.js"
echo $CMD
$CMD