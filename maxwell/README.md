sudo docker image build . -t=cdc-node


CONF=$(./get-configs.js)
CMD="sudo docker container run --network=host -it cdc-node bin/maxwell $CONF --producer=stdout --log_level=error"
echo $CMD
exec $CMD