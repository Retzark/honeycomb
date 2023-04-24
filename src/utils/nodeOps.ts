const nodeOps = () => {
  let NodeOps: any = [];

  const GetNodeOps = () => NodeOps;

  const newOps = (arr: any) => (NodeOps = arr);

  const unshiftOp = (arr: any) => NodeOps.unshift(arr);

  const pushOp = (arr: any) => NodeOps.push(arr);

  const spliceOp = (i: number) => NodeOps.splice(i, 1);

  return { GetNodeOps, newOps, unshiftOp, pushOp, spliceOp };
};

export default nodeOps;
