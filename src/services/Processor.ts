import fetch from 'node-fetch';
import { TXIDUtils } from '@src/utils';

const ProcessorHive = (
  client: any,
  nextBlock: number = 1,
  prefix: string = 'dlux_',
  account: string = 'null',
  vOpsRequired: boolean = false
) => {
  let onCustomJsonOperation: any = {};
  let onOperation: any = {};
  let onNewBlock = (fn1: any, fn2: any, fn3: any, fn4: any): any => {};
  let onStreamingStart = () => {};
  let behind: number = 0;
  let head_block: any;
  let isStreaming: boolean;
  let vOps: boolean = false;
  let stream;

  const blocks: any = {
    processing: 0,
    completed: nextBlock,
    stop: () => {
      blocks.clean(true);
    },
    ensure: (last: number) => {
      setTimeout(() => {
        if (!blocks.processing && blocks.completed === last) {
          getBlockNumber(nextBlock);
          if (!(last % 3))
            getHeadOrIrreversibleBlockNumber((result: any) => {
              if (nextBlock < result - 5) {
                behind = result - nextBlock;
                beginBlockComputing();
              } else if (!isStreaming) {
                beginBlockStreaming();
              }
            });
        }
      }, 1000);
    },
    clean: (stop = false) => {
      const blockNums: any = Object.keys(blocks);

      for (let i = 0; i < blockNums.length; i++) {
        if (
          (parseInt(blockNums[i]) && parseInt(blockNums[i]) < nextBlock - 1) ||
          (stop && parseInt(blockNums[i]))
        ) {
          delete blocks[blockNums[i]];
          if (vOps) delete blocks[blockNums.v[i]];
        }
      }

      const blockNums1 = Object.keys(blocks.v);

      for (var i = 0; i < blockNums1.length; i++) {
        if (
          (parseInt(blockNums1[i]) &&
            parseInt(blockNums1[i]) < nextBlock - 1) ||
          (stop && parseInt(blockNums1[i]))
        ) {
          delete blocks.v[blockNums1[i]];
        }
      }
    },
    v: {},
    requests: {
      last_range: 0,
      last_block: 0,
    },
    manage: (block_num: any, vOp: boolean = false) => {
      if (!head_block || block_num > head_block || !(block_num % 100))
        getHeadOrIrreversibleBlockNumber((result: any) => {
          head_block = result;
          behind = result - nextBlock;
        });
      if (
        !(block_num % 100) &&
        head_block > blocks.requests.last_range + 200 &&
        Object.keys(blocks).length < 1000
      ) {
        gbr(blocks.requests.last_range + 1, 100, 0);
      }
      if (
        !(block_num % 100) &&
        head_block - blocks.requests.last_range + 1 > 100
      ) {
        gbr(blocks.requests.last_range + 1, 100, 0);
      }
      if (!(block_num % 100)) blocks.clean();
      if (blocks.processing) {
        setTimeout(() => {
          blocks.manage(block_num);
        }, 100);
        blocks.clean();
      } else if (vOps && !blocks.v[block_num]) return;
      else if (vOp && !blocks[block_num]) return;
      else if (blocks[block_num] && block_num == nextBlock) {
        blocks.processing = nextBlock;
        processBlock(blocks[block_num]).then(() => {
          nextBlock = block_num + 1;
          blocks.completed = blocks.processing;
          blocks.processing = 0;
          delete blocks[block_num];
          if (blocks[nextBlock]) blocks.manage(nextBlock);
        });
      } else if (block_num > nextBlock) {
        if (blocks[nextBlock]) {
          processBlock(blocks[nextBlock]).then(() => {
            delete blocks[nextBlock];
            nextBlock++;
            blocks.completed = blocks.processing;
            blocks.processing = 0;
            if (blocks[nextBlock]) blocks.manage(nextBlock);
          });
        } else if (!blocks[nextBlock]) {
          getBlock(nextBlock);
        }
        if (!isStreaming || behind < 5) {
          getHeadOrIrreversibleBlockNumber((result: any) => {
            head_block = result;
            if (nextBlock < result - 3) {
              behind = result - nextBlock;
              beginBlockComputing();
            } else if (!isStreaming) {
              beginBlockStreaming();
            }
          });
        }
      }
      blocks.ensure(block_num);
    },
  };
  var stopping = false;

  const getHeadOrIrreversibleBlockNumber = (callback: any) => {
    client.database.getDynamicGlobalProperties().then((result: any) => {
      callback(result.last_irreversible_block_num);
    });
  };

  const getBlockNumber = (bln: any) => {
    client.database
      .getBlock(bln)
      .then((result: any) => {
        if (result) {
          blocks[parseInt(result.block_id.slice(0, 8), 16)] = result;
          blocks.manage(bln);
        }
      })
      .catch((e: any) => {
        console.log('getBlockNumber Error: ', e);
      });
  };

  const getBlock = (bn: any) => {
    if (behind && !stopping) gbr(bn, behind > 100 ? 100 : behind, 0);
    if (stopping) stream = undefined;
    else if (!stopping) gb(bn, 0);
  };

  const gb = (bln: any, at: any) => {
    if (blocks[bln]) {
      blocks.manage(bln);
      return;
    } else if (blocks.requests.last_block == bln) return;
    if (bln < TXIDUtils.saveNumber + 50) {
      blocks.requests.last_block = bln;
      client.database
        .getBlock(bln)
        .then((result: any) => {
          blocks[parseInt(result.block_id.slice(0, 8), 16)] = result;
          blocks.manage(bln);
        })
        .catch((err: any) => {
          if (at < 3) {
            setTimeout(() => {
              gbr(bln, at + 1);
            }, Math.pow(10, at + 1));
          } else {
            console.log('Get block attempt:', at, client.currentAddress);
          }
        });
    } else {
      setTimeout(() => {
        gb(bln, at + 1);
      }, Math.pow(10, at + 1));
    }
  };

  const gbr = async (bln: any, count: any, at?: any) => {
    if (!at && blocks.requests.last_range > bln) return;
    console.log({ bln, count, at });
    if (!at) blocks.requests.last_range = bln + count - 1;
    await fetch(client.currentAddress, {
      body: `{"jsonrpc":"2.0", "method":"block_api.get_block_range", "params":{"starting_block_num": ${bln}, "count": ${count}}, "id":1}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': `${prefix}HoneyComb/${account}`,
      },
      method: 'POST',
    })
      .then((res: any) => res.json())
      .then((result: any) => {
        try {
          var Blocks = result.result.blocks;
          for (var i = 0; i < Blocks.length; i++) {
            const bkn = parseInt(Blocks[i].block_id.slice(0, 8), 16);
            for (var j = 0; j < Blocks[i].transactions.length; j++) {
              Blocks[i].transactions[j].block_num = bkn;
              Blocks[i].transactions[j].transaction_id =
                Blocks[i].transaction_ids[j];
              Blocks[i].transactions[j].transaction_num = j;
              var ops = [];
              for (
                var k = 0;
                k < Blocks[i].transactions[j].operations.length;
                k++
              ) {
                ops.push([
                  Blocks[i].transactions[j].operations[k].type.replace(
                    '_operation',
                    ''
                  ),
                  Blocks[i].transactions[j].operations[k].value,
                ]);
              }
              Blocks[i].transactions[j].operations = ops;
              blocks[bkn] = Blocks[i];
            }
          }
          blocks.manage(bln);
        } catch (e) {
          console.log(e);
          if (at < 3) {
            setTimeout(() => {
              gbr(bln, count, at + 1);
            }, Math.pow(10, at + 1));
          } else {
            console.log('Get block range error', e);
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
        if (at < 3) {
          setTimeout(() => {
            gbr(bln, count, at + 1);
          }, Math.pow(10, at + 1));
        } else {
          console.log('Get block range error', err);
        }
      });
  };

  const beginBlockComputing = () => {
    var blockNum = nextBlock; // Helper variable to prevent race condition
    // in getBlock()
    blocks.ensure(nextBlock);
    //var vops = getVops(blockNum);
    getBlock(blockNum);
  };

  const beginBlockStreaming = () => {
    isStreaming = true;
    onStreamingStart();
    stream = client.blockchain.getBlockStream();
    stream.on('data', (Block: any) => {
      var blockNum = parseInt(Block.block_id.slice(0, 8), 16);
      blocks[blockNum] = Block;
      blocks.requests.last_block = blockNum;
      blocks.requests.last_range = blockNum;
      blocks.manage(blockNum);
    });
    stream.on('end', function () {
      console.error(
        'Block stream ended unexpectedly. Restarting block computing.'
      );
      beginBlockComputing();
      stream = undefined;
    });
    stream.on('error', (err: any) => {
      beginBlockComputing();
      stream = undefined;
      console.log('This place:', err);
      //throw err;
    });
  };

  const doOp = (op: any, pc: any) => {
    return new Promise((resolve, reject) => {
      if (op.length === 4) {
        onCustomJsonOperation[op[0]](op[1], op[2], op[3], [
          resolve,
          reject,
          pc,
        ]);
      } else if (op.length === 2) {
        onOperation[op[0]](op[1], [resolve, reject, pc]);
      }
    });
  };

  const transactional = (
    ops: any,
    i: any,
    pc: any,
    num: any,
    block: any,
    vops: any
  ) => {
    if (ops.length) {
      doOp(ops[i], [ops, i, pc, num, block, vops])
        .then((v: any) => {
          if (ops.length > i + 1) {
            transactional(v[0], v[1] + 1, v[2], v[3], v[4], v[5]);
          } else {
            onNewBlock(num, v, v[4].witness_signature, {
              timestamp: v[4].timestamp,
              block_id: v[4].block_id,
              block_number: num,
            })
              .then((r: any) => {
                pc[0](pc[2]);
              })
              .catch((e: any) => {
                console.log(e);
              });
            // }
          }
        })
        .catch((e) => {
          console.log(e);
          pc[1](e);
        });
    } else if (parseInt(block.block_id.slice(0, 8), 16) != num) {
      pc[0]();
      console.log('double');
    } else {
      onNewBlock(num, pc, block.witness_signature, {
        timestamp: block.timestamp,
        block_id: block.block_id,
        block_number: num,
      })
        .then((r: any) => {
          r[0]();
        })
        .catch((e: any) => {
          pc[1](e);
        });
    }
  };

  const processBlock = (Block: any, Pvops?: any) => {
    return new Promise((resolve, reject) => {
      var transactions = Block.transactions;
      let ops = [];
      if (parseInt(Block.block_id.slice(0, 8), 16) === nextBlock) {
        for (var i = 0; i < transactions.length; i++) {
          for (var j = 0; j < transactions[i].operations.length; j++) {
            var op = transactions[i].operations[j];
            if (op[0] === 'custom_json') {
              if (typeof onCustomJsonOperation[op[1].id] === 'function') {
                var ip = JSON.parse(op[1].json),
                  from = op[1].required_posting_auths[0],
                  active = false;
                if (
                  typeof ip === 'string' ||
                  typeof ip === 'number' ||
                  Array.isArray(ip)
                )
                  ip = {};
                ip.transaction_id = transactions[i].transaction_id;
                ip.block_num = transactions[i].block_num;
                ip.timestamp = Block.timestamp;
                ip.prand = Block.witness_signature;
                if (!from) {
                  from = op[1].required_auths[0];
                  active = true;
                }
                ops.push([op[1].id, ip, from, active]); //onCustomJsonOperation[op[1].id](ip, from, active);
              }
            } else if (onOperation[op[0]] !== undefined) {
              op[1].transaction_id = transactions[i].transaction_id;
              op[1].block_num = transactions[i].block_num;
              op[1].timestamp = Block.timestamp;
              op[1].prand = Block.witness_signature;
              ops.push([op[0], op[1]]); //onOperation[op[0]](op[1]);
            }
          }
        }
        transactional(ops, 0, [resolve, reject], nextBlock, Block, Pvops);
      }
    });
  };

  return {
    on: (operationId: any, callback: any) => {
      onCustomJsonOperation[prefix + operationId] = callback;
    },
    onOperation: (type: string, callback: any) => {
      onOperation[type] = callback;
    },

    onNoPrefix: (operationId: any, callback: any) => {
      onCustomJsonOperation[operationId] = callback;
    },
    onBlock: (callback: any) => {
      onNewBlock = callback;
    },
    start: () => {
      beginBlockComputing();
      isStreaming = false;
    },
    getCurrentBlockNumber: () => {
      return nextBlock;
    },
    isStreaming: () => {
      return isStreaming;
    },
    onStreamingStart: (callback: any) => {
      onStreamingStart = callback;
    },
  };
};

export default ProcessorHive;
